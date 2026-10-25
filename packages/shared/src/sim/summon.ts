// 소환술사 본인: 채찍으로 앞을 길게 침. 맞힌 적 수가 무기마다 정한 만큼 쌓이면 소환수가 나옴 (움직임·공격은 summons)
import { TICK_RATE } from "../constants";
import { SUMMON_PERKS } from "../itemsSummon";
import { createRng, deriveSeed } from "../rng";
import { SUMMON_STATS } from "../weaponsSummon";
import { damageEnemy } from "./combat";
import { updateSummons } from "./summons";
import type { RunState } from "./types";
import { addEffect, hasPerk, weaponOf } from "./util";

/** 소환수가 남는 틱 (12초, 불꽃 정령은 터지면 끝) */
export const SUMMON_LIFE = 720;

/** 틱마다 (채찍을 들었을 때 player에서). want = 공격 키(자동 공격이면 사거리 안에 적) */
export function summonTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  updateSummons(s);
  if ((p.lashTicks ?? 0) > 0) p.lashTicks = (p.lashTicks ?? 0) - 1;
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  const hits = whip(s, p.stats.damage, p.stats.range, weaponOf(p).arcCos ?? 0.75);
  if (hits === 0) return;
  if (hasPerk(p, "lash")) p.lashTicks = SUMMON_PERKS.lash.ticks;
  chargeSummon(s, hits);
}

/** 채찍: 앞쪽 좁고 긴 범위. 맞힌 적 수를 돌려줌 */
function whip(s: RunState, dmg: number, range: number, arc: number): number {
  const p = s.player;
  let hits = 0;
  for (const e of [...s.enemies]) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (e.hp <= 0 || d > range + e.r) continue;
    if (d > p.r + e.r && (dx * p.faceX + dy * p.faceY) / d < arc) continue;
    damageEnemy(s, e, dmg, d === 0 ? p.faceX : dx / d, d === 0 ? p.faceY : dy / d);
    hits++;
  }
  // 채찍 자국: 끝이 휘는 선 (그리기는 swing 효과 width 2)
  addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: range, maxTicks: 8, width: 2 });
  return hits;
}

/** 소환 게이지 채우기 (다 차면 소환) */
export function chargeSummon(s: RunState, n: number): void {
  const p = s.player;
  const w = weaponOf(p);
  if (!w.summon) return;
  p.summonCharge = (p.summonCharge ?? 0) + n;
  const every = w.summonEvery ?? 3;
  while (p.summonCharge >= every) {
    p.summonCharge -= every;
    summon(s);
    if (hasPerk(p, "twinSummon") && createRng(deriveSeed(s.seed, "twinSummon", s.tick, p.summonCharge)).nextFloat() < SUMMON_PERKS.twinSummon.chance) summon(s);
  }
}

/** 소환수 내보내기 (가득 찼으면 가장 오래된 것을 새로 바꿈) */
function summon(s: RunState): void {
  const p = s.player;
  const w = weaponOf(p);
  const kind = w.summon!;
  const st = SUMMON_STATS[kind];
  const max = (w.summonMax ?? 3) + (hasPerk(p, "horde") ? SUMMON_PERKS.horde.stacks : 0);
  const list = (p.summons ??= []).filter((m) => m.kind === kind);
  const life = Math.round(SUMMON_LIFE * (hasPerk(p, "oldPact") ? SUMMON_PERKS.oldPact.mul : 1));
  for (let i = 0; i < st.count; i++) {
    if (list.length >= max) {
      const old = list.reduce((a, b) => (a.life <= b.life ? a : b));
      old.life = life;
      continue;
    }
    const k = list.length;
    // 내 뒤쪽 양옆에 나타남
    const side = k % 2 === 0 ? 1 : -1;
    const x = p.x - p.faceX * 10 - p.faceY * 8 * side;
    const y = p.y - p.faceY * 10 + p.faceX * 8 * side;
    const m = { id: s.nextId++, kind, x, y, prevX: x, prevY: y, r: st.r, cd: 20, life, face: 1, slot: k };
    p.summons!.push(m);
    list.push(m);
  }
  addEffect(s, { kind: "burst", x: p.x - p.faceX * 10, y: p.y - p.faceY * 10, dirX: 0, dirY: 0, size: 10, maxTicks: 14 });
}
