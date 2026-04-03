/**
 * RFC 5987 filename* for Content-Disposition attachment.
 */
export function attachmentDisposition(filename) {
  const safe = String(filename).replace(/[\r\n"]/g, "_");
  return `attachment; filename*=UTF-8''${encodeURIComponent(safe)}`;
}
