import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"
import { i } from "framer-motion/client"

export class Game extends Model {
  public id!: number
  public isActive!: boolean
  public characterId!: number
  public campaignId!: number
  public date!: Date

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async getActiveGame(campaignId: number): Promise<Game | null> {
    return await Game.findOne({
      where: {
        campaignId,
        isActive: true
      }
    })
  }

  public static async startNewGame(
    characterId: number,
    campaignId: number
  ): Promise<Game> {
    const game = await Game.create({
      characterId,
      campaignId,
      isActive: true,
      date: new Date()
    })
    return game
  }

  public static async endGame(gameId: number): Promise<Game | null> {
    const game = await Game.findByPk(gameId)
    if (!game) {
      return null
    }
    game.isActive = false
    await game.save()
    return game
  }

  public static async getAllGamesForCampaign(
    campaignId: number
  ): Promise<Game[]> {
    return await Game.findAll({
      where: {
        campaignId
      },
      order: [["date", "DESC"]]
    })
  }
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    characterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    campaignId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: "games",
    sequelize
  }
)
