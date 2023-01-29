'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IngredientTag', {
        tag: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(128)
      },
      name: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      image: {
        type: Sequelize.BLOB,
        unique: true,
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
    await queryInterface.dropTable('IngredientTag');
  }
};