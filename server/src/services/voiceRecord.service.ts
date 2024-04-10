import { VoiceRecord } from "@prisma/client";
import { db } from "../db/db.connection";

// CRUD OPERATIONS

// Returns a list of all voice records
export const getAllVoiceRecords = async (): Promise<VoiceRecord[]> => {
  return db.voiceRecord.findMany();
};

// Returns a single voice record by ID
export const getVoiceRecordById = async (
  id: number
): Promise<VoiceRecord | null> => {
  return db.voiceRecord.findUnique({
    where: {
      id,
    },
  });
};

// Create a new voice record
export const createVoiceRecord = async (
  data: Omit<VoiceRecord, "id">
): Promise<VoiceRecord> => {
  return db.voiceRecord.create({
    data,
  });
};

// Update a voice record by ID
export const updateVoiceRecord = async (
  id: number,
  data: VoiceRecord
): Promise<VoiceRecord> => {
  return db.voiceRecord.update({
    where: {
      id,
    },
    data,
  });
};

// Delete a voice record by ID
export const deleteVoiceRecord = async (id: number): Promise<VoiceRecord> => {
  return db.voiceRecord.delete({
    where: {
      id,
    },
  });
};
