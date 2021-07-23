'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      next: {
        type: Sequelize.INTEGER,
        references: {
          model: "Questions",
          key: "id",
        },
      },
      end: {
        type: Sequelize.BOOLEAN
      },
      node: {
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      subHeading: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      answers: {
        type: Sequelize.STRING(10000000), 
        get: function() {
            return JSON.parse(this.getDataValue('answers'));
        }, 
        set: function(val) {
            return this.setDataValue('answers', JSON.stringify(val));
        }
      },
      company: {
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
    await queryInterface.dropTable('Questions');
  }
};