// 풍류사 전용 아이템 10개. 효과는 sim/pungryu·pungryuPerks·pungHooks. 수치는 PUNGRYU_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "pungryu" as const, effect: true as const });

export const PUNGRYU_PASSIVES = {
  /** 축지법: 대시가 순간이동 (거리 +40%), 그 뒤 잠깐 다음 글자 피해 2배 */
  puShrink: P("puShrink"),
  /** 분신술: 구절을 완성하면 분신이 나와 잠깐 따로 돌아다니며 글자를 씀 */
  puClone: P("puClone"),
  /** 둔갑술: 체력이 30% 아래로 떨어질 피해를 층마다 한 번 허수아비로 둔갑해 피함 */
  puDisguise: P("puDisguise"),
  /** 의적 주머니: 얻는 돈 + · 가진 돈 100G마다 공격력 + */
  puThief: P("puThief"),
  /** 오색 구름: 구름 자국에 닿은 적이 느려짐 · 지형·지속 피해 없음 */
  puCloud: P("puCloud"),
  /** 먹물 붓: 글자가 맞은 자리에 먹물 웅덩이 */
  puInk: P("puInk"),
  /** 서당 개 삼 년: 구절을 완성할 때마다 이번 판 공격력 + */
  puDog: P("puDog"),
  /** 풍류 피리: 몇 초마다 피리 가락이 둘레 적을 밀치고 적 탄을 지움 */
  puFlute: P("puFlute"),
  /** 천자문 책: 구절에 필요한 글자 4 → 3 */
  puBook: P("puBook"),
  /** 활빈당 깃발: 방을 정리하면 회복 · 상점 가격 할인 */
  puBanner: P("puBanner"),
} as const satisfies Record<string, PassiveDef>;

/** 풍류사 아이템 수치 */
export const PUNGRYU_PERKS = {
  /** 축지법: 대시 거리 배율 · 다음 글자 2배가 남는 틱 · 배율 */
  puShrink: { reach: 1.4, ticks: 30, mul: 2 },
  /** 분신술: 분신 시간 · 최대 수 · 분신 글자 피해 배율 · 처음 나오는 내 옆 거리 · 글자 쓰는 간격(틱) · 사거리 · 적이 없을 때 내 둘레 거리 · 나에게서 이 거리 안 적만 · 빠르기 */
  puClone: { ticks: 240, max: 2, mul: 0.6, side: 18, every: 20, range: 110, gap: 26, leash: 150, speed: 1.6 },
  /** 둔갑술: 이 아래로 떨어질 피해 · 무적 틱 */
  puDisguise: { below: 0.3, invuln: 60 },
  /** 의적 주머니: 얻는 돈 배율 · 100G마다 공격력 + · 최대 */
  puThief: { gold: 1.25, per: 0.02, max: 0.2 },
  /** 오색 구름: 자국 남기는 간격 · 자국 시간 · 자국 반지름 · 느려짐 틱 */
  puCloud: { gap: 6, ticks: 60, r: 10, slow: 20 },
  /** 먹물 붓: 웅덩이 시간 · 반지름 · 때리는 간격 · 초당 피해(공격력 배율) · 최대 수 */
  puInk: { ticks: 120, r: 14, gap: 15, mul: 0.3, max: 8 },
  /** 서당 개 삼 년: 구절마다 공격력 + · 최대 */
  puDog: { per: 0.005, max: 0.3 },
  /** 풍류 피리: 간격 · 반지름 · 밀침 */
  puFlute: { gap: 360, r: 60, push: 20 },
  /** 천자문 책: 구절 글자 수 */
  puBook: { letters: 3 },
  /** 활빈당 깃발: 방 정리 회복(최대 체력 비율) · 상점 가격 배율 */
  puBanner: { heal: 0.04, price: 0.9 },
};
