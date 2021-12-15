"use strict";

require("dotenv").config();

module.exports = {
  ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  // JWT secret key
  SECRET_KEY: process.env.SECRET_KEY,
  // Database
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_AUTH_SOURCE: process.env.DB_AUTH_SOURCE,
  DB_NAME: process.env.DB_NAME,
  // API base URL
  API_BASE_URL: process.env.API_BASE_URL,
  //SOCKET
  SOCKET_PORT: process.env.SOCKET_PORT,
};
