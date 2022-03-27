const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

router.get("/", (req, res) => {
  console.log(req.session);
  Post.findAll({
    attributes: [
      "id",
      "post_title",
      "post_body",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)"
        ),
        "comment_count",
      ],
    ],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
     
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("homepage", { posts, loggedIn: req.session.loggedIn});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login", {
    formTitle: "Login",
    elementId: "login-form",
    buttonText: "Login!",
    linkText: "Sign up instead",
    link: "/signup"
  });
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("sign-up", {
    formTitle: "Sign up",
    elementId: "signup-form",
    buttonText: "Sign up!",
    linkText: "Login instead",
    link: "/login",
  });
});

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_title",
      "post_body",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)"
        ),
        "comment_count",
      ],
    ],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_body", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      const post = dbPostData.get({ plain: true });
      const comments = post.comments;
      res.render("single-post", { post, comments, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
module.exports = router;
