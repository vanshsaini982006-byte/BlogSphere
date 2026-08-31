import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Admin: list all users
// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// @desc    Admin: list all posts (any status)
// @route   GET /api/admin/posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "name username avatar").sort({ createdAt: -1 });
  res.json({ success: true, posts });
});

// @desc    Admin: list all comments
// @route   GET /api/admin/comments
export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find()
    .populate("author", "name username avatar")
    .populate("post", "title slug")
    .sort({ createdAt: -1 });
  res.json({ success: true, comments });
});

// @desc    Admin: delete any post
// @route   DELETE /api/admin/posts/:id
export const adminDeletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: "Post not found" });
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ success: true, message: "Post removed by admin" });
});

// @desc    Admin: delete any comment
// @route   DELETE /api/admin/comments/:id
export const adminDeleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
  await comment.deleteOne();
  res.json({ success: true, message: "Comment removed by admin" });
});

// @desc    Admin: platform-wide stats
// @route   GET /api/admin/stats
export const getAdminStats = asyncHandler(async (req, res) => {
  const [userCount, postCount, commentCount, publishedCount] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Comment.countDocuments(),
    Post.countDocuments({ status: "published" }),
  ]);
  res.json({ success: true, stats: { userCount, postCount, commentCount, publishedCount } });
});
