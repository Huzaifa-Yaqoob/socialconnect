import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export async function getSession() {
  const cokiesStorage = await cookies();
  const token = cokiesStorage.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded;
  } catch {
    return null;
  }
}
