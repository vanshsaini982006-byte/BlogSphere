import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  PenLine,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getFeaturedPosts, getPosts } from "../services/postService";
import BlogCard from "../components/BlogCard";
import { CardSkeletonGrid } from "../components/Skeletons";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

const categories = [
  { name: "Technology", emoji: "💻" },
  { name: "Programming", emoji: "⌨️" },
  { name: "AI", emoji: "✦" },
  { name: "Web Development", emoji: "◫" },
  { name: "Education", emoji: "📚" },
  { name: "Career", emoji: "↗" },
  { name: "Lifestyle", emoji: "✿" },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredData, latestData] = await Promise.all([
          getFeaturedPosts(),
          getPosts({ limit: 6, sort: "newest" }),
        ]);

        setFeatured(featuredData?.posts?.slice(0, 3) || []);
        setLatest(latestData?.posts || []);
      } catch (error) {
        console.error("Failed to load homepage posts:", error);
        setFeatured([]);
        setLatest([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const heroPost = featured[0] || latest[0];

  return (
    <main className="bg-paper dark:bg-paper-dark">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/10 dark:border-white/10">
        <div className="absolute inset-0 bg-grain opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-spine-600 dark:text-spine-300 text-xs font-semibold uppercase tracking-[0.18em] mb-5">
                <Sparkles size={14} />
                Ideas · Stories · Knowledge
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.98]">
                Read something
                <span className="block italic text-spine-600 dark:text-spine-300">
                  worth remembering.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg leading-8 text-ink/60 dark:text-ink-light/60">
                BlogSphere is a community for developers, creators and curious
                minds. Discover practical ideas, thoughtful stories and lessons
                from people who build things.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-full bg-spine-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-spine-700"
                >
                  <BookOpen size={16} />
                  Explore articles
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to={isAuthenticated ? "/create-post" : "/register"}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 dark:border-white/15 px-6 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-ink/5 dark:hover:bg-white/5"
                >
                  <PenLine size={16} />
                  Write a story
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-xs text-ink/50 dark:text-ink-light/50">
                <span>Independent writers</span>
                <span className="h-1 w-1 rounded-full bg-current" />
                <span>Practical knowledge</span>
                <span className="h-1 w-1 rounded-full bg-current" />
                <span>Real stories</span>
              </div>
            </div>

            <div className="relative">
              {heroPost ? (
                <Link
                  to={`/post/${heroPost.slug}`}
                  className="group block overflow-hidden rounded-[2rem] bg-ink shadow-2xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={heroPost.featuredImage}
                      alt={heroPost.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute left-5 right-5 bottom-5 sm:left-7 sm:right-7 sm:bottom-7 text-white">
                      <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md">
                        Featured story
                      </span>
                      <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold leading-tight">
                        {heroPost.title}
                      </h2>
                      <p className="mt-2 text-sm text-white/75 line-clamp-2">
                        {heroPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="aspect-[4/3] rounded-[2rem] bg-paper-soft dark:bg-paper-darksoft animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-spine-600 dark:text-spine-300">
              Editor's picks
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">
              Featured stories
            </h2>
          </div>

          <Link
            to="/explore"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-spine-600 dark:text-ink-light/60 dark:hover:text-spine-300"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <CardSkeletonGrid count={3} />
        ) : featured.length === 0 ? (
          <EmptyState
            title="No featured posts yet"
            description="Publish the first article and it can become a featured story."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="border-y border-ink/10 dark:border-white/10 bg-paper-soft/60 dark:bg-paper-darksoft/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={17} className="text-spine-600 dark:text-spine-300" />
            <h2 className="font-display text-2xl font-semibold">
              Explore by topic
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/explore?category=${encodeURIComponent(category.name)}`}
                className="group inline-flex items-center gap-2 rounded-full border border-ink/10 dark:border-white/10 bg-white dark:bg-paper-dark px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-spine-400 hover:text-spine-600 dark:hover:text-spine-300"
              >
                <span className="text-base">{category.emoji}</span>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-spine-600 dark:text-spine-300">
              Fresh from the community
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">
              Latest articles
            </h2>
          </div>

          <Link
            to="/explore?sort=newest"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-spine-600 dark:text-ink-light/60 dark:hover:text-spine-300"
          >
            Browse all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <CardSkeletonGrid count={6} />
        ) : latest.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="Be the first writer to publish on BlogSphere."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-spine-700 dark:bg-spine-900 px-7 py-12 sm:px-12 sm:py-14 text-white">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-spine-100/70">
              Your turn
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold">
              Have an idea people should read?
            </h2>
            <p className="mt-4 max-w-xl text-spine-100/75 leading-7">
              Share what you know, document what you are learning, and build
              your voice one useful article at a time.
            </p>
            <Link
              to={isAuthenticated ? "/create-post" : "/register"}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-spine-700 transition-transform hover:-translate-y-0.5"
            >
              <PenLine size={16} />
              Start writing
            </Link>
          </div>

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -right-8 -bottom-36 h-80 w-80 rounded-full border border-white/10" />
        </div>
      </section>
    </main>
  );
};

export default Home;
