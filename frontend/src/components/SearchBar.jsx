import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ className = "", placeholder = "Search articles, topics, authors..." }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40 dark:text-ink-light/40" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-ink/15 dark:border-white/15 bg-white dark:bg-paper-darksoft pl-10 pr-4 py-2 text-sm focus:border-spine-500 focus:ring-1 focus:ring-spine-500 outline-none transition-colors"
      />
    </form>
  );
};

export default SearchBar;
