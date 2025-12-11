"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Weapon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Weapon.hasMany(models.FavoriteCharacter, { foreignKey: "weaponId" });
    }
  }
  Weapon.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      rarity: DataTypes.INTEGER,
      baseAttack: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Weapon",
    }
  );
  return Weapon;
};
