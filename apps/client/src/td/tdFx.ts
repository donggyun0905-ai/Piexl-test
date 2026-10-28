// 타워 디펜스 화면 꾸밈 (계산과 상관없음): 넓은 맵에서도 보이게 타워가 공격할 때 그 캐릭터 색으로 빛나는 베기·섬광,
// 적이 맞으면 튀는 불똥, 타워가 맞으면 붉은 섬광. 틱마다 이전 상태와 비교해 생긴 것만 띄움 (겹치면 밝아지는 빛)
import { PW_MOTIF, type CharacterId, type TdState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, glow, sparks } from "../game/render/pwFxBits";

const MOTIF_COLOR: Record<string, string> = {
  fire: "#ff7a3a", elements: "#ff9a5a", lightning: "#8ad8ff", tech: "#5ad8ff", poison: "#8aff6a", shadow: "#9a6aff", holy: "#fff0a0",
  blood: "#ff3a4a", nature: "#8aff8a", spirit: "#a8e8ff", beast: "#ffd070", wind: "#e8f4ff", time: "#e8d8a0", impact: "#e8c890", blade: "#c8d8ff",
};
const colorOf = (c: CharacterId) => MOTIF_COLOR[PW_MOTIF[c] ?? ""] ?? "#ffe8a0";

interface Pop {
  kind: "swing" | "spark" | "hurt";
  x: number;
  y: number;
  a: number;
  color: string;
  born: number;
  size: number;
}

const LIFE = { swing: 12, spark: 14, hurt: 16 };

interface Memo {
  attacks: Map<number, number>;
  towerHp: Map<number, number>;
  enemyHp: Map<number, number>;
  pops: Pop[];
  tick: number;
}

const memos = new WeakMap<TdState, Memo>();

/** 틱이 지났으면 새로 생긴 공격·맞음을 찾아 둠 */
function observe(td: TdState, m: Memo): void {
  const s = td.run;
  if (s.tick === m.tick) return;
  m.tick = s.tick;
  for (const t of td.towers) {
    const p = t.atk[0]!.p;
    const count = t.atk.reduce((n, a) => n + a.p.attackCount, 0);
    if (count > (m.attacks.get(t.id) ?? count)) m.pops.push({ kind: "swing", x: p.x, y: p.y, a: Math.atan2(p.faceY, p.faceX), color: colorOf(t.character), born: s.tick, size: Math.min(26, p.stats.range * 0.4 + 8) });
    m.attacks.set(t.id, count);
    if (t.hp < (m.towerHp.get(t.id) ?? t.hp) - 0.5) m.pops.push({ kind: "hurt", x: p.x, y: p.y, a: 0, color: "#ff4a4a", born: s.tick, size: 12 });
    m.towerHp.set(t.id, t.hp);
  }
  const seen = new Map<number, number>();
  for (const e of s.enemies) {
    const before = m.enemyHp.get(e.id);
    if (before !== undefined && e.hp < before - 0.5 && m.pops.length < 160) m.pops.push({ kind: "spark", x: e.x, y: e.y - e.r * 0.5, a: 0, color: "#ffe8a0", born: s.tick, size: Math.max(6, e.r * 1.2) });
    seen.set(e.id, e.hp);
  }
  m.enemyHp = seen;
  m.pops = m.pops.filter((p) => s.tick - p.born < LIFE[p.kind]);
}

export function drawTdFx(ctx: CanvasRenderingContext2D, td: TdState): void {
  let m = memos.get(td);
  if (!m) {
    m = { attacks: new Map(), towerHp: new Map(), enemyHp: new Map(), pops: [], tick: -1 };
    memos.set(td, m);
  }
  observe(td, m);
  const tick = td.run.tick;
  additive(ctx, () => {
    for (const p of m.pops) {
      const f = (tick - p.born) / LIFE[p.kind];
      const t = 1 - f;
      if (p.kind === "swing") {
        glow(ctx, p.x, p.y, p.size * 0.8, p.color, 0.5 * t, 1);
        crescent(ctx, p.x, p.y, p.size * (0.7 + f * 0.4), p.a, 0.9, p.size * 0.3, p.color, t);
      } else if (p.kind === "spark") {
        glow(ctx, p.x, p.y, p.size * (0.6 + f * 0.6), p.color, 0.7 * t, 1.5);
        sparks(ctx, p.x, p.y, 6, p.size * 1.4, f, p.color, Math.round(p.x * 3 + p.y));
      } else {
        glow(ctx, p.x, p.y, p.size * (1 + f), alpha(p.color, 1), 0.8 * t, 0.5);
      }
    }
  });
}
