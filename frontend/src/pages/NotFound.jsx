import { Link } from "react-router-dom";
import { Home, Compass } from "lucide-react";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <p className="font-display text-8xl font-semibold text-spine-600/20 dark:text-spine-300/20 mb-4">404</p>
    <h1 className="font-display text-2xl font-semibold mb-2">This page wandered off</h1>
    <p className="text-ink/55 dark:text-ink-light/55 max-w-sm mb-8">
      The page you're looking for doesn't exist, or may have been moved. Let's get you back on track.
    </p>
    <div className="flex gap-3">
      <Link to="/" className="inline-flex items-center gap-1.5 bg-spine-600 hover:bg-spine-700 text-white px-5 py-2.5 rounded-full text-sm font-medium">
        <Home size={15} /> Go Home
      </Link>
      <Link to="/explore" className="inline-flex items-center gap-1.5 border border-ink/15 dark:border-white/15 px-5 py-2.5 rounded-full text-sm font-medium">
        <Compass size={15} /> Explore Posts
      </Link>
    </div>
  </div>
);

export default NotFound;
