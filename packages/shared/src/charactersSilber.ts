// 실베르(북부를 지켜 온 나라) 캐릭터 정의 (CHARACTERS에 펼쳐 넣음). 진영 특징: 처음엔 약하지만 패시브를 먹을 때마다 능력치가 더 오름 (factionDefs.FACTION_GROWTH)

export const SILBER_CHARACTERS = {
  /** 실베르: 조커 카드 한 장씩 던져 벽에 끝없이 튕김 · 고정 피해 4, 튕길 때마다 +4 · 카드 15장 넘으면 처음 카드 사라짐 (sim/joker) */
  joker: { id: "joker", maxHp: 80, damage: 4, moveSpeed: 1.25, luck: 1, startWeapon: "jkCards" },
} as const;
