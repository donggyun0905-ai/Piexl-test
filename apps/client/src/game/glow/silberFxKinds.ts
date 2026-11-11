// 빛 층: 크루세이더 뒤 실베르 캐릭터(조커·쉐도잉·인형술사·래빗·백령·빙설·아수라) 효과마다 빛 색·세기 (glowSilber가 씀)
// 세기 1 작은 빛(맞힘·튕김) · 2 빛 + 고리 + 불티 · 3 큰 기술(크게) · 4 필살기(빛기둥 + 화면 살짝 번쩍)

/** 진한 원색 (빛 층은 더하기라 어두운 색은 안 보임) */
export const SILBER_GLOW = {
  neon: 0xb8ff3a, violet: 0xc86bff, gold: 0xffd84a, paper: 0xf4f0ff,
  soul: 0x7a9aff, lilac: 0xc8a0ff, red: 0xff3a5a, crimson: 0xff2a3a,
  green: 0x7dff4a, pink: 0xff7ac0, sky: 0x3ac8ff, bolt: 0xbfe8ff,
  ice: 0x8ad8ff, frost: 0xdff4ff, blue: 0x4a6aff, light: 0xa8c0ff,
};
const G = SILBER_GLOW;

/** 효과 이름 → [색, 세기] */
export const SILBER_FX: Record<string, readonly [number, 1 | 2 | 3 | 4]> = {
  // 조커: 카드 튕김·사라짐 · 폭죽 · 카드 뒤집힘 · 달의 힘 · 세계수 · 차원 균열
  jkBounce: [G.violet, 1], jkPop: [G.paper, 1], jkFirework: [G.gold, 3], jkReveal: [G.gold, 2], jkMoon: [G.lilac, 4], jkTree: [G.green, 2], jkRift: [G.violet, 3],
  // 쉐도잉: 그림 줄 터짐 · 봉인 번쩍 · 일필 베기 · 먹 번짐
  sdBurst: [G.soul, 2], sdSeal: [G.lilac, 3], sdSlash: [G.soul, 2], sdInk: [G.soul, 1],
  // 인형술사: 실 내리치기 · 왕관 · 인형·시체 인형·검은 실 터짐 · 분신 · 금사슬 · 골렘 내리침
  ppStrike: [G.red, 2], ppCrown: [G.gold, 2], ppDollPop: [G.red, 2], ppCorpsePop: [G.crimson, 3], ppBlackPop: [G.violet, 3], ppClone: [G.paper, 2], ppChain: [G.gold, 1], ppSlam: [G.red, 3],
  // 래빗: 내리찍기 · 토끼인장 · 날아감 · 방울 · 별사탕 · 여진 · 초거대 망치 한 대 · 초거대 망치 시작
  rbSlam: [G.green, 2], rbBunny: [G.pink, 2], rbFly: [G.pink, 1], rbBell: [G.gold, 2], rbStar: [G.gold, 1], rbAfter: [G.green, 3], rbUltHit: [G.pink, 1], rbUlt: [G.pink, 4],
  // 백령: 대태도 베기 · 소용돌이 · 대태도 쾅 · 번개 · 유령 걸음 · 혼등 · 영혼 · 게이지 한 칸
  bySlash: [G.sky, 2], byWhirl: [G.sky, 2], byGreat: [G.sky, 3], byBolt: [G.bolt, 3], byStep: [G.bolt, 1], byWisp: [G.sky, 1], bySoul: [G.bolt, 1], byLevel: [G.bolt, 2],
  // 빙설: 베기·찌르기·몸 둘레 · 터짐 · 빙각 · 얼음가루 모임 · 궁극기 한 대 · 활 · 결정 · 탄 막음
  bsSlash: [G.ice, 1], bsThrust: [G.ice, 1], bsSpin: [G.ice, 2], bsBurst: [G.ice, 2], bsSpike: [G.frost, 3], bsGather: [G.ice, 1], bsUltHit: [G.frost, 1], bsBowSet: [G.ice, 2], bsWallHit: [G.ice, 1], bsBlock: [G.frost, 1],
  // 아수라: 기본 펀치 · 연속 펀치 · 파동 · 악귀 · 각성 1·2타 · 3타 · 4타 · 육비 난무
  // 백인장: 쌍검격 · 난무 · 회전참 · 돌진베기 · 폭우 · 나선창 · 충격파 · 표식 · 감옥 · 팔연참 · 종언 · 붉은 십자
  bjSlash: [G.crimson, 1], bjFlurry: [G.crimson, 2], bjSpin: [G.crimson, 2], bjDash: [G.red, 2], bjRain: [G.crimson, 2], bjSpear: [G.red, 3], bjShock: [G.crimson, 3], bjEye: [G.red, 2], bjPrison: [G.crimson, 2], bjReaper: [G.crimson, 3], bjEnd: [G.red, 4], bjCross: [G.red, 4], bjWane: [G.crimson, 1],
  asPunch: [G.blue, 1], asRapid: [G.blue, 1], asWave: [G.light, 2], asDemon: [G.crimson, 2], asAwk12: [G.blue, 2], asAwk3: [G.blue, 2], asAwk4: [G.light, 3], asFistHit: [G.blue, 1],
};
