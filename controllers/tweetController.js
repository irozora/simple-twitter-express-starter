const db = require('../models')
const { User, Tweet, Reply } = db

const tweetController = {
  getTweet: (req, res) => {
    res.render('tweets')
  }
}

module.exports = tweetController
