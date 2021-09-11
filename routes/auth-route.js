const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

router.get('/signup', (req, res) => {
  res.render('signup', { user: req.user });
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  // check if the data in DB
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    req.flash('error_msg', 'Email has already been registered');
    res.redirect('/auth/signup');
    return;
  }
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  try {
    await new User({
      name,
      email,
      password: hash,
    }).save();
    req.flash('success_msg', 'Registration succeeds. You van login now.');
    res.redirect('/auth/login');
  } catch (err) {
    console.log(err.errors.name.properties);
    req.flash('error_msg', err.errors.name.properties.message);
    res.redirect('/auth/signup');
  }

  res.send('Thanks for posting');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: 'Wrong email or password.',
  }),
  (req, res) => {
    res.redirect('/profile');
  },
);

router.get(
  '/google',
  // 想要獲得使用者的資料，例如['email']
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// passport.authenticate() 是一個 middleware
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile');
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

module.exports = router;
