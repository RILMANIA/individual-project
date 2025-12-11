"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Artifact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Artifact.hasMany(models.FavoriteCharacter, { foreignKey: "artifactId" });
    }
  }
  Artifact.init(
    {
      name: DataTypes.STRING,

      max_rarity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Artifact",
    }
  );
  return Artifact;
};
