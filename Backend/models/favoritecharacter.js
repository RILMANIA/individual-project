"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FavoriteCharacter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FavoriteCharacter.belongsTo(models.User, { foreignKey: "userId" });
      FavoriteCharacter.belongsTo(models.Character, {
        foreignKey: "characterId",
      });
      FavoriteCharacter.belongsTo(models.Artifact, {
        foreignKey: "artifactId",
      });
      FavoriteCharacter.belongsTo(models.Weapon, { foreignKey: "weaponId" });
    }
  }
  FavoriteCharacter.init(
    {
      name: DataTypes.STRING,

      title: DataTypes.STRING,

      vision: DataTypes.STRING,

      weapon: DataTypes.STRING,

      gender: DataTypes.STRING,

      nation: DataTypes.STRING,

      affiliation: DataTypes.STRING,

      rarity: DataTypes.INTEGER,

      description: DataTypes.TEXT,

      userId: DataTypes.INTEGER,
      characterId: DataTypes.INTEGER,
      artifactId: DataTypes.INTEGER,
      weaponId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FavoriteCharacter",
    }
  );
  return FavoriteCharacter;
};
