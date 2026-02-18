import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/admin/auth";
import { UploadError, saveUploadedFile } from "@/lib/admin/upload";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const targetDir = form.get("targetDir");
    const prefix = form.get("prefix");

    if (!file || typeof file === "string" || typeof (file as Blob).arrayBuffer !== "function") {
      return NextResponse.json({ error: "file 字段缺失或类型错误" }, { status: 400 });
    }
    if (typeof targetDir !== "string" || !targetDir.trim()) {
      return NextResponse.json({ error: "targetDir 字段缺失" }, { status: 400 });
    }

    const blob = file as File;
    const url = await saveUploadedFile(blob, targetDir, typeof prefix === "string" ? prefix : "upload");
    return NextResponse.json({ url }, { status: 201 });
  } catch (e) {
    if (e instanceof UploadError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[upload] unexpected error:", e);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
