const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db

const tweetController = {
  getTweet: async (req, res) => {
    let whereQuery = {}
    const findFollowings = await Followship.findAll({
      where: { followerId: req.user.id }
    })
    const followingsId = findFollowings.map(f => f.followingId)
    // 如果user沒有followings會出錯,所以分開處理
    whereQuery['UserId'] =
      findFollowings.length > 0 ? [followingsId, req.user.id] : req.user.id

    findFollowings.forEach(f => followingsId.push(f.followingId))

    const tweets = await Tweet.findAll({
      where: whereQuery,
      include: [User, Reply, { model: User, as: 'LikedUsers' }]
    })

    const data = tweets.map(t => ({
      ...t.dataValues,
      description: t.description.substring(0, 100)
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
      req.flash('success_messages', 'restaurant was successfully created')
      return res.redirect('/tweets')
    })
  }
}

module.exports = tweetController
