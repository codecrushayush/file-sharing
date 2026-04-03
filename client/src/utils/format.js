export function formatBytes(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return "—";
  const n = Number(bytes);
  if (n === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${parseFloat((n / k ** i).toFixed(i > 1 ? 1 : 0))} ${sizes[i]}`;
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "—";
  }
}

export function mimeToLabel(mime) {
  if (!mime) return "File";
  const map = {
    "application/pdf": "PDF",
    "text/plain": "Text",
    "application/msword": "Word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
    "application/rtf": "RTF",
    "text/rtf": "RTF",
  };
  if (map[mime]) return map[mime];
  const [a, b] = mime.split("/");
  if (b) return b.slice(0, 8).toUpperCase();
  return mime;
}
