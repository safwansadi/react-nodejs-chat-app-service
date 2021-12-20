const conversation = require("../models/conversation");
const logger = require("../utils/logger");
const _ = require("lodash");

const tag = "chat.js";

module.exports = {
  fetchConvo: async (payload) => {
    const newConversation = new conversation({
      members: [payload.senderId, payload.receiverId],
    });

    try {
      const savedConversation = await newConversation.save();
      return { success: true, data: savedConversation };
    } catch (err) {
      return { success: false, data: err };
    }
  },
  //get convo of a user
  getConvoById: async (params) => {
    try {
      const convo = await conversation.find({
        members: { $in: [params.userId] },
      });
      return { success: true, data: convo };
    } catch (err) {
      return { success: false, data: err };
    }
  },
  //get convo includes two userId
  getConvoOfTwoUsers: async (params) => {
    try {
      const convo = await conversation.findOne({
        members: { $all: [params.firstUserId, params.secondUserId] },
      });
      return { success: true, data: convo };
    } catch (err) {
      return { success: false, data: err };
    }
  },
};
