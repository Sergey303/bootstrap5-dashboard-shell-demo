import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");
if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html not found");
}

const html = fs.readFileSync(indexPath, "utf8");
const forbidden = [
  /src="\/assets\//,
  /href="\/assets\//,
  /src="\.\/assets\//,
  /href="\.\/assets\//,
  /<script[^>]+src=/,
  /<link[^>]+rel="stylesheet"/
];

for (const pattern of forbidden) {
  if (pattern.test(html)) {
    throw new Error(`Not single-file. Matched: ${pattern}`);
  }
}

const extra = fs.readdirSync(distDir).filter((name) => name !== "index.html");
if (extra.length > 0) {
  throw new Error(`dist contains extra entries: ${extra.join(", ")}`);
}

console.log("OK: dist/index.html is single-file");
