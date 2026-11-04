// 빌드 세트 효과 수치 (같은 꼬리표 2 · 4 · 6개, 계산은 sim/buildSets·buildSetFx). 관리자 페이지에서 바꿀 수 있음 (balanceTables)
// 꼬리표는 itemsTags (패시브) + 제단 증강 성좌 꼬리표 (아래 ALTAR_TAGS)
import type { AltarId } from "./altarDefs";
import type { ItemTag } from "./itemsTags";

/** 세트 단계가 오르는 꼬리표 수 (2 · 4 · 6 · 8개는 각성 증강, AWAKEN) */
export const SET_STEPS = { one: 2, two: 4, three: 6, four: 8 };

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

/** 각성 증강: 같은 꼬리표 at개(8)를 모으면 그 꼬리표 기술이 대기 시간(cd 틱)마다 저절로 나감 (둘레 range 안에 적이 있을 때) · 피해는 공격력 배율
 *  필드(장판)는 ticks 동안 every 틱마다 · 떨어지는 공격은 delay 틱 뒤 (계산 sim/buildAwaken, 그림 client render/awaken*) */
export const AWAKEN = {
  at: 8,
  range: 170,
  /** 얼음 서리바람: 둥근 범위에 얼음 결정이 눈처럼 내림 (둔화 · 0.25초마다 피해) */
  ice: { cd: 360, r: 64, ticks: 240, every: 15, dmg: 0.25, slow: 30 },
  /** 불 유성우: 적 자리에 유성 n개 (폭발 반경·피해·점화) */
  fire: { cd: 420, n: 5, r: 30, dmg: 1.2, delay: 30 },
  /** 번개 뇌신의 사슬: 적 사이를 jumps번 튀는 번개 */
  bolt: { cd: 300, jumps: 6, dmg: 0.8, range: 90 },
  /** 독 역병 꽃: 피어난 꽃 둘레 독 안개 (0.25초마다 피해 · 중독) */
  poison: { cd: 360, r: 52, ticks: 240, every: 15, dmg: 0.15, poison: 0.2 },
  /** 빛 성광: 내 둘레 후광(최대 체력 heal 회복) + 적 n명에게 빛기둥 */
  light: { cd: 360, n: 4, r: 22, dmg: 1.2, heal: 0.03, delay: 24 },
  /** 어둠 심연: 적을 가운데로 끌어당기는 소용돌이 (끌어당김 · 피해) */
  dark: { cd: 420, r: 60, ticks: 180, every: 15, dmg: 0.2, pull: 1.2 },
  /** 죽음 사신의 낫: 내 둘레 한 바퀴 (체력 exec 아래 일반 적은 즉사) */
  death: { cd: 360, r: 72, dmg: 1.5, exec: 0.15 },
  /** 대지 지각 분쇄: 바위 가시 고리 rings겹이 gap마다 step 틱 간격으로 퍼짐 (경직) */
  earth: { cd: 420, rings: 3, gap: 26, step: 8, dmg: 1, stun: 30 },
  /** 물 해일: 가까운 적 쪽으로 len만큼 밀려가는 물결 (너비 w · 밀어냄) */
  water: { cd: 420, len: 180, w: 70, ticks: 60, dmg: 1.2, push: 14 },
  /** 날카로움 천검: 하늘에서 칼 n자루 */
  sharp: { cd: 300, n: 8, r: 16, dmg: 0.7, delay: 18 },
  /** 단단함 강철 요새: 보호막(최대 체력 비율) + 둘레 육각 방벽이 맥박마다 피해 */
  tough: { cd: 600, shield: 0.15, r: 52, ticks: 180, every: 30, dmg: 0.5 },
  /** 바람 대회오리: 가까운 적 쪽으로 천천히 나아가는 회오리 (speed 틱마다 거리) */
  wind: { cd: 360, ticks: 180, speed: 1.2, r: 24, every: 15, dmg: 0.3 },
  /** 행운 황금 소나기: 금화 n개 (crit 확률로 피해 3배) */
  luck: { cd: 480, n: 8, r: 18, dmg: 0.6, crit: 0.25, delay: 20 },
  /** 소환 정령 군단: 정령 토템 둘레 정령 n마리가 every 틱마다 쏨 */
  summon: { cd: 480, ticks: 300, n: 3, every: 30, dmg: 0.3, range: 140 },
  /** 피 핏빛 달: 적 n명 발밑에 피의 가시 (준 피해의 leech만큼 회복) */
  blood: { cd: 480, n: 5, r: 20, dmg: 1, leech: 0.2, delay: 20 },
};
