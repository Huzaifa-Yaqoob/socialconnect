import { S3Client } from "@aws-sdk/client-s3";

export const S3Config = new S3Client({
  region: "us-east-1", // MinIO doesn’t care, but required by AWS SDK
  endpoint: "http://127.0.0.1:9000", // MinIO endpoint
  forcePathStyle: true, // IMPORTANT for MinIO
  credentials: {
    accessKeyId: process.env.S3_KEY || "minioadmin",
    secretAccessKey: process.env.S3_SECRET || "minioadmin",
  },
});
