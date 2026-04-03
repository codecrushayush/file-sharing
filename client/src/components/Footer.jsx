import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} File Sharing Systems. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-slate-400">
          <Link to="/" className="hover:text-indigo-400">
            Home
          </Link>
          <span className="cursor-default text-slate-600">Privacy</span>
          <span className="cursor-default text-slate-600">Terms</span>
        </div>
      </div>
    </footer>
  );
}
