const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

router.get("/", (req, res) => {
  res.render("homepage", {
    id: 1,
    post_title: "This is a new post!",
    post_body:
      "This new post is about Javascript. Javascript can be considered the function portion of a website.",
    created_at: new Date(),
    comments: 30,
    user: {
      username: "test_user",
    },
  });
});
module.exports = router;
