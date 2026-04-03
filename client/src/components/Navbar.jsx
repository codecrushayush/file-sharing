import { Link, NavLink } from "react-router-dom";
import { Share2, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-indigo-500/15 text-indigo-300"
      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100",
  ].join(" ");

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
            <Share2 className="h-5 w-5 text-white" aria-hidden />
          </span>
          File Sharing Systems
        </Link>
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          {user ? (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-[140px] truncate text-sm text-slate-400 sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-500"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
