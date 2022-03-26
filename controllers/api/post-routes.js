const sequelize = require("../../config/connection");
const router = require("express").Router();
const { Post, User, Comment } = require("../../models");



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
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.get("/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
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
          attributes: ['id', 'comment_body', 'post_id', 'user_id', 'created_at'],
          include: {
              model: User,
              attributes: ['username']
          }
      },
    ],
  })
      
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });



router.post("/", (req, res) => {
  Post.create({
    post_title: req.body.post_title,
    post_body: req.body.post_body,
    user_id: req.body.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});



module.exports = router;