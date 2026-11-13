// 빛 층: 아슈바르(느아르·루주·블뢰·존·마젠타·베르) 효과마다 빛 색·세기 (silberFxKinds와 같은 방식, glowSilber가 같이 씀)
// 세기 1 작은 빛(맞힘·연타) · 2 빛 + 고리 + 불티 · 3 큰 기술 · 4 필살기(빛기둥 + 화면 살짝 번쩍)

/** 진한 원색 (빛 층은 더하기라 어두운 색은 안 보임: 느아르 검정은 보라 빛으로) */
export const ASHVAR_GLOW = {
  violet: 0xb05aff, void: 0x8a3aff, mist: 0xd8b8ff, red: 0xff3a5a, rose: 0xff5a8a, ember: 0xff8a3a,
  pink: 0xff3ab8, orchid: 0xff8ae0, leaf: 0x7ae05a, lime: 0xc8ff5a, ice: 0x8ad8ff, frost: 0xdff4ff, azure: 0x3a8aff, gold: 0xffd020, spark: 0xfff6b0, amber: 0xffa000,
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
  // 마젠타: 저주비 · 만개 · 꽃잎 파동 · 꽃가루 · 시선 · 분신 · 화산파 · 낙인 · 꽃감옥 · 꽃밭 · 소용돌이 · 독화 · 환영 붕괴 · 영혼 유린 · 강우 · 성역 · 저주 터짐
  mzRain: [G.pink, 1], mzBloom: [G.orchid, 2], mzWave: [G.pink, 2], mzPollen: [G.violet, 2], mzGaze: [G.pink, 2], mzClone: [G.orchid, 2], mzVolcano: [G.pink, 3], mzBrand: [G.violet, 2],
  mzPrison: [G.pink, 3], mzGarden: [G.violet, 3], mzVortex: [G.orchid, 3], mzErode: [G.violet, 4], mzCollapse: [G.pink, 3], mzSoul: [G.violet, 3], mzStorm: [G.pink, 4], mzEnd: [G.pink, 4], mzPop: [G.orchid, 2],
  // 베르: 쌍낫격 · 회전무 · 난무 · 채찍 · 기생 씨앗 · 체내 개화 · 생명 착취 · 시든 육신 · 꽃밭 · 가시숲 · 대지 부식 · 덩굴 감옥 · 사령화 · 포식자 · 천륜 가시무 · 종언 · 터짐 · 발아
  vtSlash: [G.leaf, 1], vtSpin: [G.leaf, 2], vtFrenzy: [G.lime, 2], vtWhip: [G.leaf, 2], vtSeed: [G.lime, 2], vtBloom: [G.leaf, 2], vtDrain: [G.lime, 3], vtWither: [G.leaf, 2],
  vtGarden: [G.leaf, 3], vtForest: [G.lime, 3], vtErode: [G.leaf, 3], vtPrison: [G.lime, 3], vtThrall: [G.leaf, 3], vtMaw: [G.lime, 3], vtDance: [G.lime, 4], vtEnd: [G.lime, 4], vtPop: [G.leaf, 2], vtSprout: [G.lime, 2],
};
