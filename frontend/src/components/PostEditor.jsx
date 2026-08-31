import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Save, Send, Image as ImageIcon } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import { useToast } from "../context/ToastContext";
import { createPost, updatePost } from "../services/postService";

const categories = ["Technology", "Programming", "AI", "Web Development", "Education", "Career", "Lifestyle"];

const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80";

const PostEditor = ({ initialPost = null }) => {
  const isEdit = !!initialPost;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: initialPost?.title || "",
    excerpt: initialPost?.excerpt || "",
    content: initialPost?.content || "",
    featuredImage: initialPost?.featuredImage || defaultImage,
    category: initialPost?.category || categories[0],
    tags: initialPost?.tags?.join(", ") || "",
  });
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.excerpt.trim()) errs.excerpt = "Excerpt is required";
    if (!form.content.trim()) errs.content = "Content is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (status) => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, status };
      if (isEdit) {
        const data = await updatePost(initialPost._id, payload);
        showToast(status === "draft" ? "Draft saved" : "Post updated");
        navigate(`/post/${data.post.slug}`);
      } else {
        const data = await createPost(payload);
        showToast(status === "draft" ? "Draft saved" : "Post published");
        navigate(`/post/${data.post.slug}`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const charCount = form.content.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold">{isEdit ? "Edit Post" : "Write a New Post"}</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setPreview((p) => !p)}>
            <Eye size={14} /> {preview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {preview ? (
        <div className="bg-white dark:bg-paper-darksoft rounded-2xl border border-ink/8 dark:border-white/8 p-8 animate-fadeUp">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-spine-500/10 text-spine-700 dark:text-spine-300">{form.category}</span>
          <h2 className="font-display text-3xl font-semibold mt-4 mb-4">{form.title || "Untitled Post"}</h2>
          <img src={form.featuredImage} alt="" className="w-full aspect-[16/9] object-cover rounded-xl mb-6" />
          <p className="text-ink/60 dark:text-ink-light/60 italic mb-6">{form.excerpt}</p>
          <div className="prose-article">
            {form.content.split("\n\n").map((p, i) => (
              <p key={i} className="text-[17px] leading-[1.85] mb-4">{p}</p>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5 bg-white dark:bg-paper-darksoft rounded-2xl border border-ink/8 dark:border-white/8 p-6 sm:p-8">
          <Input label="Title" value={form.title} onChange={onChange("title")} error={errors.title} placeholder="Give your post a compelling title" />

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={onChange("category")}
                className="w-full rounded-xl border border-ink/15 dark:border-white/15 bg-white dark:bg-paper-darksoft px-4 py-2.5 text-sm focus:border-spine-500 focus:ring-1 focus:ring-spine-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Input label="Tags (comma-separated)" value={form.tags} onChange={onChange("tags")} placeholder="react, javascript, webdev" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><ImageIcon size={14}/> Featured Image URL</label>
            <Input value={form.featuredImage} onChange={onChange("featuredImage")} placeholder="https://..." />
            {form.featuredImage && <img src={form.featuredImage} alt="" className="mt-3 w-full aspect-[16/6] object-cover rounded-xl" />}
          </div>

          <Input label="Short Excerpt" textarea rows={2} value={form.excerpt} onChange={onChange("excerpt")} error={errors.excerpt} placeholder="A one or two sentence summary that appears on cards" />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium">Content</label>
              <span className="text-xs font-mono text-ink/40 dark:text-ink-light/40">{charCount} characters</span>
            </div>
            <textarea
              value={form.content}
              onChange={onChange("content")}
              rows={16}
              placeholder="Write your article here. Separate paragraphs with a blank line."
              className={`w-full rounded-xl border ${errors.content ? "border-red-400" : "border-ink/15 dark:border-white/15"} bg-white dark:bg-paper-darksoft px-4 py-3 text-sm leading-relaxed focus:border-spine-500 focus:ring-1 focus:ring-spine-500 outline-none font-sans`}
            />
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => submit("published")} loading={saving}>
              <Send size={14} /> {isEdit ? "Update & Publish" : "Publish"}
            </Button>
            <Button variant="secondary" onClick={() => submit("draft")} loading={saving}>
              <Save size={14} /> Save Draft
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEditor;
