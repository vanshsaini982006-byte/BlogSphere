import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", "name username avatar")
    .sort({ createdAt: -1 });
  res.json({ success: true, comments });
});

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comments
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: "Comment cannot be empty" });
  }

  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ success: false, message: "Post not found" });

  const comment = await Comment.create({ post: post._id, author: req.user._id, content: content.trim() });
  await comment.populate("author", "name username avatar");

  res.status(201).json({ success: true, message: "Comment added", comment });
});

// @desc    Update own comment
// @route   PUT /api/comments/:id
export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "You can only edit your own comments" });
  }

  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: "Comment cannot be empty" });
  }

  comment.content = content.trim();
  await comment.save();
  await comment.populate("author", "name username avatar");

  res.json({ success: true, message: "Comment updated", comment });
});

// @desc    Delete own comment (or admin)
// @route   DELETE /api/comments/:id
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

  if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "You can only delete your own comments" });
  }

  await comment.deleteOne();
  res.json({ success: true, message: "Comment deleted" });
});
