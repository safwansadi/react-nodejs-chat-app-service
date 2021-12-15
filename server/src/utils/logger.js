"use strict";

const winston = require("../config/winston");
const { ENV } = require("./env");
const { DEV, STAGING } = require("./constants");

module.exports = {
  info: (tag, data) => {
    winston.info("", { tag, data });
  },

  debug: (tag, data) => {
    if (ENV === DEV || ENV === STAGING) winston.debug("", { tag, data });
  },

  error: (tag, error) => {
    if (error instanceof Error)
      winston.error(error.message, { tag, data: { ...error } });
    else winston.error("", { tag, data: error });
  },
};
