const User = require("../models/user");
const Post = require("../models/post");
const logger = require("../utils/logger");
const _ = require("lodash");

const tag = "posts.js";

module.exports = {
  //create a post
  create: async (payload) => {
    try {
      const result = await Post.create(payload);
      return { success: true, data: result };
    } catch (error) {
      logger.error(tag + ": add", error);

      return { success: false, data: error };
    }
  },
  // update a post
  update: async (payload, params) => {
    try {
      const post = await Post.findById(params.id);
      if (post.userId === payload.userId) {
        await post.updateOne({ $set: payload });
        return { success: true, data: "the post has been updated" };
      } else {
        return { success: false, data: "you can update only your post" };
      }
    } catch (err) {
      return { success: false, data: err };
    }
  },
  //delete a post
  delete: async (payload, params) => {
    try {
      const post = await Post.findById(params.id);
      if (post.userId === payload.userId) {
        await post.deleteOne();
        return { success: true, data: "the post has been deleted" };
      } else {
        return { success: false, data: "you can delete only your post" };
      }
    } catch (err) {
      return { success: false, data: err };
    }
  },
  //like / dislike a post
  giveLikeUnlike: async (payload, params) => {
    try {
      const post = await Post.findById(params.id);
      if (!post.likes.includes(payload.userId)) {
        await post.updateOne({ $push: { likes: payload.userId } });
        return { success: true, data: "The post has been liked" };
      } else {
        await post.updateOne({ $pull: { likes: payload.userId } });
        return { success: true, data: "The post has been disliked" };
      }
    } catch (err) {
      return { success: false, data: err };
    }
  },
  // get a post
  getPost: async (params) => {
    try {
      const post = await Post.findById(params.id);
      return { success: true, data: post };
    } catch (err) {
      return { success: false, data: err };
    }
  },
  // get timelines posts
  getTimeLinePosts: async (params) => {
    try {
      const currentUser = await User.findById(params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      return { success: true, data: userPosts.concat(...friendPosts) };
    } catch (err) {
      return { success: false, data: err };
    }
  },
  // get user's all post
  getAllPosts: async (params) => {
    try {
      const user = await User.findOne({ username: params.username });
      const posts = await Post.find({ userId: user._id });
      return { success: true, data: posts };
    } catch (err) {
      return { success: false, data: err };
    }
  },
};
