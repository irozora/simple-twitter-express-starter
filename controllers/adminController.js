const db = require('../models')
const { User, Tweet, Reply, Followship, Like } = db
const pageLimit = 5

const adminController = {
  getUsers: (req, res) => {
    let offset = 0

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    return User.findAndCountAll({
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ],
      offset: offset,
      limit: pageLimit,
      distinct: true
    }).then(result => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({
        length: pages
      }).map((item, index) => index + 1)

      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      users = result.rows
        .sort((a, b) => b.Tweets.length - a.Tweets.length)
        .slice(0, 5)
      res.render('admin/users', {
        users: users,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
    })
  },

  getTweets: (req, res) => {

    let offset = 0

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    
    Tweet.findAndCountAll({include: [
      User,
      {model: Reply, include: [User]},
    ],
      offset: offset,
      limit: pageLimit,
      distinct: true})
    .then(result => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({
        length: pages
      }).map((item, index) => index + 1)

      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(a => ({
        ...a.dataValues,
        description: a.dataValues.description.substring(0, 20),
        repliedCount: a.Replies.length
      }))

      console.log(data)

      res.render('admin/tweets', {
        tweets: data,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
      // const tweetsEdit = tweets.map(a => ({
      //   ...a.dataValues,
      //   description: a.dataValues.description.substring(0, 20),
      //   repliedCount: a.Replies.length
      // }))

      // return res.render('admin/tweets', {
      //   tweets: tweetsEdit
      // })
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
