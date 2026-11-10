// 순례자의 월계선 동료 = 진짜 히든 캐릭터 (sim/allies에서 부름): 동료마다 플레이어 상태(PlayerState) 하나를 두고
// 틱마다 그 캐릭터를 잠깐 꺼내 놓고(s.player) 사람처럼 키를 눌러 움직임 계산(stepPlayer)을 그대로 돌림
// → 그 캐릭터의 진짜 기본 공격·연계·패시브 기술·스킬 키(운명의 여행자 등)·대시가 다 나감. 길찾기·위험 피하기는 동료 움직임(sim/allyMove)
// 맞는 피해·체력은 동료(AllyState)가 기준 (적은 동료를 직접 노리지 않음, 적 탄·몸박치기는 allies.hurt)
import { baseStats, type CharacterId, type WeaponId } from "../content";
import { createRng, deriveSeed } from "../rng";
import { computeStats } from "../stats";
import type { AllyState } from "./hiddenTypes";
import { newPlayer, stepPlayer } from "./run";
import { EMPTY_INPUT, type EnemyState, type PlayerState, type RunState, type TickInput } from "./types";
import { dist2, normalize } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 스킬 키를 눌러 보는 간격 틱 (쓸 수 없으면 그냥 지나감) */
  skillEvery: 45,
  /** 대시: 적과 이 거리 안이면 · 간격 틱 */
  dashNear: 50,
  dashEvery: 200,
};
export { R as ALLY_KIT_RULES };

/** 월계선 동료의 진짜 캐릭터 상태 (그 캐릭터 무기 · 체력·공격력 배율) */
export function laurelPlayer(char: CharacterId, weapon: WeaponId, x: number, y: number, hpMul: number, dmgMul: number): PlayerState {
  const pl = newPlayer(char, x, y);
  pl.weaponId = weapon;
  pl.stats = computeStats(baseStats(char, weapon), []);
  pl.stats.maxHp = Math.round(pl.stats.maxHp * hpMul);
  pl.stats.damage *= dmgMul;
  pl.hp = pl.stats.maxHp;
  return pl;
}

/** 동료가 누르는 키: 가까운 적을 자동 조준해 공격 · 가끔 스킬 키 · 붙으면 가끔 대시 (움직임은 allyStep이 함) */
function kitInput(s: RunState, a: AllyState, e: EnemyState | null, n: number): TickInput {
  if (!e) return EMPTY_INPUT;
  const to = normalize(e.x - a.x, e.y - a.y) ?? [a.faceX, a.faceY];
  const rng = createRng(deriveSeed(s.seed, "allyKit", n, s.tick));
  const dash = (s.tick + n * 37) % R.dashEvery === 0 && dist2(a, e) <= R.dashNear ** 2;
  return {
    ...EMPTY_INPUT,
    aimX: Math.round(to[0] * 100) * 3,
    aimY: Math.round(to[1] * 100) * 3,
    // 대시는 적 쪽으로 (대시 공격이 있는 캐릭터)
    ...(dash ? { moveX: Math.round(to[0] * 100), moveY: Math.round(to[1] * 100), dash } : {}),
    attack: true,
    autoAim: true,
    skill: (s.tick + n * 11) % R.skillEvery === 0 ? 1 + rng.int(0, 2) : 0,
  };
}

/** 한 틱: 동료 캐릭터를 꺼내 놓고 그 캐릭터 계산을 돌림 (내 값은 그대로 돌려놓음) */
export function laurelTick(s: RunState, a: AllyState, e: EnemyState | null, n: number): void {
  const pl = a.pl;
  if (!pl) return;
  pl.prevX = a.prevX;
  pl.prevY = a.prevY;
  pl.x = a.x;
  pl.y = a.y;
  pl.hp = a.hp;
  const me = s.player;
  const keep = { auto: s.autoTargetId, pet: s.pet };
  const count = pl.attackCount;
  s.player = pl;
  // 로비 펫은 내 캐릭터 곁에서만 (두 번 때리지 않게)
  delete s.pet;
  try {
    stepPlayer(s, kitInput(s, a, e, n));
  } finally {
    s.player = me;
    s.autoTargetId = keep.auto;
    if (keep.pet) s.pet = keep.pet;
  }
  a.x = pl.x;
  a.y = pl.y;
  a.faceX = pl.faceX;
  a.faceY = pl.faceY;
  // 스스로 깎은 체력·흡혈 회복은 동료 체력에 (최대 체력은 넘지 않음)
  a.hp = Math.min(a.maxHp, pl.hp);
  if (pl.attackCount !== count) a.cd = a.rate;
}
