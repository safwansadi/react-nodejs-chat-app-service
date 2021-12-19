//const db = require("../models");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const md5 = require("md5");

const logger = require("../utils/logger");
const _ = require("lodash");

const tag = "user.js";

function createMD5(data) {
  const dateSecond = new Date().getTime();
  const token = md5(dateSecond + data);
  return token;
}
module.exports = {
  signUp: async (payload) => {
    console.log("YO")
    try {
      const hash = await bcrypt.hash(payload.password, 10);
      payload.password = hash;
      const result=await User.create(payload);
      return { success: true, data: result };
    } catch (error) {
      logger.error(tag + ": add", error);

      return { success: false, data: error };
    }
  },
  login: async (payload) => {
    User.findOne({ email: payload.email }).then((document) => {
      if (document) {
        const hash = String(document.password);
        bcrypt.compare(req.body.password, hash).then((result) => {
          if (result) {
            var token = createMD5(hash);
            User.updateOne(
              { email: req.body.email },
              { token: token },
              (error, raw) => console.log(raw)
            );
            return { success: true, data: { result: result, token: token } };
          } else {
            return { success: false, data: result };
          }
        });
      } else {
        return { success: false, data: "User don't exists" };
      }
    });
  },
  getAll: async () => {
    try {
      const result = await User.find({}).sort({ createdAt: -1 });

      return { success: true, data: result };
    } catch (error) {
      logger.error(tag + ': getAll', error);

      return { success: false, data: error };
    }
  },
  deleteAll: async ()=> {
    try{
    const result=await User.deleteMany({});
    return { success: true, data: result };
  } catch (error) {
    logger.error(tag + ': deleteAll', error);

    return { success: false, data: error };
  }
  },
  shuffle: async (token) => {
    User.aggregate(
      [
        { $sample: { size: 10 } },
        {
          $match: {
            token: {
              $nin: [token],
            },
          },
        },
      ],
      function (err, docs) {
        if(err) {
          return { success: false, data: "User not found" };
        }
        docs.forEach((e) => {
          delete e.password;
          delete e.token;
          delete e.__v;
        });
        return { success: true, data: docs };
      }
    );
  },

  userInfo: async (token) => {
    User.findOne({ token: token }, (err, document) => {
      if(err) {
        return { success: false, data: "User not found" };
      }
      return { success: true, data: document };
    });
  },
};
