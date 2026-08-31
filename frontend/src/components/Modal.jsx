import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({ open, onClose, title, children, footer }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fadeUp" onClick={onClose} />
      <div className="relative bg-white dark:bg-paper-darksoft rounded-2xl shadow-cardHover w-full max-w-md p-6 animate-fadeUp border border-ink/10 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-ink dark:text-ink-light">{title}</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink dark:text-ink-light/50 dark:hover:text-ink-light">
            <X size={20} />
          </button>
        </div>
        <div className="text-sm text-ink/70 dark:text-ink-light/70">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
