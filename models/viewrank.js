"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ViewRank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Content, {
        targetKey: "contentIdx", // Users 모델의 userId 컬럼을
        foreignKey: "contentIdx", // 현재 모델의 userId가 외래키로 가진다.
        onDelete: "CASCADE",
      });
      this.belongsTo(models.Profile, {
        targetKey: "profileIdx", // Users 모델의 userId 컬럼을
        foreignKey: "profileIdx", // 현재 모델의 userId가 외래키로 가진다.
        onDelete: "CASCADE",
      });
    }
  }
  ViewRank.init(
    {
      viewRankIdx: {
        allowNull: false, // NOT NULL
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      profileIdx: {
        allowNull: false, // NOT NULL
        type: DataTypes.UUID,
      },
      contentIdx: {
        allowNull: false, // NOT NULL
        type: DataTypes.UUID,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ViewRank",
    }
  );
  return ViewRank;
};
