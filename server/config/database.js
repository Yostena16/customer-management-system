

const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a Sequelize instance using values from the .env file
const sequelize = new Sequelize(
  process.env.DB_NAME,      // database name: crm_db
  process.env.DB_USER,      // user: root
  process.env.DB_PASSWORD,  // password: (empty for XAMPP)
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",       // tells Sequelize we're using MySQL
    logging: false,         // set to true if you want to see the SQL in the console
  }
);

module.exports = sequelize;