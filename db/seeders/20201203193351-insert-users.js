'use strict';

const bcrypt = require('bcryptjs');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          username: 'rmatusza',
          first_name: 'Ryan',
          last_name: 'Matuszak',
          email: 'ryan@test.com',
          hashedPassword: bcrypt.hashSync('password', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username:'indy',
          first_name: 'Indiana',
          last_name: 'Jones',
          email: 'indiana@test.com',
          hashedPassword: bcrypt.hashSync('password', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
