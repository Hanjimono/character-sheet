import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class MoneyBalance extends Model {
  public id!: number
  public amount!: number
  public playerId!: number
  public campaignId!: number
  public isCommon!: boolean

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async changeBalance(
    playerId: number | null = null,
    campaignId: number,
    amount: number,
    isCommon: boolean = false,
    isNegative: boolean = false,
    transaction: any = null
  ): Promise<void> {
    const balance = await MoneyBalance.findOne({
      where: {
        playerId,
        campaignId,
        isCommon
      }
    })
    if (balance) {
      balance.amount += isNegative ? -amount : amount
      await balance.save({
        transaction: transaction
      })
    } else {
      await MoneyBalance.create(
        {
          playerId,
          campaignId,
          amount: isNegative ? -amount : amount,
          isCommon
        },
        {
          transaction: transaction
        }
      )
    }
  }

  public static async getBalance(
    playerId: number | null = null,
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
    return balance ? balance.amount : 0
  }

  public static async getTotalBalance(campaignId: number): Promise<number> {
    const balances = await MoneyBalance.findAll({
      where: {
        campaignId
      }
    })
    const totalBalance = balances.reduce((acc, balance) => {
      return acc + balance.amount
    }, 0)
    return totalBalance
  }

  public static async getCommonBalance(campaignId: number): Promise<number> {
    const balance = await MoneyBalance.findOne({
      where: {
        playerId: null,
        campaignId,
        isCommon: true
      }
    })
    return balance ? balance.amount : 0
  }
}

MoneyBalance.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    playerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
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
