import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/admin/auth";
import { readJsonFile, writeJsonFile } from "@/lib/admin/json-store";

export const runtime = "nodejs";

const FILE = "data/history.json";

interface HistoryEvent { year: number; title: string; description: string; image: string }

function auth(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && verifySession(token);
}

export async function GET(): Promise<NextResponse> {
  const data = await readJsonFile<{ events: HistoryEvent[] }>(FILE);
  return NextResponse.json(data.events);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!auth(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const body = await request.json();
  const { year, title, description, image } = body as Record<string, unknown>;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
  }
  if (!year || !Number.isInteger(Number(year))) {
    return NextResponse.json({ error: "年份不合法" }, { status: 400 });
  }

  const data = await readJsonFile<{ events: HistoryEvent[] }>(FILE);
  const event: HistoryEvent = {
    year: Number(year),
    title: String(title),
    description: String(description || ""),
    image: String(image || "/images/history/placeholder.svg"),
  };

  data.events.push(event);
  data.events.sort((a, b) => a.year - b.year);
  await writeJsonFile(FILE, data);
  return NextResponse.json(event, { status: 201 });
}
