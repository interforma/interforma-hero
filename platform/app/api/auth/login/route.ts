import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const USERS: Record<string, { password: string; name: string; role: string }> = {
  "sergio@interforma.digital": { password: "Interforma2026!", name: "Sergio", role: "admin" },
  "carla@interforma.digital": { password: "Carla2026!", name: "Carla Munoz", role: "agent" },
  "matias@interforma.digital": { password: "Matias2026!", name: "Matias Lopez", role: "agent" },
};

function getSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret");
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = USERS[email];

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Credenciales invalidas" }, { status: 401 });
  }

  const token = await new SignJWT({ email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(getSecret());

  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  });
  return res;
}
