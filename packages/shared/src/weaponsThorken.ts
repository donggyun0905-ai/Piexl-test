// 토르켄(탈라시아, 바다의 나라): 닻 하나 + 사슬로 이은 철구공. 무기 = 철구공 10개 (닻은 바뀌지 않음)
// 처음 누르면 철구공을 던지고(떨어진 자리에 천둥), 그 뒤 닻을 휘두를 때마다 사슬에 걸린 철구공이 같이 크게 휘둘러짐
// 때릴 때마다 폭풍 게이지가 차고, 가득 차면 다음 휘두르기에 태풍 + 천둥 (계산은 sim/thorken·thorkenBall·thorkenStorm)
import type { WeaponDef } from "./content";

/** 철구공 모양: iron 무쇠 · tide 조수 물결 · volt 뇌운 번개 · whirl 소용돌이 · urchin 성게 가시 · twin 쌍둥이 공
 *  geyser 간헐천 물기둥 · floe 빙해 얼음 · kraken 크라켄 사슬 · maelstrom 대해일(한 바퀴) */
export type BallKind = "iron" | "tide" | "volt" | "whirl" | "urchin" | "twin" | "geyser" | "floe" | "kraken" | "maelstrom";

/** 철구공 종류 · 공 피해 배율(공격력에 곱함) · 사슬 길이 배율 · 휘두르는 각도(라디안, 2π = 한 바퀴) */
export interface FlailStyle {
  ball: BallKind;
  power: number;
  chain?: number;
  arc?: number;
}

const W = (id: string, damageMul: number, attackSpeed: number, flail: FlailStyle) =>
  ({ id, kind: "anchor", damageMul, attackSpeed, range: 70, projectileSpeed: 3.5, flail, exclusive: "thorken" }) as const;

export const THORKEN_WEAPONS = {
  /** 무쇠 철구 (처음 무기): 던져서 떨어진 자리에 천둥 · 무겁고 단단함 */
  tkIron: W("tkIron", 1, 0.75, { ball: "iron", power: 2.6 }),
  /** 조수 철구: 휘두른 끝에서 물결이 퍼져 적을 밀어냄 */
  tkTide: W("tkTide", 1, 0.75, { ball: "tide", power: 2.2 }),
  /** 뇌운 철구: 철구공에 맞은 적 둘레로 번개가 튐 */
  tkVolt: W("tkVolt", 1, 0.75, { ball: "volt", power: 2 }),
  /** 소용돌이 철구: 철구공이 멈춘 자리에 작은 소용돌이 (끌어당김) */
  tkWhirl: W("tkWhirl", 1, 0.75, { ball: "whirl", power: 2 }),
  /** 성게 철구: 휘두른 끝에서 가시가 사방으로 튐 */
  tkUrchin: W("tkUrchin", 1, 0.8, { ball: "urchin", power: 2 }),
  /** 쌍둥이 철구: 사슬 끝에 공 둘 (반대쪽에서 같이 휘둘러짐) */
  tkTwin: W("tkTwin", 0.95, 0.75, { ball: "twin", power: 1.7 }),
  /** 간헐천 철구: 세 번 휘두를 때마다 공 자리에서 물기둥이 솟아 띄움 */
  tkGeyser: W("tkGeyser", 1, 0.75, { ball: "geyser", power: 2.1 }),
  /** 빙해 철구: 맞은 적이 얼어붙듯 느려짐 · 얼어 있는 적은 더 아픔 */
  tkFloe: W("tkFloe", 1, 0.75, { ball: "floe", power: 2.1 }),
  /** 크라켄 철구: 사슬이 길고, 사슬에 닿은 적도 벰 */
  tkKraken: W("tkKraken", 1, 0.72, { ball: "kraken", power: 2, chain: 1.35 }),
  /** 대해일 철구: 한 번에 한 바퀴를 돌며 휘두름 (느리지만 가장 넓음) */
  tkMaelstrom: W("tkMaelstrom", 1.1, 0.55, { ball: "maelstrom", power: 2.4, arc: 6.3 }),
} as const satisfies Record<string, WeaponDef>;

/** 토르켄 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const THORKEN = {
  /** 닻: 닿는 거리 · 휘두르는 부채꼴(cos, -0.2 ≈ 200도) · 피해 배율 · 밀침 */
  anchorReach: 44,
  anchorArc: -0.2,
  anchorMul: 2.5,
  anchorPush: 8,
  /** 사슬 길이 · 철구공 반지름 · 철구공이 휘두르는 각도(기본) · 휘두르는 데 걸리는 틱 */
  chain: 80,
  /** 사거리가 줄어도 사슬은 이 배율 밑으로 안 짧아짐 */
  chainMinMul: 0.6,
  /** 사슬: 나와 철구공 사이 사슬에 닿은 적도 맞음 · 사슬 폭(절반) · 피해 배율 */
  chainW: 4,
  chainMul: 0.9,
  /** 대시로 감아 들일 때: 철구공이 돌아오는 틱 · 돌아오며 맞히는 피해 배율 */
  reelTicks: 9,
  reelMul: 1.2,
  ballR: 10,
  sweep: 3.6,
  sweepTicks: 10,
  /** 던지기: 날아가는 틱 · 떨어진 자리 천둥 반지름 · 천둥 피해 배율 · 기절 틱 */
  throwTicks: 12,
  clapR: 30,
  clapMul: 1.6,
  clapStun: 30,
  /** 폭풍 게이지: 가득 · 닻에 맞은 적마다 · 철구공에 맞은 적마다 · 천둥마다 */
  gaugeMax: 100,
  gaugeAnchor: 8,
  gaugeBall: 10,
  gaugeClap: 12,
  /** 태풍: 남는 틱 · 반지름 · 끌어당김 · 때리는 간격 · 한 번 피해(공격력 배율) */
  stormTicks: 150,
  stormR: 64,
  stormPull: 0.9,
  stormGap: 15,
  stormMul: 0.55,
  /** 천둥: 태풍이 불 때 내리치는 수 · 피해 배율 · 기절 틱 */
  bolts: 5,
  boltMul: 2.4,
  boltStun: 20,
  /** 조수: 물결 반지름 · 피해 배율 · 밀침 */
  tideR: 46,
  tideMul: 0.6,
  tidePush: 14,
  /** 뇌운: 튀는 번개 수 · 닿는 거리 · 피해 배율 */
  voltN: 2,
  voltReach: 70,
  voltMul: 0.6,
  /** 소용돌이: 남는 틱 · 반지름 · 끌어당김 · 때리는 간격 · 한 번 피해 */
  whirlTicks: 60,
  whirlR: 34,
  whirlPull: 0.7,
  whirlGap: 12,
  whirlMul: 0.25,
  /** 성게: 가시 수 · 피해 배율 · 날아가는 거리 */
  spikes: 8,
  spikeMul: 0.45,
  spikeRange: 90,
  /** 간헐천: 몇 번째 휘두르기마다 · 반지름 · 피해 배율 · 띄움(기절) 틱 */
  geyserEvery: 3,
  geyserR: 30,
  geyserMul: 2,
  geyserStun: 40,
  /** 빙해: 느려짐 틱 · 느려진 적이 받는 피해 배율 */
  floeSlow: 60,
  floeTaken: 1.25,
  /** 크라켄: 사슬 폭(절반) · 사슬 피해 배율 (출혈) */
  krakenW: 6,
  krakenMul: 0.8,
};
