import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Clock, Calendar, Tag, Pencil, Trash2, MessageCircle, ArrowLeft } from "lucide-react";
import { getPost, deletePost } from "../services/postService";
import { getComments, addComment, updateComment, deleteComment } from "../services/commentService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import CommentCard from "../components/CommentCard";
import BlogCard from "../components/BlogCard";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import { PostDetailSkeleton } from "../components/Skeletons";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const PostDetail = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [postData, commentsData] = await Promise.all([getPost(slug), getComments(slug)]);
      setPost(postData.post);
      setRelated(postData.relatedPosts || []);
      setComments(commentsData.comments || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Post not found", "error");
      navigate("/explore");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const data = await addComment(post._id, commentText.trim());
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
      showToast("Comment posted");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not post comment", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (id, content) => {
    try {
      const data = await updateComment(id, content);
      setComments((prev) => prev.map((c) => (c._id === id ? data.comment : c)));
      showToast("Comment updated");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not update comment", "error");
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      showToast("Comment deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not delete comment", "error");
    }
  };

  const handleDeletePost = async () => {
    setDeleting(true);
    try {
      await deletePost(post._id);
      showToast("Post deleted");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not delete post", "error");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <PostDetailSkeleton />;
  if (!post) return null;

  const isOwner = user && post.author?._id === user._id;

  return (
    <article className="animate-fadeUp">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-spine-600 dark:text-ink-light/50 dark:hover:text-spine-300 mb-6">
          <ArrowLeft size={14} /> Back to Explore
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-spine-500/10 text-spine-700 dark:text-spine-300">
            {post.category}
          </span>
          {post.status === "draft" && (
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600">Draft</span>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-semibold leading-tight mb-6">{post.title}</h1>

        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-ink/8 dark:border-white/8">
          <div className="flex items-center gap-3">
            <img src={post.author?.avatar} alt={post.author?.name} className="w-11 h-11 rounded-full object-cover" />
            <div>
              <Link to={`/profile/${post.author?._id}`} className="text-sm font-semibold hover:text-spine-600 dark:hover:text-spine-300">
                {post.author?.name}
              </Link>
              <div className="flex items-center gap-3 text-xs text-ink/45 dark:text-ink-light/45 font-mono mt-0.5">
                <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(post.createdAt)}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTime} min read</span>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigate(`/edit-post/${post._id}`)}>
                <Pencil size={13} /> Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => setConfirmOpen(true)}>
                <Trash2 size={13} /> Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <img src={post.featuredImage} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-2xl shadow-card" />
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-10 prose-article">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} className="text-[17px] leading-[1.85] text-ink/85 dark:text-ink-light/85 mb-6">
            {para}
          </p>
        ))}

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-ink/8 dark:border-white/8">
            <Tag size={14} className="text-ink/40 dark:text-ink-light/40" />
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/explore?search=${encodeURIComponent(tag)}`}
                className="text-xs font-mono px-2.5 py-1 rounded-full bg-ink/5 dark:bg-white/5 text-ink/60 dark:text-ink-light/60 hover:bg-spine-500/10 hover:text-spine-600 dark:hover:text-spine-300"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="max-w-3xl mx-auto px-4 mt-14">
        <h3 className="font-display text-2xl font-semibold flex items-center gap-2 mb-6">
          <MessageCircle size={20} className="text-spine-600 dark:text-spine-300" /> {comments.length} Comment{comments.length !== 1 ? "s" : ""}
        </h3>

        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full rounded-xl border border-ink/15 dark:border-white/15 bg-white dark:bg-paper-darksoft px-4 py-3 text-sm focus:border-spine-500 focus:ring-1 focus:ring-spine-500 outline-none"
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" type="submit" loading={submitting} disabled={!commentText.trim()}>
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 rounded-xl bg-ink/5 dark:bg-white/5 text-sm text-center">
            <Link to="/login" className="text-spine-600 dark:text-spine-300 font-medium">Login</Link> to join the discussion
          </div>
        )}

        <div>
          {comments.map((c) => (
            <CommentCard key={c._id} comment={c} onUpdate={handleUpdateComment} onDelete={handleDeleteComment} />
          ))}
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-20 mb-10">
          <h3 className="font-display text-2xl font-semibold mb-6">Related Posts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <BlogCard key={p._id} post={p} />
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeletePost}
        loading={deleting}
        title="Delete this post?"
        description="This action cannot be undone. The post and all its comments will be permanently removed."
      />
    </article>
  );
};

export default PostDetail;
