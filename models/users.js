"use strict";
const { Model } = require("sequelize");

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Profile, {
        sourceKey: "userIdx",
        foreignKey: "userIdx",
      });
    }
  }
  Users.init(
    {
      userIdx: {
        allowNull: false, // NOT NULL
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false, // NOT NULL
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false, // NOT NULL
        type: DataTypes.UUID,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
