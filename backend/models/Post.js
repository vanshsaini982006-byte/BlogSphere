import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 150 },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, required: [true, "Excerpt is required"], maxlength: 300 },
    content: { type: String, required: [true, "Content is required"] },
    featuredImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
    },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Programming", "AI", "Web Development", "Education", "Career", "Lifestyle"],
    },
    tags: [{ type: String, trim: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", content: "text", tags: "text", category: "text" });

postSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now().toString(36);
  }
  next();
});

postSchema.virtual("readingTime").get(function () {
  const words = this.content ? this.content.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

export default mongoose.model("Post", postSchema);
