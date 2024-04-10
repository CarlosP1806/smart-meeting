import { Router } from "express";
import {
  acceptInvite,
  createMeeting,
  getTranscription,
} from "../controllers/meeting.controller";
import { authMiddleware } from "../services/auth.service";
import * as FileService from "../services/fileStorage.service";

export const router = Router();

router.route("/").post(authMiddleware, createMeeting);
router.route("/:id/accept").post(authMiddleware, acceptInvite);
router
  .route("/:id/transcription")
  .get(authMiddleware, FileService.upload.single("file"), getTranscription);
