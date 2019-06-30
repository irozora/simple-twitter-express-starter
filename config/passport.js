const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, cb) => {
      const user = await User.findOne({ where: { email: username } })
      if (!user || !bcrypt.compareSync(password, user.password))
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤，請再仔細確認一次。')
        )
      return cb(null, user)
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [{ model: User, as: 'Followings' }]
  }).then(user => {
    return cb(null, user)
  })
})

module.exports = passport
