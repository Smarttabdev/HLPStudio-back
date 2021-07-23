'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Queries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      builtYear: {
        type: Sequelize.INTEGER
      },
      buildingType: {
        type: Sequelize.STRING
      },
      valuation: {
        type: Sequelize.FLOAT
      },
      price: {
        type: Sequelize.FLOAT
      },
      street: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      roomNumber: {
        type: Sequelize.INTEGER
      },
      plot: {
        type: Sequelize.STRING
      },
      condition: {
        type: Sequelize.STRING
      },
      sqm: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.STRING
      },
      toCompany: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
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
    await queryInterface.dropTable('Queries');
  }
};