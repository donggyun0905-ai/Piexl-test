// 웨이브 그리기 (몸 둘레). 몸 뒤: 만조 · 바닥에 깔리는 것(웅덩이·물시계·발자국·눈·고리·고래 그림자·문어·분수·연꽃) · 물안개 · 물의 날개 · 서핑 파도
// 몸 위: 나머지 빚은 것 · 물의 갑옷 · 머리 위 상상력 막대 · 다음 기술(상상의 물감) · 막 나간 기술 이름
import { isWave, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, WAVE, type RunState } from "@pixel-rogue/shared";
import { detectLang } from "../../i18n";
import { itemName } from "../../i18n/items";
import { iconCanvas } from "../iconArt";
import { hpBarTop } from "./hpTop";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { glints } from "./seaLight";
import { crestWave, waterFill, WV } from "./waveArt";
import { BITS_A, type BitDraw } from "./waveBits";
import { BITS_B } from "./waveBits2";
import { mist, ripple, softLight, waterWings } from "./waveKit";

const DRAW: Record<string, BitDraw> = { ...BITS_A, ...BITS_B };
const GROUND = new Set(["wvPuddle", "wvClock", "wvTrail", "wvEye", "wvEbb", "wvWhale", "wvOctopus", "wvFountain", "wvLotus"]);
const TAU = Math.PI * 2;

function bits(ctx: Ctx, s: RunState, snap: Snap, ground: boolean): void {
  for (const b of s.player.wvBits ?? []) {
    if (GROUND.has(b.k) !== ground) continue;
    DRAW[b.k]?.(ctx, s, b, snap(b.x), snap(b.y));
  }
}

/** 방 전체를 덮는 만조 물빛 (몸 뒤, 남은 틱 t): 맑은 물빛 막 · 떠도는 햇빛 얼룩 · 천천히 지나가는 물결 줄 */
export function floodLayer(ctx: Ctx, s: RunState, t: number): void {
  const a = Math.min(1, t / 30, (180 - t + 1) / 20);
  const w = ROOM_MAX_X - ROOM_MIN_X + 24;
  const h = ROOM_MAX_Y - ROOM_MIN_Y + 24;
  const x0 = ROOM_MIN_X - 12;
  const y0 = ROOM_MIN_Y - 12;
  const g = ctx.createLinearGradient(x0, y0, x0, y0 + h);
  g.addColorStop(0, alpha(WV.aqua, 0.12 * a));
  g.addColorStop(1, alpha(WV.deep, 0.2 * a));
  ctx.fillStyle = g;
  ctx.fillRect(x0, y0, w, h);
  for (let i = 0; i < 6; i++) softLight(ctx, x0 + (w * ((i % 3) + 0.5)) / 3, y0 + (h * (Math.floor(i / 3) + 0.5)) / 2, w / 6, h / 4, s.tick + i * 37, 0.8 * a);
  additive(ctx, () => {
    ctx.strokeStyle = alpha(WV.foam, 0.22 * a);
    ctx.lineWidth = 1;
    for (let k = 0; k < 5; k++) {
      const yy = y0 + ((s.tick * 0.25 + (k * h) / 5) % h);
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) ctx.lineTo(x0 + (i / 24) * w, yy + Math.sin(i * 0.9 + s.tick * 0.05 + k) * 2);
      ctx.stroke();
    }
  });
}

/** 몸 뒤 */
export function drawWaveBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isWave(p) || s.over) return;
  if (p.wvFlood) floodLayer(ctx, s, p.wvFlood);
  bits(ctx, s, snap, true);
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  if (p.wvMist) mist(ctx, x, y - 4, 56, s.tick, Math.min(1, p.wvMist / 30));
  if (p.wvWings) waterWings(ctx, x, y - 13, Math.min(1, p.wvWings / 20), s.tick);
  const v = p.wvSurf;
  if (v) {
    // 서핑: 발밑 보드 + 뒤에서 말려 오는 큰 파도
    ripple(ctx, x, y + 3, 14 + (s.tick % 10), 0.7, 1.2);
    crestWave(ctx, x - v.dx * 10, y - v.dy * 10 - 4, Math.atan2(v.dy, v.dx), 22, 1, s.tick);
    ctx.save();
    ctx.translate(x, y + 2);
    ctx.rotate(Math.atan2(v.dy, v.dx));
    ctx.fillStyle = "#f2c14e";
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 3, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = WV.deep;
    ctx.fillRect(-6, -0.5, 12, 1);
    ctx.restore();
  }
}

/** 머리 위 상상력 막대 · 상상의 물감이면 다음 기술 아이콘 */
function gauge(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const r = Math.min(1, (p.wvGauge ?? 0) / WAVE.gaugeMax);
  const top = hpBarTop(p, y) - 5;
  const w = 18;
  ctx.fillStyle = "rgba(4,16,32,0.9)";
  ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 4);
  const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  g.addColorStop(0, WV.deep);
  g.addColorStop(1, r > 0.85 ? WV.foam : WV.aqua);
  ctx.fillStyle = g;
  ctx.fillRect(x - w / 2, top, Math.round(w * r), 2);
  if (r > 0.6) additive(ctx, () => glow(ctx, x - w / 2 + w * r, top + 1, 4, WV.aqua, r));
  if (p.weaponId === "wvDream" && p.wvNext) {
    const ic = iconCanvas({ kind: "passive", id: p.wvNext as never });
    const bob = Math.sin(s.tick * 0.12) * 1;
    additive(ctx, () => glow(ctx, x, top - 8 + bob, 9, WV.pink, 0.5));
    ctx.drawImage(ic, x - 6, top - 14 + bob, 12, 12);
  }
}

/** 막 나간 기술 이름 (머리 위에 떠올랐다 사라짐) */
let lang = detectLang();
let langAt = -999;
function skillName(ctx: Ctx, s: RunState, x: number, y: number): void {
  const last = s.player.wvLast;
  const age = last ? s.tick - last.t : 99;
  if (!last || age > 50 || age < 0) return;
  if (s.tick - langAt > 600) [lang, langAt] = [detectLang(), s.tick];
  const text = itemName("passive", last.k as never, lang);
  const t = age / 50;
  ctx.font = `bold ${8 + Math.min(1, age / 6) * 2}px sans-serif`;
  ctx.textAlign = "center";
  ctx.globalAlpha = Math.min(1, (1 - t) * 3);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#04203a";
  const ty = hpBarTop(s.player, y) - 22 - t * 6;
  ctx.strokeText(text, x, ty);
  ctx.fillStyle = WV.sky;
  ctx.fillText(text, x, ty);
  ctx.globalAlpha = 1;
}

/** 몸 위 */
export function drawWaveAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isWave(p) || s.over) return;
  bits(ctx, s, snap, false);
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  if (p.wvArmor) {
    // 물의 갑옷: 몸을 감싼 물 껍질 (일렁이는 테두리 · 흐르는 빛무늬)
    const a = Math.min(1, p.wvArmor / 20) * (0.7 + Math.sin(s.tick * 0.2) * 0.1);
    waterFill(ctx, x, y - 6, 12, a * 0.45, () => {
      ctx.beginPath();
      for (let i = 0; i <= 18; i++) {
        const t = (i / 18) * TAU;
        const rr = 12 + Math.sin(t * 4 + s.tick * 0.2) * 0.8;
        ctx.lineTo(x + Math.cos(t) * rr, y - 6 + Math.sin(t) * rr * 1.15);
      }
      ctx.closePath();
    }, 1.2);
    softLight(ctx, x, y - 6, 9, 10, s.tick, a);
    glints(ctx, x, y - 6, 12, 2, s.tick, 3, WV.foam, a);
  }
  if (!s.pvp) gauge(ctx, s, x, y);
  skillName(ctx, s, x, y);
}
