// 성국(성스러운 나라) 캐릭터 정의 (characters.ts가 커서 나눔, CHARACTERS에 펼쳐 넣음). 성국 캐릭터는 자동 공격 대신 스킬형 (숫자 키 스킬)

export const SEONGGUK_CHARACTERS = {
  /** 성국: 베아트리스 쌍검 3연격·스킬 넷·악·처단·심판 (sim/beatrice) */
  beatrice: { id: "beatrice", maxHp: 130, damage: 15, moveSpeed: 1.3, luck: 1, startWeapon: "btTwin", defense: 3 },
  /** 성국: 이안 펜 찌르기·실 휘감기·스킬 넷·기록·속박·급소 (sim/ian) */
  ian: { id: "ian", maxHp: 95, damage: 14, moveSpeed: 1.45, luck: 2, startWeapon: "iaPen", defense: 1 },
  /** 성국: 가브리엘 망치 3연격·대지 강타·철옹(받는 피해 절반)·압박·스킬 넷·불멸의 성벽 (sim/gabriel) · 공격력은 18에서 더 오르지 않고 넘는 만큼 체력 */
  gabriel: { id: "gabriel", maxHp: 150, damage: 18, moveSpeed: 0.9, luck: 1, startWeapon: "gbHammer", defense: 5 },
} as const;
