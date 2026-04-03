import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { getGridFsBucket } from "../config/gridfs.js";

export async function uploadBufferToGridFS(buffer, filename, contentType) {
  const bucket = getGridFsBucket();
  const uploadStream = bucket.openUploadStream(filename, { contentType });
  await pipeline(Readable.from(buffer), uploadStream);
  return uploadStream.id;
}

export function openDownloadStream(gridFsFileId) {
  const bucket = getGridFsBucket();
  return bucket.openDownloadStream(gridFsFileId);
}

export async function deleteGridFsFile(gridFsFileId) {
  const bucket = getGridFsBucket();
  await bucket.delete(gridFsFileId);
}
