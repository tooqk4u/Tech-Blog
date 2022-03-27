const router = require("express").Router();
const withAuth = require("../utils/auth");
const sequelize = require("../config/connection");
const { Post, Comment } = require("../models");

router.get("/", withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: [
      "id",
      "post_title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)"
        ),
        "comment_count",
      ],
    ],
  })
  .then((dbPostData) => {
      
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render('dashboard', { posts, loggedIn: req.session.loggedIn });
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json(err);
  })
});

router.get('/new-post', withAuth, (req, res) => {
  res.render('new-post', { loggedIn: req.session.loggedIn });
})

router.get('/edit-post/:id', withAuth, (req, res) => {
  Post.findOne({
      where: {
          id: req.params.id
      },
      attributes: [
          "id",
          "post_title",
          "post_body",
          "user_id"
      ]
  })
  .then((dbPostData) => {
      if (!dbPostData) {
          res.status(404).json({ message: "No post found with this id" });
          return;
      }
      const post = dbPostData.get({ plain: true });
      if (post.user_id === req.session.user_id) {
          console.log(post.post_body);
          res.render('edit-post', {
              post,
              loggedIn: req.session.loggedIn
          })
      } else {
          window.location.redirect('/dashboard')
      }
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json(err);
  })

})

module.exports = router; 