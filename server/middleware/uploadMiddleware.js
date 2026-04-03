import path from "path";
import multer from "multer";
import { env } from "../config/env.js";

const storage = multer.memoryStorage();

/** Extension → acceptable MIME types (includes common mis-detections) */
const EXT_TO_MIMES = {
  ".pdf": ["application/pdf"],
  ".txt": ["text/plain", "application/octet-stream"],
  ".doc": ["application/msword", "application/octet-stream"],
  ".docx": [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream",
  ],
  ".rtf": ["application/rtf", "text/rtf", "application/octet-stream"],
};

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const allowed = EXT_TO_MIMES[ext];
  if (!allowed) {
    return cb(
      new Error(
        "Invalid file type. Allowed: pdf, txt, doc, docx, rtf"
      )
    );
  }
  const mime = (file.mimetype || "").toLowerCase();
  if (allowed.includes(mime)) {
    return cb(null, true);
  }
  return cb(
    new Error(
      "File MIME type does not match the allowed types for this extension"
    )
  );
}

export const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSizeBytes },
  fileFilter,
});

/** Wraps multer so filter/size errors are returned as JSON instead of HTML. */
export function handleUploadSingle(fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) return multerErrorHandler(err, req, res, next);
      next();
    });
  };
}

export function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: `File exceeds maximum size of ${env.maxFileSizeBytes} bytes`,
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err && err.message && err.message.includes("Invalid file")) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err && err.message && err.message.includes("MIME type")) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
}
