"use strict";

const logger = require("../utils/logger");

module.exports = new Promise((resolve, reject) => {
  const mongoose = require("../config/mongoose");

  const connection = mongoose.connection;

  connection.on("error", function (error) {
    logger.error("connect-db.js", error);

    reject(error);
  });

  connection.once("open", function () {
    logger.info("connect-db.js", {
      message: "Database connection established!",
    });

    resolve(true);
  });
});
