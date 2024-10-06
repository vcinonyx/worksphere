require('dotenv').config()

module.exports = {
    HOST: process.env.HOST,
    USER: process.env.DB_USER,
    DB: process.env.DB,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    PASSWORD: process.env.DB_PASSWORD,
  };