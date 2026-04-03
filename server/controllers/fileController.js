import crypto from "crypto";
import mongoose from "mongoose";
import { FileMetadata } from "../models/FileMetadata.js";
import { uploadBufferToGridFS, deleteGridFsFile } from "../services/gridfsService.js";
import { parseObjectId } from "../utils/objectId.js";
import { httpError } from "../utils/httpError.js";
import { createUniqueShareToken } from "../utils/shareToken.js";
import { pipeGridFileToResponse } from "../utils/sendGridFile.js";

function toFileDto(doc) {
  return {
    id: String(doc._id),
    originalName: doc.originalName,
    filename: doc.filename,
    mimeType: doc.mimeType,
    size: doc.size,
    isShared: doc.isShared,
    shareToken: doc.shareToken || null,
    uploadedAt: doc.uploadedAt,
  };
}

export async function uploadFile(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded. Use multipart field name \"file\".",
    });
  }

  const { buffer, originalname, mimetype, size } = req.file;
  const originalName = pathBasenameSafe(originalname);
  const gridKey = `fs_${crypto.randomUUID()}`;

  let gridFsFileId;
  try {
    gridFsFileId = await uploadBufferToGridFS(buffer, gridKey, mimetype);
  } catch (err) {
    return next(err);
  }

  const doc = await FileMetadata.create({
    owner: new mongoose.Types.ObjectId(req.user.id),
    originalName,
    filename: gridKey,
    mimeType: mimetype,
    size,
    gridFsFileId,
    isShared: false,
  });

  res.status(201).json({
    success: true,
    file: toFileDto(doc),
  });
}

function pathBasenameSafe(name) {
  const base = String(name || "file").split(/[/\\]/).pop() || "file";
  return base.slice(0, 512);
}

export async function listFiles(req, res) {
  const items = await FileMetadata.find({ owner: req.user.id })
    .sort({ uploadedAt: -1 })
    .lean();

  res.json({
    success: true,
    files: items.map((d) => toFileDto(d)),
  });
}

export async function deleteFile(req, res, next) {
  const oid = parseObjectId(req.params.id);
  if (!oid) {
    return next(httpError("Invalid file id", 400));
  }

  const doc = await FileMetadata.findOne({
    _id: oid,
    owner: req.user.id,
  });

  if (!doc) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  try {
    await deleteGridFsFile(doc.gridFsFileId);
  } catch (err) {
    return next(
      httpError(
        "Could not remove file from storage",
        500
      )
    );
  }

  await FileMetadata.deleteOne({ _id: doc._id });

  res.json({ success: true, message: "File deleted" });
}

export async function downloadFile(req, res, next) {
  const oid = parseObjectId(req.params.id);
  if (!oid) {
    return next(httpError("Invalid file id", 400));
  }

  const doc = await FileMetadata.findOne({
    _id: oid,
    owner: req.user.id,
  }).lean();

  if (!doc) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  pipeGridFileToResponse(doc, res, next);
}

export async function shareFile(req, res, next) {
  const oid = parseObjectId(req.params.id);
  if (!oid) {
    return next(httpError("Invalid file id", 400));
  }

  const doc = await FileMetadata.findOne({
    _id: oid,
    owner: req.user.id,
  });

  if (!doc) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  let shareToken;
  try {
    shareToken = await createUniqueShareToken();
  } catch (e) {
    return next(e);
  }

  doc.isShared = true;
  doc.shareToken = shareToken;
  await doc.save();

  res.json({
    success: true,
    shareToken,
    path: `/api/share/${shareToken}`,
    file: toFileDto(doc),
  });
}
