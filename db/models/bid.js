'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    item_id: {
      allowNull: false,
      type: DataTypes.INTEGER,

    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,

    },
    bid_amount: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    
  }, {});
  Bid.associate = function(models) {
    Bid.belongsTo(models.Item, { foreignKey: 'item_id'})
    Bid.belongsTo(models.User, { foreignKey: 'user_id'})
  };
  return Bid;
};
