import multer from "multer";
import dotenv from "dotenv";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
dotenv.config();

export const upload = multer({ storage: multer.memoryStorage() });

const client = new S3Client({});

// Upload file to AWS S3
export const uploadFile = async (file: Express.Multer.File): Promise<void> => {
  if (!file || !file.buffer) {
    throw new Error("No file content");
  }

  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
  });

  try {
    await client.send(uploadCommand);
  } catch (error: any) {
    throw new Error("Cannot upload file");
  }
};

// Get file buffer from AWS S3
export const getFileBuffer = async (filename: string): Promise<Buffer> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
  });

  const response = await client.send(command);
  if (!response.Body) {
    throw new Error("Cannot get file");
  }
  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
};
