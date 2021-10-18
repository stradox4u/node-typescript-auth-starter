"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbUser = process.env.DB_USERNAME;
const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASSWORD;
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPass, {
    host: 'localhost',
    dialect: 'postgres'
});
exports.default = sequelize;
