// 상태이상 피해 숫자 왼쪽에 붙는 작은 도트 아이콘 (화면 전용): 출혈 핏방울 · 화상 불꽃 · 독 초록 물방울 둘 · 저주 해골 · 폭풍 소용돌이 · 부패 녹아내린 구슬 · 죽음 흰 해골 · 업화 푸른 불꽃 · 달빛 약점 공격 왼쪽 초승달 · 청염 아래 진한 파랑 → 위 옅은 파랑 불꽃
import type { DotKind } from "@pixel-rogue/shared";

/** 한 글자 = 한 점. 대문자는 바탕 색, 소문자 w는 반짝임 */
const ICONS: Record<DotKind, { rows: string[]; colors: Record<string, string> }> = {
  bleed: { rows: ["..R..", "..R..", ".RRR.", "RRwRR", "RRRRR", ".RRR."], colors: { R: "#e8303a", w: "#ffb0b0" } },
  burn: { rows: ["..O..", ".OO..", ".OYO.", "OYYOO", "OYwYO", ".OOO."], colors: { O: "#ff7a1a", Y: "#ffd040", w: "#fff4c0" } },
  poison: { rows: [".G.....", ".G...G.", "GGG..G.", "GwG.GGG", "GGG.GwG", ".G..GGG", ".....G."], colors: { G: "#3ac83a", w: "#d8ffc0" } },
  curse: { rows: [".PPP.", "PPPPP", "PwPwP", "PPPPP", ".P.P."], colors: { P: "#a86aff", w: "#2a1838" } },
  storm: { rows: [".CCC.", "C...C", "..CwC", ".C...", "..CC."], colors: { C: "#7ae0ff", w: "#ffffff" } },
  rot: { rows: [".OOO.", "OwOOO", "OOOOO", ".OYO.", ".O.O.", "...O."], colors: { O: "#ff8a1a", Y: "#ffc060", w: "#fff0c0" } },
  death: { rows: [".WWW.", "WWWWW", "WkWkW", "WWWWW", ".W.W."], colors: { W: "#e8e0f0", k: "#120c16" } },
  hellfire: { rows: ["..B..", ".BB..", ".BWB.", "BWWBB", "BWwWB", ".BBB."], colors: { B: "#2a8aff", W: "#6ad8ff", w: "#e0fbff" } },
  shock: { rows: ["..YY", ".YY.", "YYYY", ".YY.", "YY.."], colors: { Y: "#ffe04a" } },
  frost: { rows: ["..C..", "C.C.C", ".CwC.", "C.C.C", "..C.."], colors: { C: "#9ae8ff", w: "#ffffff" } },
  tide: { rows: ["..B..", ".BB..", "BBwB.", "BBBBB", ".BBB."], colors: { B: "#3a9aff", w: "#d0f0ff" } },
  gold: { rows: [".YYY.", "YYwYY", "YYYYY", ".YYY."], colors: { Y: "#ffc830", w: "#fff4c0" } },
  radiance: { rows: ["..W..", "W.W.W", ".WWW.", "W.W.W", "..W.."], colors: { W: "#fff8d8" } },
  voidbolt: { rows: ["..PP", ".PP.", "PPPP", ".PP.", "PP.."], colors: { P: "#5a3a8a" } },
  blueflame: { rows: ["..P..", ".PL..", ".LLB.", "LBBBL", "BDDDB", ".DDD."], colors: { P: "#d8f4ff", L: "#7ac8ff", B: "#2a7aff", D: "#1238d8" } },
  moon: { rows: [".WW..", "WW...", "Ww...", "WW...", ".WW.."], colors: { W: "#ffffff", w: "#c8d8ff" } },
};
const OUTLINE = "#1a1622";

/** 아이콘 너비 (점 수) */
export const dotIconWidth = (kind: DotKind): number => ICONS[kind].rows[0]!.length;

/** (x, y) = 아이콘 왼쪽 위. 너비 5~7 · 높이 5~7 */
export function drawDotIcon(ctx: CanvasRenderingContext2D, kind: DotKind, x: number, y: number): void {
  const { rows, colors } = ICONS[kind];
  ctx.fillStyle = OUTLINE;
  rows.forEach((row, j) => [...row].forEach((ch, i) => ch !== "." && ctx.fillRect(x + i - 1, y + j - 1, 3, 3)));
  rows.forEach((row, j) =>
    [...row].forEach((ch, i) => {
      if (ch === ".") return;
      ctx.fillStyle = colors[ch] ?? OUTLINE;
      ctx.fillRect(x + i, y + j, 1, 1);
    }),
  );
}
