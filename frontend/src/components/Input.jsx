const Input = ({ label, error, className = "", textarea = false, ...props }) => {
  const Component = textarea ? "textarea" : "input";
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1.5 text-ink dark:text-ink-light">{label}</label>}
      <Component
        className={`w-full rounded-xl border ${
          error ? "border-red-400" : "border-ink/15 dark:border-white/15"
        } bg-white dark:bg-paper-darksoft px-4 py-2.5 text-sm text-ink dark:text-ink-light placeholder:text-ink/35 dark:placeholder:text-ink-light/35 focus:border-spine-500 focus:ring-1 focus:ring-spine-500 outline-none transition-colors ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
