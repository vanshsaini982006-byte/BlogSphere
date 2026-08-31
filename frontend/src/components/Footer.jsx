import { Link } from "react-router-dom";
import { Feather, Github, Twitter, Linkedin } from "lucide-react";

const categories = ["Technology", "Programming", "AI", "Web Development", "Education", "Career"];

const Footer = () => (
  <footer className="border-t border-ink/8 dark:border-white/8 mt-24 bg-paper-soft/50 dark:bg-paper-darksoft/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <Link to="/" className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-full bg-spine-600 flex items-center justify-center">
            <Feather size={14} className="text-white" />
          </span>
          <span className="font-display text-lg font-semibold">BlogSphere</span>
        </Link>
        <p className="text-sm text-ink/55 dark:text-ink-light/55 leading-relaxed max-w-xs">
          A place to write, read, and discuss ideas worth spreading.
        </p>
        <div className="flex gap-3 mt-4">
          <a href="https://github.com/vanshsaini982006-byte?utm_source=chatgpt.com" aria-label="GitHub" className="text-ink/40 hover:text-spine-600 dark:text-ink-light/40 dark:hover:text-spine-300"><Github size={17} /></a>
          
          <a href="https://linkedin.com/in/vansh-saini-029909380" aria-label="LinkedIn" className="text-ink/40 hover:text-spine-600 dark:text-ink-light/40 dark:hover:text-spine-300"><Linkedin size={17} /></a>
        </div>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-wider text-ink/40 dark:text-ink-light/40 mb-4">Explore</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/explore" className="text-ink/65 hover:text-spine-600 dark:text-ink-light/65 dark:hover:text-spine-300">All Articles</Link></li>
          <li><Link to="/explore?sort=popular" className="text-ink/65 hover:text-spine-600 dark:text-ink-light/65 dark:hover:text-spine-300">Popular</Link></li>
          <li><Link to="/about" className="text-ink/65 hover:text-spine-600 dark:text-ink-light/65 dark:hover:text-spine-300">About</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-wider text-ink/40 dark:text-ink-light/40 mb-4">Categories</h4>
        <ul className="space-y-2.5 text-sm">
          {categories.slice(0, 4).map((c) => (
            <li key={c}>
              <Link to={`/explore?category=${encodeURIComponent(c)}`} className="text-ink/65 hover:text-spine-600 dark:text-ink-light/65 dark:hover:text-spine-300">
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-wider text-ink/40 dark:text-ink-light/40 mb-4">Start Writing</h4>
        <p className="text-sm text-ink/55 dark:text-ink-light/55 mb-4">Have something to say? Publish your first post today.</p>
        <Link to="/create-post" className="inline-block text-sm font-medium px-4 py-2 rounded-full bg-spine-600 hover:bg-spine-700 text-white transition-colors">
          Start Writing
        </Link>
      </div>
    </div>
    <div className="border-t border-ink/8 dark:border-white/8 py-5 text-center text-xs text-ink/40 dark:text-ink-light/40 font-mono">
      © {new Date().getFullYear()} BlogSphere. A simple place to write and share.
    </div>
  </footer>
);

export default Footer;
