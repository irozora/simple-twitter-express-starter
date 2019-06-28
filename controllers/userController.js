const db = require('../models')
const bcrypt = require('bcrypt-nodejs')
const { User, Tweet, Reply, Like, Followship } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: async (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '您的兩次密碼輸入不相符。')
      return res.redirect('/signup')
    }
    const user = await User.findOne({ where: { email: req.body.email } })
    if (user) {
      req.flash('error_messages', '這個信箱已經有使用者註冊過了。')
      return res.redirect('/signup')
    }
    const done = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10),
        null
      ),
      introduction: req.body.introduction
    })
    if (done) {
      return res.redirect('/signin')
    }
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/signin')
  },

  getUserAPI: (req, res) => {
    User.findAll().then(data => {
      data = data.map(user => {
        return { name: user.name, email: user.email }
      })
      return res.send(data)
    })
  },

  like: (req, res) => {
    Like.create({
      UserId: req.user.id,
      TweetId: req.params.id
    }).then(like => {
      return res.redirect('back')
    })
  },

  unlike: (req, res) => {
    Like.findOne({
      where: { UserId: req.user.id, TweetId: req.params.id }
    }).then(like => {
      like.destroy().then(() => {
        return res.redirect('back')
      })
    })
  },

  // getFollowingPage的"該使用者的追蹤者是否是自己的追蹤者功能還未完工QQ"
  getFollowingPage: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = user.Followings.map(d => d.id).includes(user.id)
      const followingList = user.Followings.map(following => ({
        ...following.dataValues,
        followedOrNot: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      console.log(followingList)

      res.render('followings', {
        user: user,
        isFollowed: isFollowed,
        followingList: followingList
      })
    })
  },

  // getFollowerPage的狀況跟getFollowingPage一樣...
  getFollowerPage: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = user.Followings.map(d => d.id).includes(user.id)
      const followedList = user.Followers.map(follower => ({
        ...follower.dataValues
      }))
      res.render('followers', {
        user: user,
        followedList: followedList,
        isFollowed: isFollowed
      })
    })
  },

  addFollowing: (req, res) => {
    return Followship.create({ followerId: req.user.id, followingId: req.params.id }).then(followship => {
      console.log(req.user.id, req.params.id)
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.id } }).then(followship => {
      followship.destroy().then(followship => {
        return res.redirect('back')
      })
    })
  }
}

module.exports = userController
