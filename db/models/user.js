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
    
  };

  return User;
};
