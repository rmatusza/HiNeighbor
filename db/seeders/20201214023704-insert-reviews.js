'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      'Reviews',
      [
        {

          content: null,
          rating: 0,
          author_id: null,
          reviewee_id: 1,
          item_id: 1,
          service_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          content: null,
          rating: 0,
          author_id: null,
          reviewee_id: 1,
          item_id: 2,
          service_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          content: null,
          rating: 0,
          author_id: null,
          reviewee_id: 1,
          item_id: 3,
          service_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          content: null,
          rating: 0,
          author_id: null,
          reviewee_id: 1,
          item_id: 4,
          service_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          content: null,
          rating: 0,
          author_id: null,
          reviewee_id: 1,
          item_id:5,
          service_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          content: null,
          rating: 0,
          author_id: null,
          reviewee_id: 1,
          item_id: 6,
          service_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          content: null,
          rating: 0,
          author_id: null,
          reviewee_id: 1,
          item_id: 7,
          service_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          content: null,
          rating: 0,
          author_id: null,
          reviewee_id: 1,
          item_id: 8,
          service_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    );
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {});

  }
};
