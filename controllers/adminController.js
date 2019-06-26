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
  }
}

module.exports = adminController
