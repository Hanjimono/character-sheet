import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class DamageBalanceHistory extends Model {
  public id!: number
  public count!: number
  public playerId!: number
  public campaignId!: number
  public gameId!: number
  public isNegative!: boolean
  public isSummon!: boolean
  public comment!: string | null

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async saveDamageForPlayer(
    playerId: number,
    campaignId: number,
    gameId: number,
    isNegative: boolean,
    count = 0,
    isSummon: boolean = false,
    comment: string | null = null
  ) {
    await DamageBalanceHistory.create({
      playerId: playerId,
      campaignId: campaignId,
      gameId: gameId,
      count: count,
      isNegative: isNegative,
      isSummon: isSummon,
      comment: comment
    })
    return true
  }

  public static async getDamageSum(
    campaignId: number,
    gameId: number,
    playerId?: number
  ) {
    const damages = await DamageBalanceHistory.findAll({
      where: {
        campaignId: campaignId,
        gameId: gameId,
        ...(playerId && { playerId: playerId })
      }
    })
    let totalPositive = 0
    let totalNegative = 0
    for (const damage of damages) {
      if (damage.isNegative) {
        totalNegative += damage.count
      } else {
        totalPositive += damage.count
      }
    }
    return {
      totalPositive,
      totalNegative
    }
  }
}

DamageBalanceHistory.init(
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
    isSummon: {
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
    tableName: "damageBalanceHistories",
    sequelize
  }
)
