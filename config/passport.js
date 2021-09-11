const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

passport.serializeUser((user, done) => {
  console.log('Serializing user now');
  done(null, user._id); // 存進mongoDB的 id 都是 _id 的形式
});

passport.deserializeUser((id, done) => {
  console.log('Deserializing user now');
  User.findById({ _id: id }).then((user) => {
    console.log('Found User');
    done(null, user);
  });
});

// local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username: username.email });
    try {
      if (!user) return done(null, false);
      // 比較使用者傳的密碼和 hash 解密後的密碼是否相同
      await bcrypt.compare(password, user.password, (err, result) => {
        if (err) return done(null, false);
        if (!result) return done(null, false);
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }),
);

// passport-google-oauth20 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // 點選 google 帳號確認授權後會跳轉的 url
      callbackURL: '/auth/google/redirect',
    },
    // passport callback
    async (accessToken, refreshToken, profile, done) => {
      // 利用回傳的資料，確認是否已存在於 DB 中
      const foundUser = await User.findOne({ googleID: profile.id });
      if (foundUser) {
        // 查到使用者，take data out
        console.log('User already exist');
        done(null, foundUser);
      } else {
        // 沒查到使用者，create our own copy and save it to MongoDB

        new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        })
          .save()
          .then((newUser) => {
            console.log('New user created');
            done(null, newUser);
          });
      }
    },
  ),
);
