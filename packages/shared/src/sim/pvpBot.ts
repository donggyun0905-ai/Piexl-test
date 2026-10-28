// 패왕전 AI 입력: 사람처럼 키를 누름 (그 캐릭터의 진짜 공격·장치·스킬이 그대로 나감).
// 보이는 가장 가까운 상대를 노려 근접은 붙고 원거리는 거리를 두고 옆걸음 · 날아오는 탄은 대시로 피함 · 체력이 낮으면 회복 아이템
// 상대가 수풀에 숨으면 정확한 자리는 모르고, 마지막으로 본 곳(수풀 쪽)으로 가서 그쪽을 때려 봄
// 자리를 꺼내 놓은 상태에서 부름 (s.player = 그 AI, s.enemies = 상대 그림자 적). 무작위는 판 시드로만
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { HEAL_ITEMS } from "../items";
import { PW, PW_MODE } from "../paewangDefs";
import { createRng, deriveSeed } from "../rng";
import { onDeck } from "./paewangGrid";
import { seatNo } from "./party";
import { canCast, skillDef } from "./pwSkill";
import { EMPTY_INPUT, type EnemyState, type RunState, type TickInput } from "./types";
import { dist2, normalize, weaponOf } from "./util";

const roll = (s: RunState, i: number, what: string) => createRng(deriveSeed(s.seed, "bot", i, what, s.tick)).nextFloat();

/** 보이는 가장 가까운 상대 (수풀·투명은 markHidden이 표시 · 2층 위에서는 더 멀리 봄) */
function target(s: RunState): EnemyState | null {
  const p = s.player;
  const arena = s.pvp!.arena;
  const sight = PW.sight * (onDeck(arena, p.x, p.y) ? 1.4 : 1);
  let best: EnemyState | null = null;
  let bd = Infinity;
  for (const e of s.enemies) {
    const d = dist2(p, e);
    if (e.hp <= 0 || e.pwHid || d > sight * sight) continue;
    if (d < bd) {
      bd = d;
      best = e;
    }
  }
  return best;
}

export function botInput(s: RunState): TickInput {
  const i = seatNo(s);
  const pv = s.pvp!;
  const st = pv.seats[i]!;
  const p = s.player;
  if (st.dashCd > 0) st.dashCd--;
  if (st.stuck > 0) st.stuck--;
  const t = target(s);
  // 본 상대는 자리를 기억 · 안 보이면 기억한 곳을 잠시 찾음
  if (t) [st.seenX, st.seenY, st.seenT] = [t.x, t.y, PW.hunt];
  else if (st.seenT) st.seenT--;
  const hunt = !t && st.seenT ? { x: st.seenX!, y: st.seenY! } : null;
  const w = weaponOf(p);
  const melee = w.kind === "melee" || w.range < PW.meleeRange;
  const range = Math.max(28, Math.min(150, w.range));
  let mx = 0;
  let my = 0;
  let dash = false;
  if (t) {
    const to = normalize(t.x - p.x, t.y - p.y) ?? [1, 0];
    const d = Math.sqrt(dist2(p, t));
    const want = melee ? range * 0.5 : range * 0.75;
    const go = d > want + 6 ? 1 : !melee && d < want - 14 ? -1 : 0;
    if (--st.sideT <= 0) {
      st.side = -st.side;
      st.sideT = 50 + Math.floor(roll(s, i, "side") * 80);
    }
    const strafe = melee ? 0.25 : 0.7;
    mx = to[0] * go - to[1] * st.side * strafe;
    my = to[1] * go + to[0] * st.side * strafe;
    // 날아오는 상대 탄: 확률로 옆으로 대시 (네 틱에 한 번 살핌)
    if (st.dashCd <= 0 && (s.tick + i) % 4 === 0) {
      for (const pr of s.projectiles) {
        if (!pr.fromPlayer || pr.shooter === undefined || pv.seats[pr.shooter]?.team === st.team || dist2(pr, p) > 32 * 32) continue;
        if ((p.x - pr.x) * pr.vx + (p.y - pr.y) * pr.vy <= 0) continue;
        st.dashCd = PW.dashEvery;
        if (roll(s, i, "dodge") < PW_MODE[pv.mode].diff.dodge) {
          const n = normalize(-pr.vy, pr.vx) ?? [1, 0];
          mx = n[0] * st.side;
          my = n[1] * st.side;
          dash = true;
        }
        break;
      }
    }
  } else if (hunt) {
    const to = normalize(hunt.x - p.x, hunt.y - p.y) ?? [0, 0];
    const far = dist2(p, hunt) > (melee ? 10 * 10 : range * range * 0.5);
    mx = far ? to[0] : -to[1] * st.side * 0.5;
    my = far ? to[1] : to[0] * st.side * 0.5;
  } else {
    if (st.goalX === 0 || dist2(p, { x: st.goalX, y: st.goalY }) < 20 * 20 || (s.tick + i * 37) % 300 === 0) {
      st.goalX = ROOM_MIN_X + 24 + roll(s, i, "gx") * (ROOM_MAX_X - ROOM_MIN_X - 48);
      st.goalY = ROOM_MIN_Y + 24 + roll(s, i, "gy") * (ROOM_MAX_Y - ROOM_MIN_Y - 48);
    }
    const to = normalize(st.goalX - p.x, st.goalY - p.y) ?? [0, 0];
    mx = to[0] * 0.7;
    my = to[1] * 0.7;
  }
  // 베두인: 던진 차크람이 바닥에 떨어져 있으면 주우러 감
  if (p.ckHeld === false && p.ck?.mode === "ground") {
    const to = normalize(p.ck.x - p.x, p.ck.y - p.y);
    if (to) [mx, my] = to;
  }
  // 막혔으면 옆으로 비켜 감 (지난 15틱 동안 거의 못 움직임)
  if (st.stuck > 0) [mx, my] = [-my * st.side, mx * st.side];
  else if (s.tick % 15 === i % 15) {
    if ((mx || my) && st.lastX !== undefined && dist2(p, { x: st.lastX, y: st.lastY ?? 0 }) < 4) st.stuck = 30;
    st.lastX = p.x;
    st.lastY = p.y;
  }
  // 사용 아이템: 체력이 낮으면 회복 아이템, 싸우는 중엔 가끔 다른 것
  let useSlot = 0;
  const low = p.hp < p.stats.maxHp * 0.35;
  p.useSlots.forEach((id, k) => {
    if (!id || useSlot) return;
    const heal = HEAL_ITEMS.has(`use:${id}`);
    if ((heal && low) || (!heal && t && roll(s, i, `use${k}`) < 0.002)) useSlot = k + 1;
  });
  // 찾는 중: 자동 조준 없이 기억한 곳을 직접 조준해 때려 봄 (닿을 만큼 가까울 때)
  const at = t ?? hunt;
  const aimLen = at ? Math.min(30, Math.max(1, Math.round(Math.sqrt(dist2(p, at)) / 12))) : 1;
  const aim = (at && normalize(at.x - p.x, at.y - p.y)) || [p.faceX, p.faceY];
  const reach = p.stats.range + 12;
  return {
    ...EMPTY_INPUT,
    moveX: Math.round(mx * 100),
    moveY: Math.round(my * 100),
    aimX: Math.round(aim[0]! * 100) * aimLen,
    aimY: Math.round(aim[1]! * 100) * aimLen,
    attack: !!t || (!!hunt && dist2(p, hunt) <= reach * reach),
    dash,
    useSlot,
    skill: t ? botSkill(s, i, Math.sqrt(dist2(p, t))) : 0,
    statPick: (p.points ?? 0) > 0 && s.tick % 30 === 0 ? 1 + Math.floor(roll(s, i, "stat") * 7) : 0,
    autoAim: !hunt,
  };
}

/** AI 스킬: 가끔, 쓸 수 있고 상대가 닿는 스킬 하나 (없으면 0) */
function botSkill(s: RunState, i: number, d: number): number {
  if (roll(s, i, "skill") > PW.botSkill) return 0;
  const start = Math.floor(roll(s, i, "sk") * 4);
  for (let n = 0; n < 4; n++) {
    const k = (start + n) % 4;
    const def = skillDef(s, k);
    if (!def || !canCast(s, k)) continue;
    const reach = def.shape === "self" || def.shape === "cone" ? def.radius + 16 : def.shape === "summon" ? 200 : def.range + def.radius;
    if (d <= reach) return k + 1;
  }
  return 0;
}
