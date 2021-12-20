const Message = require("../models/message");
const logger = require("../utils/logger");
const _ = require("lodash");

const tag = "message.js";

module.exports = {
  add: async (payload) => {
    const newMessage = new Message(payload);

    try {
      const savedMessage = await newMessage.save();
      return { success: true, data: savedMessage };
    } catch (err) {
      return { success: false, data: err };
    }
  },
  get: async (params) => {
    try {
      const messages = await Message.find({
        conversationId: params.conversationId,
      });
      return { success: true, data: messages };
    } catch (err) {
      return { success: false, data: err };
    }
  },
};
