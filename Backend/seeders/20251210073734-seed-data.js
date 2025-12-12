"use strict";

const { createDeflate } = require("zlib");

let fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // let usersData = JSON.parse(await fs.readFile("./data/users.json", "utf8"));
    // usersData.forEach((user) => {
    //   delete user.id;
    //   user.createdAt = new Date();
    //   user.updatedAt = new Date();
    // });
    // await queryInterface.bulkInsert("Users", usersData, {});
    // let artifactsData = JSON.parse(
    //   await fs.readFile("./data/artifacts.json", "utf8")
    // );
    // artifactsData.forEach((artifact) => {
    //   delete artifact.id;
    //   artifact.createdAt = new Date();
    //   artifact.updatedAt = new Date();
    // });
    // await queryInterface.bulkInsert("Artifacts", artifactsData, {});
    // let weaponsData = JSON.parse(
    //   await fs.readFile("./data/weapons.json", "utf8")
    // );
    // weaponsData.forEach((weapon) => {
    //   delete weapon.id;
    //   weapon.createdAt = new Date();
    //   weapon.updatedAt = new Date();
    // });
    // await queryInterface.bulkInsert("Weapons", weaponsData, {});
    let charactersData = JSON.parse(
      await fs.readFile("./data/characters.json", "utf8")
    );
    charactersData.forEach((character) => {
      delete character.id;
      character.createdAt = new Date();
      character.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Characters", charactersData, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // await queryInterface.bulkDelete("Users", null, {});

    await queryInterface.bulkDelete("Artifacts", null, {});

    await queryInterface.bulkDelete("Weapons", null, {});

    await queryInterface.bulkDelete("Characters", null, {});
  },
};
