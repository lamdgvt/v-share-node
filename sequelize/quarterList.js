const sequelize = require("./index");

const { DataTypes } = require("sequelize");

/**
 * 季度模型
 * @typedef {Object} quarter_list 季度表
 * @property {number} id - id, 主键, 自动增长
 * @property {string} code - 季度代码
 * @property {string} name - [冬, 春, 夏, 秋]
 */

const tableConfig = {
  tableName: "quarter_list",
  timestamps: false,
};

const QuarterList = sequelize.define(
  "QuarterList",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  tableConfig
);

module.exports = QuarterList;
