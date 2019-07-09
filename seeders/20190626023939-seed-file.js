'use strict'

const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'admin',
          name: 'root',
          avatar: 'https://picsum.photos/640/480',
          introduction: 'Just a fake admin passing thru...',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'user',
          name: 'user1',
          avatar: 'https://picsum.photos/640/480',
          introduction: 'Just a fake user passing thru...',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'user',
          name: 'user2',
          avatar: 'https://picsum.photos/640/480',
          introduction: 'Just a fake user passing thru...',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )

    queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 5 }).map(d => ({
        description: faker.lorem.text(),
        UserId: Math.floor(Math.random() * 3) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 5 }).map(d => ({
        UserId: Math.floor(Math.random() * 3) + 1,
        TweetId: Math.floor(Math.random() * 5) + 1,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    return queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: 5 }).map(d => ({
        UserId: Math.floor(Math.random() * 3) + 1,
        TweetId: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Tweets', null, {})
    queryInterface.bulkDelete('Replies', null, {})
    return queryInterface.bulkDelete('Likes', null, {})
  }
}
