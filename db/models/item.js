'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    seller_id: {
      allowNull: false,
      type: DataTypes.INTEGER,

    },
    purchaser_id: {
      allowNull: true,
      type: DataTypes.INTEGER,

    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    for_rent: {
      allowNull: false,
      type: DataTypes.BOOLEAN,

    },
    for_sale: {
      allowNull: false,
      type: DataTypes.BOOLEAN,

    },
    image_data: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    sold: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    location: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    date_sold: {
      allowNull: true,
      type: DataTypes.DATE
    },
    num_bids: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bid_ids: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    current_bid: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },

  }, {});
  Item.associate = function(models) {
    Item.belongsTo(models.User, { foreignKey: 'seller_id'})
    Item.belongsTo(models.User, { foreignKey: 'purchaser_id'})
    Item.hasMany(models.Bid, { foreignKey: 'item_id'})
    Item.hasOne(models.Review, { foreignKey: 'item_id'})
  };
  return Item;
};
