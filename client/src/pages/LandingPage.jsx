import { Link } from "react-router-dom";
import { ArrowRight, Cloud, Lock, Link2 } from "lucide-react";

export function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-indigo-400">
          File Sharing Systems
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Share files with{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            confidence
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-400">
          A dark, premium workspace for uploading documents, managing your library, and sharing
          secure download links—powered by the MERN stack and MongoDB GridFS.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500"
          >
            Create account
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800/80"
          >
            View dashboard
          </Link>
        </div>
      </div>

      <div className="mt-24 grid gap-8 sm:grid-cols-3">
        {[
          {
            icon: Cloud,
            title: "GridFS storage",
            text: "Binary files live in MongoDB GridFS; the dashboard lists metadata, previews sharing state, and handles delete end-to-end.",
          },
          {
            icon: Lock,
            title: "Secure accounts",
            text: "JWT sessions and bcrypt-hashed passwords protect your library. Only you can upload or delete until you share.",
          },
          {
            icon: Link2,
            title: "Public share links",
            text: "Create a tokenized link anyone can use to view file details and download—no login required on the shared page.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:border-slate-700/90"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
