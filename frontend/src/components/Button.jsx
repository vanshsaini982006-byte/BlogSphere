import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-spine-600 hover:bg-spine-700 text-white shadow-sm",
  secondary: "bg-transparent border border-ink/15 dark:border-white/15 hover:bg-ink/5 dark:hover:bg-white/5 text-ink dark:text-ink-light",
  ghost: "bg-transparent hover:bg-ink/5 dark:hover:bg-white/5 text-ink dark:text-ink-light",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({ children, variant = "primary", size = "md", loading = false, className = "", disabled, ...props }) => {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
