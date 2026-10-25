// 오니 그리기: 바닥 한파·서리 · 폭풍 · 신인족 기운 · 캐릭터 왼쪽 게이지 · 추가 공격 효과(번개·불꽃·금화·한파·어둠·빛·해일·물보라·영령·각성·휘두르기)
import { ONI, WEAPONS, type EffectState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 효과마다 같은 모양이 나오게 하는 작은 난수 (0~1) */
const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** 바닥: 한파(하늘색)·서리(푸른 번개 서리) */
export function drawOniGround(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const z of s.player.oZones ?? []) {
    const x = snap(z.x);
    const y = snap(z.y);
    const fade = Math.min(1, z.ticks / 30);
    ctx.globalAlpha = 0.22 * fade;
    ctx.fillStyle = z.kind === "azure" ? "#3a8ad8" : "#9ae8ff";
    ctx.beginPath();
    ctx.ellipse(x, y, z.r, z.r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.6 * fade;
    ctx.strokeStyle = z.kind === "azure" ? "#6ad8ff" : "#e0f8ff";
    ctx.lineWidth = 1;
    ctx.stroke();
    // 서리 결정
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 10; i++) {
      const a = hash(i + z.r) * Math.PI * 2;
      const r = hash(i * 3 + z.r) * z.r * 0.9;
      const tw = (s.tick + i * 7) % 40 < 20 ? 1 : 0.5;
      ctx.globalAlpha = 0.7 * fade * tw;
      ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 0.7), 1, 1);
    }
    ctx.globalAlpha = 1;
  }
}

/** 폭풍 · 신인족 기운 · 방망이 속성 불씨 · 왼쪽 게이지 (플레이어 다음) */
export function drawOni(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  for (const st of p.oStorms ?? []) {
    const x = snap(lerp(st.prevX, st.x, alpha));
    const y = snap(lerp(st.prevY, st.y, alpha));
    const r = ONI.wind.r * (p.oReach ?? 1);
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = 0.55 - i * 0.12;
      ctx.strokeStyle = i === 0 ? "#e0fff0" : "#8af0c0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const a0 = s.tick * 0.35 + i * 2.1;
      ctx.arc(x, y - 6, r * (0.45 + i * 0.25), a0, a0 + Math.PI * 1.2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  if (p.characterId !== "oni" || s.over || WEAPONS[p.weaponId].kind !== "club") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const god = (p.oGod ?? 0) > 0;
  if (god) {
    // 신인족: 금빛·붉은 불꽃 기운이 몸에서 피어오름
    for (let i = 0; i < 10; i++) {
      const t = ((s.tick * 0.6 + i * 13) % 30) / 30;
      const ox = (hash(i) - 0.5) * 16;
      ctx.globalAlpha = 0.8 * (1 - t);
      ctx.fillStyle = i % 3 === 0 ? "#ff4a2a" : "#ffd040";
      ctx.fillRect(Math.round(x + ox), Math.round(y + 4 - t * 26), 2, 2);
    }
    ctx.globalAlpha = 0.25 + 0.1 * Math.sin(s.tick * 0.2);
    ctx.strokeStyle = "#ffd040";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 11, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 캐릭터 왼쪽 세로 게이지 (신인족이면 금빛으로 남은 시간)
  const gx = x - 13;
  const top = y - 16;
  const h = 20;
  const k = god ? (p.oGod ?? 0) / ONI.godTicks : (p.oGauge ?? 0) / ONI.gaugeMax;
  ctx.fillStyle = "rgba(10,8,16,0.85)";
  ctx.fillRect(gx - 1, top - 1, 4, h + 2);
  ctx.fillStyle = god ? ((s.tick >> 3) % 2 ? "#ffd040" : "#fff0a0") : k >= 0.8 ? "#ff6a3a" : "#c8443a";
  const fill = Math.round(h * k);
  ctx.fillRect(gx, top + h - fill, 2, fill);
  if (!god && k >= 0.8 && (s.tick >> 2) % 2 === 0) {
    ctx.fillStyle = "#ffe0a0";
    ctx.fillRect(gx, top + h - fill, 2, 1);
  }
}

/** 부채꼴 번개 가닥들 (색 · 검은 번개는 보라 테두리) */
function bolts(ctx: Ctx, fx: EffectState, x: number, y: number, t: number): void {
  const half = Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.35)));
  const base = Math.atan2(fx.dirY, fx.dirX);
  const dark = fx.tint === "#1a1020";
  for (let i = 0; i < 7; i++) {
    const a = base - half + (half * 2 * (i + 0.5)) / 7;
    const len = fx.size * (0.7 + hash(i + fx.x) * 0.3);
    const pts: [number, number][] = [[x, y]];
    for (let j = 1; j <= 5; j++) {
      const d = (len * j) / 5;
      const off = (hash(i * 11 + j + Math.floor(fx.ticks / 3)) - 0.5) * 8;
      pts.push([x + Math.cos(a) * d - Math.sin(a) * off, y + Math.sin(a) * d + Math.cos(a) * off]);
    }
    for (const [w, c] of dark ? [[3, "#9a6aff"], [1, "#0a0610"]] : [[3, fx.tint ?? "#ffe04a"], [1, "#ffffff"]]) {
      ctx.strokeStyle = c as string;
      ctx.lineWidth = w as number;
      ctx.globalAlpha = t;
      ctx.beginPath();
      pts.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.stroke();
    }
  }
}

/** 부채꼴로 흩어지는 조각들 (불꽃·금화) */
function scatter(ctx: Ctx, fx: EffectState, x: number, y: number, t: number, colors: string[], sz: number): void {
  const half = Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.2)));
  const base = Math.atan2(fx.dirY, fx.dirX);
  const go = 1 - t;
  for (let i = 0; i < 26; i++) {
    const a = base + (hash(i) * 2 - 1) * half;
    const r = fx.size * (0.2 + hash(i + 50) * 0.8) * Math.min(1, go * 1.6);
    ctx.globalAlpha = Math.min(1, t * 1.5);
    ctx.fillStyle = colors[i % colors.length]!;
    const s2 = sz + (i % 3 === 0 ? 1 : 0);
    ctx.fillRect(Math.round(x + Math.cos(a) * r - s2 / 2), Math.round(y + Math.sin(a) * r - s2 / 2 - Math.sin(go * Math.PI) * 4 * hash(i + 9)), s2, s2);
  }
}

const ONI_FX = new Set(["oBolt", "oFlame", "oCoins", "oFrost", "oDark", "oPillar", "oWave", "oSplash", "oSpirit", "oGod", "oSwing"]);

/** 오니 효과면 그리고 true */
export function drawOniFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!ONI_FX.has(fx.kind)) return false;
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const tint = fx.tint ?? "#ffffff";
  switch (fx.kind) {
    case "oSwing": {
      const a = Math.atan2(fx.dirY, fx.dirX);
      const sweep = (1 - t) * 2.2 - 1.1;
      ctx.globalAlpha = t * 0.8;
      ctx.strokeStyle = "#e8e0f0";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y - 3, fx.size * 0.85, a - 1.1, a + sweep);
      ctx.stroke();
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }
    case "oBolt":
      bolts(ctx, fx, x, y, t);
      break;
    case "oFlame":
      scatter(ctx, fx, x, y, t, ["#ff4a1a", "#ff8a2a", "#ffd040", "#c82a1a"], 3);
      break;
    case "oCoins":
      scatter(ctx, fx, x, y, t, ["#ffd040", "#fff0a0", "#c88a20"], 3);
      break;
    case "oFrost": {
      ctx.globalAlpha = t;
      ctx.strokeStyle = tint;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x, y, fx.size * (1.1 - t * 0.5), fx.size * (1.1 - t * 0.5) * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = fx.size * (1 - t) * 1.1;
        ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 0.7), 2, 2);
      }
      if (fx.dirX) bolts(ctx, { ...fx, size: fx.size * 0.6, width: -1 }, x, y - 4, t * 0.6);
      break;
    }
    case "oDark": {
      ctx.globalAlpha = t;
      ctx.fillStyle = "#2a1040";
      ctx.beginPath();
      ctx.arc(x, y - 3, fx.size * (1 - t) * 0.7 + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + hash(i) * 0.4;
        const r = fx.size * (1.2 - t * 0.7);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 3, y - 3 + Math.sin(a) * 3);
        ctx.lineTo(x + Math.cos(a) * r, y - 3 + Math.sin(a) * r);
        ctx.stroke();
      }
      break;
    }
    case "oPillar": {
      // 하늘에서 내리꽂는 빛 기둥 + 사방으로 터지는 빛
      const w = 10 * t + 2;
      ctx.globalAlpha = t;
      ctx.fillStyle = "#fff8d8";
      ctx.fillRect(x - w / 2, y - 120, w, 120);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - w / 4, y - 120, w / 2, 120);
      ctx.strokeStyle = "#ffd040";
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = fx.size * (1.3 - t);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4);
        ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        ctx.stroke();
      }
      break;
    }
    case "oWave": {
      const a = Math.atan2(fx.dirY, fx.dirX);
      const half = Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.3)));
      for (let i = 0; i < 3; i++) {
        const r = fx.size * ((1 - t) * 0.9 + 0.1) - i * 6;
        if (r <= 2) continue;
        ctx.globalAlpha = t * (1 - i * 0.25);
        ctx.strokeStyle = i === 0 ? "#e0f4ff" : tint;
        ctx.lineWidth = 4 - i;
        ctx.beginPath();
        ctx.arc(x, y - 2, r, a - half, a + half);
        ctx.stroke();
      }
      break;
    }
    case "oSplash": {
      const k = 1 - t;
      const tx = fx.toX ?? x;
      const ty = fx.toY ?? y;
      ctx.globalAlpha = t;
      ctx.fillStyle = "#7ac8ff";
      for (let i = 0; i < 4; i++) {
        const u = Math.min(1, k * 1.5 - i * 0.1);
        if (u <= 0) continue;
        ctx.fillRect(Math.round(x + (tx - x) * u), Math.round(y + (ty - y) * u - Math.sin(u * Math.PI) * 8), 2, 2);
      }
      if (k > 0.6) {
        ctx.strokeStyle = "#e0f4ff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(snap(tx), snap(ty), 3 + (k - 0.6) * 12, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case "oSpirit": {
      // 서늘한 영령이 솟아오름
      const up = (1 - t) * 14;
      ctx.globalAlpha = t * 0.9;
      ctx.fillStyle = "#e0f8ff";
      ctx.beginPath();
      ctx.arc(x, y - 8 - up, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - 4, y - 8 - up, 8, 7);
      ctx.fillStyle = tint;
      ctx.fillRect(x - 2, y - 9 - up, 1, 1);
      ctx.fillRect(x + 1, y - 9 - up, 1, 1);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, fx.size * (1 - t * 0.5), 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "oGod": {
      ctx.globalAlpha = t;
      ctx.strokeStyle = "#ffd040";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y - 6, fx.size * (1.6 - t), 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        ctx.strokeStyle = i % 2 ? "#ff4a2a" : "#fff0a0";
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 8, y - 6 + Math.sin(a) * 8);
        ctx.lineTo(x + Math.cos(a) * fx.size * (2 - t), y - 6 + Math.sin(a) * fx.size * (2 - t));
        ctx.stroke();
      }
      break;
    }
  }
  ctx.globalAlpha = 1;
  return true;
}
