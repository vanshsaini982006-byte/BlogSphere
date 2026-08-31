import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Eye, MessageSquare, FileEdit, PenSquare, Pencil, Trash2, ExternalLink } from "lucide-react";
import { getDashboard } from "../services/userService";
import { deletePost } from "../services/postService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-2xl p-5 flex items-center gap-4 shadow-card">
    <div className="w-11 h-11 rounded-xl bg-spine-500/10 flex items-center justify-center shrink-0">
      <Icon size={19} className="text-spine-600 dark:text-spine-300" />
    </div>
    <div>
      <p className="text-2xl font-display font-semibold leading-none">{value}</p>
      <p className="text-xs text-ink/50 dark:text-ink-light/50 mt-1">{label}</p>
    </div>
  </div>
);

const statusBadge = (status) =>
  status === "published"
    ? "bg-spine-500/10 text-spine-700 dark:text-spine-300"
    : "bg-amber-500/10 text-amber-600";

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("posts");
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getDashboard();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(confirmId);
      showToast("Post deleted");
      setData((d) => ({ ...d, myPosts: d.myPosts.filter((p) => p._id !== confirmId) }));
    } catch (err) {
      showToast(err.response?.data?.message || "Could not delete", "error");
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  const { stats, myPosts, recentComments } = data;
  const drafts = myPosts.filter((p) => p.status === "draft");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-spine-600 dark:text-spine-300 mb-1.5">Dashboard</p>
          <h1 className="font-display text-3xl font-semibold">Welcome back, {user?.name?.split(" ")[0]}</h1>
        </div>
        <Link to="/create-post">
          <Button><PenSquare size={15} /> Create Post</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <StatCard icon={FileText} label="Total Posts" value={stats.totalPosts} />
        <StatCard icon={FileEdit} label="Published" value={stats.publishedPosts} />
        <StatCard icon={FileEdit} label="Drafts" value={stats.drafts} />
        <StatCard icon={MessageSquare} label="Comments" value={stats.totalComments} />
        <StatCard icon={Eye} label="Total Views" value={stats.totalViews} />
      </div>

      <div className="flex gap-2 mb-6 border-b border-ink/8 dark:border-white/8">
        {[["posts", "My Posts"], ["drafts", "Drafts"], ["comments", "Recent Comments"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key ? "border-spine-600 text-spine-600 dark:text-spine-300" : "border-transparent text-ink/50 dark:text-ink-light/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "posts" && (
        myPosts.length === 0 ? (
          <EmptyState icon={FileText} title="No posts yet" description="Create your first post to see it here." action={<Link to="/create-post"><Button size="sm">Create Post</Button></Link>} />
        ) : (
          <div className="space-y-3">
            {myPosts.map((p) => (
              <div key={p._id} className="flex items-center gap-4 bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-xl p-4">
                <img src={p.featuredImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusBadge(p.status)}`}>{p.status}</span>
                    <span className="text-[11px] text-ink/40 dark:text-ink-light/40 font-mono flex items-center gap-1"><Eye size={11}/> {p.views} views</span>
                  </div>
                  <p className="font-medium truncate">{p.title}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link to={`/post/${p.slug}`} className="p-2 rounded-lg text-ink/40 hover:text-spine-600 hover:bg-spine-500/10 dark:text-ink-light/40"><ExternalLink size={15} /></Link>
                  <Link to={`/edit-post/${p._id}`} className="p-2 rounded-lg text-ink/40 hover:text-spine-600 hover:bg-spine-500/10 dark:text-ink-light/40"><Pencil size={15} /></Link>
                  <button onClick={() => setConfirmId(p._id)} className="p-2 rounded-lg text-ink/40 hover:text-red-500 hover:bg-red-500/10 dark:text-ink-light/40"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "drafts" && (
        drafts.length === 0 ? (
          <EmptyState icon={FileEdit} title="No drafts" description="Your saved drafts will show up here." />
        ) : (
          <div className="space-y-3">
            {drafts.map((p) => (
              <div key={p._id} className="flex items-center gap-4 bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-xl p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs text-ink/45 dark:text-ink-light/45 mt-0.5">Last edited {new Date(p.updatedAt).toLocaleDateString()}</p>
                </div>
                <Link to={`/edit-post/${p._id}`}><Button size="sm" variant="secondary"><Pencil size={13}/> Continue</Button></Link>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "comments" && (
        recentComments.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No comments yet" description="Comments you post will appear here." />
        ) : (
          <div className="space-y-3">
            {recentComments.map((c) => (
              <div key={c._id} className="bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-xl p-4">
                <p className="text-sm text-ink/75 dark:text-ink-light/75 mb-2">"{c.content}"</p>
                <Link to={`/post/${c.post?.slug}`} className="text-xs text-spine-600 dark:text-spine-300 font-medium">on {c.post?.title}</Link>
              </div>
            ))}
          </div>
        )
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this post?"
        description="This will permanently remove the post and all its comments."
      />
    </div>
  );
};

export default Dashboard;
