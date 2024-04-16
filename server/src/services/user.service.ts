import { User } from "@prisma/client";
import { db } from "../db/db.connection";

// CRUD OPERATIONS

// Returns a list of all users
export const getAllUsers = async (): Promise<User[]> => {
  return db.user.findMany();
};

// Returns a single user by ID
export const getUserById = async (id: number): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      id,
    },
  });
};

// Create a new user
export const createUser = async (data: Omit<User, "id">): Promise<User> => {
  return db.user.create({
    data,
  });
};

// Update a user by ID
export const updateUser = async (id: number, data: User): Promise<User> => {
  return db.user.update({
    where: {
      id,
    },
    data,
  });
};

// Delete a user by ID
export const deleteUser = async (id: number): Promise<User> => {
  return db.user.delete({
    where: {
      id,
    },
  });
};

// ADDITIONAL OPERATIONS
export const findByName = async (username: string): Promise<User | null> => {
  return db.user.findFirst({
    where: {
      username,
    },
  });
};
