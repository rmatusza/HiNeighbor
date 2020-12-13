'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      rating: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      author_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'Users' }
      },
      reviewee_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users' }

      },
      item_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Items' }

      },
      service_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'Services'}
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
    return queryInterface.dropTable('Reviews');
  }
};
