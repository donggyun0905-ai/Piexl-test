// 탈라시아(바다의 나라) 캐릭터 정의 (characters.ts가 커서 나눔, CHARACTERS에 펼쳐 넣음)

export const THALASSIA_CHARACTERS = {
  /** 탈라시아: 토르켄 닻·철구공 (sim/thorken) · 리바이어 창·고래 (sim/levia) · 테일 영역 바다 상어 (sim/tail) · 매드퀸 대포·터렛·날개 (sim/madQueen) · 훅 갈고리·산탄총 (sim/hook) · 오르카 물주먹 콤보·상어 기공파 (sim/orca) · 웨이브 물을 상상으로 빚는 기술 30 (sim/wave) */
  thorken: { id: "thorken", maxHp: 120, damage: 12, moveSpeed: 1.3, luck: 2, startWeapon: "tkIron", defense: 5 },
  levia: { id: "levia", maxHp: 105, damage: 12, moveSpeed: 1.35, luck: 1, startWeapon: "lvAqua" },
  tail: { id: "tail", maxHp: 110, damage: 12, moveSpeed: 1.4, luck: 1, startWeapon: "tlTide" },
  madQueen: { id: "madQueen", maxHp: 100, damage: 11, moveSpeed: 1.35, luck: 1, startWeapon: "mqTide" },
  hook: { id: "hook", maxHp: 115, damage: 13, moveSpeed: 1.3, luck: 2, startWeapon: "hkRusty" },
  orca: { id: "orca", maxHp: 110, damage: 12, moveSpeed: 1.4, luck: 1, startWeapon: "ocTide" },
  wave: { id: "wave", maxHp: 100, damage: 11, moveSpeed: 1.45, luck: 2, startWeapon: "wvBoard" },
} as const;
