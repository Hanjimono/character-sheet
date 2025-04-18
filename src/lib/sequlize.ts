import { Sequelize } from "sequelize"
import sqlite3 from "sqlite3"

declare global {
  var sequelize: Sequelize | undefined
}

const createSequelize = () =>
  new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
    dialectModule: sqlite3
  })

let sequelize: Sequelize
if (process.env.NODE_ENV !== "development") {
  sequelize = createSequelize()
} else {
  if (!global.sequelize) {
    global.sequelize = createSequelize()
  }
  sequelize = global.sequelize
}

export default sequelize
