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
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
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
  }, {});
  Rented_Item.associate = function(models) {
    Rented_Item.belongsTo(models.User, { foreignKey: 'user_id'})
    Rented_Item.belongsTo(models.Item, { foreignKey: 'item_id'})
  };
  return Rented_Item;
};
