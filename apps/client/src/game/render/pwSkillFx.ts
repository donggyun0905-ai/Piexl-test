// 패왕전 스킬 그림 (pwFx·pwWarn, 색은 스킬마다 tint, 위에 캐릭터 느낌 pwSkillMotif). 빛은 겹치면 밝아지게(additive) 칠함
// 폭발 · 낙하(하늘에서 떨어짐) · 빛기둥 · 비 · 빛줄기 · 파동 · 베기(초승달) · 회오리 · 돌진 자국 · 순간이동 · 오라 · 장판 · 회복 · 그물 · 소환 · 예고
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, alpha, beam, cone, crescent, easeOut, glow, lineBand, ring, rnd, rune, shock, sparks, warn, type Ctx } from "./pwFxBits";
import { drawMotif } from "./pwSkillMotif";

const STYLES = ["burst", "meteor", "pillar", "rain", "beam", "wave", "slash", "spin", "dash", "blink", "aura", "field", "heal", "net", "summon"] as const;
type Style = (typeof STYLES)[number];

interface Args {
  x: number;
  y: number;
  r: number;
  c: string;
  /** 남은 비율 1→0 · 지난 비율 0→1 */
  t: number;
  f: number;
  /** 바라보는 각 · 꾸밈 씨앗 */
  a: number;
  seed: number;
  fx: EffectState;
}

type Draw = (ctx: Ctx, o: Args) => void;

const burst: Draw = (ctx, { x, y, r, c, t, f, seed, fx }) => {
  const e = easeOut(f);
  additive(ctx, () => {
    // 터지는 순간 흰 빛 → 색 빛
    glow(ctx, x, y, r * (0.5 + e * 0.9), c, 0.9 * t, f < 0.25 ? 2 : 0.6);
    shock(ctx, x, y, r * (0.3 + e * 1.0), c, t, r * 0.35);
    shock(ctx, x, y, r * (0.15 + e * 0.7), "#ffffff", 0.6 * t, r * 0.2);
    sparks(ctx, x, y, fx.ult ? 22 : 14, r * 1.3, f, c, seed);
  });
  // 남는 연기
  ctx.fillStyle = `rgba(30,24,40,${0.25 * t})`;
  for (let k = 0; k < 5; k++) {
    const aa = rnd(seed, k + 20) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(aa) * r * 0.5 * e, y + Math.sin(aa) * r * 0.5 * e - f * 6, r * 0.25 * (0.5 + e), 0, Math.PI * 2);
    ctx.fill();
  }
};

const meteor: Draw = (ctx, o) => {
  const { x, y, r, c, f } = o;
  // 처음 20%: 하늘에서 비스듬히 떨어지는 불덩이, 그 뒤 터짐
  if (f < 0.2) {
    const u = f / 0.2;
    const sx = x - 60 * (1 - u);
    const sy = y - 120 * (1 - u);
    additive(ctx, () => {
      beam(ctx, sx - 30, sy - 60, sx, sy, r * 0.5, o.c, 0.8);
      glow(ctx, sx, sy, r * 0.8, c, 1, 2);
    });
    return;
  }
  burst(ctx, { ...o, f: (f - 0.2) / 0.8, t: 1 - (f - 0.2) / 0.8 });
  // 갈라진 땅
  ctx.strokeStyle = `rgba(20,12,8,${0.7 * o.t})`;
  ctx.lineWidth = 1;
  for (let k = 0; k < 7; k++) {
    const aa = (k / 7) * Math.PI * 2 + rnd(o.seed, k + 9);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(aa) * r * 0.5, y + Math.sin(aa) * r * 0.3);
    ctx.lineTo(x + Math.cos(aa + 0.2) * r * 0.9, y + Math.sin(aa + 0.2) * r * 0.55);
    ctx.stroke();
  }
};

const pillar: Draw = (ctx, { x, y, r, c, t, f, fx }) => {
  const w = r * (1 - f * 0.5) * (fx.ult ? 1.3 : 1);
  additive(ctx, () => {
    const g = ctx.createLinearGradient(x, y - 140, x, y);
    g.addColorStop(0, alpha(c, 0));
    g.addColorStop(0.6, alpha(c, 0.7 * t));
    g.addColorStop(1, alpha(c, t));
    ctx.fillStyle = g;
    ctx.fillRect(x - w / 2, y - 140, w, 140);
    const core = ctx.createLinearGradient(x, y - 140, x, y);
    core.addColorStop(0, "rgba(255,255,255,0)");
    core.addColorStop(1, `rgba(255,255,255,${t})`);
    ctx.fillStyle = core;
    ctx.fillRect(x - w / 6, y - 140, w / 3, 140);
    glow(ctx, x, y, r * 1.4, c, t, 1.5);
    shock(ctx, x, y, r * (0.4 + easeOut(f) * 0.9), c, t, r * 0.3);
  });
};

const rain: Draw = (ctx, { x, y, r, c, t, f, a, seed, fx }) => {
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let k = 0; k < (fx.ult ? 24 : 16); k++) {
      const ang = fx.arc ? a + (rnd(seed, k) - 0.5) * 2 * fx.arc : rnd(seed, k) * Math.PI * 2;
      const d = fx.arc ? r * (0.2 + rnd(k, seed) * 0.8) : r * Math.sqrt(rnd(k, seed));
      const px = x + Math.cos(ang) * d;
      const py = y + Math.sin(ang) * d;
      const u = (f * 1.6 + rnd(k, 7)) % 1;
      // 떨어지는 줄 → 닿으면 작은 물결
      if (u < 0.6) beam(ctx, px - 3, py - 18 * (1 - u / 0.6) - 6, px, py - 18 * (1 - u / 0.6), 1.5, c, t);
      else ring(ctx, px, py, 1 + (u - 0.6) * 10, alpha(c, t * (1 - u)), 1);
    }
    ctx.lineCap = "butt";
    if (!fx.arc) ring(ctx, x, y, r, alpha(c, 0.4 * t), 1);
  });
};

const beamFx: Draw = (ctx, { x, y, r, c, t, f, a, fx }) => {
  additive(ctx, () => {
    if (fx.toX !== undefined && fx.toY !== undefined) {
      const flick = 0.85 + 0.15 * Math.sin(f * 50);
      beam(ctx, x, y, fx.toX, fx.toY, (r * 2 + 2) * t * flick, c, t);
      glow(ctx, x, y, r * 2.5, c, t, 1.5);
      glow(ctx, fx.toX, fx.toY, r * 2, c, 0.8 * t, 1);
    } else cone(ctx, x, y, a, fx.arc ?? 0.8, r, c, t);
  });
};

const wave: Draw = (ctx, { x, y, r, c, t, f, a, fx }) => {
  const e = easeOut(f);
  additive(ctx, () => {
    if (fx.arc) {
      cone(ctx, x, y, a, fx.arc, r * (0.3 + e * 0.7), c, t * 0.8);
      crescent(ctx, x, y, r * (0.3 + e * 0.7), a, fx.arc, r * 0.25, c, t);
    } else {
      shock(ctx, x, y, r * (0.2 + e * 0.9), c, t, r * 0.45);
      shock(ctx, x, y, r * (0.1 + e * 0.6), "#ffffff", 0.5 * t, r * 0.2);
    }
  });
};

const slash: Draw = (ctx, { x, y, r, c, t, f, a, fx }) => {
  const e = easeOut(f);
  additive(ctx, () => {
    const rr = Math.max(12, r);
    const arc = fx.arc ?? 1.1;
    // 휘두르는 방향으로 지나가며 남는 칼자국 + 잔상
    crescent(ctx, x, y, rr * (0.85 + e * 0.2), a - arc * (1 - e) * 0.4, arc * (0.4 + e * 0.6), rr * 0.35, c, t);
    crescent(ctx, x, y, rr * (0.75 + e * 0.2), a - arc * (1 - e) * 0.6, arc * 0.6, rr * 0.18, "#ffffff", 0.6 * t);
    sparks(ctx, x + Math.cos(a) * rr, y + Math.sin(a) * rr, 6, rr * 0.5, f, c, Math.round(a * 100));
  });
};

const spin: Draw = (ctx, { x, y, r, c, t, f }) => {
  const rr = Math.max(14, r);
  const rot = easeOut(f) * Math.PI * 5;
  additive(ctx, () => {
    for (let k = 0; k < 3; k++) crescent(ctx, x, y, rr, rot + (k / 3) * Math.PI * 2, 0.9, rr * 0.3, c, t * 0.9);
    glow(ctx, x, y, rr * 0.7, c, 0.4 * t);
    shock(ctx, x, y, rr * (0.8 + f * 0.3), c, 0.5 * t, rr * 0.15);
  });
};

const dash: Draw = (ctx, { x, y, r, c, t, f, a, seed }) => {
  additive(ctx, () => {
    // 지나온 쪽으로 늘어진 바람 줄 + 몸 둘레 빛
    for (let k = 0; k < 5; k++) {
      const off = (rnd(seed, k) - 0.5) * r * 1.2;
      const len = r * (1.5 + rnd(k, seed) * 1.5) * t;
      const px = x - Math.sin(a) * off;
      const py = y + Math.cos(a) * off;
      beam(ctx, px - Math.cos(a) * len, py - Math.sin(a) * len, px, py, 1.2, c, t * 0.8);
    }
    glow(ctx, x, y, r * 1.3, c, 0.6 * t, 1);
    sparks(ctx, x, y, 6, r, f, c, seed);
  });
};

const blink: Draw = (ctx, { x, y, r, c, t, f, seed }) => {
  additive(ctx, () => {
    // 빨려 들어갔다 터져 나오는 빛 알갱이 + 고리
    const inward = f < 0.4;
    const u = inward ? 1 - f / 0.4 : (f - 0.4) / 0.6;
    for (let k = 0; k < 12; k++) {
      const aa = rnd(seed, k) * Math.PI * 2;
      const d = r * 1.4 * u;
      glow(ctx, x + Math.cos(aa) * d, y + Math.sin(aa) * d - (inward ? 0 : u * 6), 2.5, k % 2 ? c : "#ffffff", t);
    }
    if (!inward) shock(ctx, x, y, r * (0.3 + u), c, t, r * 0.3);
    glow(ctx, x, y, r, c, 0.5 * t, 1);
  });
};

const aura: Draw = (ctx, { x, y, r, c, t, f, seed, fx }) => {
  const heal = fx.style === STYLES.indexOf("heal");
  const col = heal ? "#7aff8a" : c;
  rune(ctx, x, y + 2, r * (0.7 + easeOut(f) * 0.3), col, t, f * 3);
  additive(ctx, () => {
    glow(ctx, x, y, r * 0.9, col, 0.5 * t);
    // 솟아오르는 빛 기둥 조각 · 회복은 + 모양
    for (let k = 0; k < 9; k++) {
      const px = x + (rnd(seed, k) - 0.5) * r * 1.4;
      const u = (f + rnd(k, seed)) % 1;
      const py = y - u * 30;
      if (heal) {
        ctx.fillStyle = `rgba(160,255,170,${t * (1 - u)})`;
        ctx.fillRect(px - 2, py, 5, 1.5);
        ctx.fillRect(px - 0.25, py - 1.75, 1.5, 5);
      } else beam(ctx, px, py + 6, px, py, 1.2, col, t * (1 - u));
    }
  });
};

const field: Draw = (ctx, { x, y, r, c, t, f }) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, alpha(c, 0.15 + 0.1 * t));
  g.addColorStop(0.85, alpha(c, 0.3 + 0.15 * t));
  g.addColorStop(1, alpha(c, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  rune(ctx, x, y, r, c, 0.6 + 0.4 * t, f * 2);
  additive(ctx, () => shock(ctx, x, y, r * (0.5 + 0.5 * ((f * 2) % 1)), c, 0.35 * t, r * 0.15));
};

const net: Draw = (ctx, { x, y, r, c, t, f }) => {
  additive(ctx, () => {
    const rr = r * (0.6 + easeOut(f) * 0.4);
    ring(ctx, x, y, rr, alpha(c, t), 2);
    ctx.strokeStyle = alpha(c, 0.8 * t);
    ctx.lineWidth = 1;
    for (let k = 0; k < 8; k++) {
      const aa = (k / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(aa) * rr, y + Math.sin(aa) * rr);
      ctx.stroke();
    }
    for (const s of [0.35, 0.65]) ring(ctx, x, y, rr * s, alpha(c, 0.7 * t), 1);
    glow(ctx, x, y, rr * 0.5, c, 0.4 * t);
  });
};

const DRAW: Record<Style, Draw> = { burst, meteor, pillar, rain, beam: beamFx, wave, slash, spin, dash, blink, aura, field, heal: aura, net, summon: aura };

export function drawPwSkillFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "pwFx" && fx.kind !== "pwWarn") return false;
  const c = (fx.tint ?? "#ffffff").slice(0, 7);
  const t = fx.ticks / fx.maxTicks;
  const f = 1 - t;
  if (fx.kind === "pwWarn") {
    warn(ctx, fx, c, f);
    return true;
  }
  const style = STYLES[fx.style ?? 0] ?? "burst";
  const o: Args = { x: snap(fx.x), y: snap(fx.y), r: fx.size * (fx.ult ? 1.15 : 1), c, t, f, a: Math.atan2(fx.dirY, fx.dirX), seed: Math.round(fx.x * 7 + fx.y * 3), fx };
  ctx.save();
  // 줄 모양 스킬인데 줄 그림이 아닌 모양(파동·회오리·장판 등)은 줄을 따라 날아가는 빛으로
  if (fx.toX !== undefined && fx.toY !== undefined && style !== "beam" && style !== "slash") additive(ctx, () => lineBand(ctx, o.x, o.y, fx.toX!, fx.toY!, o.r, c, t, f));
  else DRAW[style](ctx, o);
  ctx.restore();
  drawMotif(ctx, fx, t, f, o.seed);
  return true;
}
