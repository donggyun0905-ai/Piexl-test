// 블뢰 그리기: 효과 시트 그림 한 칸 · 방에 흩날리는 눈결정 · 얼어 있는 적 · 날아가는 서리 결정탄 (악마 계급 마크는 느아르와 같이 render/noirArt)
// 그림 sprites/bleuFx.png (192칸 4×16, 줄 차례는 ROW) — scripts/art/bleu.py
import type { RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { sheetPic } from "./noirArt";
import { lerp, type Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";

export const BU = { ice: "#7ac8ff", light: "#e0f4ff", deep: "#2a6aff" };
/** 효과 시트의 줄 (scripts/art/bleu.py ROWS 차례) */
export const ROW = {
  buBolt: 0, buWolf: 1, buWave: 2, buHawk: 3, buBurst: 4, buDeer: 5, buWall: 6, buLegion: 7,
  buField: 8, buClock: 9, buHowl: 10, buZero: 11, buPrison: 12, buStop: 13, buEnd: 14, buRain: 15,
} as const;
export const buPic = sheetPic(img("bleuFx"));

/** 눈결정 하나 (여섯 갈래 선 + 빛) */
export function snowflake(ctx: Ctx, x: number, y: number, r: number, a: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.6, BU.ice, 0.35 * a, 0.3);
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.strokeStyle = BU.light;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const [c, n] = [Math.cos((i * Math.PI) / 3), Math.sin((i * Math.PI) / 3)];
      ctx.moveTo(x - c * r, y - n * r);
      ctx.lineTo(x + c * r, y + n * r);
    }
    ctx.stroke();
    ctx.restore();
  });
}

/** 바닥(몸보다 먼저): 눈결정이 제자리에서 천천히 내려오듯 흔들림 (얼음 시계 동안은 공중에 멈춤) · 얼어 있는 적의 얼음 껍질 */
export function drawBleuGround(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const still = s.freezeTicks > 0;
  for (const f of p.buFlakes ?? []) {
    const left = f.until - s.tick;
    const ph = still ? 0 : ((s.tick + f.x * 7) % 120) / 120;
    const a = Math.min(1, left / 60) * (still ? 1 : 0.55 + 0.45 * Math.sin(ph * Math.PI));
    const dx = still ? 0 : Math.sin((s.tick + f.y) * 0.03) * 3;
    snowflake(ctx, snap(f.x + dx), snap(f.y - 10 + ph * 14), 4, a);
  }
  if (p.characterId !== "bleu") return;
  for (const e of s.enemies) {
    if ((e.buIce ?? 0) <= s.tick || e.hp <= 0) continue;
    const x = snap(lerp(e.prevX, e.x, alpha));
    const y = snap(lerp(e.prevY, e.y, alpha));
    const a = Math.min(1, (e.buIce! - s.tick) / 15);
    additive(ctx, () => glow(ctx, x, y, e.r + 8, BU.ice, 0.5 * a, 0.35));
  }
}

/** 몸 위: 날아가는 서리 결정탄 (결정탄 그림 셋째 칸을 날아가는 쪽으로) */
export function drawBleuAir(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  for (const b of s.player.buBolts ?? []) {
    const ang = Math.atan2(b.dy, b.dx);
    const left = b.dx < 0;
    buPic(ctx, ROW.buBolt, 2, snap(b.x), snap(b.y), 44, 1, left ? ang + Math.PI : ang, left);
  }
}
