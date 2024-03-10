const sequelize = require("./index");
const { DataTypes } = require("sequelize");

const tableConfig = {
  tableName: "anime_schedule",
  timestamps: false,
};

const AnimeSchedule = sequelize.define(
  "AnimeSchedule",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    bgmId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "bgm_id",
    },
    quarterCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "quarter_code",
    },
  },
  tableConfig
);

module.exports = AnimeSchedule;
