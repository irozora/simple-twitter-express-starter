const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const tweetController = require('../controllers/tweetController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) return next()
    res.redirect('/')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.role === 'admin') return next()
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/tweets/:id/delete', authenticatedAdmin, adminController.deleteTweet)

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweet)
  app.post('/tweets', authenticated, tweetController.postTweet)
  app.delete('/tweets/:tweet_id', authenticated, tweetController.deleteTweet)

  app.post('/tweets/:id/like', authenticated, userController.like)
  app.post('/tweets/:id/unlike', authenticated, userController.unlike)
  app.get('/users/:id/likes', authenticated, userController.getLikesPage)

  app.get('/users/:id/tweets', authenticated, userController.getUserProfile)
  app.get('/users/:id/edit', authenticated, userController.editUserProfile)
  app.put('/users/:id/edit', authenticated, upload.single('avatar'), userController.putUserProfile)
  app.get('/users/:id/followings', authenticated, userController.getFollowingPage)
  app.get('/users/:id/followers', authenticated, userController.getFollowerPage)

  app.post('/followships', authenticated, userController.addFollowing)
  app.delete('/followships/:id', authenticated, userController.removeFollowing)

  app.get('/tweets/:tweet_id/replies', authenticated, tweetController.getReply)
  app.post('/tweets/:tweet_id/replies', authenticated, tweetController.postReply)
  app.delete('/tweets/:replies_id/replies', authenticated, tweetController.deleteReply)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signIn
  )

  app.get('/logout', userController.logout)

  app.get('/users/api/v1', userController.getUserAPI)
}
