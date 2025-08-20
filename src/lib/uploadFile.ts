"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Config } from "@/lib/s3Config";

export async function uploadImageAction(file: File) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucketName = "mybucket"; // must already exist in MinIO
    const fileName = `${Date.now()}-${file.name}`;

    await S3Config.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return {
      success: true,
      url: `${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`, // public URL if bucket is public
    };
  } catch (error: any) {
    console.error("Upload failed:", error);
    return { success: false, error: error.message };
  }
}
