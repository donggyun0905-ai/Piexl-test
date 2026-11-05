// 게임 내용 정의 (캐릭터·무기·적). 이름·수치는 이 게임만의 것으로 정함. 화면에 보이는 이름은 화면 쪽 번역에서.
import type { Stats } from "./stats";
import { CHARACTERS, type CharacterDef, type CharacterId, type ExclusiveId } from "./characters";
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
import { IDRA_WEAPONS } from "./weaponsIdra";
import { MORPH_WEAPONS, type AnimalKind } from "./weaponsMorph";
import { FLY_WEAPONS, type TalonStyle } from "./weaponsFly";
import { ELDER_WEAPONS, type FormationKind } from "./weaponsElder";
import { REN_WEAPONS } from "./weaponsRen";
import { SPIRIT_WEAPONS, type GreatSpirit } from "./weaponsSpirit";
import { PLAGUE_WEAPONS, type PlagueKind } from "./weaponsPlague";
import { SLAYER_WEAPONS, type ScytheMove } from "./weaponsSlayer";
import { EATER_WEAPONS } from "./weaponsEater";
import { MUKIN_WEAPONS, type RamStyle } from "./weaponsMukin";
import { SAMYEOL_WEAPONS, type NeedleStyle } from "./weaponsSamyeol";
import { AUTOMATA_WEAPONS, type AutoStyle } from "./weaponsAutomata";
import { RIDER_WEAPONS, type RideStyle } from "./weaponsRider";
import { BOMBER_WEAPONS, type BombStyle } from "./weaponsBomber";
import { ARTIFACTER_WEAPONS } from "./weaponsArtifacter";
import { PUNK_WEAPONS, type CyberStyle } from "./weaponsPunk";
import { TRACKER_WEAPONS } from "./weaponsTracker";
import { FORGOTTEN_WEAPONS, type LightStyle } from "./weaponsForgotten";
import { REMNANT_WEAPONS, type PhantomStyle } from "./weaponsRemnant";
import { WANDERER_WEAPONS, type KatanaStyle } from "./weaponsWanderer";
import { SILK_WEAPONS, type SilkStyle } from "./weaponsSilk";
import { COLLECTOR_WEAPONS } from "./weaponsCollector";
import { PUNGRYU_WEAPONS, type ScriptStyle } from "./weaponsPungryu";
import { LEO_WEAPONS } from "./weaponsLeo";
import { ONYX_WEAPONS } from "./weaponsOnyx";
import { FENRIR_WEAPONS } from "./weaponsFenrir"; import { ECLIPSE_WEAPONS } from "./weaponsEclipse"; import { THORKEN_WEAPONS, type FlailStyle } from "./weaponsThorken";
import { MINER_WEAPONS, type PickStyle } from "./weaponsMiner";
import { VOYAGER_WEAPONS } from "./weaponsVoyager";
import { ZEUS_WEAPONS, type ThunderStyle } from "./weaponsZeus";
import { PILGRIM_WEAPONS, type CurioStyle } from "./weaponsPilgrim";
import { FALLEN_KING_WEAPONS } from "./weaponsFallenKing";
import { LUX_WEAPONS } from "./weaponsLux";

/** laser 기계공학자·medic 의사: 누르고 있는 동안 짧은 간격으로 틱 피해 · combo 격투가: 누를 때마다 콤보의 다음 기술 (combos) · chakram 베두인 · spear 장수 */
export type WeaponKind = "melee" | "ranged" | "laser" | "orbit" | "combo" | "medic" | "gun" | "beast" | "shade" | "chrono" | "summon" | "chakram" | "spear" | "dragon" | "cross" | "star" | "quack" | "tag" | "titan" | "club" | "quill" | "gaia" | "morph" | "talon" | "formation" | "earthwood" | "pact" | "pest" | "scythe" | "maw" | "ram" | "needle" | "automaton" | "ride" | "bomb" | "repulse" | "cyber" | "snipe" | "light" | "phantom" | "katana" | "thread" | "pick" | "fate" | "thunder" | "curio" | "zwei" | "radiant" | "hoard" | "script" | "lion" | "gem" | "fang" | "solar" | "anchor";
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
export { GAIA_FORMS, IDRA, type GaiaForm } from "./weaponsIdra";
export { MORPH, type AnimalKind } from "./weaponsMorph";
export { FLY, type TalonStyle } from "./weaponsFly";
export { ELDER, FORMATIONS, type FormationKind } from "./weaponsElder";
export { REN, REN_MOVES, type RenMove } from "./weaponsRen";
export { GREAT_SPIRITS, SMALL_SPIRITS, SPIRIT, type GreatSpirit, type SmallSpirit } from "./weaponsSpirit";
export { SUMMON_STATS, type SummonKind } from "./weaponsSummon";
export { PLAGUE, type PlagueKind } from "./weaponsPlague";
export { SLAYER, type ScytheMove } from "./weaponsSlayer";
export { EATER, type MawMove } from "./weaponsEater";
export { MUKIN, type RamStyle } from "./weaponsMukin";
export { SAMYEOL, type NeedlePattern, type NeedleStyle } from "./weaponsSamyeol";
export { AUTOMATA, type AutoStyle } from "./weaponsAutomata";
export { RIDER, type RideMove, type RideStyle } from "./weaponsRider";
export { BOMBER, type BombMode, type BombStyle } from "./weaponsBomber";
export { ARTIFACTER } from "./weaponsArtifacter";
export { PUNK, type CyberMove, type CyberStyle } from "./weaponsPunk";
export { TRACKER } from "./weaponsTracker";
export { FORGOTTEN, type LightPattern, type LightStyle } from "./weaponsForgotten";
export { REMNANT, type PhantomStyle } from "./weaponsRemnant";
export { WANDERER, type KatanaMode, type KatanaStyle } from "./weaponsWanderer";
export { SILK, type SilkStyle } from "./weaponsSilk";
export { COLLECTOR } from "./weaponsCollector";
export { CL_ARMS, CL_ARM_IDS, type ClArm, type ClArmId, type ClFx, type ClStyle } from "./itemsCollector";
export { MINER, type PickMode, type PickStyle } from "./weaponsMiner";
export { VOYAGER } from "./weaponsVoyager";
export { ZEUS, type ThunderMode, type ThunderStyle } from "./weaponsZeus";
export { PILGRIM, type CurioMode, type CurioStyle } from "./weaponsPilgrim";
export { FALLEN_KING } from "./weaponsFallenKing";
export { PUNGRYU, type ScriptStyle, type VerseKind } from "./weaponsPungryu";
export { LEO } from "./weaponsLeo";
export { ONYX, ONYX_GEMS, ONYX_GEM_IDS, type OnyxGem } from "./weaponsOnyx";
export { FENRIR } from "./weaponsFenrir"; export { ECLIPSE } from "./weaponsEclipse"; export { THORKEN, type BallKind, type FlailStyle } from "./weaponsThorken";
export { LUX } from "./weaponsLux";

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
  exclusive?: ExclusiveId;
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
  /** 변희 무기: 변하는 동물 (sim/morph) */
  animal?: AnimalKind;
  /** 플라이 무기: 발톱 종류 (sim/fly) · 장로 무기: 진 종류 (sim/elder) */
  talon?: TalonStyle;
  formation?: FormationKind;
  /** 정령사 무기: 대정령 (sim/spiritGreat) */
  great?: GreatSpirit;
  /** 역병의사 무기 종류 (sim/plague) · 학살자 대낫 5연속 콤보 (sim/slayer) */
  plague?: PlagueKind;
  combo5?: readonly ScytheMove[];
  /** 묵인 돌진 모양 (sim/mukin) */
  ram?: RamStyle;
  /** 사멸 침 던지는 모양 (sim/samyeol) */
  needle?: NeedleStyle;
  /** 오토마타 레이저 모양 (sim/automata) · 라이더 공격 모양 (sim/rider) */
  auto?: AutoStyle;
  ride?: RideStyle;
  /** 붐버 터뜨리는 방식 (sim/bomber) */
  bomb?: BombStyle;
  /** 펑크 공격 모양 (sim/punk) */
  cyber?: CyberStyle;
  light?: LightStyle;
  phantom?: PhantomStyle;
  katana?: KatanaStyle;
  silk?: SilkStyle;
  pick?: PickStyle;
  zeus?: ThunderStyle;
  curio?: CurioStyle;
  script?: ScriptStyle;
  flail?: FlailStyle;
}

/** 부적 추가 효과 (수치·설명은 weaponsMystic) */
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
  ...IDRA_WEAPONS,
  ...MORPH_WEAPONS,
  ...FLY_WEAPONS,
  ...ELDER_WEAPONS,
  ...REN_WEAPONS,
  ...SPIRIT_WEAPONS,
  ...PLAGUE_WEAPONS,
  ...SLAYER_WEAPONS,
  ...EATER_WEAPONS,
  ...MUKIN_WEAPONS,
  ...SAMYEOL_WEAPONS,
  ...AUTOMATA_WEAPONS,
  ...RIDER_WEAPONS,
  ...BOMBER_WEAPONS,
  ...ARTIFACTER_WEAPONS,
  ...PUNK_WEAPONS,
  ...TRACKER_WEAPONS,
  ...FORGOTTEN_WEAPONS,
  ...REMNANT_WEAPONS,
  ...WANDERER_WEAPONS,
  ...SILK_WEAPONS,
  ...COLLECTOR_WEAPONS,
  ...PUNGRYU_WEAPONS, ...LEO_WEAPONS, ...ONYX_WEAPONS, ...FENRIR_WEAPONS, ...ECLIPSE_WEAPONS, ...THORKEN_WEAPONS,
  ...MINER_WEAPONS,
  ...VOYAGER_WEAPONS,
  ...ZEUS_WEAPONS,
  ...PILGRIM_WEAPONS,
  ...FALLEN_KING_WEAPONS,
  ...LUX_WEAPONS,
} as const satisfies Record<string, WeaponDef>;

export type WeaponId = keyof typeof WEAPONS;
export const WEAPON_IDS = Object.keys(WEAPONS) as WeaponId[];

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

export * from "./characters";
export * from "./limitedChars";
export * from "./enemyDefs";
