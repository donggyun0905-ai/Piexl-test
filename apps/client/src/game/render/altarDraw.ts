// 제단의 방 그림: 성좌가 방을 감쌀 만큼 크게 떠 있음(render/altarFigures·altarFigures2) · 바닥에 물결 무늬·성좌마다 떠도는 것
// (고래 거품 · 거북 불씨 · 매 번개 불꽃 · 바람 줄 · 빛·어둠 구슬 · 잎 · 마법 문자 · 지지직 조각) · 앞쪽 제단 · 카드를 고른 효과
// 바닥·벽 색은 render/floorThemes가 성좌마다 (ALTAR_LOOK)
import { ALTAR_IDS, ALTAR_Y, altarOf, altarUsed, raidAltarOf, ROOM_WIDTH, type AltarId, type EffectState, type Pickup, type RunState } from "@pixel-rogue/shared";
import { drawHawk, drawTurtle, drawWhale, drawWind } from "./altarFigures";
import { drawSion, drawSylvester, drawUnknown, drawWitch } from "./altarFigures2";
import { ALTAR_LOOK } from "./altarLook";
import { drawBlades } from "./swarm";
import { additive, alpha, beam, easeOut, glow, rnd, rune, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";
import { drawProp, type PropName } from "./propArt";

/** 성좌 그림 (사용자 그림 sprites/props/star*, 없으면 코드 그림 FIGURE) */
const STAR_ART: Record<AltarId, PropName> = { whale: "starWhale", turtle: "starTurtle", hawk: "starHawk", wind: "starWind", sion: "starSion", sylvester: "starSylvester", witch: "starWitch", unknown: "starUnknown" };

type Ctx = CanvasRenderingContext2D;
const FIGURE: Record<AltarId, (ctx: Ctx, cx: number, cy: number, W: number, t: number) => void> = {
  whale: drawWhale,
  turtle: drawTurtle,
  hawk: drawHawk,
  wind: drawWind,
  sion: drawSion,
  sylvester: drawSylvester,
  witch: drawWitch,
  unknown: drawUnknown,
};

/** 떠도는 것 하나 (성좌마다 모양) */
function mote(ctx: Ctx, id: AltarId, x: number, y: number, f: number, i: number, t: number): void {
  const L = ALTAR_LOOK[id];
  const a = Math.sin(f * Math.PI);
  if (id === "whale") {
    ctx.strokeStyle = alpha("#d8f0ff", a * 0.8);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + (i % 3), 0, Math.PI * 2);
    ctx.stroke();
  } else if (id === "wind") {
    ctx.strokeStyle = alpha(L.glow, a * 0.6);
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.quadraticCurveTo(x, y - 3, x + 10, y);
    ctx.stroke();
  } else if (id === "witch") {
    ctx.fillStyle = alpha(i % 2 ? L.main : L.glow, a);
    ctx.font = "8px serif";
    ctx.fillText("✦ᚱᛟᛉ"[i % 4]!, x, y);
  } else if (id === "unknown") {
    ctx.fillStyle = alpha(i % 4 ? "#3a3a44" : "#ff3a5a", a);
    ctx.fillRect(Math.round(x), Math.round(y), 3 + (i % 4) * 2, 2);
  } else {
    additive(ctx, () => glow(ctx, x, y, 3 + (i % 3), id === "sion" ? (i % 2 ? "#b48aff" : "#fff0b0") : L.main, a, 0.8));
  }
  void t;
}

/** 방: 바닥 물결 무늬 · 거대한 성좌 · 떠도는 것 */
export function drawAltarRoom(ctx: Ctx, s: RunState, cx: number, cy: number): void {
  const id = altarOf(s);
  const L = ALTAR_LOOK[id];
  const t = s.tick;
  // 바다 같은 물결 무늬 (천천히 흐름)
  ctx.strokeStyle = alpha(L.glow, 0.12);
  ctx.lineWidth = 1;
  for (let k = 0; k < 9; k++) {
    const yy = cy - 70 + k * 18;
    ctx.beginPath();
    for (let x = 0; x <= ROOM_WIDTH; x += 12) ctx.lineTo(x, yy + Math.sin(x / 30 + t / 40 + k) * 3);
    ctx.stroke();
  }
  // 레이드 성좌의 방: 거대한 성좌 대신 제단마다 작은 성좌 (drawAltarStand)
  if (s.raidBoss) return;
  additive(ctx, () => rune(ctx, cx, ALTAR_Y + 30, 46, L.main, altarUsed(s) ? 0.3 : 0.7, t * 0.006));
  // 거대한 성좌 (반투명, 방 위쪽 절반을 감쌈) · 그림은 더하기로 (검은 바탕이 사라짐), 별이 반짝이듯 밝기가 숨 쉼
  const fy = cy - 4;
  const used = altarUsed(s);
  const twinkle = 0.85 + 0.15 * Math.sin(t / 25);
  if (drawProp(ctx, STAR_ART[id], 0, cx, fy - 6 + Math.sin(t / 60) * 2, { w: ROOM_WIDTH * 0.92, center: true, add: true, alpha: (used ? 0.25 : 0.45) * twinkle })) {
    // 그림 위에 별 반짝임 몇 개
    for (let i = 0; i < 10; i++) {
      const on = Math.max(0, Math.sin(t / 12 + i * 2.3));
      if (on > 0.6) additive(ctx, () => glow(ctx, cx + (rnd(i, 7) - 0.5) * ROOM_WIDTH * 0.8, fy + (rnd(i, 9) - 0.5) * 120, 4, L.glow, on * 0.8, 0.4));
    }
  } else figure(ctx, id, cx, fy, used, t);
  // 떠도는 것: 아래에서 위로 (바람은 옆으로)
  for (let i = 0; i < 26; i++) {
    const f = ((t * (0.4 + rnd(i, 1) * 0.5) + i * 53) % 240) / 240;
    const x = id === "wind" ? ((rnd(i, 2) * ROOM_WIDTH + t * 1.2) % ROOM_WIDTH) : rnd(i, 3) * ROOM_WIDTH + Math.sin(t / 30 + i) * 6;
    const y = id === "wind" ? cy - 80 + rnd(i, 4) * 170 : cy + 100 - f * 200;
    mote(ctx, id, x, y, f, i, t);
  }
}

/** 그림이 아직 없을 때: 코드로 그린 성좌 (가운데 기준 1.35배) */
function figure(ctx: Ctx, id: AltarId, cx: number, fy: number, used: boolean, t: number): void {
  ctx.save();
  ctx.globalAlpha = used ? 0.55 : 0.9;
  ctx.translate(cx, fy);
  ctx.scale(1.35, 1.35);
  ctx.translate(-cx, -fy);
  FIGURE[id](ctx, cx, fy, ROOM_WIDTH, t);
  ctx.restore();
}

/** 제단: 빛나는 돌 받침 + 성좌 문양 (다 고르면 빛이 꺼짐) */
export function drawAltarStand(ctx: Ctx, s: RunState, pk: Pickup, x: number, y: number): void {
  // 레이드 성좌의 방: 제단마다 성좌 (group = 성좌 차례 + 1)
  const id = raidAltarOf(pk) ?? altarOf(s);
  const L = ALTAR_LOOK[id];
  const on = !altarUsed(s);
  const t = s.tick;
  if (pk.group > 0) raidStar(ctx, id, x, y, on, t);
  if (on) additive(ctx, () => glow(ctx, x, y - 10, 30, L.main, 0.6 + 0.2 * Math.sin(t / 12), 0.6));
  // 그림(sprites/props/altarStand, 별빛 구슬이 도는 제단)이 있으면 그것을 (구슬이 살짝 떠오름)
  if (drawProp(ctx, "altarStand", 0, x, y + 4, { h: 40, alpha: on ? 1 : 0.7 })) {
    if (on && pk.itemId !== "1") additive(ctx, () => beam(ctx, x, y - 30, x, y - 70 - Math.sin(t / 10) * 4, 3, L.main, 0.5));
    return;
  }
  ctx.fillStyle = "#1a2030";
  ctx.fillRect(x - 16, y - 4, 32, 6);
  ctx.fillStyle = "#2a3448";
  ctx.fillRect(x - 12, y - 14, 24, 11);
  ctx.fillStyle = alpha(L.main, on ? 1 : 0.4);
  ctx.fillRect(x - 12, y - 15, 24, 2);
  ctx.font = "bold 10px serif";
  ctx.textAlign = "center";
  ctx.fillStyle = on ? L.glow : alpha(L.glow, 0.4);
  ctx.fillText(L.sigil, x, y - 5);
  ctx.textAlign = "start";
  if (on && pk.itemId !== "1") additive(ctx, () => beam(ctx, x, y - 16, x, y - 60 - Math.sin(t / 10) * 4, 3, L.main, 0.5));
}

/** 카드를 고른 효과: 성좌 색 충격파 + 하늘로 솟는 빛 + 불똥 (무시는 옅게) */
export function drawAltarFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "alChoose") return false;
  // 성좌 차례는 dirX에 (sim/altar)
  const L = ALTAR_LOOK[ALTAR_IDS[fx.dirX] ?? "whale"];
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const k = fx.width === 2 ? 0.4 : 1;
  additive(ctx, () => {
    shock(ctx, x, y + 30, fx.size * 1.6 * easeOut(f), L.main, (1 - f) * k, 10);
    shock(ctx, x, y + 30, fx.size * easeOut(f), L.glow, (1 - f) * k, 6);
    beam(ctx, x, y + 30, x, y - 120, 18 * (1 - f) * k + 2, L.main, (1 - f) * k);
    sparks(ctx, x, y + 20, 22, fx.size * 1.4, f, L.glow, fx.x + fx.maxTicks, k);
  });
  return true;
}

/** 제단 증강 '회전 칼날'을 가진 동안 몸 둘레 칼날 (광야의 새벽과 같은 그림) */
export function drawAugments(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (s.swarm || s.trialRun?.room === s.roomId || !p.augments?.some((a) => a.skills.includes("blades") && p.passives.includes(a.passive))) return;
  drawBlades(ctx, s.tick, p, snap);
}

/** 레이드 제단 위 작은 성좌 + 이름 (고른 뒤에는 흐리게) */
function raidStar(ctx: Ctx, id: AltarId, x: number, y: number, on: boolean, t: number): void {
  const fy = y - 38 + Math.sin(t / 50 + x) * 2;
  if (!drawProp(ctx, STAR_ART[id], 0, x, fy, { w: 58, center: true, add: true, alpha: on ? 0.8 : 0.3 })) {
    ctx.save();
    ctx.globalAlpha = on ? 0.9 : 0.35;
    ctx.translate(x, fy);
    ctx.scale(0.22, 0.22);
    ctx.translate(-x, -fy);
    FIGURE[id](ctx, x, fy, ROOM_WIDTH, t);
    ctx.restore();
  }
  ctx.font = "bold 7px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = alpha(ALTAR_LOOK[id].glow, on ? 1 : 0.4);
  ctx.fillText(ALTAR_LOOK[id].sigil, x, y + 12);
  ctx.textAlign = "start";
}
