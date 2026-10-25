// 파일 크기 검사: 코드 파일이 너무 커지면 실패 (수정할 때 읽는 양을 줄이려고). 규칙은 CLAUDE.md '수정 규칙'
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_LINES = 300;
const MAX_BYTES = 14 * 1024;
const ROOTS = ["apps/client/src", "apps/server/src", "packages/shared/src"];
const EXT = /\.(ts|tsx|css)$/;

const bad = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.test(name)) {
      const text = readFileSync(p, "utf8");
      const lines = text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
      const bytes = Buffer.byteLength(text);
      if (lines > MAX_LINES || bytes > MAX_BYTES) bad.push(`${p}: ${lines}줄 ${(bytes / 1024).toFixed(1)}KB`);
    }
  }
};
for (const r of ROOTS) walk(r);
if (bad.length > 0) {
  console.error(`파일이 너무 큽니다 (최대 ${MAX_LINES}줄·${MAX_BYTES / 1024}KB). 역할별로 나눠 주세요:\n${bad.join("\n")}`);
  process.exit(1);
}
console.log("파일 크기 OK");
