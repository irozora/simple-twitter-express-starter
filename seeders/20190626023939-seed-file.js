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
        }
      ],
      {}
    )

    queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 8 }).map(d => ({
        email: faker.internet.email(),
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'user',
        name: faker.name.firstName(),
        avatar: 'https://picsum.photos/640/480',
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 30 }).map(d => ({
        description: faker.lorem.text(),
        UserId: Math.floor(Math.random() * 10) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 30 }).map(d => ({
        UserId: Math.floor(Math.random() * 10) + 1,
        TweetId: Math.floor(Math.random() * 30) + 1,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    // queryInterface.bulkInsert(
    //   'Followships',
    //   Array.from({ length: 20 }).map(d => ({
    //     followerId: Math.floor(Math.random() * 10) + 1,
    //     followingId: Math.floor(Math.random() * 10) + 1,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   }))
    // )

    return queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: 30 }).map(d => ({
        UserId: Math.floor(Math.random() * 10) + 1,
        TweetId: Math.floor(Math.random() * 30) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Tweets', null, {})
    queryInterface.bulkDelete('Replies', null, {})
    // queryInterface.bulkDelete('Followships', null, {})
    return queryInterface.bulkDelete('Likes', null, {})
  }
}
