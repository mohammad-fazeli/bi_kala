import fs from "fs";

export function removeFiles(files: string[]) {
  for (const file of files) {
    try {
      fs.unlinkSync(`./${file}`);
    } catch {
      continue;
    }
  }
}
