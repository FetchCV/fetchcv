#!/usr/bin/env node
const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const { default: createPlugin } = require("tailwindcss/plugin");
const uuidv4 = require("uuid").v4;

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8080;

mongoose.connect(
   `mongodb+srv://fetchcv:${process.env.MONGODB_PASSWORD}@cluster0.e1en0n4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
);

const userSchema = new mongoose.Schema({
   githubId: String,
   profile: Object, /*
   {
      description: something // will check if exists, if not use github
   }
   */
   handle: String,
   stats: Object,
   postIds: Array /*{
      visitors: Array,
      visits: Number
   } */
});

const postSchemea = new mongoose.Schema({
   content: String,
   author: String, // author mongo id
   urls: Array,
   datePosted: Date,
   stats: Object // views, likes, etc
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchemea);

// Serve static files from the "public" folder
app.use(express.static("public"));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/public");

app.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
         secure: false, // This will only work if you have https enabled!
         maxAge: 60000, // 1 min
      },
   }),
);

// Public routes
app.get("/", (req, res) => {
   res.render("home");
});

app.get("/posts", (req, res) => {
   res.render("pages/posts", { userData: req.session.user });
});

app.get("/my-posts", (req, res) => {
   if (!req.session.user) {
      return res.render("pages/login", { client_id: process.env.GITHUB_CLIENT_ID });
   }
   Post.find({ author: req.session.user.id })
      .populate('author', 'handle profile.avatar_url') // Populate the 'author' field, selecting 'handle' and 'profile.avatar_url'
      .then((posts) => {
         const postsWithAuthorInfo = posts.map(post => ({
            _id: post._id,
            content: post.content,
            urls: post.urls,
            authorId: post.author,
            authorName: post.author ? post.author.handle : "Unknown",
            authorImage: post.author && post.author.profile ? post.author.profile.avatar_url : undefined,
            datePosted: post.datePosted,
            stats: post.stats
         }));
         res.render("pages/my-posts", { posts: postsWithAuthorInfo, userData: req.session.user });
      })
      .catch((err) => {
         console.error(err);
         res.status(500).json({ message: "Error fetching posts" });
      });
});

app.get("/profile", (req, res) => {
   if (!req.session.user) {
      return res.render("pages/login", { client_id: process.env.GITHUB_CLIENT_ID });
   }
   return res.redirect("/user/" + req.session.user.login);
});

app.get("/edit-profile", (req, res) => {
   if (!req.session.user) return res.render("pages/login", { client_id: process.env.GITHUB_CLIENT_ID });
   return res.render("pages/profile", { userData: req.session.user });
});

app.get("/user/github/:username", (req, res) => {
   const username = req.params.username;
   res.render("pages/github-profile", { username: username })
});

app.get("/user/:username", (req, res) => {
   const username = req.params.username;
   res.render("pages/user-profile", { username: username })
});

// Token fetching stuff
app.get("/token/:service", (req, res) => {
   const service = req.params.service;
   res.send(process.env[service.toUpperCase() + "_TOKEN"] || "No token found");
});


// GitHub OAuth
// Callback
app.get("/auth/github", (req, res) => {
   // The req.query object has the query params that were sent to this route.
   const requestToken = req.query.code;

   axios({
      method: "post",
      url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${requestToken}`,
      headers: {
         accept: "application/json",
      },
   }).then((response) => {
      req.session.github_access_token = response.data.access_token;
      res.redirect("/github/login");
   });
});

app.get("/github/login", (req, res) => {
   axios({
      method: "get",
      url: `https://api.github.com/user`,
      headers: {
         Authorization: "token " + req.session.github_access_token,
      },
   }).then((response) => {
      req.session.user = response.data;
      githubOAuthLogin(req, res);
   });
});

async function githubOAuthLogin(req, res) {
   let isAccount = await githubOAuthUserExists(req.session.user.id);
   if (isAccount) res.redirect("/profile");
   else createGithubOAuthUser(req.session.user.id, req, res);
}

function createGithubOAuthUser(githubId, req, res) {
   // this shoudl also save the user name and profile picture url
   const user = new User({
      githubId: githubId,
      handle: req.session.user.login,
      profile: {
         description: req.session.user.bio
      }
   });
   user.save().then((result) => {
      res.render("pages/welcome", { userData: req.session.user });
   });
}

async function githubOAuthUserExists(githubId) {
   const user = await User.findOne({ githubId: githubId });
   return user !== null;
}

function isLoggedIn(req) {
   return req.session.user ? true : false;
}

// Get data
app.get("/is-logged-in", (req, res) => {
   res.json({ loggedIn: req.session.user ? true : false });
});

app.get("/get/description/:githubId", (req, res) => {
   User.findOne({ githubId: req.params.githubId })
      .then((user) => {
         if (user) {
            res.json({ description: user.profile.description });
         } else {
            res.json({ description: undefined });
            throw new Error("User not found");
         }
      })
      .catch((err) => {
         console.log(err);
      });
});

// Get is deceptive, it will update as well
app.get("/get/stats/:githubId", (req, res) => {
   User.findOne({ githubId: req.params.githubId })
      .then((user) => {
         if (user) {
            user.stats.visits += 1;

            if (isLoggedIn(req)) {
               if (!user.stats.visitors.includes(req.session.user.id)) {
                  user.stats.visitors.push(req.session.user.id);
               }
            }

            user.markModified("stats");
            user.save();
            return user.stats;
         } else {
            throw new Error("User not found");
         }
      })
      .then((results) => {
         console.log(results)
         res.json({
            visitors: results.visitors.length,
            visits: results.visits
         });
      })
      .catch((err) => {
         console.log(err);
      });
});


// Edit data
app.post("/edit/description", (req, res) => {
   const data = req.body;
   User.findOne({ githubId: req.session.user.id })
      .then((user) => {
         if (user) {
            user.profile.description = data.description;

            user.markModified("profile");
            return user.save();
         } else {
            throw new Error("User not found");
         }
      })
      .then((savedUser) => {
         res.json({ message: "It worked!" });
      })
      .catch((err) => {
         console.log(err);
      });
});

// Search
app.get("/search/user/:username", (req, res) => {
   const username = req.params.username;
   const results = 15;
   User.find({ handle: { $regex: new RegExp("^" + username.toLowerCase(), "i") } })
      .then((users) => {// should only send name and descr
         res.json({ users: users.slice(0, results) });
      })
      .catch((err) => {
         console.log(err);
      });
});

// Posts
app.post("/posts/create", (req, res) => {
   if (!req.session.user) {
      console.error("User not logged in");
      return res.status(401).json({ message: "You need to be logged in to post" });
   }
   const post = new Post({
      content: req.body.content,
      urls: req.body.urls,
      datePosted: req.body.datePosted,
      author: req.session.user.id
   });
   post.save().then(() => {
      res.json({ message: "Post created successfully!" });
   });
   User.findOne({ githubId: req.session.user.id })
      .then((user) => {
         if (user) {
            user.postIds.push(post._id);
            user.markModified("postIds");
            return user.save();
         } else {
            throw new Error("User not found");
         }
      })
      .then((savedUser) => {
         console.log("Post ID added to user:", savedUser);
      })
      .catch((err) => {
         console.error(err);
      });
});

app.get("/posts/get-all", (req, res) => {
   Post.find({})
      .lean()
      .then(async (posts) => {
         for (const post of posts) {
            try {
               const author = await User.findOne({ githubId: post.author });

               if (author) {
                  console.log(author)
                  post.authorName = author.name;
                  post.authorHandle = author.handle;
                  post.authorImage = author.profile;
               }
            } catch (err) {
               console.error(`Error fetching author for post ${post._id}:`, err);
            }
            post.authorId = post.author;
         }
         res.json({ posts: posts });
      })
      .catch((err) => {
         console.error("Error fetching posts:", err);
         res.status(500).json({ message: "Error fetching posts" });
      });
});

// Connect app
app.listen(PORT, () => {
   console.log("Server is running on port " + PORT);
});


// Add item to existing schema members - remember to add to schema as well
// User.updateMany(
//    { stats: { $exists: true }},
//    { $set: { stats: { visitors: [], visits: 0 } }},
//    { multi: true }
// ).then((oth) => {
//    console.log(oth);
// }).catch((err) => {
//    console.error(err);
// });
