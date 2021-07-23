'use strict';

const bcrypt = require("bcryptjs");
// Create some test users
module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Users', [
      {
        username: 'mikael-admin',
        email: 'mikael@mikaeldacosta.com',
        password: bcrypt.hashSync("7ezJYQSs6^n6q@*s", 16),
        receiver: 'mikael@mikaeldacosta.com',
        role: await queryInterface.rawSelect('Roles', {
          where: {
            name: "admin",
          },
        }, ['id']),
        allow: true,
        identify: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // {
      //   username: 'test-company',
      //   email: 'christiancosta3@hotmail.com',
      //   password: bcrypt.hashSync("Ry6S&6c3AE06HUoj", 16),
      //   receiver: 'christiancosta3@hotmail.com',
      //   contactTextE: '',
      //   contactTextF: '',
      //   role: await queryInterface.rawSelect('Roles', {
      //     where: {
      //       name: "company",
      //     },
      //   }, ['id']),
      //   allow: true,
      //   identify: 'asfoks5',
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      //   },
  ], {});
 },

 down: async (queryInterface, Sequelize) => {
  const Op = Sequelize.Op;

   await queryInterface.bulkDelete('Users', {[Op.or]: [{
    username: 'mikael-admin',   
 },{
  username: 'test-company',   
 }]});
}
};
