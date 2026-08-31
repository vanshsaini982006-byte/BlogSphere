import { useEffect, useState } from "react";
import { Users, FileText, MessageSquare, ShieldCheck, Trash2 } from "lucide-react";
import { getAdminStats, getAllUsers, getAllPosts, getAllComments, adminDeletePost, adminDeleteComment } from "../services/adminService";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";

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

const Admin = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [tab, setTab] = useState("posts");
  const [confirm, setConfirm] = useState(null); // { type, id }
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, u, p, c] = await Promise.all([getAdminStats(), getAllUsers(), getAllPosts(), getAllComments()]);
      setStats(s.stats);
      setUsers(u.users);
      setPosts(p.posts);
      setComments(c.comments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleConfirm = async () => {
    try {
      if (confirm.type === "post") {
        await adminDeletePost(confirm.id);
        setPosts((prev) => prev.filter((p) => p._id !== confirm.id));
      } else {
        await adminDeleteComment(confirm.id);
        setComments((prev) => prev.filter((c) => c._id !== confirm.id));
      }
      showToast("Removed successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not remove", "error");
    } finally {
      setConfirm(null);
    }
  };

  if (loading || !stats) {
    return <div className="max-w-6xl mx-auto px-4 py-12"><div className="skeleton h-96 rounded-2xl" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <ShieldCheck className="text-spine-600 dark:text-spine-300" size={24} />
        <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Users} label="Total Users" value={stats.userCount} />
        <StatCard icon={FileText} label="Total Posts" value={stats.postCount} />
        <StatCard icon={FileText} label="Published" value={stats.publishedCount} />
        <StatCard icon={MessageSquare} label="Total Comments" value={stats.commentCount} />
      </div>

      <div className="flex gap-2 mb-6 border-b border-ink/8 dark:border-white/8">
        {[["posts", "All Posts"], ["comments", "All Comments"], ["users", "All Users"]].map(([key, label]) => (
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
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p._id} className="flex items-center gap-4 bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-xl p-3.5">
              <img src={p.featuredImage} className="w-12 h-12 rounded-lg object-cover shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm">{p.title}</p>
                <p className="text-xs text-ink/45 dark:text-ink-light/45">by {p.author?.name} · {p.category} · {p.status}</p>
              </div>
              <button onClick={() => setConfirm({ type: "post", id: p._id })} className="p-2 rounded-lg text-ink/40 hover:text-red-500 hover:bg-red-500/10 dark:text-ink-light/40 shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "comments" && (
        <div className="space-y-2">
          {comments.map((c) => (
            <div key={c._id} className="flex items-center gap-4 bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-xl p-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">"{c.content}"</p>
                <p className="text-xs text-ink/45 dark:text-ink-light/45">by {c.author?.name} on {c.post?.title}</p>
              </div>
              <button onClick={() => setConfirm({ type: "comment", id: c._id })} className="p-2 rounded-lg text-ink/40 hover:text-red-500 hover:bg-red-500/10 dark:text-ink-light/40 shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u._id} className="flex items-center gap-4 bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-xl p-3.5">
              <img src={u.avatar} className="w-9 h-9 rounded-full object-cover shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{u.name} <span className="text-ink/40 dark:text-ink-light/40 font-mono text-xs">@{u.username}</span></p>
                <p className="text-xs text-ink/45 dark:text-ink-light/45">{u.email}</p>
              </div>
              {u.role === "admin" && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-spine-500/10 text-spine-700 dark:text-spine-300 shrink-0">admin</span>}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
        title={`Remove this ${confirm?.type}?`}
        description="This action is permanent and cannot be undone."
      />
    </div>
  );
};

export default Admin;
