// 관리자 페이지 수치 설명 (vite 플러그인, 가상 모듈 "virtual:balance-docs"): 공용 코드(packages/shared/src)의 수치 표를 읽어
// 값 바로 위 /** 설명 */ 이나 같은 줄 // 설명을 모아 { 표 이름: { "값.경로": "설명" } } 로 만듦. 코드 주석이 곧 관리자 설명이 되어 따로 적지 않아도 됨
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ID = "virtual:balance-docs";
const ROOT = new URL("../../packages/shared/src/", import.meta.url).pathname;

function files(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return files(p);
    return f.endsWith(".ts") && !f.endsWith(".test.ts") ? [p] : [];
  });
}

const clean = (t) =>
  t
    .replace(/^\/\*\*?|\*\/$/g, "")
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim())
    .filter(Boolean)
    .join(" ")
    .trim();

/** 한 설명이 여러 값을 묶어 말할 때 ("값: 강화 · 교체 · 튜닝" → 값 셋): 낱말 수가 값 수와 같으면 하나씩 나눠 줌 */
function flush(table, group) {
  if (!group) return;
  const colon = group.doc.lastIndexOf(":");
  const head = colon >= 0 ? group.doc.slice(0, colon).trim() : "";
  const body = colon >= 0 ? group.doc.slice(colon + 1) : group.doc;
  let parts = body.split(" · ").map((x) => x.trim());
  if (parts.length !== group.keys.length) parts = body.split(/\s*·\s*/).map((x) => x.trim());
  group.keys.forEach((k, i) => {
    table[k] = group.keys.length > 1 && parts.length === group.keys.length ? (head ? `${parts[i]} (${head})` : parts[i]) : group.doc;
  });
}

/** 한 파일: 대문자 이름 표(또는 R 묶음 → export { R as 이름 })마다 값 설명 */
function parse(src, out) {
  const alias = /export\s*\{\s*R\s+as\s+([A-Z][A-Z0-9_]*)\s*\}/.exec(src)?.[1];
  const start = /(\/\*\*(?:(?!\*\/)[\s\S])*\*\/\s*)?(?:export\s+)?const\s+([A-Z][A-Z0-9_]*)\s*(?::[^=\n]+)?=\s*\{/g;
  let m;
  while ((m = start.exec(src))) {
    const name = m[2] === "R" ? alias : m[2];
    if (!name) continue;
    const table = (out[name] ??= {});
    if (m[1]) table[""] = clean(m[1].trim());
    const lines = src.slice(m.index + m[0].length).split("\n");
    const stack = [];
    let depth = 1;
    let pending = "";
    let inDoc = null;
    let group = null;
    for (const raw of lines) {
      const line = raw.trim();
      if (inDoc !== null) {
        inDoc += "\n" + line;
        if (line.includes("*/")) {
          pending = clean(inDoc);
          inDoc = null;
        }
        continue;
      }
      if (line.startsWith("/**") || line.startsWith("/*")) {
        if (line.includes("*/")) pending = clean(line);
        else inDoc = line;
        continue;
      }
      if (line.startsWith("//")) {
        pending = line.replace(/^\/\/\s*/, "");
        continue;
      }
      const key = /^(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:\s*(.*)$/.exec(line);
      const code = line.replace(/\/\/.*$/, "").replace(/"[^"]*"/g, '""');
      if (key && depth >= 1) {
        const k = key[1] ?? key[2];
        const rest = key[3];
        const trail = /\/\/\s*(.+)$/.exec(rest)?.[1] ?? /\/\*\*?(.*?)\*\//.exec(rest)?.[1];
        // 한 줄에 값이 여럿 (a: 1, b: 2): 같은 설명 묶음
        const more = /[{[]/.test(code) ? [] : [...code.slice(code.indexOf(":") + 1).matchAll(/,\s*([A-Za-z_$][\w$]*)\s*:/g)].map((x) => x[1]);
        const paths = [k, ...more].map((x) => [...stack, x].join("."));
        if (trail) {
          flush(table, group);
          group = null;
          for (const path of paths) table[path] = trail.trim();
        } else if (pending) {
          flush(table, group);
          group = { doc: pending.trim(), keys: paths, depth };
        } else if (group && group.depth === depth) group.keys.push(...paths);
        pending = "";
        const opens = (code.match(/[{[]/g) ?? []).length;
        const closes = (code.match(/[}\]]/g) ?? []).length;
        if (opens > closes) {
          stack.push(k);
          flush(table, group);
          group = null;
        }
        depth += opens - closes;
      } else {
        const opens = (code.match(/[{[]/g) ?? []).length;
        const closes = (code.match(/[}\]]/g) ?? []).length;
        depth += opens - closes;
        if (closes > opens) {
          flush(table, group);
          group = null;
        }
        for (let i = 0; i < closes - opens && stack.length; i++) stack.pop();
        if (code) pending = "";
      }
      if (depth <= 0) break;
    }
    flush(table, group);
  }
}

export function balanceDocs() {
  return {
    name: "balance-docs",
    resolveId: (id) => (id === ID ? "\0" + ID : null),
    load(id) {
      if (id !== "\0" + ID) return null;
      const out = {};
      for (const f of files(ROOT)) {
        this.addWatchFile(f);
        parse(readFileSync(f, "utf8"), out);
      }
      for (const k of Object.keys(out)) if (!Object.keys(out[k]).length) delete out[k];
      return `export default ${JSON.stringify(out)};`;
    },
  };
}
