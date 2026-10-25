// 이무기 몸 효과: 용을 부른 흔적(영구 여의주 빛) · 콤보 72 오라(용의 기운이 몸에서 피어오름) · 콤보 108 용이 된 몸 8초(몸을 감아 도는 용 기운·비늘 불꽃·번개) · 들어설 때 효과 · 왼쪽 위 "35 COMBO"
import { DRAGON_COLORS, IMUGI, imugiCrit, WEAPONS, type EffectState, type RunState, type WeaponDef } from "@pixel-rogue/shared";

const weapon = (s: RunState): WeaponDef => WEAPONS[s.player.weaponId];
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 0(흰 금빛) → 1(붉은빛) 사이 색 */
function heat(k: number): string {
  const t = Math.max(0, Math.min(1, k));
  const r = 255;
  const g = Math.round(236 - 200 * t);
  const b = Math.round(160 - 130 * t);
  return `rgb(${r},${g},${b})`;
}

/** 위로 피어오르는 기운 조각 (자리마다 정해진 흔들림) */
function wisps(ctx: Ctx, x: number, y: number, r: number, n: number, tick: number, color: string, alpha: number, tall: number): void {
  for (let i = 0; i < n; i++) {
    const k = ((tick * 1.3 + i * 37) % 40) / 40;
    const a = (i / n) * Math.PI * 2 + i * 0.7;
    const wx = x + Math.cos(a) * r * (1 - k * 0.3) + Math.sin(tick * 0.2 + i) * 1.5;
    const wy = y + Math.sin(a) * r * 0.5 - k * tall;
    ctx.globalAlpha = alpha * (1 - k);
    ctx.fillStyle = i % 3 === 0 ? "#fff6d0" : color;
    ctx.fillRect(wx - 1, wy - 2, 2, 3 + (i % 2));
  }
  ctx.globalAlpha = 1;
}

export function drawImugiBody(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "imugi" || s.over) return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const c = DRAGON_COLORS[weapon(s).dragon ?? "plain"];
  const form = p.imForm ?? 0;
  // 용을 부른 흔적 (영구): 몸 둘레를 천천히 도는 작은 여의주 빛 (부른 수만큼, 최대 5) · 은은한 발밑 빛
  const wakes = Math.min(5, p.imWakes ?? 0);
  if (wakes > 0) {
    ctx.globalAlpha = 0.18 + 0.06 * Math.sin(s.tick * 0.05);
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y + p.r - 1, p.r + 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < wakes; i++) {
      const a = s.tick * 0.03 + (i / wakes) * Math.PI * 2;
      const ox = x + Math.cos(a) * (p.r + 7);
      const oy = y - 2 + Math.sin(a) * 4;
      ctx.globalAlpha = 0.55 + 0.25 * Math.sin(s.tick * 0.1 + i);
      ctx.fillStyle = c;
      ctx.fillRect(ox - 1.5, oy - 1.5, 3, 3);
      ctx.fillStyle = "#fff6d0";
      ctx.fillRect(ox - 0.5, oy - 0.5, 1, 1);
    }
    ctx.globalAlpha = 1;
  }
  if (form > 0) {
    // 용이 된 몸: 발밑 빛 고리 · 몸을 감아 도는 두 줄기 용 기운 · 크게 솟는 기운 · 가끔 번개
    const fade = Math.min(1, form / 40);
    ctx.globalAlpha = 0.35 * fade;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y + p.r - 1, p.r + 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.8 * fade;
    ctx.strokeStyle = "#fff6d0";
    ctx.lineWidth = 1;
    ctx.stroke();
    for (let k = 0; k < 2; k++) {
      for (let i = 0; i < 18; i++) {
        const t = i / 18;
        const a = s.tick * 0.16 + t * Math.PI * 3 + k * Math.PI;
        const px = x + Math.cos(a) * (p.r + 6);
        const py = y + p.r - t * (p.r * 2 + 18) + Math.sin(a) * 3;
        const size = 3 - t * 1.6;
        ctx.globalAlpha = fade * (0.9 - t * 0.5);
        ctx.fillStyle = i === 17 ? "#fff6d0" : i % 3 === 0 ? "#ffffff" : c;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
      }
    }
    wisps(ctx, x, y + p.r - 2, p.r + 8, 22, s.tick, c, fade, 34);
    if (s.tick % 20 < 3) {
      const bx = x + ((s.tick * 13) % 21) - 10;
      ctx.globalAlpha = fade;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx, y - p.r - 18);
      ctx.lineTo(bx + 3, y - p.r - 10);
      ctx.lineTo(bx - 2, y - p.r - 6);
      ctx.lineTo(bx + 1, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return;
  }
  if ((p.imCombo ?? 0) < IMUGI.aura) return;
  // 오라: 발밑 은은한 빛 + 몸에서 피어오르는 용의 기운
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.ellipse(x, y + p.r - 1, p.r + 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  wisps(ctx, x, y + p.r - 2, p.r + 3, 12, s.tick, c, 0.75, 20);
}

/** 들어설 때: 72 기운이 차오름(빛 기둥이 솟음) · 108 용이 됨(큰 충격파 고리 + 빛 기둥 + 사방으로 비늘 빛) */
export function drawImugiPowerFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "imRise" && fx.kind !== "imAwaken") return false;
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const c = fx.tint ?? "#ffd040";
  const big = fx.kind === "imAwaken";
  const w = (big ? 14 : 8) * t;
  const h = (big ? 90 : 50) * Math.min(1, (1 - t) * 4);
  ctx.globalAlpha = t * 0.7;
  ctx.fillStyle = c;
  ctx.fillRect(x - w / 2, y - h, w, h + 4);
  ctx.globalAlpha = t;
  ctx.fillStyle = "#fff6d0";
  ctx.fillRect(x - w / 6, y - h, w / 3, h + 4);
  for (let k = 0; k < (big ? 3 : 1); k++) {
    ctx.globalAlpha = t * (1 - k * 0.25);
    ctx.strokeStyle = k ? c : "#fff";
    ctx.lineWidth = big ? 3 - k : 2;
    ctx.beginPath();
    ctx.ellipse(x, y, fx.size * (1 - t) * (1 + k * 0.35) + 4, (fx.size * (1 - t) * (1 + k * 0.35) + 4) * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (big) {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const d = fx.size * 1.2 * (1 - t);
      ctx.globalAlpha = t;
      ctx.fillStyle = i % 2 ? c : "#fff";
      ctx.fillRect(x + Math.cos(a) * d - 1, y + Math.sin(a) * d * 0.6 - 1, 3, 3);
    }
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 화면 위 숫자 표시 배율: 게임 배율의 절반 (1~2) */
export function hudScale(scale: number): number {
  return Math.max(1, Math.min(2, scale / 2));
}

/** 화면 왼쪽 위 "35 COMBO" (108에 가까울수록 붉게, 72부터 살짝 뛰고, 용이 된 동안은 남은 초) · scale = 게임 1픽셀의 화면 픽셀 */
export function drawComboHud(ctx: Ctx, s: RunState, scale: number): void {
  const p = s.player;
  // 여의주는 콤보를 쓰지 않음
  if (p.characterId !== "imugi" || weapon(s).kind !== "dragon" || weapon(s).dragon === "pearl") return;
  const combo = p.imCombo ?? 0;
  const form = p.imForm ?? 0;
  // 화면이 커도 글자는 작게 (게임 배율의 절반쯤) · 살짝 투명하게
  const k = hudScale(scale);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  const pulse = combo >= IMUGI.aura ? 1 + 0.08 * Math.sin(s.tick * 0.3) : 1;
  ctx.save();
  ctx.globalAlpha = 0.85;
  // 협동이면 왼쪽 위 인원 표 아래로
  ctx.translate(6, s.party ? ((30 + 5 * s.party.length) * scale) / k : 16);
  ctx.scale(pulse, pulse);
  ctx.font = "bold 11px monospace";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#1a1622";
  const num = String(combo);
  ctx.strokeText(num, 0, 0);
  ctx.fillStyle = heat(combo / IMUGI.ult);
  ctx.fillText(num, 0, 0);
  const nw = ctx.measureText(num).width;
  ctx.font = "bold 6px monospace";
  ctx.strokeText("COMBO", nw + 3, 0);
  ctx.fillText("COMBO", nw + 3, 0);
  // 108까지 남은 막대
  const bw = 60;
  ctx.fillStyle = "rgba(20,16,30,0.8)";
  ctx.fillRect(0, 4, bw, 3);
  ctx.fillStyle = heat(combo / IMUGI.ult);
  ctx.fillRect(0, 4, (bw * Math.min(combo, IMUGI.ult)) / IMUGI.ult, 3);
  ctx.fillStyle = "#fff6d0";
  ctx.fillRect((bw * IMUGI.aura) / IMUGI.ult, 3, 1, 5);
  // 용이 된 남은 초 · 용을 부를 때마다 쌓인 치명타
  const lines = [form > 0 ? `DRAGON ${Math.ceil(form / 60)}s` : "", imugiCrit(p) > 0 ? `CRIT ${Math.round(imugiCrit(p) * 100)}%` : ""].filter(Boolean);
  ctx.font = "bold 6px monospace";
  lines.forEach((txt, i) => {
    ctx.fillStyle = i === 0 && form > 0 ? "#ffd040" : "#ff8a5a";
    ctx.strokeText(txt, 0, 16 + i * 9);
    ctx.fillText(txt, 0, 16 + i * 9);
  });
  ctx.restore();
}
