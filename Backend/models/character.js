"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Character.hasMany(models.FavoriteCharacter, {
        foreignKey: "characterId",
      });
      Character.belongsToMany(models.MyTeam, {
        through: models.CharacterList,
        foreignKey: "characterId",
      });
    }
  }
  Character.init(
    {
      name: DataTypes.STRING,

      title: DataTypes.STRING,

      vision: DataTypes.STRING,

      weapon: DataTypes.STRING,

      gender: DataTypes.STRING,

      nation: DataTypes.STRING,

      affiliation: DataTypes.STRING,

      rarity: DataTypes.INTEGER,

      constellation: DataTypes.STRING,

      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Character",
    }
  );
  return Character;
};
