const joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const Relish = require("relish")({
  messages: {},
});
const { options } = require("../../utils/validation");

const payload = {
  username: joi.string().min(4).max(15).required().trim(),
  password: joi.string().min(6).required().trim(),
  email: joi.string().email().required().lowercase().trim(),
};

const failAction = Relish.failAction;

module.exports = {
  add: {
    payload: joi.object().keys(payload),
    //options,
    failAction,
  },

  edit: {
    payload: joi.object().keys(payload),
    //options,
    failAction,
  },
};
