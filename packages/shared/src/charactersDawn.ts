// 새벽의 성흔(악마 사냥꾼) 캐릭터 정의 (characters.ts가 커서 나눔, CHARACTERS에 펼쳐 넣음). 스킬 대신 성흔(달빛의 힘) 게이지: 가득 차면 달빛 각성

export const DAWN_CHARACTERS = {
  /** 새벽의 성흔: 블래스트 산탄총 두 발 + 펌프 · 초근접 폭멸 · 성흔 → 달빛 각성 (sim/blast) */
  blast: { id: "blast", maxHp: 115, damage: 15, moveSpeed: 1.35, luck: 2, startWeapon: "blShotgun", defense: 2 },
  /** 새벽의 성흔: 네일러 망치 내려치기 · 못 박기·스택 · 스킬 넷 · 성흔 → 달빛 각성 (sim/nailer) */
  nailer: { id: "nailer", maxHp: 120, damage: 15, moveSpeed: 1.25, luck: 2, startWeapon: "nlHammer", defense: 2 },
  /** 새벽의 성흔: 시저스 가위질(열기 → 닫기) · 운명의 실 → 대시로 끊기 · 단죄(목 자르기) · 성흔 → 달빛 각성 (sim/scissors) */
  scissors: { id: "scissors", maxHp: 105, damage: 16, moveSpeed: 1.4, luck: 2, startWeapon: "sxShears", defense: 1 },
  /** 새벽의 성흔: 헬피스트 주먹 세 박자(찌르기 → 악마 왼팔 내려찍기 → 검지로 허공 긁기) · 악마화(맞힐수록 사거리 증가) · 성흔 → 적혈 각성 (sim/hellfist) */
  hellfist: { id: "hellfist", maxHp: 125, damage: 16, moveSpeed: 1.3, luck: 1, startWeapon: "hfFist", defense: 2 },
  /** 새벽의 성흔: 실버불렛 쌍권총(은탄 두 발 · 성수 폭탄) · 대시로 장애물 넘기 · 은탄 마크 30 → 연사 · 성흔 → 달빛 각성 + 은빛 활 일제 사격 (sim/silverBullet) */
  silverBullet: { id: "silverBullet", maxHp: 105, damage: 11, moveSpeed: 1.4, luck: 2, startWeapon: "sbPistols", defense: 1 },
  /** 새벽의 성흔: 블루 플레임 청염의 활(세 겹 범위: 안쪽 불꽃 감옥 · 가운데 불꽃 기둥 · 바깥 화살) · 모든 공격 청염 · 성흔 → 열화상 각성 거대한 활 폭격 (sim/blueFlame) */
  blueFlame: { id: "blueFlame", maxHp: 100, damage: 14, moveSpeed: 1.3, luck: 2, startWeapon: "bzBow", defense: 1 },
  /** 새벽의 성흔(리더): 루나틱 월광의 세검(매우 빠른 찌르기 + 약간 돌진) · 기본 약점 공격 30% · 대시 찌르기 · 월광 표적 → 확정 치명타 달빛 베기 · 성흔 → 만월 각성 (sim/lunatic) */
  lunatic: { id: "lunatic", maxHp: 115, damage: 15, moveSpeed: 1.4, luck: 3, startWeapon: "lnRapier", defense: 2 },
  /** 새벽의 성흔(광전사): 인시전 도살자의 쌍도끼 네 박자(오른·왼 베기 → 교차 → 회오리) · 도륙 콤보(단계마다 공격 속도·피해) · 콤보 30마다 도살 도약 · 돌진 연참 · 성흔 → 광란 각성 (sim/incision) */
  incision: { id: "incision", maxHp: 130, damage: 13, moveSpeed: 1.35, luck: 1, startWeapon: "icAxes", defense: 2 },
} as const;
