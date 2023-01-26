'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recipe', {
      recipeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recipeName: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(5),
        validate: {
          isIn: [['RT', 'CK']],
        },
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
        },
        allowNull: false
      },
      preparationTime: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
        },
        allowNull: false
      },
      cookingTime: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
        },
        allowNull: false
      },
      numberOfLikes: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
        },
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'userId'
        },
        allowNull: false
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Recipe');
  }
};