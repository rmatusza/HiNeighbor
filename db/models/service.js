'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    seller_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image_url: DataTypes.TEXT,
    price: DataTypes.INTEGER
  }, {});
  Service.associate = function(models) {
    // associations can be defined here
  };
  return Service;
};