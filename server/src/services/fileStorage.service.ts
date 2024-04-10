import multer from "multer";
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();

export const upload = multer({ storage: multer.memoryStorage() });
const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET as string);

// Upload file to GCP via streams
export const uploadFile = async (file: Express.Multer.File): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      reject("No file content");
      return;
    }

    const blob = bucket.file(file.originalname);
    const stream = blob.createWriteStream();

    stream.on("error", reject);
    stream.on("finish", () => {
      resolve();
    });
    stream.end(file.buffer);
  });
};

// Get file buffer from GCP
export const getFileBuffer = async (filename: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    const stream = bucket.file(filename).createReadStream();

    stream.on("data", (chunk: Uint8Array) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on("error", reject);
  });
};
