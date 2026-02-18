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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  if (!auth(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { id } = await params;
  const yearId = Number(id);
  const body = await request.json();
  const data = await readJsonFile<{ events: HistoryEvent[] }>(FILE);
  const idx = data.events.findIndex((e) => e.year === yearId);
  if (idx === -1) return NextResponse.json({ error: "事件不存在" }, { status: 404 });

  const existing = data.events[idx];
  data.events[idx] = {
    year: body.year !== undefined ? Number(body.year) : existing.year,
    title: String(body.title ?? existing.title),
    description: String(body.description ?? existing.description),
    image: String(body.image ?? existing.image),
  };

  data.events.sort((a, b) => a.year - b.year);
  await writeJsonFile(FILE, data);
  return NextResponse.json(data.events.find((e) => e.year === (body.year !== undefined ? Number(body.year) : yearId)));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  if (!auth(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { id } = await params;
  const yearId = Number(id);
  const data = await readJsonFile<{ events: HistoryEvent[] }>(FILE);
  const idx = data.events.findIndex((e) => e.year === yearId);
  if (idx === -1) return NextResponse.json({ error: "事件不存在" }, { status: 404 });

  data.events.splice(idx, 1);
  await writeJsonFile(FILE, data);
  return NextResponse.json({ success: true });
}
