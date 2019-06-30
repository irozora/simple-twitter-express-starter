const db = require('../models')
const bcrypt = require('bcrypt-nodejs')
const { User, Tweet, Reply, Like, Followship } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: async (req, res) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10),
        null
      ),
      introduction: req.body.introduction
    }).then(() => {
      return res.redirect('/signin')
    })
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

  getFollowingPage: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = user.Followers.map(d => d.id).includes(req.user.id)
      const followingList = user.Followings.map(following => ({
        ...following.dataValues,
        followed: req.user.Followings.map(d => d.id).includes(following.id)
      }))

      res.render('followings', {
        user: user,
        isFollowed: isFollowed,
        followingList: followingList
      })
    })
  },

  getFollowerPage: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = user.Followers.map(d => d.id).includes(req.user.id)
      const followedList = user.Followers.map(follower => ({
        ...follower.dataValues,
        followed: req.user.Followings.map(d => d.id).includes(follower.id)
      }))

      res.render('followers', {
        user: user,
        followedList: followedList,
        isFollowed: isFollowed
      })
    })
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.body.UserId
    }).then(followship => {
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    return Followship.destroy({
      where: {
        followerId: req.user.id,
        followingId: req.params.id
      }
    }).then(() => {
      return res.redirect('back')
    })
  }
}

module.exports = userController
