import { Request, Response } from "express";
import * as UserService from "../services/user.service";
import * as VoiceRecordingService from "../services/voiceRecord.service";
import * as FileService from "../services/fileStorage.service";
import * as AuthService from "../services/auth.service";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

// Create a new user account and upload recording to cloud
export const signUp = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing reference recording" });
    }

    const { email, name, password } = req.body;
    const voiceFile = req.file;

    const user = await UserService.createUser({ email, name, password });
    const token = AuthService.signToken({
      username: user.name,
      email: user.email,
      id: user.id,
    });
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN,
    });

    voiceFile.originalname = `${user.id}-reference.wav`;
    const voiceRecording = await VoiceRecordingService.createVoiceRecord({
      userId: user.id,
      filename: voiceFile.originalname,
    });
    await FileService.uploadFile(voiceFile);

    res.status(201).json({ user, voiceRecording, token });
  } catch (error: any) {
    console.log(error);
    // Check if the error is related to a duplicate entry
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    if (error instanceof PrismaClientValidationError) {
      return res.status(400).json({ error: "Missing fields" });
    }

    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Log in a user and return a JWT
export const login = async (req: Request, res: Response) => {
  try {
    const user = await UserService.findByName(req.body.name);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValidPassword = user.password === req.body.password;
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = AuthService.signToken({
      username: user.name,
      email: user.email,
      id: user.id,
    });
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN,
    });

    res.status(200).json({ user, token });
  } catch (error: any) {
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
