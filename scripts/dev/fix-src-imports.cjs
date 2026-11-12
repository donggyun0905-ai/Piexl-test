// sim 파일마다 dmgSrc 도우미(srcRun·srcEach·srcCb·srcAs·srcFn) 가져오기를 실제로 쓰는 것에 맞춤 (더하고 빼기)
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "../../packages/shared/src/sim");
const NAMES = ["srcRun", "srcEach", "srcCb", "srcAs", "srcFn", "srcOpt", "srcTag", "muteDot", "logDmg"];
for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith(".ts") || f === "dmgSrc.ts") continue;
  const file = path.join(ROOT, f);
  let s = fs.readFileSync(file, "utf8");
  const re = /import \{([^}]*)\} from "\.\/dmgSrc";\n?/;
  const m = s.match(re);
  const body = m ? s.replace(re, "") : s;
  const used = NAMES.filter((n) => new RegExp(`\\b${n}\\(|\\b${n}<`).test(body.replace(/\/\/.*$/gm, "")));
  const had = m ? m[1].split(",").map((x) => x.trim()).filter(Boolean) : [];
  const keep = had.filter((x) => !NAMES.includes(x.replace(/^type /, "")) || used.includes(x));
  const want = [...new Set([...keep, ...used])].sort();
  if (m && want.join() === had.slice().sort().join()) continue;
  if (!m && !want.length) continue;
  const line = want.length ? `import { ${want.join(", ")} } from "./dmgSrc";\n` : "";
  if (m) s = s.replace(re, line);
  else {
    const h = s.match(/^(?:\/\/.*\n)*/)[0];
    s = h + line + s.slice(h.length);
  }
  fs.writeFileSync(file, s);
  console.log(f, want.join(","));
}
