'use strict';
module.exports = (sequelize, DataTypes) => {
  const image = sequelize.define('image', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    path: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    image_data: {
      type:DataTypes.BLOB
    },
  }, {});
  image.associate = function(models) {
    // associations can be defined here
  };
  return image;
};
