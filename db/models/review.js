'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    rating: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    author_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Users' }
    },
    reviewee_id: {
      allowNull: false,
      type: DataTypes.INTEGER,

    },
    item_id: {
      allowNull: true,
      type: DataTypes.INTEGER,


    },
    service_id: {
      allowNull: true,
      type: DataTypes.INTEGER,

    },

  }, {});
  Review.associate = function(models) {
    Review.belongsTo(models.Item, { foreignKey: 'item_id'})
    Review.belongsTo(models.User_service, { foreignKey: 'item_id'})
    Review.belongsTo(models.User, { foreignKey: 'author_id'})
    Review.belongsTo(models.User, { foreignKey: 'reviewee_id'})


  };
  return Review;
};
