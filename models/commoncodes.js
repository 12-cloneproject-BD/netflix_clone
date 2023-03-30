"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommonCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    // }
  }
  CommonCodes.init(
    {
      codeId: {
        allowNull: false, // NOT NULL
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      codeUseTable: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      codeUseColum: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      codeValue: {
        allowNull: false, // NOT NULL
        unique: true,
        type: DataTypes.STRING(8),
      },
      codeName: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
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
      modelName: "CommonCodes",
    }
  );
  return CommonCodes;
};
