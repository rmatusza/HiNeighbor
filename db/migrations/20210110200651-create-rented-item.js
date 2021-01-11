'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rented_Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      item_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Items' }
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users' }
      },
      seller_name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      item_name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      rate: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      start_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      return_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      rent_total: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      image_url: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING(50)
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Rented_Items');
  }
};
