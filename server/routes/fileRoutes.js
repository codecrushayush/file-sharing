import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { handleUploadSingle } from "../middleware/uploadMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadFile,
  listFiles,
  deleteFile,
  downloadFile,
  shareFile,
} from "../controllers/fileController.js";

const router = Router();

router.use(protect);

router.get("/", asyncHandler(listFiles));
router.post(
  "/upload",
  handleUploadSingle("file"),
  asyncHandler(uploadFile)
);
router.get("/:id/download", asyncHandler(downloadFile));
router.delete("/:id", asyncHandler(deleteFile));
router.post("/:id/share", asyncHandler(shareFile));

export default router;
