const logger = require("../utils/logger");
const { SOCKET_PORT } = require("../utils/env");
const Message = require("../models/message");
const user = require("../models/user");
const http = require("http");
const { Server } = require("socket.io");

var connectedUsers = [];
exports.connectSocket = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  console.log("lol");
  io.on("connection", (socket) => {
    console.log("connection init");
    socket.on("chatID", (data) => {
      let chatID = data.id;

      socket.join(chatID);
      connectedUsers.push(chatID);

      socket.broadcast.emit("onlineUsers", {
        users: connectedUsers,
      });

      socket.on("disconnect", () => {
        //Remove ConnectedUsers
        let index = connectedUsers.indexOf(chatID);
        if (index > -1) {
          connectedUsers.splice(index, 1);
        }
        // Leave From Room
        socket.leave(chatID);
        socket.broadcast.emit("onlineUsers", {
          users: connectedUsers,
        });
      });

      socket.on("send_message", (message) => {
        receiverChatID = message.receiverChatID;
        senderChatID = message.senderChatID;
        content = message.content;
        isImage = message.isImage;

        saveMessage(content, senderChatID, receiverChatID, true, isImage);

        socket.in(receiverChatID).emit("receive_message", {
          content: content,
          senderChatID: senderChatID,
          receiverChatID: receiverChatID,
          isImage: isImage,
        });
        saveMessage(content, receiverChatID, senderChatID, false, isImage);
      });
    });
  });

  function saveMessage(content, sender, receiver, isMy, isImage = false) {
    var message = new Message({
      _id: sender,
      users: [
        {
          _id: receiver,
          messages: {
            ismy: isMy,
            message: content,
            isImage: isImage,
          },
        },
      ],
    });

    Message.findOne({ _id: sender }, (err, doc) => {
      if (!doc) {
        message.save();
      } else {
        var receiverIndex = doc.users.findIndex(
          (element) => element._id === receiver
        );

        if (receiverIndex !== undefined && receiverIndex != -1) {
          doc.users[receiverIndex].messages.push({
            ismy: isMy,
            message: content,
            isImage: isImage,
          });
          doc.save();
        } else {
          doc.users.push({
            _id: receiver,
            messages: { ismy: isMy, message: content, isImage: isImage },
          });
          doc.save();
        }
      }
    }).catch((err) => {
      console.log(err.message);
    });
  }

  server.listen(SOCKET_PORT, () => {
    console.log("SERVER RUNNING");
  });
};



