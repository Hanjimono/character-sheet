import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class MoneyBalance extends Model {
  public id!: number
  public balance!: number
  public playerId!: number
  public campaignId!: number
  public isCommon!: boolean

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async changeBalance(
    playerId: number,
    campaignId: number,
    amount: number,
    isCommon: boolean = false,
    isNegative: boolean = false
  ): Promise<void> {
    const balance = await MoneyBalance.findOne({
      where: {
        playerId,
        campaignId,
        isCommon
      }
    })
    if (balance) {
      balance.balance += isNegative ? -amount : amount
      await balance.save()
    } else {
      await MoneyBalance.create({
        playerId,
        campaignId,
        balance: isNegative ? -amount : amount,
        isCommon
      })
    }
  }

  public static async getBalance(
    playerId: number,
    campaignId: number,
    isCommon: boolean = false
  ): Promise<number> {
    const balance = await MoneyBalance.findOne({
      where: {
        playerId,
        campaignId,
        isCommon
      }
    })
    return balance ? balance.balance : 0
  }
}

MoneyBalance.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    balance: {
      type: DataTypes.INTEGER,
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
    },
    isCommon: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: "moneyBalances",
    sequelize
  }
)
