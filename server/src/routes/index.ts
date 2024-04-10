import { Router } from "express";
import { router as userRouter } from "./user.router";
import { router as meetingRouter } from "./meeting.router";

export const router = Router();

router.use("/users", userRouter);
router.use("/meetings", meetingRouter);
