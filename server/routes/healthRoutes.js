import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbOk = dbState === 1;
  res.json({
    success: true,
    service: "File Sharing Systems API",
    uptime: process.uptime(),
    database: dbOk ? "connected" : "disconnected",
  });
});

export default router;
