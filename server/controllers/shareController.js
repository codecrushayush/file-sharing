import { FileMetadata } from "../models/FileMetadata.js";
import { pipeGridFileToResponse } from "../utils/sendGridFile.js";

export async function getSharedByToken(req, res) {
  const { token } = req.params;
  if (!token || token.length < 32) {
    return res.status(400).json({
      success: false,
      message: "Invalid share link",
    });
  }

  const file = await FileMetadata.findOne({
    shareToken: token,
    isShared: true,
  }).lean();

  if (!file) {
    return res.status(404).json({
      success: false,
      message: "Shared file not found",
    });
  }

  res.json({
    success: true,
    file: {
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      uploadedAt: file.uploadedAt,
    },
  });
}

export async function downloadSharedByToken(req, res, next) {
  const { token } = req.params;
  if (!token || token.length < 32) {
    return res.status(400).json({
      success: false,
      message: "Invalid share link",
    });
  }

  const file = await FileMetadata.findOne({
    shareToken: token,
    isShared: true,
  }).lean();

  if (!file) {
    return res.status(404).json({
      success: false,
      message: "Shared file not found",
    });
  }

  pipeGridFileToResponse(file, res, next);
}
