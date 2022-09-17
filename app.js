//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs'); // to access "ejs files" which should be inside "views" folder.
app.use(bodyParser.urlencoded({
  extended: true
})); // use to access the html tags and its arguments.
app.use(express.static("public")); // public folder should be created in order to access the folders(i.e.images,css..etc) inside the server.

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



const User = mongoose.model("User", userSchema);



app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const user = new User({
      email: username,
      password: hash
    });

    user.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });


});

app.post("/login", function(req, res) {
  const loginUsername = req.body.username;
  const loginPassword = req.body.password;

  User.findOne({
    email: loginUsername
  }, function(err, founduser) {
    if (err) {
      console.log(err);
    } else {
      if (founduser) {
        bcrypt.compare(loginPassword, founduser.password, function(err, result) {
          // result == true
          if (result === true) {
            res.render("secrets");
          } else {
            res.send("password not matched");
          }
        });

      } else {
        res.send(" yet not registered ");
      }
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
