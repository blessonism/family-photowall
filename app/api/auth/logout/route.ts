import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set({ name: COOKIE_NAME, value: "", httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
