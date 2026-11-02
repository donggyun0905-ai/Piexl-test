// 비밀의 방 사용자 그림 (render/propArt): 금 간 벽 3단계 · 악마 석상 · 거래 제단 · 야바위 탁자·컵 · 도박꾼 표정 4
// 각 함수는 그림을 그렸으면 true (아직 못 불러왔으면 false → render/vaultDraw의 코드 그림). 빛·촛불·글자 같은 효과는 vaultDraw가 그대로 그림
import { cupState, CUP_GAP, cupY, gambleDone, gambleNow, type RunState } from "@pixel-rogue/shared";
import { drawProp, propReady } from "./propArt";
import { additive, glow } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;

/** 금 간 벽: 0 금(살짝만 보이게) · 1 무너지는 중 · 2 뚫린 문. (x, y) = 벽 안쪽 가운데 */
export function crackArt(ctx: Ctx, x: number, y: number, stage: number, t: number): boolean {
  const a = stage === 0 ? 0.45 + 0.1 * Math.sin(t / 15) : 1;
  return drawProp(ctx, "crack", stage, x, y, { h: 32, center: true, add: true, alpha: a });
}

/** 악마의 석상 (받침 밑동 = y + 20, 앞의 거래 물건을 가리지 않게) · 붉은 눈과 가슴 보석이 깜빡임 */
export function statueArt(ctx: Ctx, cx: number, y: number, t: number): boolean {
  if (!drawProp(ctx, "devilStatue", 0, cx, y + 20, { h: 64 })) return false;
  const blink = Math.sin(t / 40) > -0.9 ? 1 : 0.2;
  additive(ctx, () => {
    glow(ctx, cx, y - 12, 6, "#ff2030", (0.6 + 0.3 * Math.sin(t / 9)) * blink, 0.5);
    for (const d of [-1, 1]) glow(ctx, cx + d * 2.5, y - 26, 2.5, "#ff3040", 0.8 * blink, 0.4);
  });
  return true;
}

/** 거래 제단 (붉은 천·소용돌이) · 그 위에 패시브가 떠 있음 (아이콘은 vaultDraw가 그림, 위치 = 돌려준 높이) */
export function offerArt(ctx: Ctx, x: number, y: number): number | null {
  return drawProp(ctx, "devilAltar", 0, x, y + 12, { h: 34 }) ? y - 28 : null;
}

/** 탁자 너비 · 펠트 가운데가 컵 줄에 오도록 */
const TABLE_W = 80;

/** 도박꾼(표정: 0 기다림 · 1 섞는 손 · 2 당첨에 놀람 · 3 꽝에 웃음, 탁자 뒤) · 녹색 펠트 탁자 · 컵 셋 */
export function gambleArt(ctx: Ctx, s: RunState, cx: number): boolean {
  if (!propReady("gambleTable") || !propReady("cups")) return false;
  const y = cupY();
  const g = gambleNow(s);
  const busy = !!g && g.pick === undefined && s.tick < gambleDone(g);
  const face = busy ? 1 : g?.win !== undefined && s.tick - gambleDone(g) < 400 ? (g.win ? 2 : 3) : 0;
  drawProp(ctx, "gambler", face, cx + (busy ? Math.sin(s.tick / 3) * 1.5 : 0), y - 14, { h: 28 });
  drawProp(ctx, "gambleTable", 0, cx, y + 48, { w: TABLE_W });
  const st = g ? cupState(g, s.tick) : { slots: [0, 1, 2], pair: null, f: 0, show: false };
  const picked = g?.pick !== undefined;
  for (let cup = 0; cup < 3; cup++) {
    let slot = st.slots[cup]!;
    let dy = 0;
    if (st.pair && st.pair.includes(slot)) {
      const other = st.pair[0] === slot ? st.pair[1] : st.pair[0];
      const e = (1 - Math.cos(st.f * Math.PI)) / 2;
      dy = Math.sin(st.f * Math.PI) * (st.pair[0] === slot ? -7 : 7);
      slot = slot + (other - slot) * e;
    }
    const x = cx + (slot - 1) * CUP_GAP;
    const prize = cup === (g?.prize ?? -1);
    // 들림: 처음에 당첨 컵을 보여 줄 때 · 고른 뒤 고른 컵과 당첨 컵
    const lifted = (st.show && prize && s.tick - (g?.at ?? 0) > 8 && s.tick - (g?.at ?? 0) < 46) || (picked && (st.slots[cup] === g!.pick || prize));
    if (lifted && prize) additive(ctx, () => glow(ctx, x, y + 4, 10, "#ffd040", 0.8, 0.5));
    drawProp(ctx, "cups", lifted ? (prize ? 2 : 1) : 0, x, y + 6 + dy, { h: 20 });
  }
  return true;
}

/** 도박꾼 그림이 있으면 탁자 뒤에서 이미 그림 (바닥 물건 쪽은 건너뜀) */
export const gamblerArt = () => propReady("gambleTable") && propReady("cups") && propReady("gambler");
