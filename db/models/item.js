'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    seller_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    for_rent: DataTypes.BOOLEAN,
    for_sale: DataTypes.BOOLEAN,
    image_url: DataTypes.TEXT,
    sold: DataTypes.BOOLEAN,
    location: DataTypes.TEXT,
    date_sold: DataTypes.DATE
  }, {});
  Item.associate = function(models) {
    // associations can be defined here
  };
  return Item;
};