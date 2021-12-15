const mongoose = require("mongoose");
const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_AUTH_SOURCE,
  DB_NAME,
} = require("../utils/env");

const connectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}`;
const options = {
  user: DB_USERNAME,
  pass: DB_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(connectionString, options);

module.exports = mongoose;
