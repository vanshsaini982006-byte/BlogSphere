import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Feather, Sun, Moon, Menu, X, PenSquare, LayoutDashboard, User, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors link-underline pb-0.5 ${
      isActive ? "text-spine-600 dark:text-spine-300" : "text-ink/70 dark:text-ink-light/70 hover:text-ink dark:hover:text-ink-light"
    }`;

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/85 dark:bg-paper-dark/85 backdrop-blur-md border-b border-ink/8 dark:border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-spine-600 flex items-center justify-center">
            <Feather size={16} className="text-white" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">BlogSphere</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>
          <NavLink to="/explore?category=all" className={navLinkClass}>Categories</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
        </nav>

        <div className="hidden md:block w-64">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-ink/60 hover:bg-ink/5 dark:text-ink-light/60 dark:hover:bg-white/5 transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-post"
                className="hidden sm:inline-flex items-center gap-1.5 bg-spine-600 hover:bg-spine-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                <PenSquare size={14} /> Create Post
              </Link>
              <div className="relative">
                <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center">
                  <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-spine-400 transition-colors" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-paper-darksoft rounded-xl shadow-cardHover border border-ink/8 dark:border-white/8 py-2 z-20 animate-fadeUp">
                      <p className="px-4 py-2 text-sm font-medium border-b border-ink/8 dark:border-white/8 truncate">{user?.name}</p>
                      <Link to={`/profile/${user?._id}`} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-ink/5 dark:hover:bg-white/5">
                        <User size={15} /> Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-ink/5 dark:hover:bg-white/5">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      {user?.role === "admin" && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-ink/5 dark:hover:bg-white/5">
                          <ShieldCheck size={15} /> Admin
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-full text-ink/70 hover:bg-ink/5 dark:text-ink-light/70 dark:hover:bg-white/5">
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-spine-600 hover:bg-spine-700 text-white">
                Register
              </Link>
            </div>
          )}

          <button onClick={() => setMobileOpen((o) => !o)} className="lg:hidden p-2 rounded-full text-ink/60 dark:text-ink-light/60">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-ink/8 dark:border-white/8 px-4 py-4 space-y-3 bg-paper dark:bg-paper-dark animate-fadeUp">
          <SearchBar />
          <NavLink to="/" end onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-1">Home</NavLink>
          <NavLink to="/explore" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-1">Explore</NavLink>
          <NavLink to="/about" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-1">About</NavLink>
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-medium px-4 py-2 rounded-full border border-ink/15 dark:border-white/15">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-medium px-4 py-2 rounded-full bg-spine-600 text-white">Register</Link>
            </div>
          )}
          {isAuthenticated && (
            <Link to="/create-post" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5 bg-spine-600 text-white text-sm font-medium px-4 py-2 rounded-full">
              <PenSquare size={14} /> Create Post
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
