// 서기관 전용 아이템 10개. 효과는 sim/scribe. 수치는 SCRIBE_PERKS
import type { PassiveDef } from "./items";

export const SCRIBE_PASSIVES = {
  /** 잉크병: 글자가 한 번 더 자주 써짐 (5번째 → 4번째) */
  inkWell: { id: "inkWell", mods: [], exclusive: "scribe", effect: true },
  /** 두꺼운 펜촉: 잉크 탄이 적 2명을 뚫음 */
  thickNib: { id: "thickNib", mods: [], exclusive: "scribe", effect: true },
  /** 각주: 기록 하나당 그 적이 받는 피해 +3% */
  footnote: { id: "footnote", mods: [], exclusive: "scribe", effect: true },
  /** 서문: 방에 들어와 처음 공격하면 바로 글자 */
  preface: { id: "preface", mods: [], exclusive: "scribe", effect: true },
  /** 양피지: 글자를 쓸 때마다 보호막 5 (최대 체력의 30%까지) */
  parchment: { id: "parchment", mods: [], exclusive: "scribe", effect: true },
  /** 낙관: 글자 피해 +40% */
  sealStamp: { id: "sealStamp", mods: [], exclusive: "scribe", effect: true },
  /** 속기: 잉크 탄이 두 발씩 */
  shorthand: { id: "shorthand", mods: [{ stat: "damage", mul: 0.9 }], exclusive: "scribe", effect: true },
  /** 검열: 글자에 맞은 적이 잠깐 멈춤 */
  censor: { id: "censor", mods: [], exclusive: "scribe", effect: true },
  /** 개정판: 글자가 한 번 더 (절반 세기) */
  revision: { id: "revision", mods: [], exclusive: "scribe", effect: true },
  /** 금서: 기록이 새겨진 적을 쓰러뜨리면 체력 2 회복 */
  forbiddenBook: { id: "forbiddenBook", mods: [{ stat: "maxHp", add: 15 }], exclusive: "scribe", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 서기관 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const SCRIBE_PERKS = {
  inkWell: { every: 1 },
  thickNib: { pierce: 2 },
  footnote: { per: 0.03 },
  parchment: { shield: 5, max: 0.3 },
  sealStamp: { damage: 1.4 },
  shorthand: { spread: 0.18 },
  censor: { stun: 30 },
  revision: { power: 0.5 },
  forbiddenBook: { heal: 2 },
};
