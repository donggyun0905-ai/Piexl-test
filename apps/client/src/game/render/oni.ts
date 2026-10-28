// 오니 그리기: 바닥 한파·서리 · 폭풍 · 신인족 기운 · 캐릭터 왼쪽 게이지 (추가 공격 효과는 oniFx)
import { ONI, WEAPONS, type RunState } from "@pixel-rogue/shared";
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
