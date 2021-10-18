import { Sequelize } from "sequelize";

const dbUser: string = process.env.DB_USERNAME!
const dbName: string = process.env.DB_NAME!
const dbPass: string = process.env.DB_PASSWORD!

const sequelize = new Sequelize(
  dbName, dbUser, dbPass, {
    host: 'localhost',
    dialect: 'postgres'
  }
)

export default sequelize