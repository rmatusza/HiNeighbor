'use strict';

const { sequelize } = require("../models");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seller_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users' }
      },
      purchaser_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'Users' }
      },
      name: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      price: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      for_rent: {
        allowNull: false,
        type: Sequelize.BOOLEAN,

      },
      for_sale: {
        allowNull: false,
        type: Sequelize.BOOLEAN,

      },
      image_data: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      sold: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      location: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      date_sold: {
        allowNull: true,
        type: Sequelize.DATE
      },
      expiry_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      num_bids: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      bid_ids: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      current_bid: {
        allowNull: true,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Items');
  }
};
