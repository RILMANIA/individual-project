"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("CharacterLists", "characterId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Characters",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("CharacterLists", "characterId");
  },
};
