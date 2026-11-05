// 웨이브 그리기 (몸 둘레). 몸 뒤: 만조 · 바닥에 깔리는 것(웅덩이·물시계·발자국·눈·고리·고래 그림자·문어·분수·연꽃) · 물안개 · 물의 날개 · 서핑 파도
// 몸 위: 나머지 빚은 것 · 물의 갑옷 · 머리 위 상상력 막대 · 다음 기술(상상의 물감) · 막 나간 기술 이름
import { isWave, WAVE, type RunState } from "@pixel-rogue/shared";
import { detectLang } from "../../i18n";
import { itemName } from "../../i18n/items";
import { iconCanvas } from "../iconArt";
import { hpBarTop } from "./hpTop";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, shock, type Ctx } from "./pwFxBits";
import { caustic, glints } from "./seaLight";
import { crestWave, waterFill, WV } from "./waveArt";
import { BITS_A, type BitDraw } from "./waveBits";
import { BITS_B, floodLayer } from "./waveBits2";

const DRAW: Record<string, BitDraw> = { ...BITS_A, ...BITS_B };
const GROUND = new Set(["wvPuddle", "wvClock", "wvTrail", "wvEye", "wvEbb", "wvWhale", "wvOctopus", "wvFountain", "wvLotus"]);
const TAU = Math.PI * 2;

function bits(ctx: Ctx, s: RunState, snap: Snap, ground: boolean): void {
  for (const b of s.player.wvBits ?? []) {
    if (GROUND.has(b.k) !== ground) continue;
    DRAW[b.k]?.(ctx, s, b, snap(b.x), snap(b.y));
  }
}

/** 물의 날개 (등 뒤, 날갯짓) */
function wings(ctx: Ctx, x: number, y: number, a: number, tick: number): void {
  const flap = Math.sin(tick * 0.25) * 0.35;
  for (const sd of [-1, 1]) {
    ctx.save();
    ctx.translate(x + sd * 2, y - 10);
    ctx.scale(sd, 1);
    ctx.rotate(-0.3 - flap);
    additive(ctx, () => glow(ctx, 10, -4, 16, WV.aqua, 0.45 * a));
    for (let k = 0; k < 4; k++) {
      waterFill(ctx, 6 + k * 3, -4 + k * 2, 6, a * (1 - k * 0.15), () => {
        ctx.beginPath();
        ctx.ellipse(6 + k * 3.5, -4 + k * 2.5, 9 - k * 1.5, 2.6, -0.5 + k * 0.25, 0, TAU);
      }, 0.7);
    }
    ctx.restore();
  }
}

/** 몸 뒤 */
export function drawWaveBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isWave(p) || s.over) return;
  if (p.wvFlood) floodLayer(ctx, s, p.wvFlood);
  bits(ctx, s, snap, true);
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  if (p.wvMist) {
    const a = Math.min(1, p.wvMist / 30);
    for (let i = 0; i < 7; i++) {
      const t = s.tick * 0.02 + i * 0.9;
      ctx.fillStyle = alpha("#e6f6ff", 0.14 * a);
      ctx.beginPath();
      ctx.arc(x + Math.cos(t) * 34, y + Math.sin(t) * 24, 18 + (i % 3) * 5, 0, TAU);
      ctx.fill();
    }
    additive(ctx, () => shock(ctx, x, y, 56, WV.pale, 0.25 * a, 8));
  }
  if (p.wvWings) wings(ctx, x, y, Math.min(1, p.wvWings / 20), s.tick);
  const v = p.wvSurf;
  if (v) {
    // 서핑: 발밑 보드 + 뒤에서 말려 오는 큰 파도
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
    caustic(ctx, x, y - 6, 9, s.tick, 0.6 * a);
    glints(ctx, x, y - 6, 12, 2, s.tick, 3, WV.foam, a);
  }
  if (!s.pvp) gauge(ctx, s, x, y);
  skillName(ctx, s, x, y);
}
