// 광야의 새벽 각성 기술: 각성한 무기는 능력치 + 무기마다 정해진 기술 하나 (기술 16가지, 한 캐릭터의 무기끼리는 겹치지 않음)
// 첫 묶음 6 (번개 폭풍 · 별똥별 · 서리 고리 · 회전 칼날 · 탄 세례 · 각성 파동)은 여기, 둘째 묶음 10은 swarmEvoNew
// 지금 run.player 기준 (그림자 공격자는 swarmGhosts가 run.player를 바꿔 부름)
import { ALL_CHARACTER_IDS, type CharacterId } from "../characters";
import { WEAPON_IDS, type WeaponId } from "../content";
import { characterWeapons } from "./loot";
import { evoSkill2, type SwarmSkill2 } from "./swarmEvoNew";
import { createRng, deriveSeed } from "../rng";
import { SWARM } from "../swarmDefs";
import { blastAt, dotDamage } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, normalize } from "./util";

export type SwarmSkill = "storm" | "comet" | "frost" | "blades" | "barrage" | "nova" | SwarmSkill2;
/** 기술 16가지 (비슷한 것끼리 떨어지게 섞은 순서) */
export const SKILLS: readonly SwarmSkill[] = ["wave", "storm", "bounce", "frost", "lance", "comet", "cleave", "blades", "curse", "fan", "chain", "barrage", "vortex", "pillar", "boomerang", "nova"];
const K = SWARM.skills;

/** 무기마다 정해진 각성 기술: 그 캐릭터가 쓸 수 있는 무기 순서대로 (캐릭터마다 시작 자리를 달리해), 한 캐릭터 안에서는 겹치지 않음 */
export function evoSkill(id: WeaponId, c?: CharacterId): SwarmSkill {
  const list = c ? characterWeapons(c) : [];
  const i = list.indexOf(id);
  if (i < 0) return SKILLS[Math.max(0, WEAPON_IDS.indexOf(id)) % SKILLS.length]!;
  return SKILLS[(i + ALL_CHARACTER_IDS.indexOf(c!) * 5) % SKILLS.length]!;
}

/** 회전 칼날 자리 (그리기도 같이 씀) */
export function bladeSpots(tick: number, x: number, y: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < K.blades.count; i++) {
    const a = tick * 0.09 + (i * Math.PI * 2) / K.blades.count;
    out.push({ x: x + Math.cos(a) * K.blades.r, y: y + Math.sin(a) * K.blades.r });
  }
  return out;
}

const alive = (s: RunState) => s.enemies.filter((e) => e.hp > 0 && !e.svBox);

/** 가까운 적 n (range 안) */
function nearest(s: RunState, n: number, range: number): EnemyState[] {
  const p = s.player;
  return alive(s)
    .filter((e) => dist2(e, p) < range * range)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)
    .slice(0, n);
}

/** 틱마다: 각성한 무기면 그 기술 */
export function evoNova(s: RunState): void {
  const p = s.player;
  if (!p.svEvo) return;
  runSkill(s, evoSkill(p.weaponId, p.characterId));
}

/** 각성 기술 하나를 이번 틱에 (때가 되면 씀 · 제단의 방 증강 기술도 같이 씀, sim/altar) */
export function runSkill(s: RunState, skill: SwarmSkill): void {
  const p = s.player;
  const dmg = p.stats.damage;
  const t = s.tick;
  switch (skill) {
    case "storm":
      if (t % K.storm.every) return;
      for (const e of nearest(s, K.storm.count, K.storm.range)) {
        dotDamage(s, e, "shock", dmg * K.storm.mul);
        addEffect(s, { kind: "bolt", x: e.x, y: e.y - 44, dirX: 0, dirY: 0, size: 2, maxTicks: 10, toX: e.x, toY: e.y, width: 2 });
      }
      return;
    case "comet": {
      if (t % K.comet.every) return;
      const rng = createRng(deriveSeed(s.seed, "evoComet", t + p.x));
      const near = nearest(s, 12, K.comet.range);
      for (let i = 0; i < K.comet.count && near.length; i++) {
        const e = near.splice(rng.int(0, near.length - 1), 1)[0]!;
        blastAt(s, e.x, e.y, K.comet.r, dmg * K.comet.mul, { still: true });
        addEffect(s, { kind: "meteor", x: e.x, y: e.y, dirX: 0, dirY: 0, size: K.comet.r, maxTicks: 18 });
      }
      return;
    }
    case "frost":
      if (t % K.frost.every) return;
      for (const e of alive(s)) {
        if (dist2(e, p) > (K.frost.r + e.r) ** 2) continue;
        dotDamage(s, e, "frost", dmg * K.frost.mul);
        e.stunTicks = Math.max(e.stunTicks ?? 0, K.frost.stun);
      }
      addEffect(s, { kind: "oFrost", x: p.x, y: p.y, dirX: 0, dirY: 0, size: K.frost.r, maxTicks: 24, tint: "#8ad8ff" });
      return;
    case "blades":
      if (t % K.blades.every) return;
      for (const b of bladeSpots(t, p.x, p.y)) for (const e of alive(s)) if (dist2(e, b) < (K.blades.hit + e.r) ** 2) dotDamage(s, e, "bleed", dmg * K.blades.mul);
      return;
    case "barrage":
      if (t % K.barrage.every) return;
      for (let i = 0; i < K.barrage.count; i++) {
        const a = (i * Math.PI * 2) / K.barrage.count + t * 0.01;
        const d = normalize(Math.cos(a), Math.sin(a)) ?? [1, 0];
        s.projectiles.push({
          id: s.nextId++,
          fromPlayer: true,
          x: p.x,
          y: p.y,
          prevX: p.x,
          prevY: p.y,
          r: 3,
          vx: d[0] * K.barrage.speed,
          vy: d[1] * K.barrage.speed,
          damage: dmg * K.barrage.mul,
          ticksLeft: 60,
          homing: true,
          ghost: true,
          tint: "#ffd84a",
        });
      }
      return;
    case "nova": {
      const e = SWARM.evo;
      if (t % e.novaEvery) return;
      blastAt(s, p.x, p.y, e.novaR, dmg * e.novaMul, { still: true });
      addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: e.novaR, maxTicks: 18, width: 2 });
      return;
    }
    default:
      evoSkill2(s, skill);
  }
}
