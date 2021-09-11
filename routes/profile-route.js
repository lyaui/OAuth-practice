const router = require('express').Router();
const Post = require('../models/post');

const authCheck = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/auth/login');
  } else {
    next();
  }
};

router.get('/', authCheck, async (req, res) => {
  let postsFound = await Post.find({ author: req.user._id });
  console.log(postsFound);
  res.render('profile', { user: req.user, posts: postsFound });
});

router.get('/post', authCheck, (req, res) => {
  res.render('post', { user: req.user });
});

router.post('/post', authCheck, async (req, res) => {
  const { title, content } = req.body;
  try {
    await new Post({ title, content, author: req.user._id }).save();
    res.status(200).redirect('/profile');
  } catch (err) {
    req.flash('error_msg', 'Both title and content are required.');
    res.redirect('/profile/post');
  }
});

module.exports = router;
