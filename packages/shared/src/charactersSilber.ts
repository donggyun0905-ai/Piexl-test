// 실베르(북부를 지켜 온 나라) 캐릭터 정의 (CHARACTERS에 펼쳐 넣음). 진영 특징: 처음엔 약하지만 패시브를 먹을 때마다 능력치가 더 오름 (factionDefs.FACTION_GROWTH)

export const SILBER_CHARACTERS = {
  /** 실베르: 조커 카드 한 장씩 던져 벽에 끝없이 튕김 · 고정 피해 4, 튕길 때마다 +4 · 카드 15장 넘으면 처음 카드 사라짐 (sim/joker) */
  joker: { id: "joker", maxHp: 80, damage: 4, moveSpeed: 1.25, luck: 1, startWeapon: "jkCards" },
  /** 실베르: 쉐도잉 마법 붓 하나로 바닥에 먹 획을 그려 공격 · 닫힌 원 = 봉인 · 곧은 줄 = 일필 베기 · 전용 패시브 20 (sim/shadowing) */
  shadowing: { id: "shadowing", maxHp: 85, damage: 8, moveSpeed: 1.2, luck: 1, startWeapon: "sdBrush" },
} as const;
