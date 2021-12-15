const handlers = require("./handlers");
const validators = require("./validators");

module.exports = [
  {
    method: "POST",
    path: "/signup",
    handler: handlers.signup,
    options: {
      auth: false,
      validate: {},
    },
  },
  {
    method: "POST",
    path: "/signin",
    handler: handlers.signin,
    options: {
      auth: false,
      validate: {},
    },
  },
  {
    method: "GET",
    path: "/userinfo",
    handler: handlers.getByToken,
    options: {
      auth: false,
      validate: {},
    },
  },
];
