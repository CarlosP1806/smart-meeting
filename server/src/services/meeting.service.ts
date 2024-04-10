import { Meeting } from "@prisma/client";
import { db } from "../db/db.connection";

export type MeetingWithUsers = Meeting & {
  users: {
    accepted: boolean;
    userId: number;
    meetingId: number;
  }[];
};

// CRUD OPERATIONS

// Returns a list of all meetings
export const getAllMeetings = async (): Promise<Meeting[]> => {
  return db.meeting.findMany();
};

// Returns a single meeting by ID
export const getMeetingById = async (
  id: number
): Promise<MeetingWithUsers | null> => {
  return db.meeting.findUnique({
    where: {
      id,
    },
    include: {
      users: true,
    },
  });
};

// Create a new meeting
export const createMeeting = async (
  meetingData: Omit<Meeting, "id">,
  userIds: number[]
): Promise<Meeting> => {
  const usersData = userIds.map((id) => {
    return {
      accepted: id === meetingData.ownerId,
      user: {
        connect: {
          id,
        },
      },
    };
  });

  return db.meeting.create({
    data: {
      ...meetingData,
      users: {
        create: usersData,
      },
    },
  });
};

// Update a meeting by ID
export const updateMeeting = async (
  id: number,
  data: Meeting
): Promise<Meeting> => {
  return db.meeting.update({
    where: {
      id,
    },
    data,
  });
};

// Delete a meeting by ID
export const deleteMeeting = async (id: number): Promise<Meeting> => {
  return db.meeting.delete({
    where: {
      id,
    },
  });
};

// ADDITIONAL OPERATIONS

// Accept an invite to a meeting
export const acceptInvite = async (
  meetingId: number,
  userId: number
): Promise<Meeting> => {
  return db.meeting.update({
    where: {
      id: meetingId,
    },
    data: {
      users: {
        update: {
          where: {
            userId_meetingId: {
              userId,
              meetingId,
            },
          },
          data: {
            accepted: true,
          },
        },
      },
    },
  });
};
