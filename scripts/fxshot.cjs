// 효과 미리보기 스크린샷 (개발용): 먼저 apps/client에서 `npx vite --port 5199` → node scripts/fxshot.cjs '<rows JSON>' '<cols JSON>' out.png [ticks]
// 넷째 값이 ticks면 cols를 지난 틱으로 봄 · 설명은 docs/FX_FRAMES.md
const { chromium } = require("playwright");

(async () => {
  const a = process.argv.slice(2);
  const glow = a[0] === "glow";
  const [rows, cols, out, mode] = glow ? [] : a;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2400, height: 1600 } });
  p.on("pageerror", (e) => console.log("ERR", e.message));
  const key = mode === "ticks" ? "ticks" : "cols";
  const url = glow
    ? `http://localhost:5199/fxprev/glow.html?char=${a[1]}&kinds=${encodeURIComponent(a[2])}&size=${a[4] ?? 50}&at=${a[5] ?? 0.12}`
    : `http://localhost:5199/fxprev/index.html?rows=${encodeURIComponent(rows)}&${key}=${encodeURIComponent(cols)}`;
  await p.goto(url);
  await p.waitForFunction(() => document.title === "ready", null, { timeout: 20000 });
  await (await p.$("canvas")).screenshot({ path: glow ? a[3] : out });
  await b.close();
})();
// 빛 층: node scripts/fxshot.cjs glow '<char>' '<kinds JSON>' out.png [size] [at초] → /fxprev/glow.html
