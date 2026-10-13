import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

console.log("dist removed");
