const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-20 px-4">
    {Icon && (
      <div className="w-16 h-16 rounded-full bg-spine-500/10 flex items-center justify-center mb-5">
        <Icon size={26} className="text-spine-600 dark:text-spine-300" />
      </div>
    )}
    <h3 className="font-display text-xl font-semibold text-ink dark:text-ink-light mb-2">{title}</h3>
    <p className="text-sm text-ink/55 dark:text-ink-light/55 max-w-sm mb-6">{description}</p>
    {action}
  </div>
);

export default EmptyState;
