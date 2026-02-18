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

export async function GET(): Promise<NextResponse> {
  const data = await readJsonFile<{ albums: Album[] }>(FILE);
  return NextResponse.json(data.albums);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!auth(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const body = await request.json();
  const { title, date, category, cover, photos } = body as Record<string, unknown>;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
  }

  const data = await readJsonFile<{ albums: Album[] }>(FILE);
  const id = String(title).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "") || `album-${Date.now()}`;

  const album: Album = {
    id,
    title: String(title),
    date: String(date || new Date().toISOString().slice(0, 10)),
    category: String(category || "其他"),
    cover: String(cover || "/images/gallery/placeholder.svg"),
    photos: Array.isArray(photos)
      ? photos.map((p: unknown) => ({
          src: String((p as Record<string, unknown>)?.src || ""),
          caption: String((p as Record<string, unknown>)?.caption || ""),
          ...(Array.isArray((p as Record<string, unknown>)?.memberIds) ? { memberIds: ((p as Record<string, unknown>).memberIds as unknown[]).map(String) } : {}),
        }))
      : [],
  };

  data.albums.push(album);
  await writeJsonFile(FILE, data);
  return NextResponse.json(album, { status: 201 });
}
