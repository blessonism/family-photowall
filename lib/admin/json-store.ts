import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";

function resolve(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(resolve(filePath), "utf-8");
  return JSON.parse(content) as T;
}

export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  const abs = resolve(filePath);
  await mkdir(path.dirname(abs), { recursive: true });
  const tmp = `${abs}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
  await rename(tmp, abs);
}
