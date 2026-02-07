"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("players", [
      {
        name: "Dungeon Master",
        characterId: 2,
        isMain: false,
        isDM: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/public/images/dm-avatar.png",
        shortname: "DM"
      },
      {
        name: "Feitum Bekker",
        characterId: 2,
        isMain: true,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/public/images/feitum-ava.png",
        shortname: "Feitum"
      },
      {
        name: "Daniel Lindeif",
        characterId: 2,
        isMain: false,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/public/images/Daniel.jpg",
        shortname: "Daniel"
      },
      {
        name: "Xartos Zerrai",
        characterId: 2,
        isMain: false,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/public/images/xartos.png",
        shortname: "Xartos"
      },
      {
        name: "Fairy",
        characterId: 2,
        isMain: false,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/public/images/fairy.png",
        shortname: "Fairy"
      },
      {
        name: "Kerkad",
        characterId: 2,
        isMain: false,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/public/images/Kerkad.jpg",
        shortname: "Kerkad"
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("players", null, {})
  }
}
