module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "characters",
          "obsidianPath",
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
        queryInterface.removeColumn("characters", "obsidianPath", {
          transaction: t
        })
      ])
    })
  }
}
