"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("players", [
      {
        name: "Dungeon Master",
        characterId: 1,
        isMain: false,
        isDM: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Sar'Tael Verin'Keloth",
        characterId: 1,
        isMain: true,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Lighane Aesteral",
        characterId: 1,
        isMain: false,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Rek'Sai",
        characterId: 1,
        isMain: false,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Selynan Ivion",
        characterId: 1,
        isMain: false,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Vish",
        characterId: 1,
        isMain: false,
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("players", null, {})
  }
}
