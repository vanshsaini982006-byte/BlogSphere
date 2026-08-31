import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, MessageSquare, Pencil, Check, X } from "lucide-react";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import BlogCard from "../components/BlogCard";
import Button from "../components/Button";
import Input from "../components/Input";
import EmptyState from "../components/EmptyState";
import { CardSkeletonGrid } from "../components/Skeletons";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateLocalUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ postCount: 0, commentCount: 0 });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });
  const [saving, setSaving] = useState(false);

  const isOwnProfile = currentUser && currentUser._id === id;

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile(id);
      setProfile(data.user);
      setStats(data.stats);
      setPosts(data.posts);
      setForm({ name: data.user.name, bio: data.user.bio || "", avatar: data.user.avatar });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const data = await updateUserProfile(id, form);
      setProfile(data.user);
      updateLocalUser(data.user);
      showToast("Profile updated");
      setEditing(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Could not update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="skeleton h-40 w-full rounded-2xl mb-10" />
        <CardSkeletonGrid count={3} />
      </div>
    );
  }
  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-2xl p-8 mb-10 shadow-card">
        {editing ? (
          <div className="space-y-4 max-w-md">
            <Input label="Avatar URL" value={form.avatar} onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))} />
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Bio" textarea rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Tell readers about yourself" />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveProfile} loading={saving}><Check size={14} /> Save</Button>
              <Button size="sm" variant="secondary" onClick={() => setEditing(false)}><X size={14} /> Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <h1 className="font-display text-2xl font-semibold">{profile.name}</h1>
                {isOwnProfile && (
                  <button onClick={() => setEditing(true)} className="text-ink/40 hover:text-spine-600 dark:text-ink-light/40 dark:hover:text-spine-300">
                    <Pencil size={15} />
                  </button>
                )}
              </div>
              <p className="text-sm text-ink/45 dark:text-ink-light/45 font-mono mb-3">@{profile.username}</p>
              <p className="text-sm text-ink/65 dark:text-ink-light/65 max-w-md mb-4">{profile.bio || "No bio yet."}</p>
              <div className="flex items-center justify-center sm:justify-start gap-6 text-sm">
                <span className="flex items-center gap-1.5"><FileText size={14} className="text-spine-600 dark:text-spine-300" /> <strong>{stats.postCount}</strong> Posts</span>
                <span className="flex items-center gap-1.5"><MessageSquare size={14} className="text-spine-600 dark:text-spine-300" /> <strong>{stats.commentCount}</strong> Comments</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="font-display text-2xl font-semibold mb-6">Published Posts</h2>
      {posts.length === 0 ? (
        <EmptyState icon={FileText} title="No posts yet" description={`${profile.name} hasn't published anything yet.`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <BlogCard key={p._id} post={{ ...p, author: profile }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
