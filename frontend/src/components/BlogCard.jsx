import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

const categoryColors = {
  Technology: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  Programming: "bg-purple-500/10 text-purple-600 dark:text-purple-300",
  AI: "bg-spine-500/10 text-spine-600 dark:text-spine-300",
  "Web Development": "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  Education: "bg-pink-500/10 text-pink-600 dark:text-pink-300",
  Career: "bg-orange-500/10 text-orange-600 dark:text-orange-300",
  Lifestyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const BlogCard = ({ post, featured = false }) => {
  if (!post) return null;

  return (
    <Link
      to={`/post/${post.slug}`}
      className={`group block overflow-hidden rounded-2xl bg-white dark:bg-paper-darksoft border border-ink/10 dark:border-white/10 shadow-card hover:shadow-cardHover transition-all duration-300 hover:-translate-y-1 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-soft dark:bg-paper-dark">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink/30 dark:text-ink-light/30">
            No image
          </div>
        )}

        <div className="absolute left-4 top-4">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-full backdrop-blur-md ${
              categoryColors[post.category] || "bg-white/80 text-ink"
            }`}
          >
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-mono text-ink/45 dark:text-ink-light/45">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readingTime || 1} min read
          </span>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <h3
          className={`font-display font-semibold text-ink dark:text-ink-light leading-snug mb-2 group-hover:text-spine-600 dark:group-hover:text-spine-300 transition-colors ${
            featured ? "text-2xl" : "text-xl"
          }`}
        >
          {post.title}
        </h3>

        <p
          className={`text-ink/60 dark:text-ink-light/60 text-sm leading-relaxed ${
            featured ? "line-clamp-3" : "line-clamp-2"
          }`}
        >
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-ink/8 dark:border-white/8">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author?.name || "Author"}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-spine-100 dark:bg-spine-900 flex items-center justify-center text-xs font-semibold text-spine-700 dark:text-spine-200">
              {(post.author?.name || "A").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="leading-tight min-w-0">
            <p className="text-xs font-semibold text-ink dark:text-ink-light truncate">
              {post.author?.name || "BlogSphere author"}
            </p>
            <p className="text-[11px] text-ink/45 dark:text-ink-light/45 font-mono">
              {post.author?.username ? `@${post.author.username}` : "Writer"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
