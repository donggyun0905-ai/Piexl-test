// 성국(성스러운 나라) 캐릭터 정의 (characters.ts가 커서 나눔, CHARACTERS에 펼쳐 넣음). 성국 캐릭터는 자동 공격 대신 스킬형 (숫자 키 스킬)

export const SEONGGUK_CHARACTERS = {
  /** 성국: 베아트리스 쌍검 3연격·스킬 넷·악·처단·심판 (sim/beatrice) */
  beatrice: { id: "beatrice", maxHp: 130, damage: 15, moveSpeed: 1.3, luck: 1, startWeapon: "btTwin", defense: 3 },
} as const;
