// 피해 출처 4차: 패시브가 켜는 공격 구간을 문법 분석(TypeScript)으로 찾아 srcRun으로 감쌈
// node scripts/dev/tag-dmg-src2.cjs [건너뛸 "파일:줄" 목록 json]  (저장소 맨 위에서 실행)
// 감싸는 곳: `if (…hasPerk(p, "X")… && …) 문장` 의 then 쪽 (조건이 &&로만 이어진 긍정 검사일 때)
//   · 안에 return·yield·await·바깥으로 나가는 break/continue가 없을 것 · 안에서 피해를 줄 수 있는 함수를 부를 것
//   · 둘러싼 함수에 RunState 매개변수가 있을 것 · 이미 srcRun 안이면(같은 id) 건너뜀
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "../../packages/shared/src/sim");
const MAXB = 14 * 1024;
const MAXL = 300;
const skip = new Set(process.argv[2] && fs.existsSync(process.argv[2]) ? JSON.parse(fs.readFileSync(process.argv[2], "utf8")) : []);
const ids = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, "passive-ids.json"), "utf8")));
const CHECK = /^(hasPerk|has[A-Z]\w*|has|perk|stacks|stk|count)$/;

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((x) => (x.isDirectory() ? walk(path.join(d, x.name)) : [path.join(d, x.name)]));
const files = walk(ROOT).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && !/TestUtil|dmgSrc\.ts$/.test(f));
const srcs = new Map(files.map((f) => [f, ts.createSourceFile(f, fs.readFileSync(f, "utf8"), ts.ScriptTarget.Latest, true)]));

// 피해를 줄 수 있는 함수 이름 (이름으로만 이어 봄, 모든 파일 합쳐서)
const BASE = new Set(["damageEnemy", "damageEnemyLite", "blastAt", "dotDamage", "statusHit", "logDmg", "srcFn"]);
const LISTS = new Set(fs.readFileSync(path.join(ROOT, "dmgSrc.ts"), "utf8").match(/const LISTS = "([^"]+)"/)[1].split(" "));
const bodies = new Map();
const addBody = (name, node) => name && node && (bodies.get(name) ?? bodies.set(name, []).get(name)).push(node);
for (const sf of srcs.values()) {
  const visit = (n) => {
    if (ts.isFunctionDeclaration(n) && n.name) addBody(n.name.text, n.body);
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) addBody(n.name.text, n.initializer);
    if ((ts.isMethodDeclaration(n) || ts.isPropertyAssignment(n)) && n.name && ts.isIdentifier(n.name)) addBody(n.name.text, n.initializer ?? n.body);
    ts.forEachChild(n, visit);
  };
  visit(sf);
}
const BUILTIN = new Set("map filter forEach some every find findIndex findLast reduce push pop shift unshift splice slice concat includes indexOf sort min max abs floor round ceil sqrt hypot atan2 sin cos sign trunc get set has add delete keys values entries fill from join flatMap at random".split(" "));
const calleeName = (c) => (ts.isIdentifier(c.expression) ? c.expression.text : ts.isPropertyAccessExpression(c.expression) && !BUILTIN.has(c.expression.name.text) ? c.expression.name.text : null);
const pushTarget = (c) => {
  if (!ts.isPropertyAccessExpression(c.expression) || c.expression.name.text !== "push") return null;
  let t = c.expression.expression;
  while (ts.isParenthesizedExpression(t) || ts.isNonNullExpression(t)) t = t.expression;
  if (ts.isBinaryExpression(t)) t = t.left;
  return ts.isPropertyAccessExpression(t) ? t.name.text : null;
};
function directHarm(node, dmg) {
  let hit = false;
  const v = (n) => {
    if (hit) return;
    if (ts.isCallExpression(n)) {
      const nm = calleeName(n);
      const pt = pushTarget(n);
      if ((nm && dmg.has(nm)) || (pt && (pt === "projectiles" || pt === "pendingBlasts" || LISTS.has(pt)))) return void (hit = true);
      // 공격을 예약하는 push: 넣는 것에 dmg·mul·damage가 있음
      if (ts.isPropertyAccessExpression(n.expression) && n.expression.name.text === "push" && n.arguments.some((a) => ts.isObjectLiteralExpression(a) && a.properties.some((q) => q.name && /^(dmg|mul|damage)$/.test(q.name.getText())))) return void (hit = true);
    }
    ts.forEachChild(n, v);
  };
  v(node);
  return hit;
}
const dmg = new Set(BASE);
for (let changed = true; changed; ) {
  changed = false;
  for (const [name, list] of bodies) if (!dmg.has(name) && list.some((b) => directHarm(b, dmg))) {
      dmg.add(name);
      changed = true;
    }
}

// 조건에서 패시브 id 찾기: &&·괄호로만 이어진 긍정 검사
function perkOf(cond) {
  let found = null;
  const v = (n) => {
    if (found) return;
    if (ts.isParenthesizedExpression(n)) return v(n.expression);
    if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) return v(n.left), v(n.right);
    if (ts.isBinaryExpression(n) && /^[<>]=?$|^>$/.test(n.operatorToken.getText()) && ts.isCallExpression(n.left)) return v(n.left);
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && CHECK.test(n.expression.text) && n.arguments.length >= 2) {
      const a = n.arguments[1];
      if (ts.isStringLiteral(a) && ids.has(a.text)) found = a.text;
    }
  };
  v(cond);
  return found;
}
const isFn = (n) => ts.isFunctionLike(n);
function escapes(stmt) {
  let bad = false;
  const v = (n, loop, sw) => {
    if (bad) return;
    if (n !== stmt && isFn(n)) return;
    if (ts.isReturnStatement(n) || ts.isYieldExpression(n) || ts.isAwaitExpression(n)) return void (bad = true);
    if (ts.isBreakStatement(n)) {
      if (n.label || !(loop || sw)) bad = true;
      return;
    }
    if (ts.isContinueStatement(n)) {
      if (n.label || !loop) bad = true;
      return;
    }
    const isLoop = ts.isIterationStatement(n, false);
    const isSw = ts.isSwitchStatement(n);
    ts.forEachChild(n, (c) => v(c, loop || isLoop, sw || isSw));
  };
  v(stmt, false, false);
  return bad;
}
function runVar(n) {
  for (let f = n.parent; f; f = f.parent) {
    if (!isFn(f)) continue;
    for (const prm of f.parameters ?? []) if (prm.type && /^RunState$/.test(prm.type.getText()) && ts.isIdentifier(prm.name)) return prm.name.text;
  }
  return null;
}
function insideSrcRun(n, id) {
  for (let f = n.parent; f; f = f.parent) {
    if (ts.isCallExpression(f) && ts.isIdentifier(f.expression) && f.expression.text === "srcRun") {
      const a = f.arguments[1];
      if (a && ts.isStringLiteral(a) && a.text === id) return true;
    }
  }
  return false;
}

const report = { files: 0, sites: 0, perks: new Set(), tooBig: [] };
for (const [file, sf] of srcs) {
  const text = sf.getFullText();
  const edits = [];
  const v = (n) => {
    if (ts.isIfStatement(n)) {
      const id = perkOf(n.expression);
      const st = n.thenStatement;
      const rel = path.relative(ROOT, file);
      const line = sf.getLineAndCharacterOfPosition(n.getStart()).line + 1;
      const already = /^srcRun\(|^\{\s*srcRun\(/.test(st.getText());
      const sv = id && !already && !skip.has(`${rel}:${line}`) ? runVar(n) : null;
      if (process.env.DBG && id && !already) console.error(`${rel}:${line} ${id} sv=${!!sv} esc=${escapes(st)} harm=${directHarm(st, dmg)}`);
      // 맨 끝이 그냥 return; 인 블록: return srcRun(…) 으로 (나머지에 빠져나가는 곳이 없을 때)
      const last = ts.isBlock(st) && st.statements.at(-1);
      const tailRet = last && ts.isReturnStatement(last) && !last.expression && !n.elseStatement;
      if (sv && tailRet && !insideSrcRun(n, id) && st.statements.slice(0, -1).every((x) => !escapes(x)) && directHarm(st, dmg)) {
        edits.push({ id, sv, st, tail: last });
        return;
      }
      if (sv && !insideSrcRun(n, id) && !escapes(st) && directHarm(st, dmg)) {
        edits.push({ id, sv, st, hasElse: !!n.elseStatement });
        return ts.forEachChild(n.elseStatement ?? n, () => {}) || (n.elseStatement && v(n.elseStatement));
      }
    }
    ts.forEachChild(n, v);
  };
  v(sf);
  if (!edits.length) continue;
  let out = text;
  for (const e of edits.sort((a, b) => b.st.getStart() - a.st.getStart())) {
    const a = e.st.getStart();
    const b = e.st.getEnd();
    if (e.tail) {
      const ind = (out.slice(0, a).match(/\n([ \t]*)[^\n]*$/) ?? ["", ""])[1];
      const inner = out.slice(a + 1, e.tail.getStart()).replace(/\s+$/, "");
      out = `${out.slice(0, a)}return srcRun(${e.sv}, "${e.id}", () => {${inner}\n${ind}});${out.slice(b)}`;
      continue;
    }
    const ind = (out.slice(0, a).match(/\n([ \t]*)[^\n]*$/) ?? ["", ""])[1];
    const one = out.slice(a, b);
    const body = ts.isBlock(e.st) ? one : one.includes("\n") ? `{\n${ind}  ${one}\n${ind}}` : `{ ${one} }`;
    out = `${out.slice(0, a)}srcRun(${e.sv}, "${e.id}", () => ${body});${out.slice(b)}`;
  }
  if (!/import \{[^}]*\bsrcRun\b[^}]*\} from "\.\/dmgSrc"/.test(out)) {
    if (/import \{([^}]*)\} from "\.\/dmgSrc";/.test(out)) out = out.replace(/import \{([^}]*)\} from "\.\/dmgSrc";/, (m, g) => `import {${g.trimEnd()}, srcRun } from "./dmgSrc";`);
    else {
      const m = out.match(/^(?:\/\/.*\n)*/);
      out = `${m[0]}import { srcRun } from "./dmgSrc";\n${out.slice(m[0].length)}`;
    }
  }
  const rel = path.relative(ROOT, file);
  if (Buffer.byteLength(out) > MAXB || out.split("\n").length > MAXL) {
    report.tooBig.push(`${rel} (${edits.map((e) => e.id).join(",")})`);
    continue;
  }
  fs.writeFileSync(file, out);
  report.files++;
  report.sites += edits.length;
  edits.forEach((e) => report.perks.add(e.id));
}
console.log(`files ${report.files} · sites ${report.sites} · perks ${report.perks.size}`);
if (report.tooBig.length) console.log("too big:\n  " + report.tooBig.join("\n  "));
