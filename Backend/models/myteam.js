"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MyTeam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MyTeam.belongsTo(models.User, { foreignKey: "userId" });
      MyTeam.hasMany(models.CharacterList, { foreignKey: "myTeamId" });
      MyTeam.belongsToMany(models.Character, {
        through: models.CharacterList,
        foreignKey: "myTeamId",
      });
    }
  }
  MyTeam.init(
    {
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MyTeam",
    }
  );
  return MyTeam;
};
