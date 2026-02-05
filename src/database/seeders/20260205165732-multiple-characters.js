"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("characters", [
      {
        id: 2,
        name: "Feitum Bekker",
        obsidianPath: "",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("characters", {
      id: {
        [Sequelize.Op.in]: [2]
      }
    })
  }
}
