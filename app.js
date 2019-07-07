const express = require('express')
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./config/passport')
const db = require('./models')
const methodOverride = require('method-override')
const flash = require('connect-flash')


const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(express.static('public'))
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers')
  })
)
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.currentUser = helpers.getUser(req)
  next()
})

module.exports = app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening on port 3000!`)
})

require('./routes')(app, passport)