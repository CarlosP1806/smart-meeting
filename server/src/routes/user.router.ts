import { Router } from "express";
import { login, signUp } from "../controllers/user.controller";
import * as FileService from "../services/fileStorage.service";

export const router = Router();

router.post("/signup", FileService.upload.single("file"), signUp);
router.post("/login", login);
