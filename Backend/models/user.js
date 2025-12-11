"use strict";
const { all } = require("axios");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.MyTeam, { foreignKey: "userId" });
      User.hasMany(models.FavoriteCharacter, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Username is required" },
          notEmpty: { msg: "Username is required" },
        },
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Must be a valid email",
          },
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
