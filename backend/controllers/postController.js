import { validationResult } from "express-validator";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all posts (search, filter, sort, paginate)
// @route   GET /api/posts
export const getPosts = asyncHandler(async (req, res) => {
  const { search, category, tag, sort = "newest", page = 1, limit = 9, status = "published", author } = req.query;

  const query = {};

  // Only show drafts to their own author; everyone else sees only published
  if (author) {
    query.author = author;
    if (!req.user || req.user._id.toString() !== author) query.status = "published";
    else if (status !== "all") query.status = status;
  } else {
    query.status = "published";
  }

  if (search) query.$text = { $search: search };
  if (category && category !== "all") query.category = category;
  if (tag) query.tags = tag;

  let sortOption = { createdAt: -1 };
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "popular") sortOption = { views: -1 };

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const [posts, total] = await Promise.all([
    Post.find(query).populate("author", "name username avatar").sort(sortOption).skip(skip).limit(limitNum),
    Post.countDocuments(query),
  ]);

  res.json({
    success: true,
    posts,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      hasMore: skip + posts.length < total,
    },
  });
});

// @desc    Get featured posts (most viewed published posts)
// @route   GET /api/posts/featured
export const getFeaturedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: "published" })
    .populate("author", "name username avatar")
    .sort({ views: -1, createdAt: -1 })
    .limit(6);
  res.json({ success: true, posts });
});

// @desc    Get single post by id or slug, increments views
// @route   GET /api/posts/:id
export const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

  const post = await Post.findOne(query).populate("author", "name username avatar bio");
  if (!post) return res.status(404).json({ success: false, message: "Post not found" });

  if (post.status === "draft" && (!req.user || req.user._id.toString() !== post.author._id.toString())) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  post.views += 1;
  await post.save();

  const relatedPosts = await Post.find({
    _id: { $ne: post._id },
    status: "published",
    $or: [{ category: post.category }, { tags: { $in: post.tags } }],
  })
    .populate("author", "name username avatar")
    .limit(3);

  res.json({ success: true, post, relatedPosts });
});

// @desc    Create post
// @route   POST /api/posts
export const createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  const { title, excerpt, content, featuredImage, category, tags, status } = req.body;

  const post = await Post.create({
    title,
    excerpt,
    content,
    featuredImage,
    category,
    tags: Array.isArray(tags) ? tags : (tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    status: status === "draft" ? "draft" : "published",
    author: req.user._id,
  });

  await post.populate("author", "name username avatar");
  res.status(201).json({ success: true, message: "Post created", post });
});

// @desc    Update own post
// @route   PUT /api/posts/:id
export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: "Post not found" });

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "You can only edit your own posts" });
  }

  const { title, excerpt, content, featuredImage, category, tags, status } = req.body;

  if (title !== undefined) post.title = title;
  if (excerpt !== undefined) post.excerpt = excerpt;
  if (content !== undefined) post.content = content;
  if (featuredImage !== undefined) post.featuredImage = featuredImage;
  if (category !== undefined) post.category = category;
  if (tags !== undefined) post.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean);
  if (status !== undefined) post.status = status;

  await post.save();
  await post.populate("author", "name username avatar");
  res.json({ success: true, message: "Post updated", post });
});

// @desc    Delete own post
// @route   DELETE /api/posts/:id
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: "Post not found" });

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "You can only delete your own posts" });
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  res.json({ success: true, message: "Post deleted" });
});
