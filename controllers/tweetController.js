const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db

const tweetController = {
  getTweet: async (req, res) => {
    let whereQuery = {}
    const findFollowings = await Followship.findAll({
      where: { followerId: req.user.id }
    })
    const followingsId = findFollowings.map(f => f.followingId)

    whereQuery['UserId'] =
      findFollowings.length > 0 ? [followingsId, req.user.id] : req.user.id

    findFollowings.forEach(f => followingsId.push(f.followingId))

    const tweets = await Tweet.findAll({
      where: whereQuery,
      include: [User, Reply, { model: User, as: 'LikedUsers' }]
    })

    const data = tweets.map(t => ({
      ...t.dataValues,
      description: t.description.substring(0, 100),
      isLiked: t.LikedUsers.map(a => a.id).includes(req.user.id),
      isReplied: t.Replies.map(b => b.id).includes(req.user.id)
    }))

    const users = await User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })

    let popularUser = users
      .map(user => ({
        ...user.dataValues,
        introduction: user.introduction.substring(0, 50),
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
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

  getReply: async (req, res) => {
    const tweet = await Tweet.findOne({
      where: { id: req.params.tweet_id },
      include: [
        User,
        { model: User, as: 'LikedUsers' },
        { model: Reply, include: User, order: [['createdAt', 'DESC']] }
      ]
    })

    tweet.isLiked = tweet.LikedUsers.some(a => a.id === req.user.id)
      ? true
      : false
    tweet.isReplied = tweet.Replies.some(b => b.UserId.id === req.user.id)
      ? true
      : false

    const user = await User.findByPk(tweet.UserId, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    })
    return res.render('reply', { tweet: tweet, user: user })
  },

  postReply: (req, res) => {
    return Reply.create({
      TweetId: req.params.tweet_id,
      UserId: req.user.id,
      comment: req.body.tweet
    }).then(() => {
      return res.redirect(`/tweets/${req.params.tweet_id}/replies`)
    })
  }
}

module.exports = tweetController
