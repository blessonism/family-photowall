import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/admin/auth";
import { readJsonFile, writeJsonFile } from "@/lib/admin/json-store";

export const runtime = "nodejs";

const FILE = "data/members.json";

interface MemberTimeline { year: number; event: string }
interface Member {
  id: string;
  name: string;
  generation: number;
  branch: string;
  title: string;
  bio: string;
  photo: string;
  birthYear: number;
  highlights: string[];
  parentId: string | null;
  spouseId: string | null;
  childrenIds: string[];
  gender: "M" | "F";
  timeline: MemberTimeline[];
}

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
  const data = await readJsonFile<{ members: Member[] }>(FILE);
  const idx = data.members.findIndex((m) => m.id === id);
  if (idx === -1) return NextResponse.json({ error: "成员不存在" }, { status: 404 });

  const existing = data.members[idx];
  data.members[idx] = {
    ...existing,
    name: String(body.name ?? existing.name),
    generation: body.generation !== undefined ? Number(body.generation) : existing.generation,
    branch: String(body.branch ?? existing.branch),
    title: String(body.title ?? existing.title),
    bio: String(body.bio ?? existing.bio),
    photo: String(body.photo ?? existing.photo),
    birthYear: body.birthYear !== undefined ? Number(body.birthYear) : existing.birthYear,
    highlights: Array.isArray(body.highlights) ? body.highlights.map(String) : existing.highlights,
    parentId: body.parentId !== undefined ? (typeof body.parentId === "string" ? body.parentId : null) : existing.parentId,
    spouseId: body.spouseId !== undefined ? (typeof body.spouseId === "string" ? body.spouseId : null) : existing.spouseId,
    childrenIds: Array.isArray(body.childrenIds) ? body.childrenIds.map(String) : existing.childrenIds,
    gender: body.gender !== undefined ? (body.gender === "F" ? "F" : "M") : existing.gender,
    timeline: Array.isArray(body.timeline) ? body.timeline.map((t: unknown) => ({
      year: Number((t as Record<string, unknown>)?.year || 0),
      event: String((t as Record<string, unknown>)?.event || ""),
    })) : existing.timeline,
  };

  await writeJsonFile(FILE, data);
  return NextResponse.json(data.members[idx]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  if (!auth(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { id } = await params;
  const data = await readJsonFile<{ members: Member[] }>(FILE);
  const idx = data.members.findIndex((m) => m.id === id);
  if (idx === -1) return NextResponse.json({ error: "成员不存在" }, { status: 404 });

  data.members.splice(idx, 1);
  await writeJsonFile(FILE, data);
  return NextResponse.json({ success: true });
}
