const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const authRoute = require('./routes/auth-route');
const profileRoute = require('./routes/profile-route');
const passport = require('passport');
require('./config/passport');
const session = require('express-session');
const flash = require('connect-flash');

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log('Connect to mongodb atlas');
  })
  .catch((err) => console.log(err));

// middleware，順序很重要
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('sucess_msg');
  res.locals.error_msg = req.flash('error_msg');
  // passport 專用的
  res.locals.error = req.flash('error');
  next();
});
app.use('/auth', authRoute); // 設定第一層的路由資料為 /auth;
app.use('/profile', profileRoute);

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});
app.listen(8081, () => {
  console.log('Server listening on port 8081');
});
