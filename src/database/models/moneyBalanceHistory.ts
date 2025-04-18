import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class MoneyBalanceHistory extends Model {
  public id!: number
  public count!: number
  public fromPlayerId!: number
  public toPlayerId!: number
  public campaignId!: number
  public gameId!: number
  public isNegative!: boolean
  public isTransfer!: boolean

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async saveBalanceChange(
    fromPlayerId: number,
    toPlayerId: number | null = null,
    campaignId: number,
    gameId: number,
    count: number,
    isNegative: boolean,
    isTransfer: boolean = false
  ) {
    await MoneyBalanceHistory.create({
      fromPlayerId: fromPlayerId,
      toPlayerId: toPlayerId,
      campaignId: campaignId,
      gameId: gameId,
      count: count,
      isNegative: isNegative,
      isTransfer: isTransfer
    })
    return true
  }

  public static async saveTransfer(
    fromPlayerId: number,
    toPlayerId: number,
    campaignId: number,
    gameId: number,
    count: number
  ) {
    await MoneyBalanceHistory.saveBalanceChange(
      fromPlayerId,
      toPlayerId,
      campaignId,
      gameId,
      count,
      true,
      true
    )
    await MoneyBalanceHistory.saveBalanceChange(
      toPlayerId,
      fromPlayerId,
      campaignId,
      gameId,
      count,
      false,
      true
    )
    return true
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
      allowNull: false
    },
    toPlayerId: {
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
