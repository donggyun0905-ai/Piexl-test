// 빛 층: 아슈바르(느아르·루주·블뢰·존) 효과마다 빛 색·세기 (silberFxKinds와 같은 방식, glowSilber가 같이 씀)
// 세기 1 작은 빛(맞힘·연타) · 2 빛 + 고리 + 불티 · 3 큰 기술 · 4 필살기(빛기둥 + 화면 살짝 번쩍)

/** 진한 원색 (빛 층은 더하기라 어두운 색은 안 보임: 느아르 검정은 보라 빛으로) */
export const ASHVAR_GLOW = {
  violet: 0xb05aff, void: 0x8a3aff, mist: 0xd8b8ff, red: 0xff3a5a, rose: 0xff5a8a, ember: 0xff8a3a,
  ice: 0x8ad8ff, frost: 0xdff4ff, azure: 0x3a8aff, gold: 0xffd020, spark: 0xfff6b0, amber: 0xffa000,
};
const G = ASHVAR_GLOW;

/** 효과 이름 → [색, 세기] */
export const ASHVAR_FX: Record<string, readonly [number, 1 | 2 | 3 | 4]> = {
  // 느아르: 횡베기 · 난무 · 회전참 · 절대 단절 · 손아귀 · 압축 · 소멸 · 포식 · 돌진 · 시초의 공허 · 낙인 · 검은 창 · 차원 절멸 · 결계 붕괴 · 무한 심연 · 흑월 강림 · 태초의 종언 · 충격파 · 터짐
  nrSlash: [G.violet, 1], nrFlurry: [G.violet, 2], nrSpin: [G.violet, 2], nrSever: [G.void, 3], nrGrasp: [G.violet, 2], nrSqueeze: [G.void, 2], nrDrain: [G.void, 2], nrDevour: [G.void, 3],
  nrRush: [G.mist, 2], nrOrigin: [G.void, 3], nrBrand: [G.red, 1], nrSpear: [G.red, 2], nrRift: [G.violet, 3], nrBarrier: [G.void, 3], nrAbyss: [G.void, 3], nrMoon: [G.mist, 4], nrEnd: [G.red, 4],
  nrWave: [G.violet, 2], nrBurst: [G.violet, 2],
  // 아슈바르 공용: 레벨업 · 강화 성공 · 승격
  nrLevel: [G.mist, 2], nrUpOk: [G.gold, 2], nrRankUp: [G.red, 3],
  // 루주: 쌍검격 · 난무 · 회전참 · 가시 · 장미 피어남 · 꽃잎 폭풍 · 가시숲 · 불꽃 · 돌진 · 큰 장미 · 낙인 · 낙인 폭발 · 혈검무 · 혈월참 · 장례 · 폭우 · 종언 · 터짐
  rgX: [G.red, 1], rgFlame: [G.ember, 2], rgSpin: [G.red, 2], rgThorn: [G.red, 1], rgBloom: [G.rose, 1], rgPetal: [G.rose, 2], rgForest: [G.red, 3], rgBlaze: [G.ember, 2],
  rgRush: [G.red, 2], rgBloomBig: [G.rose, 3], rgMark: [G.red, 1], rgMarkBoom: [G.red, 3], rgDance: [G.red, 3], rgMoon: [G.red, 3], rgFuneral: [G.rose, 3], rgRain: [G.red, 4], rgEnd: [G.rose, 4], rgBurst: [G.red, 2],
  // 블뢰: 결정탄 · 파동 · 빙정 폭발 · 빙벽 · 늑대 · 매 · 사슴 · 군단 · 설원 · 빙시계 · 포효 · 절대 영도 · 시간감옥 · 시간 동결 · 영구동토 · 빙창의 폭우 · 얼음 터짐
  buBolt: [G.ice, 2], buWave: [G.ice, 2], buBurst: [G.frost, 2], buWall: [G.ice, 3], buWolf: [G.frost, 1], buHawk: [G.frost, 2], buDeer: [G.ice, 2], buLegion: [G.frost, 3],
  buField: [G.ice, 3], buClock: [G.ice, 2], buHowl: [G.frost, 3], buZero: [G.azure, 3], buPrison: [G.ice, 3], buStop: [G.frost, 4], buEnd: [G.frost, 4], buRain: [G.azure, 4], buPop: [G.frost, 2],
  // 존: 할퀴기 · 벽력일섬 · 연속격 · 번개 주먹 · 지그재그 · 낙뢰 · 분신 · 구속 · 뇌구 · 혼돈의 낙뢰 · 손아귀 · 발자취 · 천뢰 · 초월 벽력일섬 · 천수 · 종언 · 터짐 · 황금 번개 찌릿
  jnClaw: [G.gold, 1], jnFlash: [G.spark, 2], jnRapid: [G.gold, 2], jnFist: [G.gold, 3], jnZig: [G.spark, 2], jnFall: [G.spark, 3], jnClone: [G.gold, 2], jnBind: [G.gold, 2],
  jnOrb: [G.gold, 3], jnChaos: [G.spark, 3], jnHand: [G.amber, 3], jnStep: [G.gold, 4], jnFrenzy: [G.gold, 3], jnBeam: [G.spark, 3], jnThousand: [G.amber, 3], jnEnd: [G.gold, 4], jnPop: [G.gold, 2], jnZap: [G.spark, 1],
};
