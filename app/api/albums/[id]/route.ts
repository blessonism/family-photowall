import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/admin/auth";
import { readJsonFile, writeJsonFile } from "@/lib/admin/json-store";

export const runtime = "nodejs";

const FILE = "data/albums.json";

interface Photo { src: string; caption: string; memberIds?: string[] }
interface Album { id: string; title: string; date: string; category: string; cover: string; photos: Photo[] }

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
  const body = await request.json();
  const data = await readJsonFile<{ albums: Album[] }>(FILE);
  const idx = data.albums.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "相册不存在" }, { status: 404 });

  const existing = data.albums[idx];
  data.albums[idx] = {
    ...existing,
    title: String(body.title ?? existing.title),
    date: String(body.date ?? existing.date),
    category: String(body.category ?? existing.category),
    cover: String(body.cover ?? existing.cover),
    photos: Array.isArray(body.photos)
      ? body.photos.map((p: unknown) => ({
          src: String((p as Record<string, unknown>)?.src || ""),
          caption: String((p as Record<string, unknown>)?.caption || ""),
          ...(Array.isArray((p as Record<string, unknown>)?.memberIds) ? { memberIds: ((p as Record<string, unknown>).memberIds as unknown[]).map(String) } : {}),
        }))
      : existing.photos,
  };

  await writeJsonFile(FILE, data);
  return NextResponse.json(data.albums[idx]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  if (!auth(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { id } = await params;
  const data = await readJsonFile<{ albums: Album[] }>(FILE);
  const idx = data.albums.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "相册不存在" }, { status: 404 });

  data.albums.splice(idx, 1);
  await writeJsonFile(FILE, data);
  return NextResponse.json({ success: true });
}
