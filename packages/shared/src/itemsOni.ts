// 오니 전용 아이템 18개: 무기 여섯(명뢰봉·빙각금봉·홍련신주·야마타의 그림자·풍신소환·류신금봉)마다 셋, 그 무기를 들었을 때만 나옴 (행운이 높을수록 잘 나옴)
// 효과는 sim/oniArts·oniFields. 수치는 ONI_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <I extends string>(id: I, forWeapon: string) => ({ id, mods: [] as StatMod[], exclusive: "oni" as const, effect: true as const, forWeapon });

export const ONI_PASSIVES = {
  /** 뇌운: 번개 부채꼴 범위 +30% · 피해 +50% */
  oniThunderCloud: P("oniThunderCloud", "thunderClub"),
  /** 천벌 각인: 천벌 확률 +10%p */
  oniJudgment: P("oniJudgment", "thunderClub"),
  /** 연쇄 뇌격: 부채꼴 번개에 맞은 적마다 가까운 다른 적에게 번개 (공격력 30%) */
  oniChainBolt: P("oniChainBolt", "thunderClub"),
  /** 서리 갑주: 보호막 상한 15 → 30 */
  oniFrostMail: P("oniFrostMail", "frostClub"),
  /** 영구동토: 한파 시간 +3초 · 범위 +25% */
  oniPermafrost: P("oniPermafrost", "frostClub"),
  /** 빙령 공명: 영령 다시 쓰기 5초 → 3초 · 피해 최대 체력 10% → 15% */
  oniSpiritEcho: P("oniSpiritEcho", "frostClub"),
  /** 업화 낙인: 불꽃에 맞은 적이 2초 동안 불탐 */
  oniHellBrand: P("oniHellBrand", "lotusClub"),
  /** 홍련 폭주: 업화 확률 +10%p */
  oniRedLotus: P("oniRedLotus", "lotusClub"),
  /** 화신 혈류: 업화가 터질 때 최대 체력의 3% 회복 */
  oniBloodFlame: P("oniBloodFlame", "lotusClub"),
  /** 여덟 머리: 죽음 3초 → 5초 */
  oniEightHeads: P("oniEightHeads", "yamataClub"),
  /** 심연 흡수: 죽음 피해의 30%만큼 회복 */
  oniAbyssDrink: P("oniAbyssDrink", "yamataClub"),
  /** 그림자 증식: 어둠 확률 +15%p */
  oniShadowSpread: P("oniShadowSpread", "yamataClub"),
  /** 태풍의 눈: 폭풍 5초 → 8초 */
  oniTyphoonEye: P("oniTyphoonEye", "windClub"),
  /** 질풍: 폭풍이 1.6배 빠르고 더 자주 벰 */
  oniGale: P("oniGale", "windClub"),
  /** 쌍둥이 바람: 폭풍이 둘 */
  oniTwinWind: P("oniTwinWind", "windClub"),
  /** 대해일: 해일 범위 +40% · 더 멀리 밀침 */
  oniGreatWave: P("oniGreatWave", "tideClub"),
  /** 물보라 연쇄: 나눠 주는 물보라 3번 → 5번 */
  oniSprayChain: P("oniSprayChain", "tideClub"),
  /** 용궁의 가호: 해일이 일 때 최대 체력의 3% 회복 */
  oniDragonPalace: P("oniDragonPalace", "tideClub"),
} as const satisfies Record<string, PassiveDef>;

/** 오니 아이템 수치 */
export const ONI_PERKS = {
  oniThunderCloud: { range: 1.3, damage: 1.5 },
  oniJudgment: { chance: 0.1 },
  oniChainBolt: { mul: 0.3, reach: 60 },
  oniFrostMail: { shieldMax: 30 },
  oniPermafrost: { ticks: 180, radius: 1.25 },
  oniSpiritEcho: { cd: 180, hp: 0.15 },
  oniHellBrand: { ticks: 120 },
  oniRedLotus: { chance: 0.1 },
  oniBloodFlame: { heal: 0.03 },
  oniEightHeads: { ticks: 300 },
  oniAbyssDrink: { heal: 0.3 },
  oniShadowSpread: { chance: 0.15 },
  oniTyphoonEye: { ticks: 480 },
  oniGale: { speed: 1.6, every: 5 },
  oniTwinWind: { count: 2 },
  oniGreatWave: { range: 1.4, push: 1.6 },
  oniSprayChain: { chains: 5 },
  oniDragonPalace: { heal: 0.03 },
};
