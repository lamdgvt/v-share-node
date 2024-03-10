const sequelize = require("../index");

const { DataTypes } = require("sequelize");

/**
 * 用户模型
 * @typedef {Object} User 用户表
 * @property {number} userId - ID, 主键, 自动增长
 * @property {string} userName - 用户名称
 * @property {string} password - 用户密码
 * @property {string} email - 邮箱
 * @property {string} created_timer - 创建时间
 * @property {string} last_login_timer - 最后登陆时间
 */

const tableConfig = {
  tableName: "users",
  timestamps: false,
  comment: "用户表信息",
};

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "user_id",
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "user_name",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdTimer: {
      onUpdate: DataTypes.NOW,
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: "created_timer",
    },
    lastLoginTimer: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      onUpdate: DataTypes.NOW,
      field: "last_login_timer",
    },
  },
  tableConfig
);

module.exports = User;
