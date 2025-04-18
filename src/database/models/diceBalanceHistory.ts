import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class DiceBalanceHistory extends Model {
  public id!: number
  public count!: number
  public playerId!: number
  public campaignId!: number
  public gameId!: number
  public isNegative!: boolean

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async saveRollForPlayer(
    playerId: number,
    campaignId: number,
    gameId: number,
    isNegative: boolean
  ) {
    await DiceBalanceHistory.create({
      playerId: playerId,
      campaignId: campaignId,
      gameId: gameId,
      count: 1,
      isNegative: isNegative
    })
    return true
  }
}

DiceBalanceHistory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    },
    playerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    campaignId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    gameId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    isNegative: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: "diceBalanceHistories",
    sequelize
  }
)
