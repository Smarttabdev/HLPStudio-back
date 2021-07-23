'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buildingType: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      cityPart: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      sqm: {
        type: Sequelize.FLOAT
      },
      builtYear: {
        type: Sequelize.INTEGER
      },
      roomNumber: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.FLOAT
      },
      sqmPrice: {
        type: Sequelize.FLOAT
      },
      condition: {
        type: Sequelize.STRING
      },
      saleDate: {
        type: Sequelize.DATE
      },
      plot: {
        type: Sequelize.STRING
      },
      transactionTime: {
        type: Sequelize.FLOAT
      },
      consideration: {
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
    await queryInterface.dropTable('Properties');
  }
};