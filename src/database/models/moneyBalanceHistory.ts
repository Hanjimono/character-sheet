import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"
import { Player } from "./player"
import { MoneyHistory } from "@/constants/types/money"

export class MoneyBalanceHistory extends Model {
  public id!: number
  public count!: number
  public fromPlayerId!: number | null
  public toPlayerId!: number | null
  public campaignId!: number
  public gameId!: number
  public isNegative!: boolean
  public isTransfer!: boolean
  public comment!: string | null

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async saveBalanceChange(
    fromPlayerId: number | null = null,
    toPlayerId: number | null = null,
    campaignId: number,
    gameId: number,
    count: number,
    comment: string | null = null,
    isNegative: boolean,
    isTransfer: boolean = false,
    transaction: any = null
  ) {
    await MoneyBalanceHistory.create(
      {
        fromPlayerId: fromPlayerId,
        toPlayerId: toPlayerId,
        campaignId: campaignId,
        gameId: gameId,
        count: count,
        isNegative: isNegative,
        isTransfer: isTransfer,
        comment: comment
      },
      {
        transaction: transaction
      }
    )
    return true
  }

  public static async saveTransfer(
    fromPlayerId: number | null = null,
    toPlayerId: number | null = null,
    campaignId: number,
    gameId: number,
    count: number,
    comment: string | null = null,
    transaction: any = null
  ) {
    await MoneyBalanceHistory.saveBalanceChange(
      fromPlayerId,
      toPlayerId,
      campaignId,
      gameId,
      count,
      comment,
      true,
      true,
      transaction
    )
    await MoneyBalanceHistory.saveBalanceChange(
      fromPlayerId,
      toPlayerId,
      campaignId,
      gameId,
      count,
      comment,
      false,
      true,
      transaction
    )
    return true
  }

  public static async getHistory(
    playerId: number,
    campaignId: number,
    gameId: number
  ) {
    const info: MoneyHistory[] = []
    const history = await MoneyBalanceHistory.findAll({
      where: {
        gameId: gameId,
        campaignId: campaignId,
        fromPlayerId: playerId,
        isTransfer: false
      },
      order: [["createdAt", "ASC"]]
    })
    for (const item of history) {
      info.push({
        amount: item.count,
        isNegative: item.isNegative,
        isTransfer: false,
        comment: item.comment || undefined
      })
    }
    const fromTransferHistory = await MoneyBalanceHistory.findAll({
      where: {
        gameId: gameId,
        campaignId: campaignId,
        fromPlayerId: playerId,
        isTransfer: true,
        isNegative: true
      },
      order: [["createdAt", "ASC"]]
    })
    for (const item of fromTransferHistory) {
      const toPlayer = !!item.toPlayerId
        ? (await Player.findByPk(item.toPlayerId))?.name
        : "common funds"
      info.push({
        amount: item.count,
        isNegative: item.isNegative,
        isTransfer: true,
        toPlayer: toPlayer,
        comment: item.comment || undefined
      })
    }
    const toTransferHistory = await MoneyBalanceHistory.findAll({
      where: {
        gameId: gameId,
        campaignId: campaignId,
        toPlayerId: playerId,
        isTransfer: true,
        isNegative: false
      },
      order: [["createdAt", "ASC"]]
    })
    for (const item of toTransferHistory) {
      const fromPlayer = !!item.fromPlayerId
        ? (await Player.findByPk(item.fromPlayerId))?.name
        : "common funds"
      info.push({
        amount: item.count,
        isNegative: item.isNegative,
        isTransfer: true,
        fromPlayer: fromPlayer,
        comment: item.comment || undefined
      })
    }
    return info
  }
}

MoneyBalanceHistory.init(
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
    fromPlayerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    toPlayerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    campaignId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    gameId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isNegative: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isTransfer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: "moneyBalanceHistories",
    sequelize
  }
)
