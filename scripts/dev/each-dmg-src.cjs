// 피해 출처 4차: dmgSrc LISTS(소환물·예약 공격 목록)를 for…of로 도는 곳에 srcEach를 씌움 (만든 패시브가 출처가 되게)
// node scripts/dev/each-dmg-src.cjs  (저장소 맨 위에서 실행) · 이미 srcEach면 건너뜀 · p.목록 · s.player.목록 · 그것을 담은 지역 상수
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "../../packages/shared/src/sim");
const LISTS = new Set(fs.readFileSync(path.join(ROOT, "dmgSrc.ts"), "utf8").match(/const LISTS = "([^"]+)"/)[1].split(" "));
const listOf = (x) => {
  while (x && (ts.isParenthesizedExpression(x) || ts.isNonNullExpression(x))) x = x.expression;
  if (x && ts.isBinaryExpression(x) && x.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) x = x.left;
  return x && ts.isPropertyAccessExpression(x) && LISTS.has(x.name.text) ? x.name.text : null;
};
let total = 0;
for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith(".ts") || f.endsWith(".test.ts") || f === "dmgSrc.ts") continue;
  const file = path.join(ROOT, f);
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const alias = new Map();
  const edits = [];
  const v = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer && listOf(n.initializer)) alias.set(n.name.text, true);
    if (ts.isForOfStatement(n)) {
      const it = n.expression;
      const isCall = ts.isCallExpression(it) && ts.isIdentifier(it.expression) && it.expression.text === "srcEach";
      const hit = !isCall && (listOf(it) || (ts.isIdentifier(it) && alias.has(it.text)));
      if (hit) edits.push(it);
    }
    // filter·forEach·some·map(화살표 함수)에서 s를 넘겨 무언가 부르면 srcCb
    if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && /^(filter|forEach|some|map)$/.test(n.expression.name.text)) {
      const obj = n.expression.expression;
      const fn = n.arguments[0];
      const hit = (listOf(obj) || (ts.isIdentifier(obj) && alias.has(obj.text))) && fn && ts.isArrowFunction(fn) && fn.parameters.length <= 2;
      let calls = false;
      const c = (x) => {
        if (ts.isCallExpression(x) && x.arguments.some((a) => ts.isIdentifier(a) && a.text === "s")) calls = true;
        ts.forEachChild(x, c);
      };
      if (hit) c(fn.body);
      if (hit && calls) edits.push(fn);
    }
    ts.forEachChild(n, v);
  };
  v(sf);
  if (!edits.length) continue;
  let out = text;
  for (const it of edits.sort((a, b) => b.getStart() - a.getStart())) out = `${out.slice(0, it.getStart())}${ts.isArrowFunction(it) ? "srcCb" : "srcEach"}(${it.getText()})${out.slice(it.getEnd())}`;
  fs.writeFileSync(file, out);
  total += edits.length;
  console.log(f, edits.length);
}
console.log("total", total);
