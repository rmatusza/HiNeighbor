'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_service = sequelize.define('User_service', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    service_id: {
      allowNull: false,
      type: DataTypes.INTEGER,

    },
    purchaser_id: {
      allowNull: false,
      type: DataTypes.INTEGER,

    },
    location: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    service_date: {
      allowNull: false,
      type: DataTypes.DATE
    },
    appt_confirmed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    service_completed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    completion_date: {
      allowNull: true,
      type: DataTypes.DATE
    },

  }, {});
  User_service.associate = function(models) {
    User_service.belongsTo(models.Service, { foreignKey: 'service_id'})
    User_service.belongsTo(models.User, { foreignKey: 'purchaser_id'})

  };
  return User_service;
};
