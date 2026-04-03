import { openDownloadStream } from "../services/gridfsService.js";
import { attachmentDisposition } from "./contentDisposition.js";

export function pipeGridFileToResponse(file, res, next) {
  const stream = openDownloadStream(file.gridFsFileId);

  stream.on("error", (err) => {
    if (!res.headersSent) {
      next(err);
    } else {
      res.end();
    }
  });

  res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
  res.setHeader("Content-Disposition", attachmentDisposition(file.originalName));
  if (file.size != null) {
    res.setHeader("Content-Length", String(file.size));
  }

  stream.pipe(res);
}
