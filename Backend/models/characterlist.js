"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CharacterList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CharacterList.belongsTo(models.MyTeam, { foreignKey: "myTeamId" });
      CharacterList.belongsTo(models.Character, {
        foreignKey: "characterId",
      });
    }
  }
  CharacterList.init(
    {
      name: DataTypes.STRING,
      myTeamId: DataTypes.INTEGER,
      characterId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CharacterList",
    }
  );
  return CharacterList;
};
