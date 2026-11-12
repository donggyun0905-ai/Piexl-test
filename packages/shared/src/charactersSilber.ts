// 실베르(북부를 지켜 온 나라) 캐릭터 정의 (CHARACTERS에 펼쳐 넣음). 진영 특징: 처음엔 약하지만 패시브를 먹을 때마다 능력치가 더 오름 (factionDefs.FACTION_GROWTH)

export const SILBER_CHARACTERS = {
  /** 실베르: 조커 카드 한 장씩 던져 벽에 끝없이 튕김 · 고정 피해 4, 튕길 때마다 +4 · 카드 15장 넘으면 처음 카드 사라짐 (sim/joker) */
  joker: { id: "joker", maxHp: 80, damage: 4, moveSpeed: 1.25, luck: 1, startWeapon: "jkCards" },
  /** 실베르: 쉐도잉 마법 붓 하나로 바닥에 먹 획을 그려 공격 · 닫힌 원 = 봉인 · 곧은 줄 = 일필 베기 · 전용 패시브 20 (sim/shadowing) */
  shadowing: { id: "shadowing", maxHp: 85, damage: 8, moveSpeed: 1.2, luck: 1, startWeapon: "sdBrush" },
  /** 실베르: 인형술사 손 하나 · 꾹 눌러 적을 조종(나무 왕관 아군, 최대 3) · 짧게 눌러 실 내리치기 · 전용 패시브 20 (sim/puppet) */
  puppeteer: { id: "puppeteer", maxHp: 90, damage: 7, moveSpeed: 1.2, luck: 1, startWeapon: "ppHand" },
  /** 실베르: 래빗 토끼 망치 하나 · 앞에 내리찍어 땅울림 · 전용 패시브 20 (땅울림 파동·토끼인장·홈런·슈퍼 럭키 등, sim/rabbit) */
  rabbit: { id: "rabbit", maxHp: 95, damage: 9, moveSpeed: 1.2, luck: 2, startWeapon: "rbHammer" },
  /** 실베르: 백령 대태도 하나 · 앞 부채꼴 베기 · 처치하면 영혼 게이지 → 3칸부터 유령팔 참격 · 전용 패시브 20 (혼령참·(진)대태도 등, sim/baekryeong) */
  baekryeong: { id: "baekryeong", maxHp: 100, damage: 9, moveSpeed: 1.2, luck: 1, startWeapon: "byBlade" },
  /** 실베르: 빙설 얼음 칼날 무기 10 · 몸 둘레 얼음 영역(안의 적 느려짐) · 전용 패시브 10 (빙설창·빙설무장·얼음가루 등, sim/bingseol) */
  bingseol: { id: "bingseol", maxHp: 95, damage: 8, moveSpeed: 1.2, luck: 1, startWeapon: "bsBlade" },
  /** 실베르: 아수라 맨손 하나 · 귀신의 주먹 6개와 자기 주먹으로 넓게 침(피해는 약함) · 전용 패시브 20 (분쇄·귀진·파동·아수라 각성·연발·악귀 등, sim/asura) */
  /** 실베르: 혼령 곰방대 10개 · 연기용을 내뿜고 공격마다 방에 연기 구름 → 구름 안이면 은신 · 전용 패시브로 연기 혼령(늑대·범·부엉이·용·분신)을 부림 */
  honryeong: { id: "honryeong", maxHp: 90, damage: 8, moveSpeed: 1.2, luck: 1, startWeapon: "hrPipe" },
  baekinjang: { id: "baekinjang", maxHp: 100, damage: 9, moveSpeed: 1.25, luck: 1, startWeapon: "bjBlades" },
  /** 실베르: 아리아 음표 무기 10 · 느리게 둥실거리며 방 끝까지 가는 음표 · 서로 다른 음표 8개가 모이면 색색으로 터짐 · 악기 넷이 다 놓이면 악보 완성 (sim/aria) */
  aria: { id: "aria", maxHp: 85, damage: 8, moveSpeed: 1.2, luck: 1, startWeapon: "arBaton" },
  asura: { id: "asura", maxHp: 105, damage: 8, moveSpeed: 1.2, luck: 1, startWeapon: "asFist" },
} as const;
