import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Search as SearchIcon } from "lucide-react";
import { getPosts } from "../services/postService";
import BlogCard from "../components/BlogCard";
import { CardSkeletonGrid } from "../components/Skeletons";
import EmptyState from "../components/EmptyState";

const categories = ["all", "Technology", "Programming", "AI", "Web Development", "Education", "Career", "Lifestyle"];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false });
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search") || "";

  const observerRef = useRef();
  const lastCardRef = useCallback(
    (node) => {
      if (loading || loadingMore || !pagination.hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadMore();
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, pagination.hasMore]
  );

  const fetchPosts = async (page = 1, append = false) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const params = { page, limit: 9, sort };
      if (category !== "all") params.category = category;
      if (search) params.search = search;
      const data = await getPosts(params);
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setPagination(data.pagination);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, search]);

  const loadMore = () => {
    if (pagination.hasMore) fetchPosts(pagination.page + 1, true);
  };

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-wider text-spine-600 dark:text-spine-300 mb-1.5">Discover</p>
        <h1 className="font-display text-4xl font-semibold mb-2">Explore Articles</h1>
        <p className="text-ink/55 dark:text-ink-light/55">Search, filter, and find your next favorite read.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <form onSubmit={onSearchSubmit} className="relative flex-1">
          <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-ink-light/40" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, content, category, or tags..."
            className="w-full rounded-full border border-ink/15 dark:border-white/15 bg-white dark:bg-paper-darksoft pl-11 pr-4 py-3 text-sm focus:border-spine-500 focus:ring-1 focus:ring-spine-500 outline-none"
          />
        </form>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-ink/40 dark:text-ink-light/40 hidden sm:block" />
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="rounded-full border border-ink/15 dark:border-white/15 bg-white dark:bg-paper-darksoft px-4 py-3 text-sm outline-none focus:border-spine-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="popular">Most popular</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => updateParam("category", c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === c
                ? "bg-spine-600 border-spine-600 text-white"
                : "border-ink/15 dark:border-white/15 text-ink/65 dark:text-ink-light/65 hover:border-spine-400"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {loading ? (
        <CardSkeletonGrid count={9} />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No articles found"
          description="Try a different search term, or explore a different category."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <div key={post._id} ref={i === posts.length - 1 ? lastCardRef : null}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
          {loadingMore && <div className="mt-8"><CardSkeletonGrid count={3} /></div>}
        </>
      )}
    </div>
  );
};

export default Explore;
