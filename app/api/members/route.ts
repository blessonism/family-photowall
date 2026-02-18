import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/admin/auth";
import { readJsonFile, writeJsonFile } from "@/lib/admin/json-store";
import { randomBytes } from "crypto";

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

export async function GET(): Promise<NextResponse> {
  const data = await readJsonFile<{ members: Member[] }>(FILE);
  return NextResponse.json(data.members);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!auth(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const body = await request.json();
  const { name, generation, branch, title, bio, photo, birthYear, highlights, parentId, spouseId, childrenIds, gender, timeline } = body as Record<string, unknown>;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "姓名不能为空" }, { status: 400 });
  }

  const data = await readJsonFile<{ members: Member[] }>(FILE);
  const id = randomBytes(4).toString("hex");
  const member: Member = {
    id,
    name: String(name),
    generation: Number(generation) || 1,
    branch: String(branch || "主家"),
    title: String(title || ""),
    bio: String(bio || ""),
    photo: String(photo || "/images/members/placeholder.svg"),
    birthYear: Number(birthYear) || new Date().getFullYear(),
    highlights: Array.isArray(highlights) ? highlights.map(String) : [],
    parentId: typeof parentId === "string" ? parentId : null,
    spouseId: typeof spouseId === "string" ? spouseId : null,
    childrenIds: Array.isArray(childrenIds) ? childrenIds.map(String) : [],
    gender: gender === "F" ? "F" : "M",
    timeline: Array.isArray(timeline) ? timeline.map((t: unknown) => ({
      year: Number((t as Record<string, unknown>)?.year || 0),
      event: String((t as Record<string, unknown>)?.event || ""),
    })) : [],
  };

  data.members.push(member);
  await writeJsonFile(FILE, data);
  return NextResponse.json(member, { status: 201 });
}
