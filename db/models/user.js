'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY,
    },
    first_name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    last_name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
  }, {});

  User.associate = function(models) {
    User.hasMany(models.Bid, { foreignKey: 'user_id'})
    User.hasMany(models.Conversation, { foreignKey: 'member_one'})
    User.hasMany(models.Conversation, { foreignKey: 'member_two'})
    User.hasMany(models.Item, { foreignKey: 'seller_id'})
    User.hasMany(models.Item, { foreignKey: 'purchaser_id'})
    User.hasMany(models.Message, { foreignKey: 'author'})
    User.hasMany(models.Review, { foreignKey: 'author_id'})
    User.hasMany(models.Review, { foreignKey: 'reviewee_id'})
    User.hasMany(models.Service, { foreignKey: 'seller_id'})
    User.hasMany(models.User_service, { foreignKey: 'purchaser_id'})
  };

  return User;
};
