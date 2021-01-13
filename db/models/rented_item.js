'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rented_Item = sequelize.define('Rented_Item', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    item_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Items' }
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Users' }
    },
    seller_name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    item_name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    rate: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    start_date: {
      allowNull: false,
      type: DataTypes.DATE
    },
    return_date: {
      allowNull: false,
      type: DataTypes.DATE
    },
    rent_total: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    active: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    image_url: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },

  }, {});
  Rented_Item.associate = function(models) {
    Rented_Item.belongsTo(models.User, { foreignKey: 'user_id'})
    Rented_Item.belongsTo(models.Item, { foreignKey: 'item_id'})
  };
  return Rented_Item;
};
