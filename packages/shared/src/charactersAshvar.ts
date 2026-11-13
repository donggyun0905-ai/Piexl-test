// 아슈바르(태초의 색채 악마 7원색 군단) 캐릭터 정의 (CHARACTERS에 펼쳐 넣음). 진영 특징: 적응력(흑 게이지·강화·승격)·제약 (sim/nrAdapt)

export const ASHVAR_CHARACTERS = {
  /** 느아르 (아슈바르): 공허의 검 · 패시브 없음 · 적응력·제약 (sim/noir) */
  noir: { id: "noir", maxHp: 110, damage: 9, moveSpeed: 1.3, luck: 0, startWeapon: "nrBlade" },
  /** 루주 (아슈바르): 장미쌍검 · 혈장미 (sim/rouge) */
  rouge: { id: "rouge", maxHp: 105, damage: 9, moveSpeed: 1.35, luck: 0, startWeapon: "rgBlades" },
  /** 블뢰 (아슈바르): 하얀 마도서 · 얼음마녀 (sim/bleu) */
  bleu: { id: "bleu", maxHp: 100, damage: 9, moveSpeed: 1.3, luck: 0, startWeapon: "buTome" },
} as const;
