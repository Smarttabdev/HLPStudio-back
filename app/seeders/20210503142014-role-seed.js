'use strict';

// Create all the roles for the app
module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Roles', [{
       name: 'company',
       createdAt: new Date(),
       updatedAt: new Date(), 
    },{
       name: 'admin',
       createdAt: new Date(),
       updatedAt: new Date(),

    }
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

     await queryInterface.bulkDelete('Roles', {[Op.or]: [{
      name: 'company',   
   },{
      name: 'admin',   
   }]});
  }
};
