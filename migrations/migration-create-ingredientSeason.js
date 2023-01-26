'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IngredientSeason', {
      tag: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(128),
        references: {
          model: 'IngredientTag',
          key: 'tag'
        }
      },
      seasonId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Season',
          key: 'seasonId'
        }
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
    await queryInterface.dropTable('IngredientSeason');
  }
};