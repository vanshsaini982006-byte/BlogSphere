import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  const icons = {
    success: <CheckCircle2 size={18} className="text-spine-500 dark:text-spine-300 shrink-0" />,
    error: <XCircle size={18} className="text-red-500 shrink-0" />,
    info: <Info size={18} className="text-blue-500 shrink-0" />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-fadeUp flex items-start gap-2.5 bg-white dark:bg-paper-darksoft border border-ink/10 dark:border-white/10 shadow-cardHover rounded-xl px-4 py-3 text-sm"
          >
            {icons[t.type]}
            <p className="flex-1 text-ink dark:text-ink-light">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="text-ink/40 hover:text-ink dark:text-ink-light/40 dark:hover:text-ink-light">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
