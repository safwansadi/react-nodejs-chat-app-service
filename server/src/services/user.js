//const db = require("../models");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
const _ = require("lodash");

const tag = "user.js";

module.exports = {
  signUp: async (payload) => {
    try {
      const hash = await bcrypt.hash(payload.password, 10);
      payload.password = hash;
      const result = await User.create(payload);
      return { success: true, data: result };
    } catch (error) {
      logger.error(tag + ": add", error);

      return { success: false, data: error };
    }
  },
  login: async (payload) => {
    try {
      const document = await User.findOne({ email: payload.email });
      if (document) {
        const hash = String(document.password);
        const result = await bcrypt.compare(payload.password, hash);
        if (result) {
          return { success: true, data: result };
        } else {
          return { success: false, data: "Password is incorrect" };
        }
      } else {
        return { success: false, data: "Email doesn't exist" };
      }
    } catch (error) {
      return { success: false, data: error };
    }
  },
  //update user
  update: async (payload, params) => {
    if (payload.userId === params.id || payload.isAdmin) {
      if (payload.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          payload.password = await bcrypt.hash(payload.password, salt);
        } catch (err) {
          return { success: false, data: err };
        }
      }
      try {
        const user = await User.findByIdAndUpdate(params.id, {
          $set: payload,
        });
        return { success: true, data: "Account has been updated" };
      } catch (err) {
        return { success: false, data: err };
      }
    } else {
      return { success: false, data: "You can update only your account" };
    }
  },

  getAll: async () => {
    try {
      const result = await User.find({}).sort({ createdAt: -1 });

      return { success: true, data: result };
    } catch (error) {
      logger.error(tag + ": getAll", error);

      return { success: false, data: error };
    }
  },
  //delete all users
  deleteAll: async () => {
    try {
      const result = await User.deleteMany({});
      return { success: true, data: result };
    } catch (error) {
      logger.error(tag + ": deleteAll", error);

      return { success: false, data: error };
    }
  },
  delete: async (payload, params) => {
    if (payload.userId === params.id || payload.isAdmin) {
      try {
        await User.findByIdAndDelete(params.id);
        return { success: true, data: "Account has been deleted" };
      } catch (err) {
        return { success: false, data: err };
      }
    } else {
      return { success: false, data: "You can delete only your account!" };
    }
  },
  //get a user
  getById: async (payload) => {
    const userId = payload.userId;
    const username = payload.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      return { success: true, data: other };
    } catch (err) {
      return { success: false, data: err };
    }
  },
  // get friends
  getFriends: async (payload, params) => {
    try {
      const user = await User.findById(params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      return { success: true, data: friendList };
    } catch (err) {
      return { success: false, data: err };
    }
  },
  follow: async (payload, params) => {
    if (payload.userId !== params.id) {
      try {
        const user = await User.findById(params.id);
        const currentUser = await User.findById(payload.userId);
        if (!user.followers.includes(payload.userId)) {
          await user.updateOne({ $push: { followers: payload.userId } });
          await currentUser.updateOne({ $push: { followings: params.id } });
          return { success: true, data: "user has been followed" };
        } else {
          return { success: false, data: "you allready follow this user" };
        }
      } catch (err) {
        return { success: false, data: err };
      }
    } else {
      return { success: false, data: "you cant follow yourself" };
    }
  },
  unfollow: async (payload, params) => {
    if (payload.userId !== params.id) {
      try {
        const user = await User.findById(params.id);
        const currentUser = await User.findById(payload.userId);
        if (user.followers.includes(payload.userId)) {
          await user.updateOne({ $pull: { followers: payload.userId } });
          await currentUser.updateOne({ $pull: { followings: params.id } });
          return { success: true, data: "user has been unfollowed" };
        } else {
          return { success: false, data: "you dont follow this user" };
        }
      } catch (err) {
        return { success: false, data: err };
      }
    } else {
      return { success: false, data: "you cant unfollow yourself" };
    }
  },
};
