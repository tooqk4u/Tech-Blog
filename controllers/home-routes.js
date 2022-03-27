const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

router.get("/", (req, res) => {
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
      console.log(dbPostData[0].get({ plain: true }))
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render("homepage", { posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  res.render('login');
})

module.exports = router;
