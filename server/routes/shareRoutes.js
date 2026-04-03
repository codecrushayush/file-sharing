import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getSharedByToken,
  downloadSharedByToken,
} from "../controllers/shareController.js";

const router = Router();

router.get("/:token/download", asyncHandler(downloadSharedByToken));
router.get("/:token", asyncHandler(getSharedByToken));

export default router;
