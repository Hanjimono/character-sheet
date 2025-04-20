"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("moneyBalanceHistories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fromPlayerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "players",
          key: "id"
        }
      },
      toPlayerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "players",
          key: "id"
        }
      },
      campaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "campaigns",
          key: "id"
        }
      },
      gameId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "games",
          key: "id"
        }
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      isNegative: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isTransfer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable("moneyBalanceHistories")
  }
}
