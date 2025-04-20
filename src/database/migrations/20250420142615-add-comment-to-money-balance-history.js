module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "moneyBalanceHistories",
          "comment",
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
        queryInterface.removeColumn("moneyBalanceHistories", "comment", {
          transaction: t
        })
      ])
    })
  }
}
