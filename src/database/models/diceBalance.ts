import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class DiceBalance extends Model {
  public id!: number
  public positiveBalance!: number
  public negativeBalance!: number
  public playerId!: number
  public campaignId!: number

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async saveBalanceForPlayer(
    plyerId: number,
    campaignId: number,
    isNegative: boolean
  ) {
    const balance = await DiceBalance.findOne({
      where: {
        playerId: plyerId,
        campaignId: campaignId
      }
    })
    if (!balance) {
      await DiceBalance.create({
        playerId: plyerId,
        campaignId: campaignId,
        positiveBalance: isNegative ? 0 : 1,
        negativeBalance: isNegative ? 1 : 0
      })
      return true
    }
    if (isNegative) {
      await balance.increment("negativeBalance")
    } else {
      await balance.increment("positiveBalance")
    }
    return true
  }
}

DiceBalance.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    positiveBalance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    negativeBalance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    playerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    campaignId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    tableName: "diceBalances",
    sequelize
  }
)
