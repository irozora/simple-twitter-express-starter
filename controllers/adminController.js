const db = require('../models')
const { User, Tweet, Reply, Followship, Like } = db

const adminController = {
  getUsers: (req, res) => {
    return User.findAll({
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(users => {
      users = users.sort((a, b) => b.Tweets.length - a.Tweets.length)
      res.render('admin/users', { users, users })
    })
  },
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [User, {
        model: Reply,
        include: [User]
      }]
    }).then(tweets => {
      const tweetsEdit = tweets.map(a => ({
        ...a.dataValues,
        description: a.dataValues.description.substring(0, 20)
      }))

      return res.render('admin/tweets', {
        tweets: tweetsEdit
      })
    })
  },

  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id).then(tweet => {
      tweet.destroy().then(tweet => {
        return res.redirect('/admin/tweets')
      })
    })
  }
}

  
module.exports = adminController