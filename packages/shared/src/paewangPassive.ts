// 패왕전 전용 패시브 수치 (던전과 따로, 관리자 '패왕전 수치 · 규칙'의 passive에서 바꿈). 계산은 sim/pwPassive
export const PW_PASSIVE = {
  /** 파수꾼 수호: 체력이 이만큼 아래로 떨어지면 한 판에 한 번, 최대 체력 비율만큼 보호막(틱 동안) */
  wardenBelow: 0.5, wardenShield: 0.2, wardenTicks: 180,
  /** 장수 기세: 평타를 n번 이어 맞히면 다음 평타 피해 배율·기절(틱) · 이어지는 간격(틱) */
  generalN: 3, generalMul: 1.5, generalStun: 18, generalGap: 120,
  /** 오니 광폭: 잃은 체력 비율 × 이만큼 공격력 (가득 잃으면 +40%) · 신인족이 되는 휘두르기 수 · 신인족 시간 */
  oniRage: 0.4, oniGauge: 15, oniGodTicks: 480,
  /** 변희 변신 순환: 스킬을 쓸 때마다 3초 (늑대 이동 · 곰 받는 피해 · 독수리 공격 속도) */
  morphTicks: 180, morphMove: 1.3, morphTaken: 0.75, morphRate: 1.3,
  /** 묵인 들이받기: 대시로 부딪힌 상대 기절(틱) */
  mukinStun: 30,
  /** 떠돌이 거리 사수: 사거리 비율 넘게 먼 상대 피해 배율 · 대시 뒤 첫 공격 배율 */
  drifterFar: 0.7, drifterFarMul: 1.2, drifterDashMul: 1.3,
  /** 기계공학자 과열: 같은 상대를 맞힐 때마다 +이만큼, 최대 */
  engHeat: 0.02, engHeatMax: 0.5,
  /** 거너 새 탄창: 장전 뒤 처음 n발 피해 배율 */
  gunnerShots: 6, gunnerMul: 1.25,
  /** 이드라 세계수의 무기: 스킬을 쓸 때마다 4초 (대궁 공격력 · 단검 공격 속도 · 방패 받는 피해) */
  idraTicks: 240, idraDmg: 1.15, idraRate: 1.3, idraTaken: 0.75,
  /** 사멸 맹독: 평타 n번째에 터지는 배율 */
  samyeolN: 5, samyeolMul: 3,
  /** 오토마타 자동 미사일: 평타 n번마다 유도 미사일 수 */
  automataEvery: 4, automataMissiles: 3,
  /** 추적자 조준: 가만히 이만큼(틱) 있으면 다음 평타 배율 */
  trackerStill: 60, trackerMul: 2,
  /** 원소술사 원소 순환: 바뀌는 간격(틱) · 불 화상(공격력 비율) · 얼음 둔화(틱) · 번개 피해 배율 */
  elemEvery: 180, elemBurn: 0.3, elemSlow: 30, elemShock: 1.15,
  /** 장로 덩굴 진: 평타에 묶임(틱) · 같은 상대 다시 묶기까지(틱) */
  elderRoot: 30, elderGap: 120,
  /** 렌 수호 토목이 원거리 탄을 막는 확률 */
  renBlock: 0.3,
  /** 역병의사 역병: 내 지속 피해를 받는 상대 회복 배율 · 지속(틱) */
  plagueHeal: 0.6, plagueTicks: 180,
  /** 붐버 자기 폭발 피해: 최대 체력 비율 */
  bomberSelf: 0.05,
  /** 격투가 콤보: 평타 n번째 기절(틱) */
  brawlerN: 4, brawlerStun: 18,
  /** 야수 사냥 본능: 체력이 이 비율 아래인 상대에게 피해 배율 */
  beastBelow: 0.5, beastMul: 1.25,
  /** 이터 물어뜯기: 평타 n번째 배율 · 그 피해의 회복 비율 */
  eaterN: 3, eaterMul: 1.8, eaterHeal: 0.3,
  /** 베두인 사막 바람: 스킬 뒤 이동 속도 배율·틱 */
  bedouinMove: 1.3, bedouinTicks: 120,
  /** 버려진 자들 교대: 교대 뒤 다음 평타 배율 */
  abandonedMul: 1.3,
  /** 펑크 신경 가속: 시간(틱) · 둘레 상대 둔화 반경 */
  punkTicks: 120, punkSlowR: 70,
  /** 수집가 수집품의 무게: 등 뒤 수집 무기 하나마다 평타 피해 + · 최대 */
  collectorPer: 0.04, collectorMax: 0.3,
  /** 풍류사 구절 완성: 평타 네 번째마다 피해 배율 */
  pungryuN: 4, pungryuMul: 1.6,
  /** 레오 번개 물기: 평타 세 번째마다 피해 배율 */
  leoN: 3, leoMul: 1.5,
  /** 오닉스 칠보: 평타 일곱 번째마다 피해 배율 */
  onyxN: 7, onyxMul: 2.2,
  /** 펜리르 천랑 낙인: 평타 다섯 번째마다 피해 배율 */
  fenrirN: 5, fenrirMul: 2,
  /** 잔영 치명타 피해 */
  remnantCrit: 2,
  /** 음양사 수호 부적: 평타가 맞으면 가장 가까운 아군 회복 (최대 체력 비율) */
  mysticHeal: 0.02,
  /** 의사: 아군에게도 넘친 회복을 보호막으로 (최대 체력 비율까지) */
  doctorShieldMax: 0.3,
  /** 악의 사도 죄의 오라: 반경 · 둘레 아군 공격력 배율 · 둘레 상대 받는 피해 배율 */
  apostleR: 70, apostleAlly: 1.05, apostleFoe: 1.1,
  /** 아티팩터 즉석 제작: 맞힐 때마다 게이지, n이면 가까운 아군 버프(틱) */
  artifacterN: 25, artifacterTicks: 300, artifacterDmg: 1.2, artifacterTaken: 0.8, artifacterMove: 1.25,
  /** 잊혀진 자: 신족 시간(틱) · 그동안 둘레 아군 초당 재생(최대 체력 비율) · 반경 */
  forgottenGod: 360, forgottenRegen: 0.02, forgottenR: 70,
};
