'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    seller_name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    seller_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Users' }
    },
    purchaser_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: { model: 'Users' }
    },
    name: {
      allowNull: false,
      type: DataTypes.TEXT
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
    image_url: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    image_key: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    sold: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rented: {
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
    expiry_date: {
      allowNull: true,
      type: DataTypes.DATE
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING(50)
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
    rate: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    last_bidder:{
      allowNull: true,
      type: DataTypes.INTEGER
    },
    expired: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }

  }, {});
  Item.associate = function(models) {
    Item.belongsTo(models.User, { foreignKey: 'seller_id'})
    Item.belongsTo(models.User, { foreignKey: 'purchaser_id'})
    Item.hasMany(models.Bid, { foreignKey: 'item_id'})
    Item.hasOne(models.Review, { foreignKey: 'item_id'})
  };
  return Item;
};
