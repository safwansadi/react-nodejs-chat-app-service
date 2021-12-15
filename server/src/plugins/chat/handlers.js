"use strict";

const service = require("../../services/banner");
const { success, error } = require("../../utils/response");

module.exports = {
  signup: async (request, h) => {
    const { payload } = request;

    const result = await service.add(payload);

    if (!result.success) return error(result.data);

    return success(result.data, "user added");
  },
  signin: async (request, h) => {
    const { payload } = request;

    const result = await service.add(payload);

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

    const result = await service.userinfo(token);

    if (!result.success) return error(result.data);

    return success(result.data, "Success");
  },
};
