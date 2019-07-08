'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER
    },
    {}
  )
  Like.associate = function(models) {}
  return Like
}
