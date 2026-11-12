// 레이븐 스킬(숫자 키 1~4, 전용 패시브를 먹어야 열림): 왕국의 체스판 · 체크메이트 · 캐슬링 · 그랜드 체크메이트(궁극기)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { RV_PERKS as K } from "../itemsRaven";
import { srcRun } from "./dmgSrc";
import { raiseShield } from "./imugiMods";
import { boardHalf, hasRv, rvAlive, rvCdMul, rvNearest, rvReach, rvRoll, rvStrongest } from "./rvKit";
import { rvBoss, rvSchedule } from "./rvStrike";
import type { RunState } from "./types";
import { addEffect, keepInRoom, roomGrid } from "./util";

/** 스킬 칸 차례의 전용 패시브 */
export const RV_SKILLS = ["rvBoard", "rvMate", "rvCastle", "rvGrand"] as const;

type P = RunState["player"];

/** 스킬이 하나라도 열렸는지 */
export const rvHasSkill = (p: P) => RV_SKILLS.some((id) => hasRv(p, id));

/** 스킬 칸 넷의 남은 대기 (0~1, 안 열린 칸은 1) */
export const rvSkills = (p: P): number[] => RV_SKILLS.map((id, i) => (hasRv(p, id) ? Math.min(1, (p.rvSkillCd?.[i] ?? 0) / (K[id].cd * rvCdMul(p))) : 1));

/** 1 체스판: 판 안에서 적이 선 칸부터, 모자라면 아무 칸이나 골라 금빛 기둥 */
function board(s: RunState): boolean {
  const p = s.player;
  const R = K.rvBoard;
  const h = boardHalf(p);
  const cs = (h * 2) / R.n;
  const [ox, oy] = [p.x - h, p.y - h];
  const picked: number[] = [];
  for (const e of s.enemies) {
    if (!rvAlive(e) || Math.abs(e.x - p.x) > h || Math.abs(e.y - p.y) > h) continue;
    const c = Math.min(R.n - 1, Math.floor((e.x - ox) / cs)) + Math.min(R.n - 1, Math.floor((e.y - oy) / cs)) * R.n;
    if (!picked.includes(c)) picked.push(c);
  }
  for (let tries = 0; picked.length < R.pillars && tries < 40; tries++) {
    const c = Math.floor(rvRoll(s, "rvBoardCell") * R.n * R.n);
    if (!picked.includes(c)) picked.push(c);
  }
  picked.slice(0, R.pillars).forEach((c, i) => {
    const [x, y] = [ox + ((c % R.n) + 0.5) * cs, oy + (Math.floor(c / R.n) + 0.5) * cs];
    const at = R.delay + i * R.gap;
    addEffect(s, { kind: "rvBoardHit", x, y, dirX: 0, dirY: 0, size: cs * 0.75, maxTicks: at + 16 });
    rvSchedule(s, { at: s.tick + at, kind: "area", x, y, dx: 0, dy: 0, r: cs * 0.75, dmg: p.stats.damage * R.mul });
  });
  return true;
}

/** 2 체크메이트: 적 둘레에 기물 8개 → 붙잡은 뒤 가운데를 한꺼번에 · 마지막 한 방 */
function mate(s: RunState): boolean {
  const p = s.player;
  const R = K.rvMate;
  const k = rvReach(p);
  const e = rvNearest(s, p.x, p.y, R.dist * k, p.faceX, p.faceY);
  if (!e) return false;
  const r = R.r * k;
  addEffect(s, { kind: "rvMateRing", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: R.hold + 26 });
  for (const o of s.enemies) {
    if (!rvAlive(o) || (o.x - e.x) ** 2 + (o.y - e.y) ** 2 > (r + o.r) ** 2) continue;
    // 도주로 봉쇄: 보스는 느려지기만
    if (rvBoss(o)) o.slowTicks = Math.max(o.slowTicks ?? 0, R.slow);
    else o.stunTicks = Math.max(o.stunTicks ?? 0, R.hold + 18);
  }
  for (let i = 0; i < 8; i++) rvSchedule(s, { at: s.tick + R.hold + i * 2, kind: "area", x: e.x, y: e.y, dx: 0, dy: 0, r: r * 0.7, dmg: p.stats.damage * R.mul, fx: "rvMateHit", style: i });
  rvSchedule(s, { at: s.tick + R.hold + 20, kind: "pillar", x: e.x, y: e.y, dx: 0, dy: 0, r, dmg: p.stats.damage * R.final, fx: "rvMatePop" });
  return true;
}

/** 3 캐슬링: 바라보는 쪽에 룩을 세우고 자리를 맞바꿈 · 큰 방어막 · 두고 온 룩이 충격파 */
function castle(s: RunState): boolean {
  const p = s.player;
  const R = K.rvCastle;
  const k = rvReach(p);
  const [ox, oy] = [p.x, p.y];
  p.x += p.faceX * R.dist * k;
  p.y += p.faceY * R.dist * k;
  keepInRoom(p, roomGrid(s));
  addEffect(s, { kind: "rvCastle", x: ox, y: oy, dirX: p.faceX, dirY: p.faceY, size: 26, toX: p.x, toY: p.y, maxTicks: 30 });
  const sh = p.stats.maxHp * R.shield * (hasRv(p, "rvStale") ? K.rvStale.shield : 1);
  raiseShield(p, sh, sh);
  p.invulnTicks = Math.max(p.invulnTicks, R.invuln);
  p.rvCastleAt = s.tick;
  rvSchedule(s, { at: s.tick + 6, kind: "area", x: ox, y: oy, dx: 0, dy: 0, r: R.r * k, dmg: p.stats.damage * R.mul, fx: "rvRookShock" });
  return true;
}

/** 4 그랜드 체크메이트: 방 가득 체스판 · 기물 6종이 차례로 적을 덮침 · 끝에 킹과 퀸의 거대한 십자 빛 */
function grand(s: RunState): boolean {
  const p = s.player;
  const R = K.rvGrand;
  const [cx, cy] = [(ROOM_MIN_X + ROOM_MAX_X) / 2, (ROOM_MIN_Y + ROOM_MAX_Y) / 2];
  addEffect(s, { kind: "rvGrand", x: cx, y: cy, dirX: 0, dirY: 0, size: 60, maxTicks: R.cross + 44 });
  p.rvGrandEnd = s.tick + R.cross + 44;
  const foes = s.enemies.filter(rvAlive);
  for (let i = 0; i < R.hits; i++) {
    const e = foes[i % Math.max(1, foes.length)];
    const [x, y] = e ? [e.x, e.y] : [cx + (rvRoll(s, "rvGrandX") - 0.5) * 200, cy + (rvRoll(s, "rvGrandY") - 0.5) * 100];
    rvSchedule(s, { at: s.tick + 10 + i * R.every, kind: "area", x, y, dx: 0, dy: 0, r: R.r * rvReach(p), dmg: p.stats.damage * R.mul, id: e?.id, fx: "rvGrandPiece", style: i % 6 });
  }
  const t = rvStrongest(s, cx, cy, 9999);
  rvSchedule(s, { at: s.tick + R.cross, kind: "cross", x: t?.x ?? cx, y: t?.y ?? cy, dx: 0, dy: 0, r: R.w * rvReach(p), dmg: p.stats.damage * R.crossMul, id: t?.id, fx: "rvCross" });
  return true;
}

const USE = [board, mate, castle, grand];

/** 스킬 i(0~3) 쓰기 (겨눌 적이 없어 안 나가면 대기 시간도 안 씀) */
export function rvSkill(s: RunState, i: number): void {
  const p = s.player;
  const id = RV_SKILLS[i];
  const cd = (p.rvSkillCd ??= [0, 0, 0, 0]);
  if (!id || !hasRv(p, id) || (cd[i] ?? 0) > 0) return;
  if (srcRun(s, id, () => USE[i]!(s))) cd[i] = Math.round(K[id].cd * rvCdMul(p));
}
