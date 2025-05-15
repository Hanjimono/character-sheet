import { Model, DataTypes, Sequelize, Optional } from "sequelize"
import sequelize from "@/lib/sequlize"

export class Player extends Model {
  public id!: number
  public name!: string
  public isMain!: boolean
  public isDM!: boolean
  public characterId!: number
  public image!: string
  public shortname!: string

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static async getPlayersForCharacter(characterId: number) {
    return await Player.findAll({
      where: {
        characterId: characterId
      }
    })
  }

  public static async getPlayerById(playerId: number) {
    return await Player.findOne({
      where: {
        id: playerId
      }
    })
  }
}

Player.init(
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
    isMain: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isDM: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    characterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shortname: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "players",
    sequelize
  }
)
