const express = require('express')
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./config/passport')
const db = require('./models')
const methodOverride = require('method-override')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(express.static('public'))
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main'
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
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening on port 3000!`)
})

require('./routes')(app, passport)