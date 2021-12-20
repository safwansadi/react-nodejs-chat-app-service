"use strict";

const service = require("../../services/user");
const { success, error } = require("../../utils/response");

module.exports = {
  deleteAll: async (request, h) => {
    const result = await service.deleteAll();

    if (!result.success) return error(result.data);

    return success(result.data, "Success");
  },
  getAll: async (request, h) => {
    const result = await service.getAll();

    if (!result.success) return error(result.data);

    return success(result.data, "Success");
  },
  signup: async (request, h) => {
    const { payload } = request;

    const result = await service.signUp(payload);

    if (!result.success) return error(result.data);

    return success(result.data, "user added");
  },
  signin: async (request, h) => {
    const { payload } = request;

    const result = await service.login(payload);

    if (!result.success) return error(result.data);

    return success(result.data, "user signed in");
  },
  shuffle: async (request, h) => {
    const { params } = request;
    const { token } = params;

    const result = await service.shuffle(token);

    if (!result.success) return error(result.data);

    return success(result.data, "Success");
  },
  getByToken: async (request, h) => {
    const { params } = request;
    const { token } = params;

    const result = await service.userInfo(token);

    if (!result.success) return error(result.data);

    return success(result.data, "Success");
  },
};
