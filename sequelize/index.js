const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('v_share', 'root', 'yunTest123?', {
    host: '106.53.116.123',
    dialect: 'mysql',
    dialectModule: mysql,
})

module.exports = sequelize
