// 방랑객(아스칼론, 시즌 2): 카타나를 든 떠돌이 무사 · 기본 예리함 25% · 카타나 10개 (계산은 sim/wanderer)
import type { WeaponDef } from "./content";

/** 베는 방식: slash 앞쪽 베기 · iai 발도(앞으로 긴 한 줄) · zone 무심의 원(가만히 서면 원 안에 들어온 적을 바로 벰)
 *  · storm 칼날 폭풍을 날림 · tempest 게이지가 차면 방 전체 칼날 폭풍 · lunge 앞으로 내달리며 벰 */
export type KatanaMode = "slash" | "iai" | "zone" | "storm" | "tempest" | "lunge";

/** 방식 · 베는 거리 · 넓이(코사인) · 한 번에 벰 수(연참은 잇따라) · 같이 날리는 검기 수 */
export interface KatanaStyle {
  mode: KatanaMode;
  reach: number;
  arc: number;
  hits?: number;
  waves?: number;
}

const K = (id: string, damageMul: number, attackSpeed: number, range: number, katana: KatanaStyle) =>
  ({ id, kind: "katana", damageMul, attackSpeed, range, projectileSpeed: 4, katana, exclusive: "wanderer" }) as const;

export const WANDERER_WEAPONS = {
  /** 방랑 카타나 (처음 무기): 앞쪽 베기 */
  wdKatana: K("wdKatana", 1, 1.6, 60, { mode: "slash", reach: 34, arc: 0.2 }),
  /** 발도: 칼을 뽑으며 앞으로 길게 한 줄 */
  wdIai: K("wdIai", 1.8, 1, 90, { mode: "iai", reach: 80, arc: 1 }),
  /** 무심의 원: 1초 가만히 서면 큰 원이 펼쳐지고, 원에 들어온 적은 거리와 상관없이 바로 베임 (대시하면 둘레 적을 원 안으로 끌어당김) */
  wdZone: K("wdZone", 0.9, 1.4, 60, { mode: "zone", reach: 32, arc: 0.2 }),
  /** 칼날 폭풍: 꿰뚫고 나아가는 칼날 폭풍을 날림 */
  wdStorm: K("wdStorm", 0.7, 1.2, 150, { mode: "storm", reach: 30, arc: 0.2, waves: 1 }),
  /** 천검란: 벨 때마다 게이지가 차고, 가득 차면 방 전체에 칼날 폭풍 */
  wdTempest: K("wdTempest", 0.9, 1.5, 60, { mode: "tempest", reach: 34, arc: 0.2 }),
  /** 초승달 베기: 베면서 초승달 검기를 날림 */
  wdCrescent: K("wdCrescent", 0.9, 1.4, 140, { mode: "slash", reach: 32, arc: 0.2, waves: 1 }),
  /** 이도류: 한 번에 두 번 벰 */
  wdTwin: K("wdTwin", 0.7, 1.8, 60, { mode: "slash", reach: 30, arc: 0.1, hits: 2 }),
  /** 노다치: 길고 넓게 */
  wdNodachi: K("wdNodachi", 1.5, 0.9, 70, { mode: "slash", reach: 48, arc: -0.1 }),
  /** 연참: 세 번을 잇따라 벰 */
  wdFlurry: K("wdFlurry", 0.55, 1.3, 60, { mode: "slash", reach: 32, arc: 0.2, hits: 3 }),
  /** 달빛 일섬: 앞으로 길게 내달리고, 2초 뒤 지나간 줄의 적이 한꺼번에 베임 */
  wdMoon: K("wdMoon", 1.4, 1, 100, { mode: "lunge", reach: 96, arc: 1 }),
} as const satisfies Record<string, WeaponDef>;

/** 방랑객 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const WANDERER = {
  /** 발도·일섬 폭 */
  lineWidth: 8,
  /** 연참 사이 틱 */
  flurryGap: 6,
  /** 무심의 원: 가만히 서야 하는 틱 · 반지름 · 원 안 적을 베는 피해 배율 · 같은 적을 다시 베기까지 · 움직인 뒤 남는 틱 · 대시로 끌어당기는 거리 */
  zoneStill: 60,
  zoneR: 70,
  zoneMul: 2,
  zoneGap: 45,
  zoneLinger: 30,
  zonePull: 30,
  /** 무심의 원에서 대시: 원 안 적이 모두 멈추는 틱 · 한 번씩 크게 베는 피해 배율 */
  zoneStun: 60,
  zoneDashMul: 4,
  /** 달빛 일섬: 지나간 줄의 적이 베이기까지 틱 */
  moonDelay: 120,
  /** 칼날 폭풍·초승달 검기: 피해 배율 · 크기 · 속도 */
  waveMul: 0.8,
  waveR: 6,
  waveSpeed: 3.5,
  /** 천검란: 게이지(벤 횟수) · 방 전체 폭풍 횟수 · 사이 틱 · 한 번 피해 배율 */
  tempestNeed: 60,
  tempestHits: 5,
  tempestGap: 12,
  tempestMul: 1.2,
};
