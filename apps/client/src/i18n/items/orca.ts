// 탈라시아 오르카 글자 (한·영·일): 권갑 무기 6 이름·기술 설명 · 전용 아이템 10 이름·효과 (수치는 weaponsOrca·ORCA_PERKS와 맞춤)
import type { OrcaKind, OrcaStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type OcWeapon = "ocTide" | "ocRiptide" | "ocGeyser" | "ocMegalodon" | "ocPod" | "ocMaelstrom";
type OcPassive = "ocSpray" | "ocUndertow" | "ocSurf" | "ocFin" | "ocFrenzy" | "ocEcho" | "ocBreath" | "ocLiberty" | "ocFoam" | "ocSeaWind";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const OC_WEAPON_NAMES: Record<OcWeapon & WeaponId, Names> = {
  ocTide: c("파도 손목띠", "Tide Wraps", "波のリストバンド"),
  ocRiptide: c("이안류 권갑", "Riptide Gauntlets", "離岸流の籠手"),
  ocGeyser: c("간헐천 너클", "Geyser Knuckles", "間欠泉のナックル"),
  ocMegalodon: c("메갈로돈 이빨", "Megalodon Fang", "メガロドンの牙"),
  ocPod: c("범고래 무리", "Orca Pod", "シャチの群れ"),
  ocMaelstrom: c("대소용돌이 권갑", "Maelstrom Gauntlets", "大渦の籠手"),
};

/** 권갑마다 기술 */
const KIND: Record<OrcaKind, Names> = {
  tide: c("고른 성능의 기본 손목띠", "the basic, well-rounded wraps", "バランスのよい基本のリストバンド"),
  riptide: c("둘째 타 소용돌이가 40% 크고 두 배로 끌어당김", "the 2nd-hit whirl is 40% bigger and pulls twice as hard", "2撃目の渦が40%大きく、2倍引き寄せる"),
  geyser: c("셋째 타 물기둥이 앞으로 셋 줄지어 솟음", "the 3rd-hit geyser erupts three times in a row ahead", "3撃目の水柱が前へ3本連なって噴き上がる"),
  megalodon: c("상어 기공파가 1.7배 크고 1.5배 세게 물지만 사냥은 1번 적게", "the shark wave is 1.7x bigger and bites 1.5x harder, but hunts 1 fewer", "鮫の気功波が1.7倍大きく1.5倍強く噛むが、狩りは1回少ない"),
  pod: c("상어 기공파가 셋으로 갈라져 따로 사냥 (하나는 55%)", "the shark wave splits into three that hunt on their own (55% each)", "鮫の気功波が3匹に分かれてそれぞれ狩る（1匹55%）"),
  maelstrom: c("상어가 터진 자리에 적을 빨아들이는 소용돌이 장판 (2초)", "a burst shark leaves a whirlpool that sucks foes in (2s)", "鮫が弾けた場所に敵を吸い込む渦が残る（2秒）"),
};

/** 권갑 무기 설명: 종류 기술 */
export function riptideDesc(st: OrcaStyle, lang: Lang): string {
  return KIND[st.orca][lang];
}

export const OC_PASSIVE_NAMES: Record<OcPassive & PassiveId, Names> = {
  ocSpray: c("물보라 장갑", "Spray Gloves", "飛沫のグローブ"),
  ocUndertow: c("밑물결", "Undertow", "引き波"),
  ocSurf: c("파도 타기", "Wave Riding", "波乗り"),
  ocFin: c("등지느러미", "Dorsal Fin", "背びれ"),
  ocFrenzy: c("피 냄새", "Scent of Blood", "血の匂い"),
  ocEcho: c("반향정위", "Echolocation", "反響定位"),
  ocBreath: c("고래의 숨", "Whale's Breath", "鯨の息"),
  ocLiberty: c("해방의 노래", "Song of Liberation", "解放の歌"),
  ocFoam: c("물거품 방패", "Foam Shield", "泡の盾"),
  ocSeaWind: c("바닷바람", "Sea Breeze", "潮風"),
};

export const OC_EFFECTS: Partial<Record<OcPassive & PassiveId, Names>> = {
  ocSpray: c("1타 물보라 거리 +{reach:up}% · 피해 {mul}배", "1st-hit spray +{reach:up}% reach · {mul}x damage", "1撃目の飛沫の距離+{reach:up}% · ダメージ{mul}倍"),
  ocUndertow: c("2타 소용돌이 크기 +{r:up}% · 끌어당김 {pull}배", "2nd-hit whirl +{r:up}% size · {pull}x pull", "2撃目の渦の大きさ+{r:up}% · 引き寄せ{pull}倍"),
  ocSurf: c("대시 직후 다음 타격 피해 {mul}배 · 콤보가 한 단계 건너뜀", "Right after a dash, the next hit deals {mul}x and the combo skips ahead a step", "ダッシュ直後の次の攻撃ダメージ{mul}倍 · コンボが1段階進む"),
  ocFin: c("상어 기공파 사냥 +{hunts}번", "+{hunts} shark wave hunts", "鮫の気功波の狩り+{hunts}回"),
  ocFrenzy: c("상어가 한 번 물 때마다 다음 물기 피해 +{up:pct}%", "Each shark bite makes its next bite +{up:pct}% stronger", "鮫が噛むたびに次の噛みつき+{up:pct}%"),
  ocEcho: c("상어가 터질 때 물기둥이 솟고 터짐 범위 +{r:up}%", "A bursting shark raises a geyser · +{r:up}% burst size", "鮫が弾けると水柱が噴き上がり範囲+{r:up}%"),
  ocBreath: c("해방 게이지가 {gain}배 빨리 참", "The Liberation gauge fills {gain}x faster", "解放ゲージが{gain}倍速くたまる"),
  ocLiberty: c("범고래 돌파 뒤 {ticks}틱 동안 공격 속도 {speed}배", "After Orca Breach, {speed}x attack speed for {ticks} ticks", "シャチ突破の後{ticks}ティックの間 攻撃速度{speed}倍"),
  ocFoam: c("범고래 돌파로 내려앉으면 최대 체력의 {heal:pct}% 회복", "Landing an Orca Breach heals {heal:pct}% of max HP", "シャチ突破で着地すると最大体力の{heal:pct}%回復"),
  ocSeaWind: c("받는 피해 -{taken:down}%", "-{taken:down}% damage taken", "被ダメージ-{taken:down}%"),
};
