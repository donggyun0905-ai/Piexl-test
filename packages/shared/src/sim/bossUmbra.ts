// 시즌 2 라스트 보스 검은 잔영: 맞지 않고 방 위쪽에서 지켜보며 거대한 짐승 셋(데스웜 · 거대 전갈 · 거대 매)을 한꺼번에 불러 1대3
// 짐승이 하나 쓰러질 때마다 한마디 → 셋을 다 잡으면 검은 모습으로 셋을 체력 절반으로 되살림 (필살기는 다시 안 씀, 공격 주기가 더 빠름)
// 되살린 셋도 다 잡으면 "지켜볼 가치가 있어.." 뒤 사라짐 (그때 쓰러진 것으로 셈)
// 체력은 세 짐승 체력의 합: 화면은 막대 하나를 짐승마다 한 칸씩 세 칸으로 (전갈 칸은 흰 보호막까지)
import { ENEMIES, UMBRA_BEASTS, UMBRA_WARD } from "../content";
import { ROOM_CX } from "../constants";
import type { EnemyState, RunState } from "./types";
import { addEffect, makeEnemy, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 처음 말하고 짐승을 부르기까지 · 셋을 잡은 뒤 되살리기까지 · 마지막 말 뒤 사라지기까지 */
  INTRO: 150,
  REVIVE: 180,
  VANISH: 200,
};
export { R as BOSS_UMBRA_RULES };

/** 짐승이 솟는 자리 (방 위쪽, 왼쪽부터 데스웜 · 전갈 · 매) */
const SPOTS = [-110, 0, 110];

/** 대사: [처음 · 하나 · 둘 · 셋] (첫 셋 / 되살린 셋) */
const LINES = [
  [0, 1, 2, 4],
  [0, 5, 6, 3],
];

/** 짐승 셋 (dark: 되살린 검은 모습, 필살기 없음) */
function summon(s: RunState, e: EnemyState, spawned: EnemyState[], dark: boolean): void {
  const mul = e.maxHp / ENEMIES.umbra.hp;
  UMBRA_BEASTS.forEach((kind, i) => {
    const b = makeEnemy(s, kind, ROOM_CX + SPOTS[i]!, ROOM_MIN_Y + 70, mul, 60 + i * 40);
    const ward = UMBRA_WARD[kind];
    if (ward) b.ward = Math.round(b.maxHp * ward);
    // 되살린 셋은 체력·보호막 절반
    if (dark) {
      b.dark = b.ultDone = true;
      b.hp = Math.round(b.maxHp / 2);
      if (b.ward) b.ward = Math.round(b.ward / 2);
    }
    spawned.push(b);
    addEffect(s, { kind: "burst", x: b.x, y: b.y, dirX: 0, dirY: 0, size: b.r * 2, maxTicks: 20 });
  });
}

function say(s: RunState, e: EnemyState, line: number): void {
  e.say = line;
  e.sayAt = s.tick;
}

export function updateUmbra(s: RunState, e: EnemyState, _toP: readonly [number, number], _go: readonly [number, number], spawned: EnemyState[]): void {
  e.immune = true;
  e.air = true;
  e.stunTicks = 0;
  // 방 위쪽 가운데에서 천천히 흔들리며 지켜봄
  e.x = ROOM_CX + (s.tick % 240 < 120 ? (s.tick % 120) / 6 - 10 : 10 - (s.tick % 120) / 6);
  e.y = ROOM_MIN_Y + 16;
  if (e.step === undefined) {
    e.step = -1;
    e.timer = R.INTRO;
    say(s, e, 0);
  }
  if (e.step < 0) {
    if (e.timer > 0) return;
    // step = 쓰러진 짐승 수
    e.step = 0;
    e.phase = "act";
    summon(s, e, spawned, false);
    return;
  }
  const alive = s.enemies.filter((o) => (UMBRA_BEASTS as readonly string[]).includes(o.kind) && o.hp > 0);
  e.hp = Math.max(1, alive.reduce((sum, o) => sum + o.hp, 0));
  const down = UMBRA_BEASTS.length - alive.length;
  // count = 0 첫 셋 · 1 되살린 셋
  if (down > e.step) {
    e.step = down;
    say(s, e, LINES[e.count]![down]!);
    if (down === UMBRA_BEASTS.length) {
      e.phase = "walk";
      e.timer = e.count === 0 ? R.REVIVE : R.VANISH;
    }
  }
  if (e.phase !== "walk" || e.timer > 0) return;
  if (e.count === 0) {
    // 되살림
    e.count = 1;
    e.step = 0;
    e.phase = "act";
    summon(s, e, spawned, true);
    return;
  }
  // 사라짐: 쓰러진 것으로 셈
  addEffect(s, { kind: "puff", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 30, maxTicks: 30 });
  e.immune = false;
  e.hp = 0;
}
