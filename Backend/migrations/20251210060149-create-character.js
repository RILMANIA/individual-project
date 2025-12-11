"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Characters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      vision: {
        type: Sequelize.STRING,
      },
      weapon: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      nation: {
        type: Sequelize.STRING,
      },
      affiliation: {
        type: Sequelize.STRING,
      },
      rarity: {
        type: Sequelize.INTEGER,
      },
      constellation: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Characters");
  },
};
