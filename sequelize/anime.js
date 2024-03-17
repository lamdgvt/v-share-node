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
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "tmdb_id",
    },
    backdropPath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "backdrop_path",
    },
    posterPath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "poster_path",
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mediaType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "media_type",
    },
    voteAverage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: "vote_average",
    },
  },
  tableConfig
);

module.exports = Anime;
