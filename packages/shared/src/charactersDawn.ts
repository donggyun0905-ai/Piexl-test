// 새벽의 성흔(악마 사냥꾼) 캐릭터 정의 (characters.ts가 커서 나눔, CHARACTERS에 펼쳐 넣음). 스킬 대신 성흔(달빛의 힘) 게이지: 가득 차면 달빛 각성

export const DAWN_CHARACTERS = {
  /** 새벽의 성흔: 블래스트 산탄총 두 발 + 펌프 · 초근접 폭멸 · 성흔 → 달빛 각성 (sim/blast) */
  blast: { id: "blast", maxHp: 115, damage: 15, moveSpeed: 1.35, luck: 2, startWeapon: "blShotgun", defense: 2 },
  /** 새벽의 성흔: 네일러 망치 내려치기 · 못 박기·스택 · 스킬 넷 · 성흔 → 달빛 각성 (sim/nailer) */
  nailer: { id: "nailer", maxHp: 120, damage: 15, moveSpeed: 1.25, luck: 2, startWeapon: "nlHammer", defense: 2 },
} as const;
