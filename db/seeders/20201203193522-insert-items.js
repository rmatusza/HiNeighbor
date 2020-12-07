'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Items',
    [
      {
        seller_id: 2,
        purchaser_id: null,
        name: 'Holy Grail',
        description: 'An ancient biblical relic that I stole from the Nazis',
        price: 1000000000,
        quantity: 1,
        for_rent: false,
        for_sale: true,
        image_url: 'holy_grail.PNG',
        sold: false,
        location: null,
        date_sold: null,
        category: 'Ancient Relics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        seller_id: 2,
        purchaser_id: null,
        name: 'Arc of the Covenant',
        description: 'An ancient biblical relic that I stole from the Nazis',
        price: 50,
        quantity: 1,
        for_rent: false,
        for_sale: true,
        image_url: null,
        sold: false,
        location: null,
        date_sold: null,
        category: 'Home and Garden',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        seller_id: 2,
        purchaser_id: null,
        name: 'Golden Idol',
        description: 'An ancient biblical relic that I stole from the Nazis',
        price: 15,
        quantity: 1,
        for_rent: true,
        for_sale: false,
        image_url: null,
        sold: false,
        location: null,
        date_sold: null,
        category: 'Home and Garden',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Items', null, {});
  }
};
