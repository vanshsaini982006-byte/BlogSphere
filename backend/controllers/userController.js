import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get user profile with stats
// @route   GET /api/users/:id
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const [postCount, commentCount, posts] = await Promise.all([
    Post.countDocuments({ author: user._id, status: "published" }),
    Comment.countDocuments({ author: user._id }),
    Post.find({ author: user._id, status: "published" }).sort({ createdAt: -1 }).limit(20),
  ]);

  res.json({
    success: true,
    user: user.toSafeObject(),
    stats: { postCount, commentCount },
    posts,
  });
});

// @desc    Update own profile
// @route   PUT /api/users/:id
export const updateUserProfile = asyncHandler(async (req, res) => {
  if (req.params.id !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "You can only edit your own profile" });
  }

  const { name, bio, avatar } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();
  res.json({ success: true, message: "Profile updated", user: user.toSafeObject() });
});

// @desc    Dashboard stats for logged-in user
// @route   GET /api/users/me/dashboard
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalPosts, publishedPosts, drafts, totalComments, myPosts, recentComments, viewsAgg] = await Promise.all([
    Post.countDocuments({ author: userId }),
    Post.countDocuments({ author: userId, status: "published" }),
    Post.countDocuments({ author: userId, status: "draft" }),
    Comment.countDocuments({ author: userId }),
    Post.find({ author: userId }).sort({ createdAt: -1 }),
    Comment.find({ author: userId }).sort({ createdAt: -1 }).limit(10).populate("post", "title slug"),
    Post.aggregate([{ $match: { author: userId } }, { $group: { _id: null, totalViews: { $sum: "$views" } } }]),
  ]);

  res.json({
    success: true,
    stats: {
      totalPosts,
      publishedPosts,
      drafts,
      totalComments,
      totalViews: viewsAgg[0]?.totalViews || 0,
    },
    myPosts,
    recentComments,
  });
});
