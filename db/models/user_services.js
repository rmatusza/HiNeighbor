'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_service = sequelize.define('User_service', {
    service_id: DataTypes.INTEGER,
    purchaser_id: DataTypes.INTEGER,
    location: DataTypes.TEXT,
    service_date: DataTypes.DATE,
    appt_confirmed: DataTypes.BOOLEAN,
    service_completed: DataTypes.BOOLEAN,
    completion_date: DataTypes.DATE
  }, {});
  User_service.associate = function(models) {
    // associations can be defined here
  };
  return User_service;
};
