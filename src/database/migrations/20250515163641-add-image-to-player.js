module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "players",
          "image",
          {
            type: Sequelize.DataTypes.STRING
          },
          { transaction: t }
        )
      ])
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("players", "image", {
          transaction: t
        })
      ])
    })
  }
}
