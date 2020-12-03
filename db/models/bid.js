'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    item_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    bid_amount: DataTypes.INTEGER
  }, {});
  Bid.associate = function(models) {
    // associations can be defined here
  };
  return Bid;
};
