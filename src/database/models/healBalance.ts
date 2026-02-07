import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class HealBalance extends Model {
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
    isNegative: boolean,
    count: number
  ) {
    const balance = await HealBalance.findOne({
      where: {
        playerId: plyerId,
        campaignId: campaignId
      }
    })
    if (!balance) {
      await HealBalance.create({
        playerId: plyerId,
        campaignId: campaignId,
        positiveBalance: isNegative ? 0 : count,
        negativeBalance: isNegative ? count : 0
      })
      return true
    }
    if (isNegative) {
      await balance.increment("negativeBalance", { by: count })
    } else {
      await balance.increment("positiveBalance", { by: count })
    }
    return true
  }

  public static async deleteBalanceForPlayer(
    playerId: number,
    campaignId: number,
    isNegative: boolean,
    count: number
  ) {
    const balance = await HealBalance.findOne({
      where: {
        playerId: playerId,
        campaignId: campaignId
      }
    })
    if (!balance) {
      return false
    }
    if (isNegative) {
      await balance.decrement("negativeBalance", { by: count })
    } else {
      await balance.decrement("positiveBalance", { by: count })
    }
    return true
  }

  public static async getTotalBalance(campaignId: number, playerId?: number) {
    const balances = await HealBalance.findAll({
      where: {
        campaignId: campaignId,
        ...(playerId && { playerId: playerId })
      }
    })
    let totalPositive = 0
    let totalNegative = 0
    for (const balance of balances) {
      totalPositive += balance.positiveBalance
      totalNegative += balance.negativeBalance
    }
    return {
      totalPositive,
      totalNegative
    }
  }
}

HealBalance.init(
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
    tableName: "healBalances",
    sequelize
  }
)
