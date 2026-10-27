// 패왕전 AI 입력: 사람처럼 키를 누름 (그 캐릭터의 진짜 공격·장치·스킬이 그대로 나감).
// 보이는 가장 가까운 상대를 노려 근접은 붙고 원거리는 거리를 두고 옆걸음 · 날아오는 탄은 대시로 피함 · 체력이 낮으면 회복 아이템
// 자리를 꺼내 놓은 상태에서 부름 (s.player = 그 AI, s.enemies = 상대 그림자 적). 무작위는 판 시드로만
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { HEAL_ITEMS } from "../items";
import { PW, PW_MODE } from "../paewangDefs";
import { createRng, deriveSeed } from "../rng";
import { inBush, onDeck } from "./paewangGrid";
import { seatNo } from "./party";
import { EMPTY_INPUT, type EnemyState, type RunState, type TickInput } from "./types";
import { dist2, normalize, weaponOf } from "./util";

const roll = (s: RunState, i: number, what: string) => createRng(deriveSeed(s.seed, "bot", i, what, s.tick)).nextFloat();

/** 보이는 가장 가까운 상대 (수풀에 숨으면 가까이서만 · 2층 위에서는 더 멀리 봄) */
function target(s: RunState): EnemyState | null {
  const p = s.player;
  const arena = s.pvp!.arena;
  const sight = PW.sight * (onDeck(arena, p.x, p.y) ? 1.4 : 1);
  let best: EnemyState | null = null;
  let bd = Infinity;
  for (const e of s.enemies) {
    const d = dist2(p, e);
    if (e.hp <= 0 || d > sight * sight || (inBush(arena, e.x, e.y) && d > PW.hideNear * PW.hideNear)) continue;
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
  } else {
    if (st.goalX === 0 || dist2(p, { x: st.goalX, y: st.goalY }) < 20 * 20 || (s.tick + i * 37) % 300 === 0) {
      st.goalX = ROOM_MIN_X + 24 + roll(s, i, "gx") * (ROOM_MAX_X - ROOM_MIN_X - 48);
      st.goalY = ROOM_MIN_Y + 24 + roll(s, i, "gy") * (ROOM_MAX_Y - ROOM_MIN_Y - 48);
    }
    const to = normalize(st.goalX - p.x, st.goalY - p.y) ?? [0, 0];
    mx = to[0] * 0.7;
    my = to[1] * 0.7;
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
  const aimLen = t ? Math.min(10, Math.max(1, Math.round(Math.sqrt(dist2(p, t)) / 12))) : 1;
  const aim = (t && normalize(t.x - p.x, t.y - p.y)) || [p.faceX, p.faceY];
  return {
    ...EMPTY_INPUT,
    moveX: Math.round(mx * 100),
    moveY: Math.round(my * 100),
    aimX: Math.round(aim[0]! * 100) * aimLen,
    aimY: Math.round(aim[1]! * 100) * aimLen,
    attack: !!t,
    dash,
    useSlot,
    // 스킬 키(추적자)·스탯 찍기(풋내기)는 가끔
    skill: t && roll(s, i, "skill") < 0.01 ? 1 + Math.floor(roll(s, i, "sk") * 3) : 0,
    statPick: (p.points ?? 0) > 0 && s.tick % 30 === 0 ? 1 + Math.floor(roll(s, i, "stat") * 7) : 0,
    autoAim: true,
  };
}
