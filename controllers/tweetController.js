const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db
const helpers = require('../_helpers')

const tweetController = {
  getTweet: async (req, res) => {
    let whereQuery = {}
    const findFollowings = await Followship.findAll({
      where: { followerId: helpers.getUser(req).id }
    })
    const followingsId = findFollowings.map(f => f.followingId)

    whereQuery['UserId'] =
      findFollowings.length > 0
        ? [followingsId, helpers.getUser(req).id]
        : helpers.getUser(req).id

    findFollowings.forEach(f => followingsId.push(f.followingId))

    const tweets = await Tweet.findAll({
      where: whereQuery,
      include: [User, Reply, { model: User, as: 'LikedUsers' }],
      order: [['createdAt', 'DESC']]
    })

    const data = tweets.map(t => ({
      ...t.dataValues,
      description: t.description.substring(0, 100),
      isLiked: t.LikedUsers.map(a => a.id).includes(helpers.getUser(req).id),
      isReplied: t.Replies.map(b => b.id).includes(helpers.getUser(req).id)
    }))

    const users = await User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })

    let popularUser = users
      .map(user => ({
        ...user.dataValues,
        introduction: user.introduction.substring(0, 50),
        FollowerCount: user.Followers.length,
        isFollowed: helpers
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(user.id)
      }))
      .sort((a, b) => b.FollowerCount - a.FollowerCount)
      .slice(0, 10)

    return res.render('tweets', {
      popularUser: popularUser,
      tweets: data
    })
  },

  postTweet: (req, res) => {
    return Tweet.create({
      description: req.body.tweet,
      UserId: req.body.UserId
    }).then(() => {
      return res.redirect('/tweets')
    })
  },

  deleteTweet: (req, res) => {
    return Tweet.destroy({ where: { id: req.params.tweet_id } }).then(() => {
      return res.redirect('back')
    })
  },

  getReply: async (req, res) => {
    const tweet = await Tweet.findOne({
      where: { id: req.params.tweet_id },
      include: [
        User,
        { model: User, as: 'LikedUsers' },
        { model: Reply, include: User }
      ]
    })
    tweet.Replies.sort((a, b) => b.createdAt - a.createdAt)

    tweet.isLiked = tweet.LikedUsers.some(a => a.id === helpers.getUser(req).id)
      ? true
      : false
    tweet.isReplied = tweet.Replies.some(
      b => b.UserId === helpers.getUser(req).id
    )
      ? true
      : false

    const user = await User.findByPk(tweet.UserId, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    })
    const isFollowed = user.Followers.map(d => d.id).includes(
      helpers.getUser(req).id
    )
    return res.render('reply', {
      tweet: tweet,
      user: user,
      isFollowed: isFollowed
    })
  },

  postReply: (req, res) => {
    return Reply.create({
      TweetId: req.params.tweet_id,
      UserId: helpers.getUser(req).id,
      comment: req.body.tweet
    }).then(() => {
      return res.redirect(`/tweets/${req.params.tweet_id}/replies`)
    })
  },

  deleteReply: (req, res) => {
    return Reply.destroy({
      where: { id: req.params.replies_id }
    }).then(() => {
      return res.redirect('back')
    })
  }
}

module.exports = tweetController
