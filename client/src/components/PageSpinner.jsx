export function PageSpinner({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-11 w-11 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-400"
        aria-hidden
      />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
