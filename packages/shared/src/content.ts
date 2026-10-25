// 게임 내용 정의 (캐릭터·무기·적). 이름·수치는 이 게임만의 것으로 정함. 화면에 보이는 이름은 화면 쪽 번역에서.
import type { Stats } from "./stats";
import type { ComboStyle } from "./combos";
import { BRAWLER_WEAPONS } from "./weaponsBrawler";
import { ELEMENTAL_WEAPONS, type OrbitKind } from "./weaponsElemental";
import { ENGINEER_WEAPONS, type LaserGear } from "./weaponsEngineer";
import { MYSTIC_WEAPONS } from "./weaponsMystic";
import { DOCTOR_WEAPONS, type MedicGear } from "./weaponsDoctor";
import { GUNNER_WEAPONS, type GunStyle } from "./weaponsGunner";
import { BEAST_WEAPONS, type BeastStyle, type PetKind } from "./weaponsBeast";
import { BASE_WEAPONS } from "./weaponsBase";
import { NINJA_WEAPONS, type ShadeStyle } from "./weaponsNinja";
import { CHRONO_WEAPONS, type ChronoStyle } from "./weaponsChrono";
import { SUMMON_WEAPONS, type SummonKind } from "./weaponsSummon";
import { BEDOUIN_WEAPONS } from "./weaponsBedouin";
import { GENERAL_WEAPONS, type LegendKind } from "./weaponsGeneral";
import { IMUGI_WEAPONS, type DragonArt } from "./weaponsImugi";
import { APOSTLE_WEAPONS, type SinKind } from "./weaponsApostle";
import { STAR_WEAPONS, type StarStyle } from "./weaponsStar";
import { DUCK_WEAPONS, type QuackStyle } from "./weaponsDuck";
import { ABANDONED_WEAPONS } from "./weaponsAbandoned";
import { TITAN_WEAPONS, type SmashKind, type TitanStyle } from "./weaponsTitan";
import { ONI_WEAPONS, type ClubArt } from "./weaponsOni";
import { SCRIBE_WEAPONS, type ScribeWord } from "./weaponsScribe";

/** laser 기계공학자·medic 의사: 누르고 있는 동안 짧은 간격으로 틱 피해 · combo 격투가: 누를 때마다 콤보의 다음 기술 (combos) · chakram 베두인 · spear 장수 */
export type WeaponKind = "melee" | "ranged" | "laser" | "orbit" | "combo" | "medic" | "gun" | "beast" | "shade" | "chrono" | "summon" | "chakram" | "spear" | "dragon" | "cross" | "star" | "quack" | "tag" | "titan" | "club" | "quill";
export type { OrbitKind } from "./weaponsElemental";
export type { LaserGear } from "./weaponsEngineer";
export type { MedicGear } from "./weaponsDoctor";
export type { GunStyle } from "./weaponsGunner";
export type { BeastStyle, PetKind } from "./weaponsBeast";
export { TIGER } from "./weaponsBeast";
export type { ShadeStyle } from "./weaponsNinja";
export type { ChronoStyle } from "./weaponsChrono";
export type { LegendKind, SpearMove, SpearMoveKind } from "./weaponsGeneral";
export { DRAGON_COLORS, IMUGI, type DragonArt } from "./weaponsImugi";
export { APOSTLE, SIN_COLORS, type SinKind } from "./weaponsApostle";
export { STAR, STAR_COLORS, type StarStyle } from "./weaponsStar";
export { DUCK, type QuackStyle } from "./weaponsDuck";
export { ABANDONED, TAG_SETS, type TagMove, type TagMoveKind, type TagSet, type TagSpecial, type TagSpecialKind } from "./weaponsAbandoned";
export { TITAN, type SmashKind, type TitanStyle } from "./weaponsTitan";
export { ONI, type ClubArt } from "./weaponsOni";
export { SCRIBE, type ScribeWord } from "./weaponsScribe";
export { SUMMON_STATS, type SummonKind } from "./weaponsSummon";

export interface WeaponDef {
  id: string;
  kind: WeaponKind;
  /** 캐릭터 공격력에 곱함 */
  damageMul: number;
  /** 초당 공격 횟수 */
  attackSpeed: number;
  /** 사거리, 픽셀 (근접은 휘두르는 거리) */
  range: number;
  /** 투사체 속도, 픽셀/틱 (근접은 0) */
  projectileSpeed: number;
  /** 근접: 휘두르는 범위의 절반 각도의 cos 값 (0.5 = 앞쪽 120도, -1 = 한 바퀴) */
  arcCos?: number;
  /** 원거리: 맞은 자리에서 터지는 범위, 픽셀 (주변 적은 절반 피해) */
  blast?: number;
  /** 원거리: 한 번에 쏘는 발 수 (홀수) */
  shots?: number;
  /** 여러 발 사이 각도의 [cos, sin] (기기마다 같게 미리 정한 값) */
  spread?: readonly [number, number];
  /** 원거리: 뚫고 지나가는 적 수 */
  pierce?: number;
  /** 이 캐릭터만 얻을 수 있는 전용 무기 */
  exclusive?: "warden" | "drifter" | "mage" | "mystic" | "engineer" | "elementalist" | "brawler" | "doctor" | "gunner" | "beast" | "ninja" | "chronomancer" | "summoner" | "novice" | "bedouin" | "general" | "imugi" | "apostle" | "stargazer" | "duck" | "abandoned" | "titan" | "oni" | "scribe";
  /** 의사 무기: 공격 방식 */
  medic?: MedicGear;
  /** 음양사 부적: 맞힐 때마다 세다가 추가 효과 (sim/talisman) */
  charm?: CharmKind;
  /** 기계공학자 무기: 공격 방식 */
  gear?: LaserGear;
  /** 원소술사 무기: 회전체 종류·구슬 수·도는 반경(없으면 사거리) */
  orbit?: OrbitKind;
  orbs?: number;
  ringR?: number;
  /** 거너 무기: 총 종류 · 탄창 · 장전 틱 (gun 종류, sim/gun) */
  gun?: GunStyle;
  mag?: number;
  reload?: number;
  /** 야수 무기: 본인 공격 방식 · 데리고 다니는 고양이 */
  beast?: BeastStyle;
  pets?: readonly PetKind[];
  /** 닌자 무기: 공격 방식 · 그림자가 나오는 데 필요한 표식 수 (sim/ninja·shades) */
  shade?: ShadeStyle;
  marks?: number;
  /** 시간술사 무기: 공격 방식 (sim/chrono, 모든 공격은 잔상이 한 번 더 함) */
  chrono?: ChronoStyle;
  /** 소환술사 채찍: 나오는 소환수 · 맞힌 적 몇 명마다 소환 · 최대 수 (sim/summon) */
  summon?: SummonKind;
  summonEvery?: number;
  summonMax?: number;
  /** 격투가 무기: 콤보 표 */
  combo?: ComboStyle;
  /** 장수 무기: 콤보 표 이름(weaponsGeneral.SPEAR_COMBOS) · 숨겨진 힘 필살기 */
  spear?: string;
  /** 이무기 무기: 맞은 적마다 추가 공격 종류 (sim/imugiArts) · 악의 사도 무기: 공격 종류 (sim/apostle) */
  dragon?: DragonArt;
  sin?: SinKind;
  /** 별지기 무기: 별 종류 (sim/star) */
  star?: StarStyle;
  /** 오리 무기: 꽥 종류 · 새끼 오리 수 · 몇 번째마다 큰 꽥 (sim/duck) */
  quack?: QuackStyle;
  ducklings?: number;
  bigEvery?: number;
  legend?: LegendKind;
  /** 원거리: 사거리 끝에서 되돌아옴 (부메랑) */
  returns?: boolean;
  /** 들고 있으면 이동 속도에 곱함 */
  moveMul?: number;
  /** 버려진 자들 무기: 조합 표 이름 (weaponsAbandoned.TAG_SETS) */
  tag?: string;
  /** 거인 무기: 평소 공격 · 기계팔 강타 종류 · 강타 배율 (sim/titan) */
  titan?: TitanStyle;
  smash?: SmashKind;
  smashMul?: number;
  /** 오니 방망이: 추가 공격 종류 (sim/oniArts) */
  club?: ClubArt;
  /** 서기관 무기: 글자 (sim/scribe) */
  word?: ScribeWord;
}

/**
 * 부적 추가 효과. ramp 수제(맞힐수록 강해짐) · smite 강력(주변 3명) · seal 수양(붙어서 도트 3중첩) · spark 번개(벽 통과, 추가 공격)
 * blaze 불꽃(불탐, 아주 강한 공격) · frost 얼음(경직) · bloom 벚꽃(느린 꽃잎, 폭발) · radiant 빛(밀침) · shade 어둠(유도 부적) · quake 땅(주변 피해, 공격 빨라짐)
 */
export type CharmKind = "ramp" | "smite" | "seal" | "spark" | "blaze" | "frost" | "bloom" | "radiant" | "shade" | "quake";

export const WEAPONS = {
  ...BASE_WEAPONS,
  ...MYSTIC_WEAPONS,
  ...ENGINEER_WEAPONS,
  ...ELEMENTAL_WEAPONS,
  ...BRAWLER_WEAPONS,
  ...DOCTOR_WEAPONS,
  ...GUNNER_WEAPONS,
  ...BEAST_WEAPONS,
  ...NINJA_WEAPONS,
  ...CHRONO_WEAPONS,
  ...SUMMON_WEAPONS,
  ...BEDOUIN_WEAPONS,
  ...GENERAL_WEAPONS,
  ...IMUGI_WEAPONS,
  ...APOSTLE_WEAPONS,
  ...STAR_WEAPONS,
  ...DUCK_WEAPONS,
  ...ABANDONED_WEAPONS,
  ...TITAN_WEAPONS,
  ...ONI_WEAPONS,
  ...SCRIBE_WEAPONS,
} as const satisfies Record<string, WeaponDef>;

export type WeaponId = keyof typeof WEAPONS;
export const WEAPON_IDS = Object.keys(WEAPONS) as WeaponId[];

export interface CharacterDef {
  id: string;
  maxHp: number;
  damage: number;
  moveSpeed: number;
  luck: number;
  startWeapon: WeaponId;
  /** 있으면 아이템·레벨과 상관없이 최대 체력이 늘 이 값 (거너) */
  fixedHp?: number;
}

export const CHARACTERS = {
  /** 근접 중심 */
  warden: { id: "warden", maxHp: 120, damage: 10, moveSpeed: 1.2, luck: 0, startWeapon: "greatblade" },
  /** 원거리 중심 */
  drifter: { id: "drifter", maxHp: 90, damage: 10, moveSpeed: 1.35, luck: 0, startWeapon: "crossbow" },
  /** 마법: 느린 마법탄이 터져 주변 적까지 맞힘 · 체력 낮음 · 행운 조금 */
  mage: { id: "mage", maxHp: 75, damage: 11, moveSpeed: 1.25, luck: 1, startWeapon: "emberstaff" },
  /** 음양사: 부적을 맞힐 때마다 세다가 무기마다 다른 추가 효과 · 체력 조금 낮음 */
  mystic: { id: "mystic", maxHp: 85, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "handcharm" },
  /** 기계공학자: 레이저를 계속 쏘아 녹임 (빗나가지 않지만 사거리 짧음) */
  engineer: { id: "engineer", maxHp: 100, damage: 10, moveSpeed: 1.25, luck: 0, startWeapon: "beamer" },
  /** 원소술사: 몸 둘레를 도는 구슬로 싸움 (닿으면 피해) · 체력 보통 */
  elementalist: { id: "elementalist", maxHp: 90, damage: 10, moveSpeed: 1.25, luck: 0, startWeapon: "elemorb" },
  /** 격투가: 누를 때마다 이어지는 콤보, 마지막 기술이 강함 · 체력 높음 · 근접 */
  brawler: { id: "brawler", maxHp: 110, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "fist" },
  /** 의사: 공격 회복·초과 치료(sim/heal) · 행운 높음 */
  doctor: { id: "doctor", maxHp: 100, damage: 10, moveSpeed: 1.2, luck: 5, startWeapon: "syringe" },
  /** 거너: 탄창을 다 쓰면 장전하는 총 · 치명타 · 이동 빠름 · 체력 낮음 */
  /** 야수(고양이 수인): 고양이를 데리고 다니며 같이 싸움 · 발이 아주 빠름 */
  beast: { id: "beast", maxHp: 95, damage: 10, moveSpeed: 1.4, luck: 1, startWeapon: "claws" },
  gunner: { id: "gunner", maxHp: 40, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "pistol", fixedHp: 40 },
  /** 닌자: 수리검으로 표식을 쌓으면 적의 그림자에서 분신이 튀어나와 벰 · 발이 빠르고 행운 조금 */
  ninja: { id: "ninja", maxHp: 85, damage: 10, moveSpeed: 1.4, luck: 1, startWeapon: "shuriken" },
  /** 시간술사: 모든 공격을 1초 뒤 그 자리에서 잔상이 한 번 더 함 · 체력 보통 */
  chronomancer: { id: "chronomancer", maxHp: 90, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "pocketwatch" },
  /** 소환술사: 근접 채찍으로 쳐서 모은 힘으로 소환수를 부름 (무기마다 다른 소환수) */
  summoner: { id: "summoner", maxHp: 95, damage: 10, moveSpeed: 1.25, luck: 0, startWeapon: "leatherwhip" },
  /** 풋내기: 맨손으로 시작, 공용 무기·공용 패시브만. 경험치로 레벨이 오르면 스탯을 직접 찍음 (sim/novice) */
  novice: { id: "novice", maxHp: 100, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "fists" },
  /** 베두인: 차크람으로 돌려 베고 던진 뒤 대시로 주움 (sim/bedouin) */
  bedouin: { id: "bedouin", maxHp: 95, damage: 24, moveSpeed: 1.35, luck: 0, startWeapon: "sandChakram" },
  /** 장수: 끊기지 않고 이어지는 창 콤보 (sim/general) */
  general: { id: "general", maxHp: 115, damage: 10, moveSpeed: 1.2, luck: 0, startWeapon: "trainingSpear" },
  /** 이무기: 맞힐 때마다 콤보 (72 오라 · 108 용) (sim/imugi) */
  imugi: { id: "imugi", maxHp: 100, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "imugiSpear" },
  /** 악의 사도: 뒤집힌 십자가 · 일곱 죄 장판 · 영혼으로 회복 (sim/apostle) */
  apostle: { id: "apostle", maxHp: 105, damage: 10, moveSpeed: 1.2, luck: 0, startWeapon: "invertedCross" },
  /** 버려진 자들: 세 아이를 탭으로 바꿔 가며 조합 콤보·특수기 (sim/abandoned) */
  abandoned: { id: "abandoned", maxHp: 100, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "streetKids" },
  /** 거인: 기계팔 탱커, 맞은 피해를 에너지로 모아 강타 (sim/titan) */
  titan: { id: "titan", maxHp: 170, damage: 12, moveSpeed: 1.05, luck: 0, startWeapon: "ironArm" },
  /** 오니: 느리고 센 방망이 + 확률 추가 공격 · 30초 신인족 · 받는 피해 +30% (sim/oni) */
  oni: { id: "oni", maxHp: 150, damage: 36, moveSpeed: 1.15, luck: 0, startWeapon: "thunderClub" },
  /** 별지기 (히든, 무작위 10%): 별자리를 그려 빛줄기로 태움 (sim/star) */
  stargazer: { id: "stargazer", maxHp: 110, damage: 12, moveSpeed: 1.3, luck: 1, startWeapon: "starStaff" },
  /** 오리 (히든, 무작위 5%): 꽥 음파·새끼 오리 (sim/duck) */
  duck: { id: "duck", maxHp: 130, damage: 12, moveSpeed: 1.4, luck: 2, startWeapon: "rubberDuck" },
  /** 서기관 (히든, 아카식 레코드, 무작위 5%): 잉크 탄으로 기록을 새기고 몇 번째마다 무기의 글자가 발동 (sim/scribe) */
  scribe: { id: "scribe", maxHp: 95, damage: 11, moveSpeed: 1.3, luck: 2, startWeapon: "quillPen" },
} as const satisfies Record<string, CharacterDef>;

export type CharacterId = keyof typeof CHARACTERS;
/** 숨은 캐릭터: 선택창·순위표·타워 디펜스에는 없고 무작위 캐릭터(10%)·연습장에서만 */
export const HIDDEN_CHARACTERS: readonly CharacterId[] = ["stargazer", "duck", "scribe"];
/** 보통 고를 수 있는 캐릭터 (숨은 캐릭터 빼고) · ALL_CHARACTER_IDS는 숨은 캐릭터까지 */
export const ALL_CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];
export const CHARACTER_IDS = ALL_CHARACTER_IDS.filter((id) => !HIDDEN_CHARACTERS.includes(id));

/** 캐릭터 + 무기 → 아이템 적용 전 기본 능력치 */
export function baseStats(characterId: CharacterId, weaponId: WeaponId): Stats {
  const c: CharacterDef = CHARACTERS[characterId];
  const w: WeaponDef = WEAPONS[weaponId];
  return {
    maxHp: c.maxHp,
    damage: c.damage * w.damageMul,
    attackSpeed: w.attackSpeed,
    range: w.range,
    moveSpeed: c.moveSpeed * (w.moveMul ?? 1),
    projectileSpeed: w.projectileSpeed,
    luck: c.luck,
  };
}

export * from "./enemyDefs";
