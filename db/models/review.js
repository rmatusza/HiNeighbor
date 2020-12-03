'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    content: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    author_id: DataTypes.INTEGER,
    reviewee_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER
  }, {});
  Review.associate = function(models) {
    // associations can be defined here
  };
  return Review;
};