// 시즌 2 3단계 보스 유령선 선장: 갑판 방. 가까우면 해적 칼 베기, 아니면 차례로 ① 대포 포격(가로줄 여럿) ② 닻 던져 끌어당기기
// ③ 밀물(방 왼쪽·오른쪽 절반을 쓸고, 맞으면 반대쪽으로 밀림) ④ 물에 빠진 선원 부르기. 체력 절반 아래면 포격 줄·선원이 늘고 더 빠름
import { dashDodged } from "./remnant";
import { ROOM_WIDTH } from "../constants";
import { ENEMIES } from "../content";
import { distTo, half, hitDamage, keepAway } from "./bossKit";
import { depth } from "./hero";
import { addShape, inHazard } from "./hazards";
import { eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";
import { keepInRoom, makeEnemy, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 칼 베기: 범위 · 부채꼴 cos · 예고 틱 */
  SLASH_R: 46,
  SLASH_ARC: 0.2,
  SLASH_WARN: 24,
  /** 포격: 줄 수(절반 아래) · 줄 사이 · 굵기 · 첫 예고 · 줄마다 더 늦게 */
  ROWS: 3,
  ROWS_HALF: 5,
  ROW_GAP: 34,
  ROW_W: 9,
  CANNON_WARN: 50,
  CANNON_STAGGER: 12,
  /** 닻: 길이 · 굵기 · 예고 틱 · 끌어당기는 거리 */
  ANCHOR_LEN: 150,
  ANCHOR_W: 8,
  ANCHOR_WARN: 40,
  ANCHOR_PULL: 70,
  /** 밀물: 예고 틱 · 맞으면 밀리는 거리 */
  TIDE_WARN: 70,
  TIDE_PUSH: 60,
  /** 선원: 한 번에 · 방에 최대 */
  CREW: 2,
  CREW_HALF: 3,
  CREW_MAX: 5,
  /** 거리 두기 · 쉬는 틱 */
  KEEP: 60,
  REST: 70,
};
export { R as BOSS_CAPTAIN_RULES };

type Vec = readonly [number, number];

/** 선 예고 하나를 그 자리 그대로 다시 만들어 맞았는지 봄 (끌기·밀기용) */
function lineHit(x: number, y: number, toX: number, toY: number, width: number, fn: (dx: number, dy: number) => void, s: RunState): void {
  const line = { tick: 0, start: 0, x, y, radius: 0, damage: 0, toX, toY, width };
  eachSeat(
    s,
    () => {
      const p = s.player;
      if (!inHazard(line, p.x, p.y, p.r) || dashDodged(s)) return;
      fn(p.x, p.y);
      keepInRoom(p, roomGrid(s));
    },
    !!s.party,
  );
}

export function updateCaptain(s: RunState, e: EnemyState, toP: Vec, go: Vec, spawned: EnemyState[]): void {
  const h = half(e);
  const rest = h ? R.REST - 25 : R.REST;
  if (e.phase === "windup") {
    if (e.timer > 0) return;
    const k = e.step ?? 0;
    if (k === 1) {
      // 닻에 걸린 사람은 선장 쪽으로
      lineHit(e.x, e.y, e.x + e.dirX * R.ANCHOR_LEN, e.y + e.dirY * R.ANCHOR_LEN, R.ANCHOR_W, () => {
        s.player.x -= e.dirX * R.ANCHOR_PULL;
        s.player.y -= e.dirY * R.ANCHOR_PULL;
      }, s);
    } else if (k === 2) {
      // 밀물에 휩쓸린 사람은 반대쪽으로
      const left = (e.aux ?? 0) < 0;
      const cx = left ? ROOM_MIN_X + ROOM_WIDTH / 4 : ROOM_MAX_X - ROOM_WIDTH / 4;
      lineHit(cx, ROOM_MIN_Y, cx, ROOM_MAX_Y, ROOM_WIDTH / 4, () => {
        s.player.x += (left ? 1 : -1) * R.TIDE_PUSH;
      }, s);
    }
    e.phase = "walk";
    e.timer = rest;
    return;
  }
  keepAway(s, e, toP, go, R.KEEP, ENEMIES.captain.speed * (h ? 1.3 : 1));
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.timer > 0) return;
  e.count++;
  if (distTo(s, e) < R.SLASH_R) {
    addShape(s, R.SLASH_WARN, { x: e.x, y: e.y, radius: R.SLASH_R, damage: hitDamage(s), dirX: toP[0], dirY: toP[1], arc: R.SLASH_ARC, fx: "bslash" });
    e.phase = "windup";
    e.step = 0;
    e.timer = R.SLASH_WARN;
    return;
  }
  const pick = e.count % 4;
  if (pick === 1) {
    // 포격: 플레이어 둘레 가로줄 (위아래로 차례로 터짐)
    const n = h ? R.ROWS_HALF : R.ROWS;
    for (let i = 0; i < n; i++) {
      const y = Math.max(ROOM_MIN_Y + 6, Math.min(ROOM_MAX_Y - 6, s.player.y + (i - (n - 1) / 2) * R.ROW_GAP));
      addShape(s, R.CANNON_WARN + Math.abs(i - (n - 1) / 2) * R.CANNON_STAGGER, { x: ROOM_MIN_X, y, radius: 0, damage: hitDamage(s), toX: ROOM_MAX_X, toY: y, width: R.ROW_W, fx: "stab" });
    }
    e.timer = rest + 20;
  } else if (pick === 2) {
    // 닻 던지기
    addShape(s, R.ANCHOR_WARN, { x: e.x, y: e.y, radius: 0, damage: Math.round(hitDamage(s) * 0.7), toX: e.x + toP[0] * R.ANCHOR_LEN, toY: e.y + toP[1] * R.ANCHOR_LEN, width: R.ANCHOR_W, fx: "stab" });
    e.phase = "windup";
    e.step = 1;
    e.timer = R.ANCHOR_WARN;
  } else if (pick === 3) {
    // 밀물: 플레이어가 있는 쪽 절반
    const left = s.player.x < (ROOM_MIN_X + ROOM_MAX_X) / 2;
    e.aux = left ? -1 : 1;
    const cx = left ? ROOM_MIN_X + ROOM_WIDTH / 4 : ROOM_MAX_X - ROOM_WIDTH / 4;
    addShape(s, R.TIDE_WARN, { x: cx, y: ROOM_MIN_Y, radius: 0, damage: hitDamage(s), toX: cx, toY: ROOM_MAX_Y, width: ROOM_WIDTH / 4, fx: "dark" });
    e.phase = "windup";
    e.step = 2;
    e.timer = R.TIDE_WARN;
  } else {
    // 물에 빠진 선원 (돈 없음)
    const alive = s.enemies.filter((m) => m.noGold && m.hp > 0).length + spawned.length;
    const n = Math.min(h ? R.CREW_HALF : R.CREW, R.CREW_MAX - alive);
    for (let i = 0; i < n; i++) {
      const m = makeEnemy(s, "crawler", e.x + (i - (n - 1) / 2) * 18, e.y + 10, 1 + 0.15 * (depth(s) - 1), 25);
      m.noGold = true;
      spawned.push(m);
    }
    e.timer = rest;
  }
}
