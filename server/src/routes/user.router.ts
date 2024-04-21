import { Router } from "express";
import { getCurrentUser, login, signUp } from "../controllers/user.controller";
import * as FileService from "../services/fileStorage.service";
import { authMiddleware } from "../services/auth.service";

export const router = Router();

router.get("/", authMiddleware, getCurrentUser);
router.post("/signup", FileService.upload.single("file"), signUp);
router.post("/login", login);
