// 풍류사(아스칼론, 시즌 3): 늘 구름을 타고 다니는 의적 선비. 큰 붓으로 허공에 천자문 글자를 써서 날림
// 무기 = 천자문 한 구절(네 글자). 공격 한 번에 글자 하나, 네 번째 글자를 쓰면 구절 완성 → 무기마다 큰 마법 (계산은 sim/pungryu·pungryuVerse)
import type { WeaponDef } from "./content";

/** 구절 마법: heaven 하늘·땅 기둥 · flood 큰 물결 · sunmoon 해·달 구슬 · stars 별자리 선 · seasons 찬바람·뜨거운 바람
 *  harvest 모아 둔 피해 한 번에 · rain 따라오는 비구름 · frost 이슬 → 서리 · gold 금빛 물줄기 · sword 날아가는 명검 */
export type VerseKind = "heaven" | "flood" | "sunmoon" | "stars" | "seasons" | "harvest" | "rain" | "frost" | "gold" | "sword";

/** 글자탄 수 · 사이 각도 · 뚫는 적 수 · 구절 마법 · 구절 피해 배율(공격력에 곱함) */
export interface ScriptStyle {
  verse: VerseKind;
  n: number;
  spread?: number;
  pierce?: number;
  power: number;
}

const W = (id: string, damageMul: number, attackSpeed: number, range: number, script: ScriptStyle) =>
  ({ id, kind: "script", damageMul, attackSpeed, range, projectileSpeed: 4, script, exclusive: "pungryu" }) as const;

export const PUNGRYU_WEAPONS = {
  /** 천지현황(天地玄黃, 처음 무기): 겨눈 적 자리에 하늘의 검은 빛 → 땅의 누런 빛 기둥 */
  puHeaven: W("puHeaven", 1, 1.8, 150, { verse: "heaven", n: 1, power: 3 }),
  /** 우주홍황(宇宙洪荒): 큰 물결이 앞으로 방을 쓸고 감 (밀침) */
  puFlood: W("puFlood", 0.9, 1.6, 150, { verse: "flood", n: 1, power: 4.5 }),
  /** 일월영측(日月盈昃): 해 구슬(화상)·달 구슬(느려짐)이 몸 둘레를 돌며 점점 커짐 */
  puSunMoon: W("puSunMoon", 1, 1.7, 140, { verse: "sunmoon", n: 1, power: 0.9 }),
  /** 진수열장(辰宿列張): 글자에 맞은 적에 별 표식, 구절 때 표식 난 적을 별자리 선으로 이어 벰 */
  puStars: W("puStars", 1, 1.8, 160, { verse: "stars", n: 1, power: 2.2 }),
  /** 한래서왕(寒來暑往): 앞쪽에 찬바람(얼림) → 뜨거운 바람(화상) */
  puSeasons: W("puSeasons", 0.9, 1.7, 130, { verse: "seasons", n: 1, power: 1.6 }),
  /** 추수동장(秋收冬藏): 글자 피해 일부를 곳간에 모았다가 가장 센 적에게 한 번에 */
  puHarvest: W("puHarvest", 1.1, 1.8, 150, { verse: "harvest", n: 1, power: 2 }),
  /** 운등치우(雲騰致雨): 비구름이 떠올라 나를 따라다니며 비를 뿌림 */
  puRain: W("puRain", 1, 1.8, 150, { verse: "rain", n: 1, power: 0.45 }),
  /** 노결위상(露結爲霜): 글자에 맞은 적에 이슬, 구절 때 이슬 맺힌 적을 모두 서리로 얼림 */
  puFrost: W("puFrost", 1, 1.8, 150, { verse: "frost", n: 1, power: 1 }),
  /** 금생여수(金生麗水): 금빛 물줄기 세 갈래, 구절 때 큰 물줄기 (쓰러뜨리면 금화) */
  puGold: W("puGold", 0.45, 2, 140, { verse: "gold", n: 3, spread: 0.12, power: 2.5 }),
  /** 검호거궐(劍號巨闕): 무거운 글자, 구절 때 명검 거궐이 날아가 앞을 크게 벰 */
  puSword: W("puSword", 1.3, 1.3, 140, { verse: "sword", n: 1, pierce: 1, power: 5 }),
} as const satisfies Record<string, WeaponDef>;

/** 풍류사 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const PUNGRYU = {
  /** 구절 하나에 쓰는 글자 수 · 이만큼 쓰지 않으면 처음부터 */
  letters: 4,
  idle: 120,
  /** 글자탄 크기 · 구절 마법이 노리는 거리(사거리 배율) */
  letterR: 3.5,
  aim: 1.3,
  /** 구름 타기: 지형·지속 피해 배율 */
  cloudEnv: 0.5,
  /** 천지현황: 기둥 반지름 · 땅 기둥까지 틱 · 땅 기둥 피해(하늘 기둥 대비) */
  heavenR: 26,
  heavenGap: 14,
  earthMul: 0.7,
  /** 우주홍황: 물결 길이·폭(절반) · 밀침 */
  floodLen: 220,
  floodW: 18,
  floodPush: 14,
  /** 일월영측: 구슬 시간 · 도는 반지름 · 구슬 크기(처음 → 끝) · 때리는 간격 · 달 느려짐 · 해 화상 배율 */
  orbTicks: 360,
  orbRing: 34,
  orbR0: 7,
  orbR1: 14,
  orbGap: 15,
  moonSlow: 60,
  sunBurn: 1,
  /** 진수열장: 별 표식 시간 · 선 굵기(절반) · 표식 하나 늘 때마다 피해 + · 최대 */
  starTicks: 600,
  starW: 6,
  starPer: 0.25,
  starMax: 2,
  /** 한래서왕: 부채꼴 거리·cos · 뜨거운 바람까지 틱 · 얼림 틱 */
  windR: 95,
  windCos: 0.3,
  windGap: 15,
  freeze: 60,
  /** 추수동장: 글자 피해 중 곳간에 모으는 몫 · 쓰러뜨리면 돈 */
  store: 0.3,
  reapGold: 3,
  /** 운등치우: 비구름 시간 · 반지름 · 때리는 간격 · 느려짐 */
  rainTicks: 240,
  rainR: 50,
  rainGap: 15,
  rainSlow: 20,
  /** 노결위상: 이슬 하나마다 피해 + · 서리 시간 · 서리 맞은 적 받는 피해(풍류사 공격) */
  dewPer: 0.5,
  frostTicks: 120,
  frostTaken: 1.3,
  /** 금생여수: 큰 물줄기 길이·폭 · 쓰러뜨리면 돈 */
  goldLen: 200,
  goldW: 8,
  goldCoin: 3,
  /** 검호거궐: 명검이 베는 길이·폭 */
  swordLen: 150,
  swordW: 22,
};
