'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('User_services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      service_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Services' }
      },
      purchaser_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users' }
      },
      location: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      service_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      appt_confirmed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      service_completed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      completion_date: {
        allowNull: true,
        type: Sequelize.DATE
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
    return queryInterface.dropTable('User_services');
  }
};
