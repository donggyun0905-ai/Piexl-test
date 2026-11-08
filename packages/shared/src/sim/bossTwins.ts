// 시즌 3 2단계 보스 피로 이어진 쌍둥이: 루(흰 가면·근접, 단계 보스) + 레(검은 가면·원거리, 루가 처음에 데려옴)
// 둘 사이 핏줄(지나가면 출혈) · 루는 세 번 뛰어들며 할퀴기 · 레는 천천히 쫓는 피 구슬(루에게 닿으면 루 회복) · 가끔 둘이 자리를 바꿈
// 한쪽만 쓰러지면 쓰러진 채 남고 시간 안에 다른 쪽도 쓰러뜨려야 함 (못 하면 체력 일부로 다시 일어남, 남은 쪽은 화가 나 빨라짐)
// 체력 합이 절반 아래면 방 가운데 고정점에서 핏줄 하나 더 · 구슬 늘고 자리 바꾸기 자주
import { ENEMIES } from "../enemyDefs";
import { half, hitDamage, ultBoss } from "./bossKit";
import { damagePlayer } from "./combat";
import { addShape, inHazard } from "./hazards";
import { eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";
import { startCage, startCross, twinKitTick } from "./bossTwinsKit";
import { addEffect, makeEnemy, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 쓰러진 쪽이 다시 일어나기까지 틱: 혼자 · 둘 이상 (협동은 나눠 맡으라고 짧게) · 일어날 때 체력 비율 */
  REVIVE: 360,
  REVIVE_PARTY: 240,
  REVIVE_HP: 0.3,
  /** 짝이 쓰러진 동안 남은 쪽 공격 대기가 줄어드는 배율 (1.3 = 30% 빠름) */
  RAGE: 1.3,
  /** 핏줄: 피해 간격 틱 · 피해 · 굵기 */
  LINE_EVERY: 30,
  LINE_DMG: 8,
  LINE_W: 3,
  /** 루 뛰어들기: 횟수 · 한 번 예고 틱 · 범위 · 뛰는 거리 · 피해 배율 */
  LEAPS: 4,
  LEAP_WARN: 24,
  LEAP_R: 20,
  LEAP_DIST: 28,
  LEAP_MUL: 0.7,
  /** 레 피 구슬: 개수 · 체력 절반 아래 · 빠르기 · 남는 틱 · 맞으면 피해 배율 · 루에게 닿으면 루 최대 체력의 몇 % 회복 */
  ORBS: 3,
  ORBS_HALF: 5,
  ORB_SPEED: 0.7,
  ORB_TICKS: 300,
  ORB_MUL: 0.6,
  ORB_HEAL: 0.05,
  /** 레가 지키는 거리 */
  KEEP: 80,
  /** 자리 바꾸기: 예고 틱 · 몇 번째 공격마다 (체력 절반 아래) */
  SWAP_WARN: 36,
  SWAP_EVERY: 4,
  SWAP_EVERY_HALF: 2,
  /** 공격 사이 쉬는 틱 */
  REST: 70,
  /** 루의 공격 고르기: 몇 번째마다 교차 돌진 · 핏줄 감옥 (나머지는 뛰어들기) */
  CROSS_EVERY: 3,
  CAGE_EVERY: 5,
};
export { R as BOSS_TWINS_RULES };

type Vec = readonly [number, number];
const isTwin = (e: EnemyState) => e.kind === "twinlu" || e.kind === "twinre";
const mate = (s: RunState, e: EnemyState) => s.enemies.find((x) => x.id === e.twLink && x.hp > 0);
const down = (e: EnemyState) => (e.twDown ?? 0) > 0;
/** 방 가운데 (방 크기가 바뀔 수 있어 그때그때) */
const mid = (): Vec => [(ROOM_MIN_X + ROOM_MAX_X) / 2, (ROOM_MIN_Y + ROOM_MAX_Y) / 2];

/** 쓰러진 적 정리 전 (combat.removeDead): 라스트 보스는 궁극기를 쓰기 전에는 체력 1 · 쌍둥이 붙잡기 */
export function holdDown(s: RunState): void {
  for (const e of s.enemies) if (e.hp <= 0 && !e.ultDone && ultBoss(e)) e.hp = 1;
  twinHold(s);
}

/** 쌍둥이: 짝이 서 있으면 쓰러진 채 남음 · 짝도 쓰러져 있으면 둘 다 쓰러짐 */
function twinHold(s: RunState): void {
  for (const e of s.enemies) {
    if (!isTwin(e) || e.hp > 0) continue;
    const m = s.enemies.find((x) => x.id === e.twLink);
    if (!m || m.hp <= 0) continue;
    if (down(m)) {
      m.hp = 0;
      continue;
    }
    if (down(e)) continue;
    e.hp = 1;
    e.twDown = s.party && s.party.length > 1 ? R.REVIVE_PARTY : R.REVIVE;
    e.immune = true;
    e.air = true;
    e.twOrbs = [];
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 14, maxTicks: 18, foe: true });
  }
}

/** 핏줄 위의 사람: 간격마다 피해·출혈 */
function bloodLine(s: RunState, a: Vec, b: Vec): void {
  const line = { tick: 0, start: 0, x: a[0], y: a[1], radius: 0, damage: 0, toX: b[0], toY: b[1], width: R.LINE_W };
  eachSeat(
    s,
    () => {
      const p = s.player;
      if (inHazard(line, p.x, p.y, p.r)) damagePlayer(s, R.LINE_DMG, "twinlu");
    },
    !!s.party,
  );
}

/** 레의 피 구슬: 가까운 사람을 천천히 쫓음 · 사람에게 닿으면 피해 · 루에게 닿으면 루 회복 */
function orbsTick(s: RunState, e: EnemyState, lu: EnemyState | undefined): void {
  if (!e.twOrbs?.length) return;
  const dmg = Math.round(hitDamage(s) * R.ORB_MUL);
  e.twOrbs = e.twOrbs.filter((o) => {
    if (--o.t <= 0) return false;
    const p = s.player;
    const d = Math.hypot(p.x - o.x, p.y - o.y) || 1;
    o.x += ((p.x - o.x) / d) * R.ORB_SPEED;
    o.y += ((p.y - o.y) / d) * R.ORB_SPEED;
    let hit = false;
    eachSeat(
      s,
      () => {
        const q = s.player;
        if (!hit && (q.x - o.x) ** 2 + (q.y - o.y) ** 2 < (q.r + 4) ** 2) {
          damagePlayer(s, dmg, "twinre");
          hit = true;
        }
      },
      !!s.party,
    );
    if (hit) return false;
    if (lu && !down(lu) && (lu.x - o.x) ** 2 + (lu.y - o.y) ** 2 < (lu.r + 4) ** 2) {
      lu.hp = Math.min(lu.maxHp, lu.hp + lu.maxHp * R.ORB_HEAL);
      addEffect(s, { kind: "burst", x: lu.x, y: lu.y, dirX: 0, dirY: 0, size: 8, maxTicks: 12, foe: true });
      return false;
    }
    return true;
  });
}

/** 루·레 (bosses BOSS_AI) */
export function updateTwin(s: RunState, e: EnemyState, toP: Vec, go: Vec, spawned: EnemyState[]): void {
  // 처음: 루가 레를 데려옴 (체력 배율은 루와 같게)
  if (e.kind === "twinlu" && e.twLink === undefined) {
    const re = makeEnemy(s, "twinre", e.x + 40, e.y, e.maxHp / ENEMIES.twinlu.hp, 60);
    re.noGold = true;
    re.twLink = e.id;
    e.twLink = re.id;
    spawned.push(re);
  }
  // 쓰러져 있음: 시간이 다 되면 다시 일어남
  if (down(e)) {
    if (--e.twDown! > 0) return;
    e.twDown = 0;
    e.hp = Math.round(e.maxHp * R.REVIVE_HP);
    e.immune = false;
    e.air = false;
    e.phase = "walk";
    e.timer = R.REST;
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 18, maxTicks: 18, foe: true });
    return;
  }
  const m = mate(s, e);
  const lu = e.kind === "twinlu" ? e : m;
  // 핏줄은 루가 계산 (짝이 서 있을 때만) · 절반 아래는 가운데 고정점에서 레로 하나 더
  const both = (e.hp + (m?.hp ?? 0)) * 2 < e.maxHp + (m?.maxHp ?? 0);
  if (e.kind === "twinlu" && m && !down(m) && s.tick % R.LINE_EVERY === 0) {
    bloodLine(s, [e.x, e.y], [m.x, m.y]);
    if (both) bloodLine(s, mid(), [m.x, m.y]);
  }
  if (e.kind === "twinre") orbsTick(s, e, lu);
  // 교차 돌진 · 핏줄 감옥 (루가 정하고 레도 같이 움직임, sim/bossTwinsKit)
  if (twinKitTick(s, e, m)) return;
  // 짝이 쓰러져 있으면 화가 나 공격 대기가 빨리 줆
  if (m && down(m) && s.tick % Math.max(1, Math.round(1 / (R.RAGE - 1))) === 0) e.timer--;
  const h = both || half(e);
  if (e.phase === "walk") {
    const sp = ENEMIES[e.kind].speed;
    if (e.kind === "twinlu") {
      e.x += go[0] * sp;
      e.y += go[1] * sp;
    } else {
      const p = s.player;
      const d = Math.hypot(p.x - e.x, p.y - e.y);
      const dir = d > R.KEEP + 10 ? 1 : d < R.KEEP - 15 ? -1 : 0;
      e.x += go[0] * sp * dir;
      e.y += go[1] * sp * dir;
    }
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (e.timer > 0) return;
    e.count++;
    // 자리 바꾸기 (루가 정함, 짝이 서 있을 때)
    if (e.kind === "twinlu" && m && !down(m) && e.count % (h ? R.SWAP_EVERY_HALF : R.SWAP_EVERY) === 0) {
      for (const t of [e, m]) {
        t.phase = "blink";
        t.timer = R.SWAP_WARN;
      }
      return;
    }
    const pair = e.kind === "twinlu" && m && !down(m) && m.phase === "walk";
    if (pair && e.count % R.CAGE_EVERY === 0) return startCage(s, e, m);
    if (pair && e.count % R.CROSS_EVERY === 0) return startCross(s, e, m);
    if (e.kind === "twinlu") {
      e.phase = "charge";
      e.step = R.LEAPS;
      leapWarn(s, e, toP);
    } else {
      const n = h ? R.ORBS_HALF : R.ORBS;
      for (let i = 0; i < n; i++) (e.twOrbs ??= []).push({ x: e.x + toP[0] * 8 + (i - (n - 1) / 2) * 6, y: e.y + toP[1] * 8, t: R.ORB_TICKS });
      e.phase = "volley";
      e.timer = 20;
    }
    return;
  }
  if (e.phase === "blink") {
    if (e.timer > 0) return;
    // 루가 둘의 자리를 바꿈
    if (e.kind === "twinlu" && m && m.phase === "blink") {
      [e.x, m.x] = [m.x, e.x];
      [e.y, m.y] = [m.y, e.y];
      e.prevX = e.x;
      e.prevY = e.y;
      m.prevX = m.x;
      m.prevY = m.y;
      m.phase = "walk";
      m.timer = R.REST / 2;
    }
    e.phase = "walk";
    e.timer = R.REST / 2;
    return;
  }
  if (e.phase === "charge") {
    // 루: 예고 자리로 뛰어들며 할퀴기 (셋)
    const k = 1 / Math.max(1, e.timer);
    e.x += ((e.auxX ?? e.x) - e.x) * k;
    e.y += ((e.auxY ?? e.y) - e.y) * k;
    if (e.timer > 0) return;
    e.step = (e.step ?? 1) - 1;
    if (e.step > 0) return leapWarn(s, e, toP);
    e.phase = "walk";
    e.timer = R.REST;
    return;
  }
  if (e.phase === "volley" && e.timer <= 0) {
    e.phase = "walk";
    e.timer = R.REST;
  }
}

/** 루 한 번 뛰어들기: 사람 쪽 앞 자리에 원 예고 */
function leapWarn(s: RunState, e: EnemyState, toP: Vec): void {
  const p = s.player;
  const d = Math.min(R.LEAP_DIST, Math.hypot(p.x - e.x, p.y - e.y));
  e.auxX = e.x + toP[0] * d;
  e.auxY = e.y + toP[1] * d;
  e.timer = R.LEAP_WARN;
  addShape(s, R.LEAP_WARN, { x: e.auxX, y: e.auxY, radius: R.LEAP_R, damage: Math.round(hitDamage(s) * R.LEAP_MUL), dirX: toP[0], dirY: toP[1], arc: 0.2, by: "twinlu", owner: e.id, fx: "bslash" });
}
