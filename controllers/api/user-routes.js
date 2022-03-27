const router = require("express").Router();
const sequelize = require("../../config/connection");
const { User, Post, Comment } = require("../../models");

router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: [
          "id",
          "post_title",
          "post_body",
          "created_at",
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM comment INNER JOIN post ON post.id = comment.post_id WHERE comment.post_id = posts.id)"
            ),
            "comment_count",
          ],
        ],
      },
      {
        model: Comment,
        attributes: ["id", "comment_body", "post_id"],
        include: [
          {
            model: Post,
            attributes: ["post_title"],
          },
        ],
      },
    ],
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
      res.json(dbUserData);
    });
  })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(400).json({ message: "No user found with that username." });
        return;
      }

      // user verification
      const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Password does not match with username." });
      return;
    }
    req.session.save(() => {
      // sets session variables to confirm user is logged in
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.json({ user: dbUserData, message: "You are now logged in!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
})

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
module.exports = router;
