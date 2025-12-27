import fs from "fs";

export function loadJSON<T>(path: string): T {
  if (!fs.existsSync(path)) return [] as T;
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

export function saveJSON<T>(path: string, data: T): void {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
