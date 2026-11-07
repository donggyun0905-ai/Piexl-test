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
} as const;
