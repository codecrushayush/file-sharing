import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Trash2,
  Share2,
  Copy,
  Check,
  Loader2,
  FileText,
  Shield,
  ShieldOff,
} from "lucide-react";
import { formatBytes, formatDateTime, mimeToLabel } from "../utils/format.js";

export function FileInventory({
  files,
  loading,
  error,
  onRetry,
  onDownload,
  onDelete,
  onShare,
  downloadBusyId,
  deleteBusyId,
  shareBusyId,
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => f.originalName.toLowerCase().includes(q));
  }, [files, query]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search by file name…"
          value={query}
          disabled={loading}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {error ? (
        <div
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-4 text-sm text-red-100 shadow-lg shadow-red-900/20"
          role="alert"
        >
          <p className="font-semibold text-red-50">Could not load your library</p>
          <p className="mt-1 text-red-200/90">{error}</p>
          <p className="mt-2 text-xs text-red-300/80">
            Confirm the API is running and you are signed in, then retry.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-red-500/25 px-4 py-2 text-xs font-semibold text-red-50 transition hover:bg-red-500/35"
          >
            Try again
          </button>
        </div>
      ) : null}

      {loading ? (
        <div
          className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/30 p-4 sm:p-5"
          aria-busy="true"
          aria-label="Loading files"
        >
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-600">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" aria-hidden />
            Syncing library…
          </div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-slate-800/50 bg-slate-950/40 p-4"
            >
              <div className="flex gap-4">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-slate-800/90" />
                <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                  <div className="h-4 max-w-md rounded bg-slate-700/70" />
                  <div className="h-3 w-32 rounded bg-slate-800/80" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-700/70 bg-gradient-to-b from-slate-900/40 to-slate-950/30 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-600/10 text-indigo-300 ring-1 ring-indigo-500/20">
            <FileText className="h-8 w-8 opacity-90" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-100">
              {files.length === 0 ? "No files yet" : "No matches"}
            </p>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {files.length === 0
                ? "Upload a PDF, Word, RTF, or text file above — it will appear here instantly."
                : "Try a different search term or clear the search box."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="grid gap-4 sm:hidden">
            {filtered.map((f) => (
              <li
                key={f.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-lg shadow-black/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{f.originalName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {mimeToLabel(f.mimeType)} · {formatBytes(f.size)} ·{" "}
                      {formatDateTime(f.uploadedAt)}
                    </p>
                  </div>
                  <span
                    className={[
                      "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      f.isShared
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-slate-700/60 text-slate-400",
                    ].join(" ")}
                  >
                    {f.isShared ? (
                      <>
                        <Shield className="h-3 w-3" />
                        Shared
                      </>
                    ) : (
                      <>
                        <ShieldOff className="h-3 w-3" />
                        Private
                      </>
                    )}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionBtn
                    icon={Download}
                    label="Download"
                    onClick={() => onDownload(f)}
                    busy={downloadBusyId === f.id}
                  />
                  <ActionBtn
                    icon={Share2}
                    label="Share"
                    onClick={() => onShare(f)}
                    busy={shareBusyId === f.id}
                  />
                  <ActionBtn
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                    onClick={() => onDelete(f)}
                    busy={deleteBusyId === f.id}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 shadow-xl shadow-black/20 sm:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800/90 bg-slate-950/50 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Type</th>
                    <th className="px-5 py-3 font-semibold">Size</th>
                    <th className="px-5 py-3 font-semibold">Uploaded</th>
                    <th className="px-5 py-3 font-semibold">Sharing</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filtered.map((f) => (
                    <tr
                      key={f.id}
                      className="transition-colors hover:bg-slate-800/30"
                    >
                      <td className="max-w-[240px] px-5 py-3">
                        <span className="line-clamp-2 font-medium text-slate-100">
                          {f.originalName}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                        {mimeToLabel(f.mimeType)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-300">
                        {formatBytes(f.size)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                        {formatDateTime(f.uploadedAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3">
                        <span
                          className={[
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                            f.isShared
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-slate-700/50 text-slate-400",
                          ].join(" ")}
                        >
                          {f.isShared ? "Shared" : "Private"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <IconButton
                            title="Download"
                            onClick={() => onDownload(f)}
                            busy={downloadBusyId === f.id}
                          >
                            <Download className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            title="Share"
                            onClick={() => onShare(f)}
                            busy={shareBusyId === f.id}
                          >
                            <Share2 className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            title="Delete"
                            variant="danger"
                            onClick={() => onDelete(f)}
                            busy={deleteBusyId === f.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function IconButton({ children, onClick, title, busy, variant }) {
  return (
    <button
      type="button"
      title={title}
      disabled={busy}
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:opacity-50",
        variant === "danger"
          ? "text-slate-400 hover:bg-red-500/15 hover:text-red-300"
          : "text-slate-400 hover:bg-indigo-500/15 hover:text-indigo-300",
      ].join(" ")}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}

function ActionBtn({ icon: Icon, label, onClick, busy, variant }) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className={[
        "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50",
        variant === "danger"
          ? "border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
          : "border border-slate-700 bg-slate-800/80 text-slate-200 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white",
      ].join(" ")}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}

export function ShareLinkModal({ open, url, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl shadow-indigo-500/10">
        <h2 id="share-modal-title" className="text-lg font-semibold text-white">
          Share link ready
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Anyone with this link can view file details and download the document.
        </p>
        <div className="mt-4 flex gap-2 rounded-xl border border-slate-700/80 bg-slate-950/80 p-3">
          <code className="min-w-0 flex-1 break-all text-xs text-indigo-200">{url}</code>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy link
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
