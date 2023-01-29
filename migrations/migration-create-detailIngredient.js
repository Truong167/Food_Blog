'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DetailIngredient', {
      tag: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(128),
        references: {
          model: 'IngredientTag',
          key: 'tag'
        }
      },
      recipeId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Recipe',
          key: 'recipeId'
        }
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DetailIngredient');
  }
};