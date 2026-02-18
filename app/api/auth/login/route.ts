import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, createSession, verifyPassword, SESSION_MAX_AGE } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体必须为 JSON" }, { status: 400 });
  }

  const password = typeof (body as Record<string, unknown>)?.password === "string"
    ? (body as { password: string }).password : "";

  if (!password.trim()) {
    return NextResponse.json({ error: "密码不能为空" }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  const token = createSession();
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
