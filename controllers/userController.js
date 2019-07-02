const db = require('../models')
const bcrypt = require('bcrypt-nodejs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { User, Tweet, Reply, Like, Followship } = db
const helpers = require('../_helpers')

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

  getLikesPage: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        {
          model: Tweet,
          as: 'LikedTweets',
          include: [User, Reply, { model: User, as: 'LikedUsers' }]
        }
      ]
    }).then(user => {
      const isFollowed = user.Followers.map(d => d.id).includes(
        helpers.getUser(req).id
      )
      const likedList = user.LikedTweets.map(liked => ({
        ...liked.dataValues
      }))
      res.render('likes', {
        user: user,
        isFollowed: isFollowed,
        likedList: likedList
      })
    })
  },

  like: (req, res) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    }).then(like => {
      return res.redirect('back')
    })
  },

  unlike: (req, res) => {
    Like.findOne({
      where: { UserId: helpers.getUser(req).id, TweetId: req.params.id }
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
      const isFollowed = user.Followers.map(d => d.id).includes(
        helpers.getUser(req).id
      )
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
      const isFollowed = user.Followers.map(d => d.id).includes(
        helpers.getUser(req).id
      )
      const followedList = user.Followers.map(follower => ({
        ...follower.dataValues,
        followed: helpers
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(follower.id)
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
      followerId: helpers.getUser(req).id,
      followingId: req.body.UserId
    }).then(followship => {
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    return Followship.destroy({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.id
      }
    }).then(() => {
      return res.redirect('back')
    })
  },

  getUserProfile: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [Reply, { model: User, as: 'LikedUsers' }] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = user.Followers.map(d => d.id).includes(
        helpers.getUser(req).id
      )
      const tweets = user.Tweets.map(a => ({
        ...a.dataValues,
        description: a.dataValues.description.substring(0, 100),
        isReplied: helpers
          .getUser(req)
          .Replies.map(r => r.id)
          .includes(a.id),
        isLiked: helpers
          .getUser(req)
          .LikedTweets.map(l => l.id)
          .includes(a.id)
      }))
      return res.render('profile', { user, tweets, isFollowed })
    })
  },

  editUserProfile: (req, res) => {
    User.findByPk(helpers.getUser(req).id).then(user => {
      return res.render('edit', { user })
    })
  },

  putUserProfile: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'Name cant be blank')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(helpers.getUser(req).id).then(user => {
          user
            .update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: file ? img.data.link : user.avatar
            })
            .then(user => {
              req.flash(
                'success_messages',
                'Your profile was successfully to update'
              )
              res.redirect(`/users/${helpers.getUser(req).id}/tweets`)
            })
        })
      })
    } else {
      User.findByPk(helpers.getUser(req).id).then(user => {
        user
          .update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar
          })
          .then(user => {
            req.flash(
              'success_messages',
              'Your profile was be successfully updated'
            )
            return res.redirect(`/users/${helpers.getUser(req).id}/tweets`)
          })
      })
    }
  }
}

module.exports = userController
