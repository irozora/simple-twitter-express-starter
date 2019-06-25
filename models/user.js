'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.BOOLEAN,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT
    },
    {}
  )
  User.associate = function(models) {}
  return User
}
