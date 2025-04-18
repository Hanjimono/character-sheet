import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class Campaign extends Model {
  public id!: number
  public name!: string
  public isActive!: boolean
  public characterId!: number

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async getActiveCampaign(
    characterId: number
  ): Promise<Campaign | null> {
    return await Campaign.findOne({
      where: {
        characterId,
        isActive: true
      }
    })
  }
}

Campaign.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    characterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    tableName: "campaigns",
    sequelize
  }
)
