// 오니: 아이템으로 능력치가 바뀌면 (공격력 → 최대 체력 · 공격 속도 → 재생력 · 사거리 → 추가 공격 범위) 체력 줄 위에 작은 글자 "재생력 UP!"
// 화면 전용: 판(RunState)마다 지난 값을 기억해 늘어난 것만 띄움 (신인족이 켜지고 꺼질 때는 무시)
import type { RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

export type OniUp = "hp" | "regen" | "reach";
interface Seen {
  hp: number;
  regen: number;
  reach: number;
  god: boolean;
  ups: { kind: OniUp; tick: number }[];
}
const seen = new WeakMap<RunState, Seen>();
/** 글자가 떠 있는 틱 */
const LIFE = 70;
const COLOR: Record<OniUp, string> = { hp: "#ff8a8a", regen: "#8aff9a", reach: "#8ad8ff" };

export function drawOniUps(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap, label?: (k: OniUp) => string): void {
  const p = s.player;
  if (p.characterId !== "oni" || !label) return;
  const now = { hp: p.stats.maxHp, regen: p.oRegen ?? 0, reach: p.oReach ?? 1, god: (p.oGod ?? 0) > 0 };
  const old = seen.get(s);
  if (!old) {
    seen.set(s, { ...now, ups: [] });
    return;
  }
  if (old.god === now.god) {
    if (now.hp > old.hp + 0.5) old.ups.push({ kind: "hp", tick: s.tick });
    if (now.regen > old.regen + 0.05) old.ups.push({ kind: "regen", tick: s.tick });
    if (now.reach > old.reach + 0.001) old.ups.push({ kind: "reach", tick: s.tick });
  }
  Object.assign(old, now);
  old.ups = old.ups.filter((u) => s.tick - u.tick < LIFE);
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha)) + p.r - 35;
  ctx.font = "bold 5px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.lineWidth = 2;
  old.ups.forEach((u, i) => {
    const age = s.tick - u.tick;
    const ty = y - i * 6 - age * 0.12;
    ctx.globalAlpha = Math.min(1, (LIFE - age) / 20);
    ctx.strokeStyle = "#1a1018";
    ctx.strokeText(label(u.kind), x, ty);
    ctx.fillStyle = COLOR[u.kind];
    ctx.fillText(label(u.kind), x, ty);
  });
  ctx.globalAlpha = 1;
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}
