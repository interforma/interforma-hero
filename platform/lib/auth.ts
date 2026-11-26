import { cookies } from "next/headers";
import { jwtVerify } from "jose";

function getSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret");
}

export interface SessionUser {
  email: string;
  name: string;
  role: string;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}
