import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class Character extends Model {
  public id!: number
  public name!: string

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Character.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "characters",
    sequelize
  }
)
