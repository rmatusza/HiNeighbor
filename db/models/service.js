'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
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
    name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    image_url: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
   
  }, {});
  Service.associate = function(models) {
    Service.belongsTo(models.User, { foreignKey: 'seller_id'})
    Service.hasMany(models.User_service, { foreignKey: 'service_id'})

  };
  return Service;
};
