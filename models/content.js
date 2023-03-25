"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.ViewHistory, {
        sourceKey: "contentIdx",
        foreignKey: "contentIdx",
      });
      this.hasMany(models.Like, {
        sourceKey: "contentIdx",
        foreignKey: "contentIdx",
      });
      this.hasMany(models.Category, {
        sourceKey: "contentIdx",
        foreignKey: "contentIdx",
      });
      this.hasMany(models.Participant, {
        sourceKey: "contentIdx",
        foreignKey: "contentIdx",
      });
      this.hasMany(models.Save, {
        sourceKey: "contentIdx",
        foreignKey: "contentIdx",
      });
      this.hasMany(models.Alarm, {
        sourceKey: "contentIdx",
        foreignKey: "contentIdx",
      });
      this.hasMany(models.ViewRank, {
        sourceKey: "contentIdx",
        foreignKey: "contentIdx",
      });
      this.hasMany(models.LikeRank, {
        sourceKey: "contentIdx",
        foreignKey: "contentIdx",
      });
    }
  }
  Content.init(
    {
      contentIdx: {
        allowNull: false, // NOT NULL
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      desc: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      class: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING(8),
      },
      viewLimit: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING(8),
      },
      playTime: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      videoUrl: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      videoThumUrl: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING(8),
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
      modelName: "Content",
    }
  );
  return Content;
};
