'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true,
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true,
      },
      hashedPassword: {
        allowNull: false,
        type: Sequelize.STRING(60).BINARY,
      },
      average_rating: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      num_ratings: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tokenId: {
        type: Sequelize.STRING(36),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Users');
  }
};
