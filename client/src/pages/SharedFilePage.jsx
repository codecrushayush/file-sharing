import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Link2,
  Download,
  Loader2,
  AlertCircle,
  FileText,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { getSharedMetadata, downloadSharedFile, buildSharePageUrl } from "../services/filesApi.js";
import { formatBytes, formatDateTime, mimeToLabel } from "../utils/format.js";

export function SharedFilePage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setError("Invalid link");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await getSharedMetadata(token);
      setFile(data.file);
    } catch (err) {
      setError(err.message || "Could not load shared file");
      setFile(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDownload() {
    if (!token || !file) return;
    setDownloadBusy(true);
    try {
      await downloadSharedFile(token, file.originalName);
    } catch (err) {
      setError(err.message || "Download failed");
    } finally {
      setDownloadBusy(false);
    }
  }

  async function copyPageLink() {
    const url = buildSharePageUrl(token);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-48 bg-gradient-to-b from-violet-500/15 to-transparent blur-3xl" />

      <Link
        to="/"
        className="relative mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        File Sharing Systems
      </Link>

      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-2xl shadow-black/40 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-600/10" />
        <div className="relative p-8 sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-indigo-300 ring-1 ring-indigo-500/30">
            <Link2 className="h-8 w-8" aria-hidden />
          </div>

          <h1 className="text-center text-2xl font-bold text-white">Shared file</h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            This link was shared with you via File Sharing Systems.
          </p>

          {loading ? (
            <div className="mt-10 flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
              <p className="text-sm text-slate-500">Loading file details…</p>
            </div>
          ) : error ? (
            <div
              className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-8 text-center"
              role="alert"
            >
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className="text-sm font-medium text-red-200">{error}</p>
              <button
                type="button"
                onClick={load}
                className="mt-2 rounded-lg bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-100 hover:bg-red-500/30"
              >
                Retry
              </button>
            </div>
          ) : file ? (
            <>
              <div className="mt-10 rounded-2xl border border-slate-700/80 bg-slate-950/50 p-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-indigo-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold text-white">{file.originalName}</p>
                    <dl className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-600">Type</dt>
                        <dd className="text-slate-300">{mimeToLabel(file.mimeType)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-600">Size</dt>
                        <dd className="text-slate-300">{formatBytes(file.size)}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-xs uppercase tracking-wide text-slate-600">Uploaded</dt>
                        <dd className="text-slate-300">{formatDateTime(file.uploadedAt)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={downloadBusy}
                  onClick={handleDownload}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloadBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download
                </button>
                <button
                  type="button"
                  onClick={copyPageLink}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy page link
                    </>
                  )}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
