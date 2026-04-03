import { useCallback, useEffect, useState } from "react";
import { LayoutDashboard, Sparkles, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { FileUploadZone } from "../components/FileUploadZone.jsx";
import { FileInventory, ShareLinkModal } from "../components/FileInventory.jsx";
import {
  listFiles,
  uploadFile,
  deleteFile,
  shareFile,
  downloadOwnedFile,
  buildSharePageUrl,
} from "../services/filesApi.js";

export function DashboardPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [downloadBusyId, setDownloadBusyId] = useState(null);
  const [deleteBusyId, setDeleteBusyId] = useState(null);
  const [shareBusyId, setShareBusyId] = useState(null);
  const [shareModal, setShareModal] = useState({ open: false, url: "" });

  const loadFiles = useCallback(async () => {
    setListError(null);
    setListLoading(true);
    try {
      const data = await listFiles();
      setFiles(data.files || []);
    } catch (err) {
      setListError(err.message || "Failed to load files");
      setFiles([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  async function handleFileSelected(file) {
    setUploadError(null);
    setActionError(null);
    setUploading(true);
    try {
      const data = await uploadFile(file);
      if (data?.file) {
        setFiles((prev) => [data.file, ...prev]);
      } else {
        await loadFiles();
      }
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(f) {
    setActionError(null);
    setDownloadBusyId(f.id);
    try {
      await downloadOwnedFile(f.id, f.originalName);
    } catch (err) {
      setActionError(err.message || "Download failed");
    } finally {
      setDownloadBusyId(null);
    }
  }

  async function handleDelete(f) {
    if (!window.confirm(`Delete “${f.originalName}”? This cannot be undone.`)) {
      return;
    }
    setActionError(null);
    setDeleteBusyId(f.id);
    try {
      await deleteFile(f.id);
      setFiles((prev) => prev.filter((x) => x.id !== f.id));
    } catch (err) {
      setActionError(err.message || "Delete failed");
    } finally {
      setDeleteBusyId(null);
    }
  }

  async function handleShare(f) {
    setActionError(null);
    setShareBusyId(f.id);
    try {
      const data = await shareFile(f.id);
      const token = data.shareToken || data.file?.shareToken;
      const url = buildSharePageUrl(token);
      setShareModal({ open: true, url });
      setFiles((prev) =>
        prev.map((x) =>
          x.id === f.id
            ? {
                ...x,
                isShared: true,
                shareToken: token,
              }
            : x
        )
      );
    } catch (err) {
      setActionError(err.message || "Could not create share link");
    } finally {
      setShareBusyId(null);
    }
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-3xl" />

      <header className="relative mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            File Sharing Systems
          </div>
          <div className="mt-3 flex items-center gap-2 text-indigo-400">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">Dashboard</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your workspace
          </h1>
          <p className="mt-2 max-w-xl text-slate-400">
            {user?.name ? (
              <>
                Signed in as <span className="text-slate-200">{user.name}</span>. Upload documents,
                share secure links, and keep everything in one place.
              </>
            ) : (
              "Upload documents, share secure links, and keep everything in one place."
            )}
          </p>
        </div>
      </header>

      <section className="relative mb-10 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-1 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="rounded-[1.35rem] bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/30 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white">Upload</h2>
          <p className="mt-1 text-sm text-slate-500">
            Drag a file into the zone or click to select. One file per upload.
          </p>
          {uploadError ? (
            <div
              className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {uploadError}
            </div>
          ) : null}
          <div className="mt-6">
            <FileUploadZone
              onFileSelected={handleFileSelected}
              uploading={uploading}
              disabled={listLoading}
            />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Library</h2>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {files.length} {files.length === 1 ? "file" : "files"}
          </span>
        </div>

        {actionError ? (
          <div
            className="mb-6 flex flex-wrap items-start justify-between gap-3 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
            role="status"
          >
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
              <span>{actionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="shrink-0 rounded-lg bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/25"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <FileInventory
          files={files}
          loading={listLoading}
          error={listError}
          onRetry={loadFiles}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onShare={handleShare}
          downloadBusyId={downloadBusyId}
          deleteBusyId={deleteBusyId}
          shareBusyId={shareBusyId}
        />
      </section>

      <ShareLinkModal
        open={shareModal.open}
        url={shareModal.url}
        onClose={() => setShareModal({ open: false, url: "" })}
      />
    </div>
  );
}
