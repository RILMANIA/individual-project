"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FavoriteCharacters", {
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
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      characterId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Characters",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      artifactId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Artifacts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      weaponId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Weapons",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("FavoriteCharacters");
  },
};
