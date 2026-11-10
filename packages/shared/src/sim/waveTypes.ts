// 웨이브 상태 타입 (sim/wave). 모두 선택 값 (예전 저장에는 없음)
import type { HookFx } from "./hookTypes";
import type { MadQueenFx } from "./madQueenTypes";
import type { OrcaFx } from "./orcaTypes";
import type { TailFx } from "./tailTypes";

/**
 * 물로 빚은 것 하나 (초승달·나비·고래·구름…): k 종류 · 자리 · 방향 · 남은 틱 · 처음 틱 · 피해 배율
 * 나머지는 종류마다 씀: hit 맞힌 적 · tg 쫓는 적 · n 세는 값 · v 덧값 · ox,oy 처음 자리·목표 자리 · ids 묶은 적 · pts 자리 목록
 */
export interface WvBit {
  k: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  t: number;
  t0: number;
  mul: number;
  hit?: number[];
  tg?: number;
  n?: number;
  v?: number;
  ox?: number;
  oy?: number;
  ids?: number[];
  pts?: number[];
}

export interface WavePlayerState {
  /** 상상력 (0~WAVE.gaugeMax) · 다음에 나갈 기술 */
  wvGauge?: number;
  wvNext?: string;
  /** 물로 빚은 것들 */
  wvBits?: WvBit[];
  /** 물의 갑옷 남은 틱 · 파도 타기 (방향·남은 틱·맞힌 적) · 만조 · 물안개 · 물의 날개 남은 틱 */
  wvArmor?: number;
  wvSurf?: { dx: number; dy: number; t: number; hit: number[]; m: number };
  wvFlood?: number;
  wvMist?: number;
  wvWings?: number;
  /** 만조·물안개·물의 날개를 쓸 때 기술 세기 */
  wvFloodMul?: number;
  wvMistMul?: number;
  wvWingsMul?: number;
  /** 잠든 적 (인어의 노래, 다음 피해 2배) */
  wvSleep?: number[];
  /** 지나온 자리 (x, y 번갈아, 물발자국) */
  wvSteps?: number[];
  /** 지난 틱 대시 중이었는지 · 지금 방 */
  wvDash?: boolean;
  wvRoom?: string;
  /** 마지막으로 나간 기술 · 틱 (머리 위 이름) */
  wvLast?: { k: string; t: number };
}

/** 효과: 초승달 터짐 · 기술 이름 · 물보라 · 나비 터짐 · 물창 꿰뚫음 · 갑옷 터짐 · 물병 쏟음 · 고래 솟구침 · 거품 터짐 · 찌릿 · 용오름 · 꽃 · 물보라 끝 · 만조 물결 · 밧줄 부딪힘 · 풍선 터짐 · 진주 튐 · 손뼉 · 분수 방울 · 물수제비 · 음표 · 탄 지움 · 문어 다리 · 깃털 · 눈 짓누름 · 고리 · 물가시 · 해일 */
export type WaveFx =
  | "wvCrest" | "wvCast" | "wvSplash" | "wvFlyPop" | "wvPierce" | "wvArmorPop" | "wvPour" | "wvBreach" | "wvBubblePop" | "wvZap"
  | "wvSpoutHit" | "wvBloom" | "wvSurfEnd" | "wvFloodWave" | "wvRopeCrash" | "wvBalloonPop" | "wvPearlBounce" | "wvClap"
  | "wvLob" | "wvSkipRing" | "wvNote" | "wvErase" | "wvSlam" | "wvFeather" | "wvCrush" | "wvRing" | "wvSpike" | "wvTsunamiHit";

/** 탈라시아 캐릭터 효과 묶음 (fxTypes가 커서 여기서 합침) */
export type SeaFx = TailFx | MadQueenFx | HookFx | OrcaFx | WaveFx;
