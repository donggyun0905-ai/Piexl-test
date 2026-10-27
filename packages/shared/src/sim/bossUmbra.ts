// 시즌 2 라스트 보스 검은 잔영: 맞지 않고 방 위쪽에서 지켜보며 거대한 짐승 셋(데스웜 → 거대 전갈 → 거대 매)을 하나씩 부름
// 짐승을 하나 잡을 때마다 한마디 ("호오..." · "제법이군..." · "지켜볼 가치가 있어..") → 셋을 다 잡으면 사라짐 (그때 쓰러진 것으로 셈)
// 체력은 세 짐승 체력의 합: 화면은 막대 하나를 세 칸으로 나눠 보여 줌
import { ENEMIES, UMBRA_BEASTS } from "../content";
import { ROOM_CX } from "../constants";
import type { EnemyState, RunState } from "./types";
import { addEffect, makeEnemy, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 처음 말하고 첫 짐승을 부르기까지 · 짐승을 잡은 뒤 말하는 틱 · 마지막 말 뒤 사라지기까지 */
  INTRO: 150,
  TALK: 170,
  VANISH: 200,
};
export { R as BOSS_UMBRA_RULES };

/** 짐승 하나의 최대 체력 (검은 잔영과 같은 배율) */
const beastHp = (e: EnemyState, i: number) => Math.round(ENEMIES[UMBRA_BEASTS[i]!].hp * (e.maxHp / ENEMIES.umbra.hp));

/** 짐승이 솟는 자리: 방 가운데 위쪽 */
function summon(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  const i = e.step ?? 0;
  const b = makeEnemy(s, UMBRA_BEASTS[i]!, ROOM_CX, ROOM_MIN_Y + 70, e.maxHp / ENEMIES.umbra.hp, 60);
  spawned.push(b);
  addEffect(s, { kind: "burst", x: b.x, y: b.y, dirX: 0, dirY: 0, size: b.r * 2, maxTicks: 20 });
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
  e.x = ROOM_CX + ((s.tick % 240) < 120 ? (s.tick % 120) / 6 - 10 : 10 - (s.tick % 120) / 6);
  e.y = ROOM_MIN_Y + 16;
  if (e.step === undefined) {
    e.step = -1;
    e.timer = R.INTRO;
    say(s, e, 0);
  }
  const step = e.step;
  if (step < 0) {
    if (e.timer > 0) return;
    e.step = 0;
    e.phase = "act";
    summon(s, e, spawned);
    return;
  }
  // 아직 안 나온 짐승 체력 + 지금 짐승 체력
  let rest = 0;
  for (let i = step + 1; i < UMBRA_BEASTS.length; i++) rest += beastHp(e, i);
  const beast = s.enemies.find((o) => o.kind === UMBRA_BEASTS[step] && o.hp > 0);
  if (e.phase === "act") {
    e.hp = Math.max(1, rest + (beast?.hp ?? 0));
    if (beast) return;
    // 짐승이 쓰러짐: 한마디
    e.phase = "walk";
    e.timer = step === UMBRA_BEASTS.length - 1 ? R.VANISH : R.TALK;
    say(s, e, step + 1);
    return;
  }
  e.hp = Math.max(1, rest);
  if (e.timer > 0) return;
  if (step === UMBRA_BEASTS.length - 1) {
    // 사라짐: 쓰러진 것으로 셈
    addEffect(s, { kind: "puff", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 30, maxTicks: 30 });
    e.immune = false;
    e.hp = 0;
    return;
  }
  e.step = step + 1;
  e.phase = "act";
  delete e.say;
  summon(s, e, spawned);
}
