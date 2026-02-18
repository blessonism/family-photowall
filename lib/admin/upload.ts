import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_SIZE = 2 * 1024 * 1024;
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const ALLOWED_DIRS = new Set(["members", "gallery", "history"]);

export class UploadError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const NAME_EXT: Record<string, string> = {
  ".jpg": "jpg",
  ".jpeg": "jpg",
  ".png": "png",
  ".webp": "webp",
};

export async function saveUploadedFile(
  file: File,
  targetDir: string,
  prefix: string,
): Promise<string> {
  let ext = MIME_EXT[file.type];
  if (!ext && file.name) {
    const fileExt = path.extname(file.name).toLowerCase();
    ext = NAME_EXT[fileExt] ?? "";
  }
  if (!ext) throw new UploadError("仅支持 JPG、PNG、WebP 格式");
  if (file.size <= 0) throw new UploadError("文件不能为空");
  if (file.size > MAX_SIZE) throw new UploadError("文件大小不能超过 2MB");

  const dir = targetDir.trim().replace(/^\/+|\/+$/g, "");
  if (!ALLOWED_DIRS.has(dir)) throw new UploadError("不支持的上传目录");

  const safePrefix = prefix.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "file";
  const fileName = `${safePrefix}-${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;

  const absDir = path.join(process.cwd(), "public", "images", dir);
  await mkdir(absDir, { recursive: true });
  await writeFile(path.join(absDir, fileName), Buffer.from(await file.arrayBuffer()));

  return `/images/${dir}/${fileName}`;
}
