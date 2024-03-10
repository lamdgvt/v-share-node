const sequelize = require("./index");
const { DataTypes } = require("sequelize");

const tableConfig = {
  tableName: "anime",
  timestamps: false,
};

const Anime = sequelize.define(
  "Anime",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    bgmId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "bgm_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    season: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updateWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "update_week",
    },
  },
  tableConfig
);

module.exports = Anime;
