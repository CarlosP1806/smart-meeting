import { Response } from "express";
import * as AuthService from "../services/auth.service";
import * as MeetingService from "../services/meeting.service";
import * as TranscriptionService from "../services/transcription.service";
import * as FileService from "../services/fileStorage.service";

// Create a new meeting and associate it with a user
export const createMeeting = async (
  req: AuthService.AuthRequest,
  res: Response
) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userId = req.userId;
    const { title, date, userIds } = req.body;
    const meetingData = { title, date, ownerId: userId };

    const meeting = await MeetingService.createMeeting(meetingData, userIds);
    res.status(201).json(meeting);
  } catch (error: any) {
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Accept an invite to a meeting
export const acceptInvite = async (
  req: AuthService.AuthRequest,
  res: Response
) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userId = req.userId;
    const meetingId = parseInt(req.params.id);

    const meeting = await MeetingService.acceptInvite(meetingId, userId);
    res.status(200).json(meeting);
  } catch (error: any) {
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Get the transcription of a meeting
export const getTranscription = async (
  req: AuthService.AuthRequest,
  res: Response
) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const meeting = await MeetingService.getMeetingById(
      parseInt(req.params.id)
    );

    if (!meeting || meeting.ownerId !== req.userId) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    const userIds = meeting.users.map((user) => user.userId);
    const refRecNames = userIds.map((id) => `${id}-reference.wav`);
    const fileBuffers: Buffer[] = [];

    for (let i = 0; i < userIds.length; i++) {
      const refRec = await FileService.getFileBuffer(refRecNames[i]);
      if (!refRec) {
        return res.status(400).json({ error: "Missing reference recording" });
      }
      fileBuffers.push(refRec);
    }

    const meetingRec = req.file;
    if (!meetingRec) {
      return res.status(400).json({ error: "Missing meeting recording" });
    }

    const meetingRecBuffer = meetingRec.buffer;
    const audioBuffers = [...fileBuffers, meetingRecBuffer];
    const merged = await TranscriptionService.concatenateAudio(audioBuffers);

    const { transcription, diarization } =
      await TranscriptionService.transcribeAudio(merged, userIds.length);
    res.status(200).json({ transcription, diarization });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
