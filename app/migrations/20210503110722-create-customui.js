'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Customuis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      backgroundImg: {
        type: Sequelize.STRING
      },
      normalFont: {
        type: Sequelize.STRING
      },
      labelFont: {
        type: Sequelize.STRING
      },
      labelCol: {
        type: Sequelize.STRING
      },
      cardBackCol: {
        type: Sequelize.STRING
      },
      headerCol: {
        type: Sequelize.STRING
      },
      headerText: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      popupText: {
        type: Sequelize.STRING
      },
      popupCol: {
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
    await queryInterface.dropTable('Customuis');
  }
};