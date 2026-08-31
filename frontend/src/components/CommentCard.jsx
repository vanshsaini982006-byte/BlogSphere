import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val} ${name}${val > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

const CommentCard = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.content);
  const isOwner = user && user._id === comment.author?._id;

  const save = async () => {
    if (!text.trim()) return;
    await onUpdate(comment._id, text.trim());
    setEditing(false);
  };

  return (
    <div className="flex gap-3 py-4 border-b border-ink/8 dark:border-white/8 last:border-0">
      <img src={comment.author?.avatar} alt={comment.author?.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink dark:text-ink-light">{comment.author?.name}</span>
            <span className="text-xs text-ink/40 dark:text-ink-light/40 font-mono">{timeAgo(comment.createdAt)}</span>
          </div>
          {isOwner && !editing && (
            <div className="flex items-center gap-1">
              <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-ink/40 hover:text-spine-600 hover:bg-spine-500/10 dark:text-ink-light/40 dark:hover:text-spine-300">
                <Pencil size={13} />
              </button>
              <button onClick={() => onDelete(comment._id)} className="p-1.5 rounded-lg text-ink/40 hover:text-red-500 hover:bg-red-500/10 dark:text-ink-light/40">
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
        {editing ? (
          <div className="mt-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-ink/15 dark:border-white/15 bg-white dark:bg-paper-darksoft px-3 py-2 text-sm focus:border-spine-500 focus:ring-1 focus:ring-spine-500 outline-none"
            />
            <div className="flex gap-2 mt-1.5">
              <button onClick={save} className="flex items-center gap-1 text-xs font-medium text-spine-600 dark:text-spine-300">
                <Check size={13} /> Save
              </button>
              <button onClick={() => { setEditing(false); setText(comment.content); }} className="flex items-center gap-1 text-xs font-medium text-ink/50 dark:text-ink-light/50">
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink/75 dark:text-ink-light/75 mt-1 leading-relaxed">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
