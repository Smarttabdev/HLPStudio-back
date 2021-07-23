'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      receiver: {
        type: Sequelize.STRING
      },
      contactTextE: {
        type: Sequelize.STRING
      },
      contactTextF: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER,
        references: {
          model: "Roles", 
          key: 'id',
        },
      },
      allow: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      identify: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};