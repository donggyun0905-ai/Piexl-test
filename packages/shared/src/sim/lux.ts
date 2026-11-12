// 한정 캐릭터 빛의 사도 (lux, 서고의 감시자): 평타는 사거리 안 가까운 적 자리에 작은 빛의 검 · 몇 번째 공격마다 (사거리 ×LUX.reach 안) 가까운 적들 자리에
// '+' 모양 빛의 검이 여러 번 생겨 벰 (적마다 몇 번, 45°씩 엇갈림) · 빛의 조각(lxShard, 빛의 적이 떨굼, sim/luxFoes)으로 성장:
// 조각마다 공격력·공격 속도(아이템 값) + 치명타·예리함 + 빛의 검 피해 · 6개마다 한 단계(0~3): 노리는 적 +1 · 검이 커짐 · 모습이 바뀜(그림 lux~lux4, 크기는 파수꾼과 같음)
// 은총의 옷자락: 더 넓게 + 5개 더 · 꿰뚫는 빛: 생긴 자리에 붉은 빛의 검이 한 번 더
import { TICK_RATE } from "../constants";
import { LUX } from "../weaponsLux";
import { LUX_PERKS as K } from "../itemsLux";
import type { ExtraStats } from "../characters";
import type { StatMod } from "../stats";
import { alive, onSegment, strike as strike_ } from "./s2Kit";
import type { LuxCross } from "./luxTypes";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";
import { srcFn, srcRun } from "./dmgSrc";
const strike = srcFn("lux", () => strike_);

export const isLux = (p: PlayerState) => p.characterId === "lux";

/** 가진 빛의 조각 수 · 성장 단계 (0~3) */
export const luxShards = (p: PlayerState): number => p.passives.reduce((n, id) => n + (id === "lxShard" ? 1 : 0), 0);
export const luxStage = (p: PlayerState): number => Math.min(LUX.maxStage, Math.floor(luxShards(p) / LUX.perStage));

/** 조각 몫 추가 스탯 (baseStats.extraOf): 치명타 확률 · 예리함 · 빛의 문신이면 치명타 피해 */
export function luxExtras(p: PlayerState): Partial<ExtraStats> | null {
  const n = luxShards(p);
  if (!isLux(p) || !n) return null;
  return { critChance: n * K.lxShard.crit, sharpness: n * K.lxShard.sharp, critDamage: hasPerk(p, "lxTattoo") ? n * K.lxTattoo.critDmg : 0 };
}

/** 빛의 문신: 조각마다 최대 체력 (items.recalcStats) */
export function luxMods(p: PlayerState): StatMod[] {
  return isLux(p) && hasPerk(p, "lxTattoo") ? [{ stat: "maxHp", add: luxShards(p) * K.lxTattoo.hp }] : [];
}

/** 평타: 사거리 안 가장 가까운 적 자리에 작은 빛의 검 (없으면 헛휘두름) */
function stab(s: RunState): void {
  const p = s.player;
  const e = nearIn(s, p.stats.range)[0];
  if (!e) return;
  (p.lxQ ??= []).push({ at: s.tick + 1, x: e.x, y: e.y, rot: p.attackCount % 2 === 1, arm: LUX.stab, dmg: p.stats.damage, plain: true });
}

/** 거리 안의 산 적 (가까운 순) */
function nearIn(s: RunState, reach: number) {
  const p = s.player;
  const d2 = (e: { x: number; y: number }) => (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
  return alive(s).filter((e) => d2(e) <= (reach + e.r) ** 2).sort((a, b) => d2(a) - d2(b) || a.id - b.id);
}

/** 빛의 검 생성: 가까운 적들 자리에 '+' 빛의 검을 적마다 몇 번 (사이 틱을 두고 엇갈려) 예약 */
function summon(s: RunState): void {
  const p = s.player;
  const stage = luxStage(p);
  const grace = hasPerk(p, "lxGrace");
  const near = nearIn(s, p.stats.range * LUX.reach * (grace ? K.lxGrace.reach : 1)).slice(0, LUX.targets + stage);
  const hits = LUX.hits + (hasPerk(p, "lxMore") ? K.lxMore.add : 0);
  const arm = LUX.arm * (1 + 0.15 * stage) * (hasPerk(p, "lxWide") ? K.lxWide.mul : 1);
  const dmg = p.stats.damage * LUX.cross * (1 + luxShards(p) * LUX.perShard) * (hasPerk(p, "lxJudge") ? K.lxJudge.mul : 1);
  const q = (p.lxQ ??= []);
  near.forEach((e, i) => {
    for (let h = 0; h < hits; h++) {
      // 같은 자리에 겹치지 않게 조금씩 비켜 생김
      const off = h === 0 ? [0, 0] : [((h * 7 + i * 3) % 9) - 4, ((h * 5 + i * 11) % 9) - 4];
      q.push({ at: s.tick + 2 + h * LUX.gap + i, x: e.x + off[0]!, y: e.y + off[1]!, rot: (h + i) % 2 === 1, arm, dmg });
    }
  });
  // 은총의 옷자락: 노린 적들 둘레 넓게 5개 더 (돌아가며 비켜서)
  if (grace && near.length) for (let j = 0; j < K.lxGrace.add; j++) {
    const e = near[j % near.length]!;
    const [dx, dy] = [((j * 13 + 5) % 25) - 12, ((j * 17 + 9) % 25) - 12];
    q.push({ at: s.tick + 4 + j * 3, x: e.x + dx, y: e.y + dy, rot: j % 2 === 0, arm, dmg });
  }
}

const D = Math.SQRT1_2;

/** 예약한 빛의 검이 생겨 벰: '+'(또는 '×') 두 팔에 걸린 적 */
function strikeCross(s: RunState, c: LuxCross): void {
  const [ax, ay, bx, by] = c.rot ? [D, D, D, -D] : [1, 0, 0, 1];
  const hit = new Set([...onSegment(s, c.x - ax * c.arm, c.y - ay * c.arm, c.x + ax * c.arm, c.y + ay * c.arm, LUX.width), ...onSegment(s, c.x - bx * c.arm, c.y - by * c.arm, c.x + bx * c.arm, c.y + by * c.arm, LUX.width)]);
  for (const e of hit) strike(s, e, c.dmg);
  // dirX: 0 '+' · 1 '×' · 2·3 붉은 검 · 4·5 평타 검(코드 그림)
  addEffect(s, { kind: "lxCross", x: c.x, y: c.y, dirX: (c.rot ? 1 : 0) + (c.red ? 2 : c.plain ? 4 : 0), dirY: luxStage(s.player), size: c.arm, maxTicks: c.plain ? 12 : 18 });
  // 꿰뚫는 빛: 같은 자리에 붉은 빛의 검이 엇갈려 한 번 더
  if (!c.red && !c.plain && hasPerk(s.player, "lxPierce")) srcRun(s, "lxPierce", () => { (s.player.lxQ ??= []).push({ ...c, at: s.tick + K.lxPierce.delay, rot: !c.rot, dmg: c.dmg * K.lxPierce.mul, red: true }); });
}

/** 직업 무기 틱 (classTicks): 기다리는 빛의 검 · 누르면 빛의 칼날 · 몇 번째마다 빛의 검 생성 */
export function luxTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  // 조각 6개마다 성장: 빛이 터지며 모습이 바뀜
  const stage = luxStage(p);
  if (stage > (p.lxStage ?? 0)) addEffect(s, { kind: "lxGrow", x: p.x, y: p.y, dirX: 0, dirY: stage, size: 40, maxTicks: 50, follow: true });
  p.lxStage = stage;
  if (p.lxQ?.length) {
    const now = p.lxQ.filter((c) => c.at <= s.tick);
    if (now.length) {
      p.lxQ = p.lxQ.filter((c) => c.at > s.tick);
      for (const c of now) strikeCross(s, c);
    }
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  stab(s);
  addEffect(s, { kind: "lxSwing", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: 12, maxTicks: 6 });
  if (p.attackCount % (hasPerk(p, "lxQuick") ? K.lxQuick.every : LUX.every) === 0) summon(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetLux(p: PlayerState): void {
  delete p.lxQ;
  delete p.lxStage;
}
