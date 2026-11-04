// 빌드 세트 효과 수치 (같은 꼬리표 2 · 4 · 6개, 계산은 sim/buildSets·buildSetFx). 관리자 페이지에서 바꿀 수 있음 (balanceTables)
// 꼬리표는 itemsTags (패시브) + 제단 증강 성좌 꼬리표 (아래 ALTAR_TAGS)
import type { AltarId } from "./altarDefs";
import type { ItemTag } from "./itemsTags";

/** 세트 단계가 오르는 꼬리표 수 (2 · 4 · 6) */
export const SET_STEPS = { one: 2, two: 4, three: 6 };

/** 세트 효과 수치 (꼬리표마다, 단계 숫자 2·4·6은 그 단계에서 생기는 효과) */
export const BUILD_SETS = {
  /** 불: 2 화상 피해 + · 4 화상 걸린 적이 쓰러지면 폭발(반경·공격력 배율) · 6 맞힐 때 확률로 점화 */
  fire: { burn2: 0.2, boomR4: 36, boom4: 0.5, ignite6: 0.15 },
  /** 얼음: 2 맞힐 때 확률로 둔화(틱, 보스 제외) · 4 둔화된 적에게 피해 + · 6 같은 적을 이 횟수 맞히면 빙결(틱, 보스는 짧게) */
  ice: { slow2: 0.2, slowT2: 60, dmg4: 0.15, hits6: 3, freeze6: 60, bossFreeze6: 18 },
  /** 번개: 2 맞힐 때 확률로 가까운 다른 적에게 번개(거리·공격력 배율) · 4 번개 확률·피해 · 6 이 틱마다 둘레 적 몇 명에게 번개 */
  bolt: { chance2: 0.1, range2: 70, dmg2: 0.3, chance4: 0.2, dmg4: 0.6, every6: 240, count6: 3, dmg6: 1, range6: 110 },
  /** 독: 2 맞힐 때 확률로 중독(틱·0.5초마다 공격력 배율) · 4 중독 피해 + · 6 중독된 적이 쓰러지면 독구름(반경) */
  poison: { chance2: 0.15, ticks2: 120, dmg2: 0.12, dmg4: 0.3, cloudR6: 40 },
  /** 빛: 2 회복량 + · 4 방을 정리하면 최대 체력의 비율 회복 · 6 체력이 가득하면 피해 + */
  light: { heal2: 0.15, clear4: 0.05, full6: 0.15 },
  /** 어둠: 2 체력 이 비율 아래면 피해 + · 4 그 피해 더 · 6 처치하면 가까운 적을 그림자가 벰(거리·공격력 배율) */
  dark: { low: 0.5, dmg2: 0.1, dmg4: 0.2, range6: 80, cut6: 0.8 },
  /** 죽음: 2 체력 이 비율 아래 적에게 피해 + · 4 처치할 때 확률로 둘레 일반 적 하나 즉사(거리) · 6 처치마다 피해 +(중첩 최대·유지 틱) */
  death: { low2: 0.25, dmg2: 0.15, reap4: 0.05, range4: 60, soul6: 0.03, max6: 10, ticks6: 300 },
  /** 대지: 2 방어력 + · 4 대시가 끝나면 충격파(반경·공격력 배율) · 6 가만히 서 있으면 받는 피해 줄임 */
  earth: { def2: 3, quakeR4: 34, quake4: 0.5, still6: 0.2 },
  /** 물: 2 맞힐 때 확률로 물튐(반경·공격력 배율) · 4 물튐 확률 · 6 물튐에 맞은 적 둔화(틱) */
  water: { chance2: 0.1, splashR: 28, splash: 0.2, chance4: 0.25, slow6: 60 },
  /** 날카로움: 2 치명타 확률 + · 4 치명타 피해 + · 6 치명타 확률 더 + */
  sharp: { crit2: 0.05, critDmg4: 0.25, crit6: 0.1 },
  /** 단단함: 2 방어력 + · 4 피해 감소 + · 6 맞으면 보호막(최대 체력 비율, 다시 쓰는 틱) */
  tough: { def2: 5, cut4: 0.08, shield6: 0.08, cd6: 240 },
  /** 바람: 2 이동 속도 + · 4 대시 대기 시간 배율 · 6 대시 뒤 이 틱 동안 피해 + */
  wind: { move2: 0.1, dash4: 0.8, after6: 60, dmg6: 0.25 },
  /** 행운: 2 돈 획득 + · 4 행운 + · 6 치명타 확률·회피 + */
  luck: { gold2: 0.15, luck4: 2, crit6: 0.05, dodge6: 0.05 },
  /** 소환: 2 이 틱마다 작은 정령이 가까운 적에게 정령탄(거리·공격력 배율) · 4 더 자주 · 6 정령탄이 맞히면 체력 회복 */
  summon: { every2: 240, range2: 140, dmg2: 0.4, every4: 120, heal6: 0.5 },
  /** 피: 2 흡혈 + · 4 맞힐 때 확률로 출혈 · 6 체력 이 비율 아래면 흡혈 더 + */
  blood: { leech2: 0.02, bleed4: 0.15, low6: 0.5, leech6: 0.02 },
} satisfies Record<ItemTag, Record<string, number>>;

/** 제단 증강을 받으면 그 성좌 꼬리표가 각각 +1 (알 수 없는 성좌는 행운 + 고른 꼬리표 하나) */
export const ALTAR_TAGS: Record<AltarId, readonly ItemTag[]> = {
  whale: ["water", "ice"],
  turtle: ["earth", "fire"],
  hawk: ["bolt", "tough"],
  wind: ["sharp", "wind"],
  sion: ["light", "dark"],
  sylvester: ["poison", "summon"],
  witch: ["death", "blood"],
  unknown: ["luck"],
};

/** 보상 편향: 가장 많이 가진 꼬리표 패시브가 더 잘 나옴 (가진 수 1개마다 배율 +per, 최대 max) · 셋 이상 고르는 보상은 한 칸을 늘 다른 꼬리표로 */
export const SET_BIAS = { per: 0.25, max: 2.5 };
