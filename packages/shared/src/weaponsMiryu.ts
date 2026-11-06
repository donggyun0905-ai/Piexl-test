// 미류(탈라시아, 해룡 수인): 대태도로 물 흐르듯 베는 3연격 (물결 가르기 → 역류 베기 → 해룡 일섬)
// 벤 자리에 흐르는 물길이 남아 적을 실어 나르며 베고, 칼날 물기운이 휘어 멀리 적을 벰 · 적 탄을 흘려 모았다가 일섬에 되돌려 보냄
// 해류 게이지가 차면 '천류 해방': 거대한 해룡이 맵 위 모든 물길을 따라 흐르고 폭포로 내리꽂힘
// 무기 = 대태도 10자루. 계산은 sim/miryu·miryuCuts·miryuFlow
import type { WeaponDef } from "./content";

/** 대태도 종류: seiran 청람 · moon 수월 · torrent 격류 · vortex 와류 · mirror 명경 · willow 유엽 · crest 물마루 · frost 빙류 · abyss 심연 · formless 무형 */
export type MiryuKind = "seiran" | "moon" | "torrent" | "vortex" | "mirror" | "willow" | "crest" | "frost" | "abyss" | "formless";

/** 대태도 하나: 종류 · 물길 시간 배율 · 물길 폭 배율 · 물길 실어 나름 배율 · 물길 피해 간격 배율 · 흘리기 시간 배율 · 모을 물방울 최대 · 되돌림 피해 배율 · 휘는 칼날 거리 배율 · 휘는 칼날 맞힐 수 · 일섬 길이 배율 · 베기 거리 배율 · 게이지 배율 */
export interface MiryuStyle {
  miryu: MiryuKind;
  life?: number;
  width?: number;
  carry?: number;
  every?: number;
  guard?: number;
  drops?: number;
  back?: number;
  bend?: number;
  bends?: number;
  flash?: number;
  reach?: number;
  gain?: number;
}

const W = (id: string, damageMul: number, attackSpeed: number, miryu: MiryuStyle) =>
  ({ id, kind: "flowblade", damageMul, attackSpeed, range: 64, projectileSpeed: 7, miryu, exclusive: "miryu" }) as const;

export const MIRYU_WEAPONS = {
  /** 청람 (처음 무기): 고른 성능 */
  mrSeiran: W("mrSeiran", 1, 1, { miryu: "seiran" }),
  /** 수월: 물길이 1.6배 오래 남고 30% 넓음 */
  mrMoon: W("mrMoon", 0.95, 1, { miryu: "moon", life: 1.6, width: 1.3 }),
  /** 격류: 빠르게 벰 · 물길이 1.5배 세게 실어 나르고 두 배 자주 벰 */
  mrTorrent: W("mrTorrent", 0.92, 1.15, { miryu: "torrent", carry: 1.5, every: 0.5 }),
  /** 와류: 셋째 타가 한 바퀴 회오리 베기 · 둥근 물길이 적을 안으로 빨아들임 */
  mrVortex: W("mrVortex", 1, 0.95, { miryu: "vortex" }),
  /** 명경: 흘리기 시간이 길고 물방울을 10개까지 · 되돌린 물칼날이 1.4배 세고 쏜 적을 쫓아감 */
  mrMirror: W("mrMirror", 0.95, 1, { miryu: "mirror", guard: 1.8, drops: 10, back: 1.4 }),
  /** 유엽: 휘는 칼날이 1.5배 멀리 · 적 셋을 이어 벰 */
  mrWillow: W("mrWillow", 0.92, 1, { miryu: "willow", bend: 1.5, bends: 3 }),
  /** 물마루: 해룡 일섬이 1.6배 길고 조금 더 멀리 미끄러짐 */
  mrCrest: W("mrCrest", 1, 0.95, { miryu: "crest", flash: 1.6 }),
  /** 빙류: 물길에 닿은 적이 느려지고, 물길이 사라질 때 얼음으로 깨져 벰 */
  mrFrost: W("mrFrost", 0.95, 1, { miryu: "frost" }),
  /** 심연: 느리지만 무겁고 길게 벰 · 해류 게이지가 빨리 참 */
  mrAbyss: W("mrAbyss", 1.3, 0.8, { miryu: "abyss", reach: 1.15, gain: 1.4 }),
  /** 무형: 벨 때마다 방금 걸어온 길도 물길이 됨 (자유롭게 강을 그림) */
  mrFormless: W("mrFormless", 0.95, 1, { miryu: "formless" }),
} as const satisfies Record<string, WeaponDef>;

/** 미류 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀, 각은 라디안) */
export const MIRYU = {
  /** 3연격 간격 (공격 간격 배율) · 이 틱 동안 안 베면 처음으로 */
  stepTime: [0.5, 0.5, 0.85],
  comboGap: 55,
  /** 1·2타 휩쓸기: 거리 · 반각 · 피해 배율(1타·2타) · 밀어냄 */
  reach: 64,
  sweepArc: 1.45,
  sweepMul: [0.95, 1.05],
  sweepPush: 4,
  /** 3타 해룡 일섬: 길이 · 폭 · 피해 배율 · 앞으로 미끄러지는 거리 · 일섬이 길어져도 미끄러짐은 이 배율까지 */
  flashLen: 120,
  flashW: 14,
  flashMul: 1.6,
  lunge: 34,
  lungeMax: 1.2,
  /** 와류 회오리 베기: 반지름 배율(베기 거리의) · 피해 배율 · 안으로 빨아들임 */
  whirlR: 1.1,
  whirlMul: 1.5,
  whirlPull: 0.6,
  /** 휘는 칼날: 찾는 거리 · 피해 배율 · 맞힐 수 */
  bendR: 140,
  bendMul: 0.55,
  bends: 1,
  /** 물길: 남는 틱 · 폭(절반) · 최대 개수 · 피해 간격 · 피해 배율 · 실어 나름(한 틱 픽셀) · 위에서 내 이동 배율 · 걸어온 길 물길 점 간격 */
  streamTicks: 150,
  streamW: 10,
  streamMax: 8,
  streamEvery: 15,
  streamMul: 0.22,
  carry: 0.9,
  surf: 1.25,
  trailEvery: 5,
  /** 빙류: 느려지는 틱 · 깨질 때 피해 배율 · 반지름 */
  frostSlow: 30,
  shatterMul: 0.5,
  shatterR: 18,
  /** 흘리기: 베고 나서 탄을 받는 틱 · 받는 거리 더함 · 대시 중 받는 거리 · 물방울 최대 */
  guardTicks: 12,
  guardPad: 6,
  dashCatch: 22,
  dropMax: 6,
  /** 되돌리는 물칼날: 빠르기 · 거리 · 몸 반지름 · 피해 배율 · 펼친 각(전체) · 쫓는 정도 */
  bladeSpeed: 7,
  bladeRange: 200,
  bladeR: 8,
  bladeMul: 0.8,
  bladeSpread: 1,
  bladeTurn: 0.18,
  /** 해류 게이지: 가득 · 벤 적 하나 · 흘린 탄 하나 · 물길 피해 · 휘는 칼날 */
  flowMax: 100,
  gainHit: 3,
  gainCatch: 4,
  gainStream: 1,
  gainBend: 2,
  /** 천류 해방: 해룡 빠르기 · 몸 반지름 · 피해 배율 · 같은 적 다시 벨 틱 · 옆으로 밀어냄 · 맨 끝 둘레 고리 반지름 · 고리 점 수 · 마지막 돌진 거리 · 물길 따라가는 점 최대 · 물길 따라가는 길이 최대(픽셀) */
  dragonSpeed: 9,
  dragonR: 16,
  dragonMul: 1.8,
  dragonRehit: 18,
  dragonPush: 10,
  loopR: 60,
  loopPts: 8,
  dive: 140,
  pathMax: 90,
  pathLen: 1600,
  /** 폭포: 반지름 · 피해 배율 · 기절 · 물길이 터질 때 점마다 피해 배율 */
  fallR: 96,
  fallMul: 3,
  fallStun: 50,
  burstMul: 0.6,
};
