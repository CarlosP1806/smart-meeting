import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET;

interface IPayload {
  username: string;
  email: string;
  id: number;
}

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, SECRET as string) as IPayload;
    req.userId = payload.id;
  } catch (error: any) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

export const signToken = ({ username, email, id }: IPayload) => {
  const payload = { username, email, id };
  return jwt.sign(payload, SECRET as string);
};
