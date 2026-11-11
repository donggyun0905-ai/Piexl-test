// 패왕전 스킬 틱마다 (그 사람 자리를 꺼내 놓고, 움직이기 전에): 대기·침묵·버프 줄이기 · 밀려남 · 돌진 · 예고·장판 · 소환한 것 · 스킬 키
// 돌진 중이거나 스킬을 쓴 틱은 걷기·평타 입력을 막음
import { PW } from "../paewangDefs";
import { kitOf } from "../pwKits";
import type { TickInput } from "./inputTypes";
import { damageEnemy as damageEnemy_ } from "./combat";
import { recalcStats } from "./items";
import { PW_SRC_SUMMON, recapHeal } from "./pvpRecap";
import { seatNo } from "./party";
import { castSkill, skillDef, stepCast } from "./pwSkill";
import { castFx, PW_FX_STYLES, skillPow } from "./pwSkillHit";
import type { RunState } from "./types";
import { addEffect, keepInRoom, roomGrid } from "./util";
import { srcFn } from "./dmgSrc";
const damageEnemy = srcFn("pwSkillRun", () => damageEnemy_);

/** 능력치를 바꾸는 버프 수 (바뀌면 다시 계산) */
const statBuffs = (s: RunState) => (s.player.pwBuffs ?? []).filter((b) => b.dmg || b.move || b.rate).length;

export function pwSkillTick(s: RunState, input: TickInput): TickInput {
  const p = s.player;
  const i = seatNo(s);
  const pv = s.pvp!;
  const seat = pv.seats[i]!;
  if (!kitOf(p.characterId)) return input;
  if (p.pwCd) p.pwCd = p.pwCd.map((t) => Math.max(0, t - 1));
  if ((seat.silence ?? 0) > 0) seat.silence = (seat.silence ?? 0) - 1;
  // 버프: 시간 줄이기 · 재생 · 능력치가 바뀌면 다시 계산
  const before = statBuffs(s);
  for (const b of p.pwBuffs ?? []) {
    // 파멸의 용 강화(keep)는 끝나지 않음
    if (!b.keep) b.t--;
    if (b.regen) {
      const add = Math.max(0, Math.min(p.stats.maxHp - p.hp, (p.stats.maxHp * b.regen * PW.heal) / 60));
      p.hp += add;
      recapHeal(s, seatNo(s), add);
    }
  }
  if (p.pwBuffs?.length) p.pwBuffs = p.pwBuffs.filter((b) => b.t > 0);
  if (statBuffs(s) !== before || p.pwSig !== before) {
    p.pwSig = statBuffs(s);
    recalcStats(s);
  }
  // 밀려나는 중
  if (seat.push) {
    p.x += seat.push.vx;
    p.y += seat.push.vy;
    keepInRoom(p, roomGrid(s));
    if (--seat.push.t <= 0) seat.push = undefined;
  }
  let out = input;
  const k = input.skill;
  if (k >= 1 && k <= 4) castSkill(s, k - 1, input);
  // 스킬 키는 다른 계산(추적자 스킬 등)에 넘기지 않음
  out = { ...out, skill: 0 };
  if (k >= 1 && k <= 4) out = { ...out, attack: false };
  if (p.pwDash) {
    dashStep(s);
    out = { ...out, moveX: 0, moveY: 0, attack: false, dash: false };
  }
  // 이 사람이 쓴 예고·장판
  if (pv.casts?.length) pv.casts = pv.casts.filter((c) => c.seat !== i || stepCast(s, c));
  minionsStep(s);
  return out;
}

/** 스킬 돌진 한 틱: 움직이며 닿은 상대를 한 번씩 (여러 번 돌진이면 절반마다 다시) */
function dashStep(s: RunState): void {
  const p = s.player;
  const d = p.pwDash!;
  const def = skillDef(s, d.k);
  const step = Math.min(d.speed, d.left);
  const ox = p.x;
  const oy = p.y;
  p.x += d.dx * step;
  p.y += d.dy * step;
  keepInRoom(p, roomGrid(s));
  const moved = Math.hypot(p.x - ox, p.y - oy);
  d.left = moved < step * 0.3 ? 0 : d.left - step;
  // 여러 번 돌진(쌍발톱 등): 한 구간을 지날 때마다 같은 상대를 다시 벨 수 있음
  const seg = def?.repeat ? Math.floor(((d.total - d.left) * def.repeat.n) / d.total) : 0;
  if (seg !== (d.seg ?? 0)) {
    d.seg = seg;
    d.hit = [];
  }
  if (def) {
    for (const e of s.enemies) {
      if (e.hp <= 0 || d.hit.includes(e.id) || (e.x - p.x) ** 2 + (e.y - p.y) ** 2 > (def.radius + e.r) ** 2) continue;
      d.hit.push(e.id);
      const c = { seat: seatNo(s), k: d.k, x: e.x, y: e.y, dx: d.dx, dy: d.dy, t: 0, left: 1 };
      // 맞힌 상대 자리에 작은 폭발로 처리 (피해·상태이상·회복을 한 곳에서)
      s.pvp!.casts!.push(c);
    }
    if (s.tick % 3 === 0) addEffect(s, { kind: "pwFx", x: p.x, y: p.y, dirX: d.dx, dirY: d.dy, size: def.radius, maxTicks: 14, tint: def.tint, style: PW_FX_STYLES.indexOf("dash") });
  }
  if (d.left <= 0) {
    p.pwDash = undefined;
    if (def) castFx(s, def, p.x, p.y, d.dx, d.dy, 16);
  }
}

/** 소환한 것들: 가장 가까운 상대에게 다가가(포탑은 그 자리) 사거리 안이면 때림 · 시간이 다하면 사라짐 */
function minionsStep(s: RunState): void {
  const pv = s.pvp!;
  const i = seatNo(s);
  if (!pv.mins?.length) return;
  for (const m of pv.mins) {
    if (m.seat !== i) continue;
    const def = skillDef(s, m.k);
    const sm = def?.summon;
    m.prevX = m.x;
    m.prevY = m.y;
    m.t--;
    // 상대에게 맞아 부서짐
    if (m.body && m.body.hp <= 0) {
      m.t = 0;
      addEffect(s, { kind: "burst", x: m.x, y: m.y, dirX: 0, dirY: 0, size: 14, maxTicks: 14 });
      continue;
    }
    if (!sm) continue;
    let best = null;
    let bd = Infinity;
    // 수풀·투명으로 안 보이는 상대는 못 노림 (markHidden: 쓴 사람 기준)
    for (const e of s.enemies) {
      const dd = (e.x - m.x) ** 2 + (e.y - m.y) ** 2;
      if (e.hp > 0 && !e.pwHid && dd < bd) [bd, best] = [dd, e];
    }
    if (!best) continue;
    const d = Math.sqrt(bd);
    if (!sm.still && d > sm.range * 0.7) {
      m.x += ((best.x - m.x) / d) * PW.minionSpeed;
      m.y += ((best.y - m.y) / d) * PW.minionSpeed;
      const b = { x: m.x, y: m.y, prevX: m.x, prevY: m.y, r: 4 };
      keepInRoom(b, roomGrid(s));
      [m.x, m.y] = [b.x, b.y];
    }
    if (m.body) [m.body.x, m.body.y, m.body.prevX, m.body.prevY] = [m.x, m.y, m.x, m.y];
    if (--m.cd > 0 || d > sm.range + best.r) continue;
    m.cd = sm.every;
    pv.src = PW_SRC_SUMMON;
    damageEnemy(s, best, skillPow(s.player) * sm.dmg, (best.x - m.x) / (d || 1), (best.y - m.y) / (d || 1), false);
    pv.src = undefined;
    m.shot = { x: best.x, y: best.y, at: s.tick };
  }
  pv.mins = pv.mins.filter((m) => m.t > 0);
}
