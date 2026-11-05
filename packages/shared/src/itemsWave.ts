// 웨이브 전용 아이템 30개: 하나하나가 물로 빚는 기술 하나 (상상력이 차면 가진 기술 중 무작위로 하나). 효과는 sim/waveSkills*. 수치는 WAVE_PERKS
import type { PassiveDef } from "./items";

const P = <T extends string>(id: T) => ({ id, mods: [], exclusive: "wave" as const, effect: true as const });

export const WAVE_PASSIVES = {
  /** 물나비: 물나비 떼가 팔랑이며 날아가 적에게 앉으면 물방울로 터짐 (느려짐) */
  wvButterfly: P("wvButterfly"),
  /** 물창: 머리 위에 큰 물창이 빚어져 겨눈 뒤 가장 먼 적까지 꿰뚫음 */
  wvSpear: P("wvSpear"),
  /** 물의 갑옷: 물 보호막 · 깨지거나 끝나면 둘레로 터짐 */
  wvArmor: P("wvArmor"),
  /** 물의 여신: 등 뒤에 물의 여신이 나타나 적이 몰린 곳에 물병을 쏟음 */
  wvGoddess: P("wvGoddess"),
  /** 꿈의 고래: 바닥 아래로 고래 그림자가 헤엄쳐 가 적 무리 밑에서 솟구침 (띄움) */
  wvWhale: P("wvWhale"),
  /** 거품 감옥: 가까운 적을 거품에 가둬 띄웠다가 터뜨림 */
  wvBubble: P("wvBubble"),
  /** 물시계: 물시계 둘레의 시간이 느려짐 (적·적 탄 느리게, 째깍마다 피해) */
  wvClock: P("wvClock"),
  /** 해파리 등불: 해파리 셋이 떠다니며 서로 전기 줄로 이어짐 (줄에 닿은 적 감전) */
  wvJelly: P("wvJelly"),
  /** 물거울: 물로 된 내가 하나 더 서서 초승달을 같이 날림 */
  wvMirror: P("wvMirror"),
  /** 소나기 구름: 작은 비구름이 가장 센 적을 따라다니며 비를 퍼부음 */
  wvCloud: P("wvCloud"),
  /** 용오름: 물 회오리가 벽에 튕기며 돌아다니고 적을 빨아들여 돌림 */
  wvSpout: P("wvSpout"),
  /** 물연꽃: 적 자리에 물연꽃이 피어 꽃잎이 하나씩 소용돌이치며 날아감 */
  wvLotus: P("wvLotus"),
  /** 파도 타기: 파도를 만들어 서핑보드로 타고 내달림 (무적, 앞을 쓸어 버림) */
  wvSurf: P("wvSurf"),
  /** 물방울 회오리: 몸에서 물방울이 나선으로 쏟아져 나감 */
  wvSpiral: P("wvSpiral"),
  /** 만조: 방 전체가 물에 잠김 (모든 적 피해·느려짐, 나는 빨라짐) */
  wvFlood: P("wvFlood"),
  /** 물고기 떼: 물고기 떼가 적을 둘러싸고 빙빙 돌며 뜯어먹음 */
  wvSchool: P("wvSchool"),
  /** 물밧줄: 둘레 적들을 물밧줄로 묶어 한가운데로 끌어 부딪힘 */
  wvRope: P("wvRope"),
  /** 물풍선: 큰 물풍선을 던져 터뜨리고 미끄러운 물웅덩이를 남김 */
  wvBalloon: P("wvBalloon"),
  /** 진주 구슬: 진주가 벽에 튕길 때마다 빨라지고 세짐 */
  wvPearl: P("wvPearl"),
  /** 물의 손: 땅에서 큰 물의 손 둘이 솟아 적을 손뼉으로 짓누름 (기절) */
  wvHands: P("wvHands"),
  /** 분수: 그 자리에 분수가 솟아 둘레 적에게 물방울을 포물선으로 뿌림 */
  wvFountain: P("wvFountain"),
  /** 물수제비: 물 조약돌이 통통 튀며 앞으로 · 튈 때마다 물결 고리 */
  wvSkip: P("wvSkip"),
  /** 인어의 노래: 물 음표가 물결치며 날아가 적을 잠재움 (잠든 적은 다음 피해 2배) */
  wvSiren: P("wvSiren"),
  /** 물안개: 둘레를 물안개가 감싸 적 탄을 지우고 받는 피해가 줄어듦 */
  wvMist: P("wvMist"),
  /** 대왕 문어: 물 문어 다리 여덟이 차례로 내리침 */
  wvOctopus: P("wvOctopus"),
  /** 물의 날개: 물의 날개가 돋아 빨라지고, 날갯짓마다 깃털이 날아감 */
  wvWings: P("wvWings"),
  /** 심해의 눈: 가장 센 적 밑에 거대한 눈이 떠 노려본 뒤 수압으로 짓누름 */
  wvEye: P("wvEye"),
  /** 밀물 썰물: 물결 고리가 밀려 나갔다가 다시 밀려 들어오며 두 번 침 */
  wvEbb: P("wvEbb"),
  /** 물발자국: 지나온 발자국에서 차례로 물가시가 솟음 */
  wvTrail: P("wvTrail"),
  /** 자유의 해일: 방을 가로지르는 거대한 해일이 적을 쓸어 감 */
  wvTsunami: P("wvTsunami"),
} as const satisfies Record<string, PassiveDef>;

export type WvSkill = keyof typeof WAVE_PASSIVES;
export const WV_SKILLS = Object.keys(WAVE_PASSIVES) as WvSkill[];

/** 웨이브 기술 수치 (mul = 공격력 배율, 틱 60 = 1초, 거리 픽셀) */
export const WAVE_PERKS = {
  /** 물나비: 수 · 빠르기 · 남는 틱 · 피해 · 느려짐 틱 */
  wvButterfly: { n: 5, speed: 2.6, life: 150, mul: 0.8, slow: 60 },
  /** 물창: 겨누는 틱 · 빠르기 · 거리 · 폭 · 피해 */
  wvSpear: { aim: 24, speed: 9, range: 300, w: 9, mul: 2.2 },
  /** 물의 갑옷: 보호막(최대 체력 비율) · 남는 틱 · 터짐 반지름 · 피해 · 밀어냄 */
  wvArmor: { shield: 0.25, ticks: 300, r: 60, mul: 1.4, push: 16 },
  /** 물의 여신: 남는 틱 · 쏟는 간격 · 물기둥 반지름 · 피해 */
  wvGoddess: { ticks: 180, every: 30, r: 30, mul: 0.7 },
  /** 꿈의 고래: 빠르기 · 솟구침 반지름 · 피해 · 기절 틱 */
  wvWhale: { speed: 3.5, r: 54, mul: 2.6, stun: 50 },
  /** 거품 감옥: 가두는 수 · 찾는 거리 · 갇히는 틱 · 터짐 피해 · 둘레 반지름·피해 */
  wvBubble: { n: 3, reach: 160, ticks: 120, mul: 1.6, r: 30, near: 0.6 },
  /** 물시계: 반지름 · 남는 틱 · 째깍 간격 · 피해 · 적 탄 느려짐(움직임 비율) */
  wvClock: { r: 70, ticks: 180, every: 30, mul: 0.35, shot: 0.4 },
  /** 해파리 등불: 남는 틱 · 삼각형 반지름 · 떠가는 빠르기 · 찌릿 간격 · 피해 */
  wvJelly: { ticks: 240, r: 42, speed: 0.6, every: 20, mul: 0.3 },
  /** 물거울: 남는 틱 · 서는 자리(내 뒤로) */
  wvMirror: { ticks: 300, back: 26 },
  /** 소나기 구름: 남는 틱 · 빠르기 · 빗방울 간격 · 빗방울 반지름 · 피해 */
  wvCloud: { ticks: 240, speed: 2.2, every: 6, r: 12, mul: 0.1 },
  /** 용오름: 남는 틱 · 빠르기 · 반지름 · 빨아들임 · 피해 간격 · 피해 */
  wvSpout: { ticks: 210, speed: 1.8, r: 34, pull: 1.2, every: 15, mul: 0.25 },
  /** 물연꽃: 피는 틱 · 꽃잎 수 · 꽃잎 간격 · 꽃잎 빠르기 · 거리 · 꽃잎 피해 · 가운데 터짐 피해 */
  wvLotus: { bloom: 20, petals: 8, every: 5, speed: 4.5, range: 110, mul: 0.7, core: 1 },
  /** 파도 타기: 틱 · 한 틱 거리 · 피해 · 밀어냄 · 끝 물보라 반지름·피해 */
  wvSurf: { ticks: 22, step: 6, mul: 1.6, push: 14, r: 40, end: 1 },
  /** 물방울 회오리: 틱 · 쏘는 간격 · 도는 각(라디안) · 빠르기 · 거리 · 피해 */
  wvSpiral: { ticks: 60, every: 3, turn: 0.5, speed: 4, range: 130, mul: 0.22 },
  /** 만조: 틱 · 피해 간격 · 피해 · 느려짐 틱 */
  wvFlood: { ticks: 180, every: 30, mul: 0.3, slow: 30 },
  /** 물고기 떼: 틱 · 빠르기 · 뜯는 간격 · 반지름 · 피해 */
  wvSchool: { ticks: 240, speed: 3, every: 10, r: 26, mul: 0.12 },
  /** 물밧줄: 묶는 수 · 찾는 거리 · 끌기 전 틱 · 부딪힘 피해 · 묶인 적 하나마다 더함 · 기절 */
  wvRope: { n: 4, reach: 150, wait: 30, mul: 1.5, per: 0.25, stun: 30 },
  /** 물풍선: 날아가는 틱 · 던지는 거리 · 터짐 반지름·피해 · 웅덩이 틱 · 웅덩이 피해 간격·피해 */
  wvBalloon: { flight: 36, reach: 200, r: 40, mul: 1.8, pool: 150, every: 30, poolMul: 0.2 },
  /** 진주 구슬: 빠르기 · 튈 때마다 빨라짐 · 튀는 수 · 피해 · 튈 때마다 세짐 · 최대 틱 */
  wvPearl: { speed: 3.5, faster: 0.6, bounces: 7, mul: 0.8, up: 0.15, life: 300 },
  /** 물의 손: 모이는 틱 · 벌어진 거리 · 손뼉 반지름 · 피해 · 기절 · 손 사이 피해 */
  wvHands: { ticks: 30, gap: 50, r: 26, mul: 2.8, stun: 60, between: 1 },
  /** 분수: 틱 · 뿌리는 간격 · 찾는 거리 · 날아가는 틱 · 반지름 · 피해 */
  wvFountain: { ticks: 240, every: 25, reach: 180, flight: 24, r: 18, mul: 0.45 },
  /** 물수제비: 튀는 수 · 한 번 튀는 거리 · 빠르기 · 물결 반지름 · 피해 */
  wvSkip: { hops: 5, hop: 34, speed: 5, r: 26, mul: 0.75 },
  /** 인어의 노래: 음표 수 · 펼침 각 · 빠르기 · 거리 · 피해 · 잠 틱 · 잠든 적 다음 피해 배율 */
  wvSiren: { n: 5, spread: 0.3, speed: 3, range: 180, mul: 0.4, sleep: 100, wake: 2 },
  /** 물안개: 틱 · 반지름 · 피해 간격 · 피해 · 받는 피해 배율 */
  wvMist: { ticks: 240, r: 56, every: 20, mul: 0.15, taken: 0.75 },
  /** 대왕 문어: 다리 수 · 내리치는 간격 · 다리 길이 · 폭 · 피해 · 밀어냄 */
  wvOctopus: { arms: 8, every: 10, len: 70, w: 12, mul: 0.75, push: 10 },
  /** 물의 날개: 틱 · 날갯짓 간격 · 깃털 수 · 빠르기 · 거리 · 피해 */
  wvWings: { ticks: 300, every: 40, n: 4, speed: 4, range: 150, mul: 0.2 },
  /** 심해의 눈: 노려보는 틱 · 피해 · 둘레 반지름·피해 */
  wvEye: { ticks: 70, mul: 4.5, r: 40, near: 1 },
  /** 밀물 썰물: 나가는 틱 · 머무는 틱 · 들어오는 틱 · 가장 큰 반지름 · 피해 · 밀어냄 */
  wvEbb: { out: 30, hold: 10, in: 30, r: 90, mul: 1.1, push: 12 },
  /** 물발자국: 솟는 간격 · 가시 반지름 · 피해 · 한 적이 맞는 최대 */
  wvTrail: { every: 2, r: 16, mul: 0.45, cap: 4 },
  /** 자유의 해일: 틱 · 빠르기 · 해일 두께 · 피해 · 밀어냄 · 기절 · 실어 나름 */
  wvTsunami: { ticks: 80, speed: 4.5, depth: 22, mul: 3, push: 26, stun: 30, carry: 2 },
};
