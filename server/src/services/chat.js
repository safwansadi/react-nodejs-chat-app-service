const Message = require("../models/message");

const logger = require("../utils/logger");
const _ = require("lodash");

const tag = "chat.js";

module.exports = {
  fetchMessages: async (payload) => {
    let senderID = payload.sender;
    let receiverID = payload.receiver;

    Message.find(
      { _id: senderID },
      {
        users: {
          $elemMatch: { _id: receiverID },
        },
      }
    )
      .then((document) => {
        if (document.length > 0) {
          if (document[0].users.length > 0) {
            var messages = document[0].users[0].messages;
            return {
              success: true,
              data: messages.slice(Math.max(messages.length - 15, 0)),
            };
          } else {
            return { success: false, data: [] };
          }
        } else {
          return { success: false, data: [] };
        }
      })
      .catch((err) => {
        return { success: false, data: err };
      });
  },
};
