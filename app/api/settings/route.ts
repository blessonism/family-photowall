import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/admin/auth";
import { readJsonFile, writeJsonFile } from "@/lib/admin/json-store";

export const runtime = "nodejs";

const FILE = "data/site.json";

interface SiteConfig {
  title: string;
  familyName: string;
  slogan: string;
  description: string;
  nav: { label: string; href: string }[];
  footer: { copyright: string; message: string };
}

function auth(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && verifySession(token);
}

export async function GET(): Promise<NextResponse> {
  const data = await readJsonFile<SiteConfig>(FILE);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  if (!auth(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const body = await request.json();
  const current = await readJsonFile<SiteConfig>(FILE);

  const updated: SiteConfig = {
    title: String(body.title ?? current.title),
    familyName: String(body.familyName ?? current.familyName),
    slogan: String(body.slogan ?? current.slogan),
    description: String(body.description ?? current.description),
    nav: Array.isArray(body.nav) ? body.nav.map((n: unknown) => ({
      label: String((n as Record<string, unknown>)?.label || ""),
      href: String((n as Record<string, unknown>)?.href || ""),
    })) : current.nav,
    footer: {
      copyright: String(body.footer?.copyright ?? current.footer.copyright),
      message: String(body.footer?.message ?? current.footer.message),
    },
  };

  await writeJsonFile(FILE, updated);
  return NextResponse.json(updated);
}
