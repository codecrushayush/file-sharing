import mongoose from "mongoose";

const DEFAULT_BUCKET = "fs";

let bucket = null;

/**
 * Creates and caches the GridFS bucket. Call once after MongoDB is connected.
 */
export function initGridFSBucket(bucketName = DEFAULT_BUCKET) {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB must be connected before initializing GridFS");
  }
  bucket = new mongoose.mongo.GridFSBucket(db, { bucketName });
  return bucket;
}

export function getGridFsBucket() {
  if (!bucket) {
    initGridFSBucket();
  }
  return bucket;
}

export function getGridFsBucketName() {
  return DEFAULT_BUCKET;
}
