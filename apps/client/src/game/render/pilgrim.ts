// 차원의 순례자 (sim/pilgrim): 위쪽 벽 포탈에서 걸어 나오는 분홍빛 긴 머리 여자아이 · 몸보다 큰 둥근 배낭 · 도착하면 말풍선
// 히든 아이템 효과 (hiddenPerks·hiddenUse) · 왼쪽 위 금기된 아티팩트 스택 창
import { pilgrimHere, pilgrimWalk, relicStacks, ROOM_CX, ROOM_CY, type EffectState, type RunState } from "@pixel-rogue/shared";
import { RELIC_COLORS } from "../iconArt/hidden";
import { hudScale } from "./imugiAura";
import { drawHiddenFx2 } from "./hiddenGear";
import { drawCharacter } from "../sprites";
import type { Snap } from "./palette";
import { additive, alpha, beam, glow, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const PORTAL_Y = ROOM_CY - 60;
const STAND_Y = ROOM_CY - 16;

function rect(ctx: Ctx, c: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

/** 순례자와 포탈 (방 안에 있을 때만). line = 말풍선 글자 */
export function drawPilgrim(ctx: Ctx, s: RunState, line: string | undefined): void {
  const npc = s.pilgrimNpc;
  if (!npc || !pilgrimHere(s)) return;
  const f = pilgrimWalk(s);
  const x = ROOM_CX;
  const y = PORTAL_Y + (STAND_Y - PORTAL_Y) * f;
  // 포탈: 걸어 나오는 동안 열려 있다가 닫힘 (아이 키보다 큰 문, 아이가 그 안에서 걸어 나옴)
  const open = f < 1 ? Math.min(1, (s.tick - npc.t0) / 20) : Math.max(0, 1 - (s.tick - npc.t0 - 110) / 30);
  if (open > 0) drawPortal(ctx, x, PORTAL_Y - 30, open, s.tick);
  const bob = f < 1 ? Math.round(Math.abs(Math.sin(s.tick * 0.3)) * 1) : Math.round(Math.sin(s.tick * 0.08) * 0.6);
  // 캐릭터 시트 (scripts/art/pilgrim_sprite.py, 나중에 히든 캐릭터로도 씀). 아직 못 불러왔으면 간단한 그림
  const pose = { faceX: 0, faceY: 1, moving: f < 1, casting: false, step: (s.tick >> 3) % 4 };
  if (!drawCharacter(ctx, "pilgrim", x, y - 6, 6, pose)) drawGirl(ctx, x, y - bob, s.tick, f < 1);
  if (f >= 1 && line && s.tick - npc.t0 < 110 + 240) drawBubble(ctx, x, y - 76, line);
}

/** 차원 포탈 (가로 42 · 세로 50 반지름, 거대한 배낭까지 들어가는 크기): 바깥 빛 · 검보라 속 · 소용돌이 고리 넷 · 테두리 룬 여덟 · 빨려 들어가는 별 가루 */
function drawPortal(ctx: Ctx, x: number, y: number, open: number, tick: number): void {
  const rx = 42 * open;
  const ry = 50 * open;
  additive(ctx, () => glow(ctx, x, y, 60 * open, "#8a5aff", 0.7 * open, 1));
  // 속: 가운데로 갈수록 진한 검보라 (별이 비침)
  const g = ctx.createRadialGradient(x, y, 0, x, y, ry);
  g.addColorStop(0, "rgba(8,2,20,0.95)");
  g.addColorStop(0.6, "rgba(40,12,90,0.9)");
  g.addColorStop(1, "rgba(120,70,255,0.5)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  ctx.fill();
  for (let i = 0; i < 7; i++) {
    const a = tick * 0.02 * (i % 2 ? 1 : -1) + i * 0.9;
    const d = 0.25 + ((i * 0.37 + tick * 0.004) % 0.6);
    rect(ctx, i % 3 ? "#c8b8ff" : "#ffffff", x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, 1, 1);
  }
  additive(ctx, () => {
    // 소용돌이 고리 넷 (안쪽일수록 빨리 돎)
    for (let i = 0; i < 4; i++) {
      const k = 1 - i * 0.2;
      const a = tick * (0.06 + i * 0.03) * (i % 2 ? -1 : 1) + i * 1.7;
      ctx.strokeStyle = alpha(["#e0d0ff", "#a070ff", "#6ad8ff", "#c060ff"][i]!, 0.85 * open);
      ctx.lineWidth = i === 0 ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.ellipse(x, y, rx * k, ry * k, 0, a, a + Math.PI * 1.4);
      ctx.stroke();
    }
    // 테두리 룬 여덟 (반짝임)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + tick * 0.01;
      const px = x + Math.cos(a) * (rx + 4);
      const py = y + Math.sin(a) * (ry + 4);
      const on = (tick >> 3) % 8 === i;
      rect(ctx, on ? "#ffffff" : "#c8a8ff", px - 1, py - 1, 2, 2);
      if (on) glow(ctx, px, py, 6, "#c8a8ff", 0.8, 1);
    }
    // 둘레에서 빨려 들어가는 별 가루
    for (let i = 0; i < 10; i++) {
      const ph = ((tick + i * 13) % 40) / 40;
      const a = i * 2.39 + tick * 0.01;
      const d = 1.5 - ph;
      rect(ctx, alpha("#e8d8ff", (1 - ph) * open), x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, 1, 1);
    }
  });
}

/** 꼬마 + 커다란 배낭 (아래가 발) */
function drawGirl(ctx: Ctx, x: number, y: number, tick: number, walking: boolean): void {
  rect(ctx, "rgba(0,0,0,0.35)", x - 9, y + 1, 18, 2);
  // 배낭 (몸 뒤, 키의 두 배쯤) + 삐죽삐죽 튀어나온 장비
  rect(ctx, "#5a3a22", x - 12, y - 34, 24, 28);
  rect(ctx, "#7a5232", x - 11, y - 33, 22, 26);
  rect(ctx, "#4a2e1a", x - 11, y - 22, 22, 2);
  rect(ctx, "#4a2e1a", x - 11, y - 29, 22, 1);
  rect(ctx, "#c8a040", x - 2, y - 24, 4, 4);
  rect(ctx, "#b8c0cc", x - 9, y - 44, 1, 11); // 칼
  rect(ctx, "#8a96a8", x - 11, y - 38, 5, 1);
  rect(ctx, "#6a4a2a", x + 7, y - 43, 1, 10); // 지팡이
  rect(ctx, "#ff6a8a", x + 6, y - 45, 3, 3);
  rect(ctx, "#ffd040", x + 1, y - 38, 4, 4); // 황금 잔
  rect(ctx, "#3a8a5a", x - 5, y - 39, 3, 5); // 물약
  rect(ctx, "#c8f0ff", x - 4, y - 40, 1, 1);
  rect(ctx, "#a8b0c0", x - 14, y - 30, 3, 7); // 옆에 매단 방패
  rect(ctx, "#5a6272", x - 13, y - 28, 1, 3);
  rect(ctx, "#8a5aff", x + 10, y - 28, 4, 4); // 반짝이는 차원 결정
  if ((tick >> 4) % 2) rect(ctx, "#ffffff", x + 11, y - 27, 1, 1);
  // 몸 (작은 꼬마: 갈색 단발 · 큰 눈 · 초록 망토)
  const step = walking ? ((tick >> 3) % 2) * 2 - 1 : 0;
  rect(ctx, "#3a2a2a", x - 3 + step, y - 3, 2, 3);
  rect(ctx, "#3a2a2a", x + 1 - step, y - 3, 2, 3);
  rect(ctx, "#3a8a6a", x - 4, y - 10, 8, 7);
  rect(ctx, "#f0c8a8", x - 3, y - 16, 6, 6);
  rect(ctx, "#6a3a22", x - 4, y - 17, 8, 3);
  rect(ctx, "#6a3a22", x - 4, y - 14, 1, 4);
  rect(ctx, "#6a3a22", x + 3, y - 14, 1, 4);
  rect(ctx, "#2a1a2a", x - 2, y - 13, 1, 2);
  rect(ctx, "#2a1a2a", x + 1, y - 13, 1, 2);
  rect(ctx, "#ff9aa8", x - 3, y - 11, 1, 1);
  rect(ctx, "#ff9aa8", x + 2, y - 11, 1, 1);
}

function drawBubble(ctx: Ctx, x: number, y: number, text: string): void {
  ctx.font = "bold 6px sans-serif";
  const w = Math.ceil(ctx.measureText(text).width) + 8;
  rect(ctx, "rgba(20,14,30,0.9)", x - w / 2 - 1, y - 9, w + 2, 12);
  rect(ctx, "#fff8f0", x - w / 2, y - 8, w, 10);
  rect(ctx, "#fff8f0", x - 1, y + 2, 3, 2);
  ctx.fillStyle = "#3a2a3a";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y - 1);
  ctx.textAlign = "start";
}

/** 히든 아이템 효과. 그렸으면 true */
export function drawHiddenFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("hd")) return false;
  if (drawHiddenFx2(ctx, fx, snap)) return true;
  const t = fx.ticks / fx.maxTicks;
  const f = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "hdGate" || fx.kind === "hdWarp") {
    // 차원이동문·포탈건·테라포밍: 내 자리에 아이 키만 한 포탈이 열렸다 닫힘 (빨려 들어가는 빛)
    drawPortal(ctx, x, y - 12, Math.min(1, f * 4, t * 3) * 0.6, fx.maxTicks - fx.ticks);
    additive(ctx, () => shock(ctx, x, y - 12, fx.size * (0.4 + t), fx.kind === "hdWarp" ? "#3ad0ff" : "#c8a8ff", t, 3));
    return true;
  }
  additive(ctx, () => {
    switch (fx.kind) {
      case "hdAether":
        glow(ctx, x, y, fx.size * (0.4 + f), "#b060ff", t, 1.5);
        shock(ctx, x, y, fx.size * (0.3 + f * 0.9), "#d8a8ff", t, 8);
        sparks(ctx, x, y, 14, fx.size * 1.1, f, "#f0d8ff", fx.x + fx.y);
        break;
      case "hdMeteor": {
        // 떨어질 자리 붉은 원 + 하늘에서 내려오는 불덩이
        ctx.strokeStyle = alpha("#ff5a2a", 0.4 + 0.4 * f);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, fx.size, 0, TAU);
        ctx.stroke();
        if (t < 0.35) {
          const k = t / 0.35;
          const mx = x - 30 * k;
          const my = y - 90 * k;
          beam(ctx, mx - 10, my - 26, mx, my, 4, "#ff8a3a", 0.8);
          glow(ctx, mx, my, 8, "#ffb040", 1, 1.6);
        }
        break;
      }
      case "hdScroll":
        glow(ctx, x, y, 14 + f * 10, "#ff5a2a", t, 1.2);
        break;
      case "hdPortal":
        glow(ctx, x, y - 20, 50, "#8a5aff", 0.2, 1);
        break;
      case "hdShow":
        sparks(ctx, x, y, 16, fx.size, f, "#ffe8a0", fx.x);
        glow(ctx, x, y, fx.size * 0.6, "#c8a8ff", t * 0.7);
        break;
      case "hdQuake":
        shock(ctx, x, y, 4 + f * fx.size, "#c8a070", t, 4);
        break;
      case "hdLeaf":
        glow(ctx, x, y - 6, 10, "#5ae07a", t * 0.7, 1);
        sparks(ctx, x, y - 4, 6, 12, f, "#a8ffb8", fx.y);
        break;
      case "hdMirror": {
        // 앞쪽 거울 (분홍 테두리 둥근 거울) + 빛 레이저
        const tx = x + fx.dirX * fx.size;
        const ty = y + fx.dirY * fx.size;
        beam(ctx, x, y, tx, ty, (fx.width ?? 8) * t, "#ff9ad8", t);
        beam(ctx, x, y, tx, ty, 2 * t, "#ffffff", t);
        glow(ctx, x, y, 9, "#ffc8e8", t, 1.4);
        break;
      }
    }
  });
  if (fx.kind === "hdMirror") {
    ctx.strokeStyle = alpha("#e0b040", t);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y, 4, 6, 0, 0, TAU);
    ctx.stroke();
  }
  return true;
}

/** 왼쪽 위 금기된 아티팩트 스택 창 (가진 색마다 한 줄, 그 색 테두리) · scale = 게임 1픽셀의 화면 픽셀 */
export function drawRelicHud(ctx: Ctx, s: RunState, scale: number): void {
  const list = relicStacks(s.player);
  if (list.length === 0) return;
  const k = hudScale(scale);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.save();
  // 협동이면 인원 표 아래, 다른 왼쪽 위 표시(영혼·콤보)와 겹치지 않게 조금 아래
  ctx.translate(6, (s.party ? ((30 + 5 * s.party.length) * scale) / k : 16) + 22);
  ctx.font = "bold 10px monospace";
  list.forEach(({ id, n }, i) => {
    const [c, light] = RELIC_COLORS[id] ?? ["#ffffff", "#ffffff"];
    const y = i * 15;
    ctx.fillStyle = "rgba(16,12,24,0.82)";
    ctx.fillRect(0, y, 58, 13);
    ctx.fillStyle = c;
    ctx.fillRect(0, y, 58, 1);
    ctx.fillRect(0, y + 12, 58, 1);
    ctx.fillRect(0, y, 1, 13);
    ctx.fillRect(57, y, 1, 13);
    ctx.fillRect(3, y + 3, 7, 7);
    ctx.fillStyle = light;
    ctx.fillRect(5, y + 5, 3, 3);
    ctx.fillStyle = light;
    ctx.fillText(String(n), 14, y + 10);
  });
  ctx.restore();
}
