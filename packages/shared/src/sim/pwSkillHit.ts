// 패왕전 스킬이 닿을 때: 모양마다 맞는 상대 고르기 · 피해·기절·둔화·속박·침묵·밀치기/끌어오기·독 · 아군 회복·버프 · 스킬 그림(pwFx)
import { roleHealMul } from "./pwMatchup";
import { PW_CHAR } from "../paewangBalance";
import { PW } from "../paewangDefs";
import { kitOf, PW_MOTIF, type PwSkillDef } from "../pwKits";
import type { PwCast } from "./paewangTypes";
import { allPlayers, seatNo } from "./party";
import { inPlay } from "./pvpWorld";
import { onSegment } from "./s2Kit";
import { recapHeal } from "./pvpRecap";
import { damageEnemy } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect } from "./util";
import { plagueCut } from "./pwPassive";
import { PW_PASSIVE } from "../paewangPassive";

/** 스킬 그림 모양 순서 (EffectState.style) */
export const PW_FX_STYLES = ["burst", "meteor", "pillar", "rain", "beam", "wave", "slash", "spin", "dash", "blink", "aura", "field", "heal", "net", "summon"] as const;

/** 스킬 그림: warn이면 예고 표시(maxTicks = 터지기까지) */
export function castFx(s: RunState, def: PwSkillDef, x: number, y: number, dx: number, dy: number, ticks: number, warn = false): void {
  const line = def.shape === "line";
  addEffect(s, {
    kind: warn ? "pwWarn" : "pwFx",
    x,
    y,
    dirX: dx,
    dirY: dy,
    size: def.shape === "dash" || def.shape === "blink" ? Math.max(14, def.radius) : def.radius,
    // 그림만 조금 더 길게 (계산과 상관없음) · 예고는 터질 때까지 그대로
    maxTicks: warn ? ticks : Math.round(ticks * PW.fxLinger),
    tint: def.tint,
    style: PW_FX_STYLES.indexOf(def.fx),
    ...(line ? { toX: x + dx * def.range, toY: y + dy * def.range } : {}),
    ...(def.shape === "cone" ? { arc: def.arc ?? 0.8 } : {}),
    ...(kitOf(s.player.characterId)?.skills[3] === def ? { ult: true } : {}),
    motif: def.motif ?? PW_MOTIF[s.player.characterId],
  });
}

/** 지금 자리의 버프 곱 (공격력·이동·공격 속도·받는 피해) */
export const buffMul = (p: PlayerState, k: "dmg" | "move" | "rate" | "taken"): number => (p.pwBuffs ?? []).reduce((m, b) => m * (b[k] ?? 1), 1);
/** 스킬 한 번 피해의 바탕 (캐릭터 보정 공격력 배율 포함) */
export const skillPow = (p: PlayerState): number => PW.skillDmg * (PW_CHAR[p.characterId]?.dmg ?? 1) * (PW_CHAR[p.characterId]?.skill ?? 1);
/** 투명(상대에게 안 보임) 버프 중인지 */
export const pwHidden = (p: PlayerState): boolean => !!p.pwBuffs?.some((b) => b.hide);

/** 맞은 상대 하나 (지금 자리 = 쓴 사람) */
function hitFoe(s: RunState, def: PwSkillDef, e: EnemyState, dx: number, dy: number): void {
  const h = def.hit;
  if (!h || e.immune || e.hp <= 0) return;
  const p = s.player;
  const pw = s.pvp!;
  pw.src = 1 + Math.max(0, kitOf(p.characterId)?.skills.indexOf(def) ?? 0);
  damageEnemy(s, e, skillPow(p) * h.dmg * buffMul(p, "dmg"), dx, dy, false);
  pw.src = undefined;
  if (h.stun) e.stunTicks = Math.max(e.stunTicks ?? 0, h.stun);
  if (h.slow) e.slowTicks = Math.max(e.slowTicks ?? 0, h.slow);
  if (h.root) e.rootTicks = Math.max(e.rootTicks ?? 0, h.root);
  if (h.dot) {
    e.poisonTicks = Math.max(e.poisonTicks ?? 0, h.dot);
    e.poisonDmg = skillPow(p) * PW.skillDot;
  }
  const pv = s.pvp!;
  const seat = pv.seats[pv.proxies.indexOf(e)];
  if (seat && h.silence) seat.silence = Math.max(seat.silence ?? 0, h.silence);
  if (seat && h.push) {
    // 밀치기(+)는 쓴 사람에게서 멀리, 끌어오기(-)는 쓴 사람 앞까지 (넘어가지 않게)
    const l = Math.hypot(e.x - p.x, e.y - p.y) || 1;
    const dist = h.push > 0 ? h.push * 5 : Math.min(-h.push * 5, l - p.r - e.r - 2);
    const sign = h.push > 0 ? 1 : -1;
    if (dist > 0) seat.push = { vx: (((e.x - p.x) / l) * sign * dist) / 8, vy: (((e.y - p.y) / l) * sign * dist) / 8, t: 8 };
  }
  addEffect(s, { kind: "blast", x: e.x, y: e.y, dirX: dx, dirY: dy, size: 9, maxTicks: 12, tint: def.tint });
}

/** 지금 자리 사람과 같은 편 (경기장에 있는) 사람들 · 반경 안 */
export function alliesNear(s: RunState, x: number, y: number, r: number): PlayerState[] {
  const pv = s.pvp!;
  const me = seatNo(s);
  return allPlayers(s).filter((q, j) => (j === me || pv.seats[j]!.team === pv.seats[me]!.team) && inPlay(s, j) && (q.x - x) ** 2 + (q.y - y) ** 2 <= (r + q.r) ** 2);
}

/** 버프 걸기 (공격력·이동·공격 속도는 능력치를 다시 계산) */
export function addBuff(q: PlayerState, def: PwSkillDef): void {
  const b = def.buff!;
  // 능력치는 그 사람 차례에 다시 계산 (pwSkillRun)
  (q.pwBuffs ??= []).push({ t: b.ticks, dmg: b.dmg, move: b.move, rate: b.rate, taken: b.taken, regen: b.regen, hide: b.hide });
}

/** 예고가 끝나 터짐 · 장판 한 번 · 늦게 나가는 줄 */
export function resolveCast(s: RunState, def: PwSkillDef, c: PwCast): void {
  const p = s.player;
  if (c.follow) {
    c.x = p.x;
    c.y = p.y;
  }
  const first = c.left === (def.repeat?.n ?? 1);
  let foes: EnemyState[] = [];
  const live = s.enemies.filter((e) => e.hp > 0);
  if (def.shape === "line") foes = onSegment(s, c.x, c.y, c.x + c.dx * def.range, c.y + c.dy * def.range, def.radius);
  else if (def.shape === "cone") {
    const cos = Math.cos(def.arc ?? 0.8);
    foes = live.filter((e) => {
      const l = Math.hypot(e.x - c.x, e.y - c.y);
      return l <= def.radius + e.r && (l < e.r + 4 || ((e.x - c.x) * c.dx + (e.y - c.y) * c.dy) / l >= cos);
    });
  } else foes = live.filter((e) => (e.x - c.x) ** 2 + (e.y - c.y) ** 2 <= (def.radius + e.r) ** 2);
  for (const e of foes) hitFoe(s, def, e, c.dx, c.dy);
  // 아군 회복 (장판이면 매번) · 버프 (처음 한 번)
  const reach = def.shape === "self" || def.shape === "cone" ? Math.max(def.radius, 30) : def.radius;
  if (def.heal)
    for (const q of alliesNear(s, c.x, c.y, reach)) {
      const raw = q.stats.maxHp * def.heal * PW.heal * roleHealMul(s) * plagueCut(s, q);
      const add = Math.min(q.stats.maxHp - q.hp, raw);
      q.hp += Math.max(0, add);
      // 의사 패시브: 넘친 회복은 보호막 (최대 체력 비율까지)
      if (p.characterId === "doctor" && raw > add) q.shieldPts = Math.min(q.stats.maxHp * PW_PASSIVE.doctorShieldMax, (q.shieldPts ?? 0) + raw - Math.max(0, add));
      recapHeal(s, allPlayers(s).indexOf(q), add);
    }
  if (def.buff && first) for (const q of def.buff.allies ? alliesNear(s, c.x, c.y, reach) : [p]) addBuff(q, def);
  castFx(s, def, c.x, c.y, c.dx, c.dy, def.repeat ? Math.max(12, def.repeat.every) : 20);
}
