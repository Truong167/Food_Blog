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
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING,
        validate: {
          isIn: [['RT', 'CK']],
        }
      },
      amount: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
        }
      },
      preparationTime: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
        }
      },
      cookingTime: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
        }
      },
      numberOfLikes: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
        }
      },
      userId: {
        type: Sequelize.INTEGER
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