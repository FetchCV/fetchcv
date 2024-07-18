const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

mongoose.connect(
   `mongodb+srv://fetchcv:${process.env.MONGODB_PASSWORD}@cluster0.e1en0n4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
);

const userSchema = new mongoose.Schema({
   githubId: String,
   profile: Object /*
   {
      description: something // will check if exists, if not use github
   }
   */

});

const User = mongoose.model("User", userSchema);

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

app.get("/gh-username-search", (req, res) => {
   res.render("pages/gh-username-search");
});

app.get("/profile", (req, res) => {
   if (!req.session.user) {
      return res.render("pages/login", { client_id: process.env.GITHUB_CLIENT_ID });
   }
   return res.render("pages/profile", { userData: req.session.user });
});

app.get("/user/github/:username", (req, res) => {
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
   const user = new User({ githubId: githubId });
   user.save().then((result) => {
      res.render("pages/welcome", { userData: req.session.user });
   });
}

async function githubOAuthUserExists(githubId) {
   const user = await User.findOne({ githubId: githubId });
   return user !== null;
}



// Get data
app.get("/get/description", (req, res) => {
   User.findOne({ githubId: req.session.user.id })
      .then((user) => {
         if (user) {
            console.log(user.profile);
            res.json({ description: user.profile.description });
         } else {
            throw new Error("User not found");
         }
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
         console.log(savedUser);
         res.json({ message: "It worked!" });
      })
      .catch((err) => {
         console.log(err);
      });
});

// Connect app
app.listen(PORT, () => {
   console.log("Server is running on port " + PORT);
});
