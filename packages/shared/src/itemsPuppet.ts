// 인형술사 전용 아이템 20개: 하나하나가 실·인형에 새 기술·능력을 더하고 능력치도 올림 (실베르답게 먹을수록 강해짐)
// 앞 여덟은 미니 인형 8종(때릴 때 확률로 내 쪽에서 나와 적에게 달려가 터짐, 인형마다 다른 효과) · 나머지는 시체 인형·거대 인형 친구·검은 실·분신 등
// 효과는 sim/puppetDolls·puppetFriends. 수치는 PUPPET_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "puppeteer" as const, effect: true as const });

export const PUPPET_PASSIVES = {
  /** 리본 인형: 터지면 둘레 적을 묶음 */
  ppDollRibbon: P("ppDollRibbon", [{ stat: "maxHp", add: 10 }]),
  /** 태엽 인형: 터지면 둘레 적을 가운데로 끌어당김 */
  ppDollSpiral: P("ppDollSpiral", [{ stat: "range", mul: 1.05 }]),
  /** 광대 인형: 터지면 파편이 사방으로 날아감 */
  ppDollJester: P("ppDollJester", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 신사 인형: 아주 크게 터짐 */
  ppDollHat: P("ppDollHat", [{ stat: "damage", mul: 1.06 }]),
  /** 공주 인형: 터지면 내 체력 회복 */
  ppDollPrincess: P("ppDollPrincess", [{ stat: "maxHp", add: 15 }]),
  /** 춤추는 인형: 터진 뒤 다른 적에게 한 번 더 튀어 터짐 */
  ppDollDancer: P("ppDollDancer", [{ stat: "moveSpeed", add: 0.06 }]),
  /** 빨간 망토 인형: 터지면 불태움 */
  ppDollHood: P("ppDollHood", [{ stat: "damage", mul: 1.05 }]),
  /** 고양이 인형: 터지면 오래 느려짐 */
  ppDollCat: P("ppDollCat", [{ stat: "luck", add: 2 }]),
  /** 시체 폭발: 처치한 적이 확률로 앉아 있는 거대한 인형이 되어 잠시 뒤 크게 터짐 */
  ppCorpse: P("ppCorpse", [{ stat: "damage", mul: 1.06 }]),
  /** 내 친구~: 거대 인형 친구가 곁을 돌아다니며 다가온 적을 때림 (체력·공격력 높고 느림 · 쓰러지면 30초 뒤 다시) */
  ppGolem: P("ppGolem", [{ stat: "maxHp", add: 20 }]),
  /** 검은 실: 실로 때릴 때마다 적에게 실이 묶임 · 20개면 크게 느려지고 30개면 검게 변해 터짐 (보스에게도) */
  ppBlack: P("ppBlack", [{ stat: "attackSpeed", add: 0.08 }]),
  /** 분신: 피해를 받으면 방 어딘가에 내 분신이 나타나 적을 모두 끌어들임 (체력 고정 · 30초마다) */
  ppClone: P("ppClone", [{ stat: "moveSpeed", add: 0.08 }]),
  /** 네 번째 왕관: 왕관 하나 더 · 왕관 쓴 아군 체력 증가 */
  ppCrown: P("ppCrown", [{ stat: "maxHp", add: 10 }]),
  /** 실타래: 조종 게이지가 빨리 차고 천천히 줄어듦 */
  ppSpool: P("ppSpool", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 긴 실: 손이 더 멀리 닿고 더 커짐 */
  ppLong: P("ppLong", [{ stat: "range", mul: 1.1 }]),
  /** 거미줄: 실 내리친 자리에 거미줄이 남아 적을 느리게 함 */
  ppWeb: P("ppWeb", [{ stat: "range", mul: 1.05 }]),
  /** 꼭두각시 춤: 왕관 쓴 아군·인형 친구가 더 빠르고 세게 때림 */
  ppDance: P("ppDance", [{ stat: "damage", mul: 1.05 }]),
  /** 마지막 인사: 왕관 쓴 아군이 쓰러지면 그 자리에서 터짐 */
  ppBow: P("ppBow", [{ stat: "maxHp", add: 10 }]),
  /** 바느질: 왕관을 씌우면 회복 · 아군이 적을 처치하면 회복 */
  ppStitch: P("ppStitch", [{ stat: "maxHp", add: 15 }]),
  /** 금사슬: 실 내리치기가 가까운 적 둘에게 이어서 튐 */
  ppChain: P("ppChain", [{ stat: "damage", mul: 1.06 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱, 거리는 픽셀) */
export const PUPPET_PERKS = {
  ppDollRibbon: { stun: 45 },
  ppDollSpiral: { pull: 14, r: 48 },
  ppDollJester: { n: 6, mul: 0.6, speed: 4, ticks: 30 },
  ppDollHat: { size: 1.7, mul: 1.6 },
  ppDollPrincess: { heal: 2 },
  ppDollDancer: { bounce: 1 },
  ppDollHood: { burn: 0.6 },
  ppDollCat: { slow: 150 },
  /** 시체 폭발: 확률 · 터지기까지 틱 · 반지름 · 피해 배율 · 한 번에 있는 가장 많은 수 */
  ppCorpse: { chance: 0.25, delay: 100, r: 60, mul: 3, max: 4 },
  /** 인형 친구: 체력 · 피해 배율 · 공격 간격 · 이동 빠르기 · 몸 반지름 · 때리는 거리 · 지키는 거리(내 둘레) · 다시 나오는 틱 */
  ppGolem: { hp: 160, mul: 2.4, rate: 80, speed: 0.65, r: 12, reach: 22, guard: 120, respawn: 1800 },
  /** 검은 실: 느려지는 실 수 · 터지는 실 수 · 터질 때 그 적 피해 배율 · 둘레 반지름 · 둘레 피해 배율 */
  ppBlack: { slow: 20, burst: 30, mul: 8, r: 46, area: 2 },
  /** 분신: 체력 · 남는 틱 · 다시 쓰기까지 틱 · 나타나는 거리 */
  ppClone: { hp: 60, ticks: 600, cd: 1800, dist: 90 },
  /** 네 번째 왕관: 왕관 수 + · 아군 체력 배율 */
  ppCrown: { more: 1, hp: 1.5 },
  /** 실타래: 차는 빠르기 배율 · 줄어드는 양 배율 */
  ppSpool: { fill: 1.6, decay: 0.5 },
  /** 긴 실: 손 거리·크기 배율 */
  ppLong: { reach: 1.3, size: 1.3 },
  /** 거미줄: 남는 틱 · 느려지는 틱 */
  ppWeb: { ticks: 150, slow: 30 },
  /** 꼭두각시 춤: 공격 간격 배율 · 피해 배율 */
  ppDance: { rate: 0.6, mul: 1.4 },
  /** 마지막 인사: 반지름 · 피해 배율 */
  ppBow: { r: 44, mul: 3 },
  /** 바느질: 왕관 씌울 때 회복 · 아군 처치 회복 */
  ppStitch: { crown: 6, kill: 2 },
  /** 금사슬: 튀는 수 · 튀는 거리 · 피해 배율 */
  ppChain: { n: 2, dist: 70, mul: 0.7 },
};

/** 미니 인형 8종 차례 (그림 줄 칸 번호와 같음: 리본·태엽·광대·신사·공주·춤꾼·빨간 망토·고양이) */
export const PP_DOLLS = ["ppDollRibbon", "ppDollSpiral", "ppDollJester", "ppDollHat", "ppDollPrincess", "ppDollDancer", "ppDollHood", "ppDollCat"] as const;
