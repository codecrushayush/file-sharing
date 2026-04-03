import mongoose from "mongoose";

const fileMetadataSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  originalName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 512,
  },
  /** Filename stored in GridFS (bucket key), not the user's display name */
  filename: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
    min: 0,
  },
  gridFsFileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isShared: {
    type: Boolean,
    default: false,
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export const FileMetadata = mongoose.model("FileMetadata", fileMetadataSchema);
