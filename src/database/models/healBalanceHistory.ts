import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class HealBalanceHistory extends Model {
  public id!: number
  public count!: number
  public playerId!: number
  public campaignId!: number
  public gameId!: number
  public isNegative!: boolean
  public comment!: string | null

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async saveHealForPlayer(
    playerId: number,
    campaignId: number,
    gameId: number,
    isNegative: boolean,
    count = 0,
    comment: string | null = null
  ) {
    await HealBalanceHistory.create({
      playerId: playerId,
      campaignId: campaignId,
      gameId: gameId,
      count: count,
      isNegative: isNegative,
      comment: comment
    })
    return true
  }

  public static async getHealSum(
    campaignId: number,
    gameId: number,
    playerId?: number
  ) {
    const heals = await HealBalanceHistory.findAll({
      where: {
        campaignId: campaignId,
        gameId: gameId,
        ...(playerId && { playerId: playerId })
      }
    })
    let totalPositive = 0
    let totalNegative = 0
    for (const heal of heals) {
      if (heal.isNegative) {
        totalNegative += heal.count
      } else {
        totalPositive += heal.count
      }
    }
    return {
      totalPositive,
      totalNegative
    }
  }

  public static async getAllForGame(
    campaignId: number,
    gameId: number
  ): Promise<HealBalanceHistory[]> {
    return await HealBalanceHistory.findAll({
      where: {
        campaignId: campaignId,
        gameId: gameId
      },
      order: [["createdAt", "ASC"]]
    })
  }
}

HealBalanceHistory.init(
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
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    tableName: "healBalanceHistories",
    sequelize
  }
)
