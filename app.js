const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

mongoose.connect(
   `mongodb+srv://fetchcv:${process.env.MONGODB_PASSWORD}@cluster0.e1en0n4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
);

const userSchema = new mongoose.Schema({
   githubId: String,
});

const User = mongoose.model("User", userSchema);

// Serve static files from the "public" folder
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/public");

// Define routes and middleware here
app.get("/", (req, res) => {
   res.sendFile(__dirname + "/public/index.html");
});

app.get("/token/:service", (req, res) => {
   const service = req.params.service;
   console.log(
      service.toUpperCase() + "_TOKEN",
      process.env[service.toUpperCase() + "_TOKEN"],
   );
   res.send(process.env[service.toUpperCase() + "_TOKEN"] || "No token found");
});

// GitHub OAuth
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
let github_access_token = "not logged in";
let github_user_data = {};

function loggedIn() {
   if (github_access_token === "not logged in") {
      return false;
   }
   return true;
}

app.get("/gh", (req, res) => {
   res.render("pages/index", { client_id: clientID });
});

// Callback
app.get("/auth/github", (req, res) => {
   // The req.query object has the query params that were sent to this route.
   const requestToken = req.query.code;

   axios({
      method: "post",
      url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      // Set the content type header, so that we get the response in JSON
      headers: {
         accept: "application/json",
      },
   }).then((response) => {
      github_access_token = response.data.access_token;
      res.redirect("/github/login");
   });
});

app.get("/github/login", function (req, res) {
   axios({
      method: "get",
      url: `https://api.github.com/user`,
      headers: {
         Authorization: "token " + github_access_token,
      },
   }).then((response) => {
      github_user_data = response.data;
      githubOAuthLogin(res);
   });
});

async function githubOAuthLogin(res) {
   let isAccount = await githubOAuthUserExists(github_user_data.id);
   if (isAccount) res.render("pages/success", { userData: github_user_data });
   else createGithubOAuthUser(github_user_data.id, res);
}

function createGithubOAuthUser(githubId, res) {
   const user = new User({ githubId: githubId });
   user.save().then((result) => {
      console.log("id is " + result.id);
      res.render("pages/new-user", { userData: github_user_data });
   });
}

async function githubOAuthUserExists(githubId) {
   const user = await User.findOne({ githubId: githubId });
   console.log(user !== null);
   return user !== null;
}

// Connect app
app.listen(PORT, () => {
   console.log("Server is running on port " + PORT);
});
