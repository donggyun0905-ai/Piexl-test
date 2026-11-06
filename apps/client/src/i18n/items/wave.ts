// 탈라시아 웨이브 글자 (한·영·일): 상상의 도구 6 이름·설명 · 물의 기술 30 이름 (효과 글은 waveEffects, 수치는 weaponsWave·WAVE_PERKS와 맞춤)
import type { PassiveId, WaveKind, WaveStyle, WeaponId, WvSkill } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type WvWeapon = "wvBoard" | "wvShell" | "wvPrism" | "wvCrown" | "wvRibbon" | "wvDream";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const WV_WEAPON_NAMES: Record<WvWeapon & WeaponId, Names> = {
  wvBoard: c("파도 서핑보드", "Wave Surfboard", "波のサーフボード"),
  wvShell: c("소라 고둥", "Conch Shell", "ほら貝"),
  wvPrism: c("물방울 프리즘", "Droplet Prism", "しずくのプリズム"),
  wvCrown: c("만조의 왕관", "Crown of High Tide", "満潮の冠"),
  wvRibbon: c("물결 리본", "Ripple Ribbon", "さざ波のリボン"),
  wvDream: c("상상의 물감", "Paint of Imagination", "想像の絵の具"),
};

/** 도구마다 기술 */
const KIND: Record<WaveKind, Names> = {
  board: c("고른 성능의 기본 보드", "the basic, well-rounded board", "バランスのよい基本のボード"),
  shell: c("상상력이 1.5배 빨리 참", "imagination fills 1.5x faster", "想像力が1.5倍速くたまる"),
  prism: c("기술이 나갈 때 35% 확률로 다른 기술 하나가 같이 나감 (70% 세기)", "35% chance a second, different skill fires too (70% power)", "技が出るとき35%で別の技がもう一つ出る（70%の強さ）"),
  crown: c("기술 피해 1.35배 · 기술 크기 1.15배", "skills deal 1.35x damage and are 1.15x bigger", "技のダメージ1.35倍 · 大きさ1.15倍"),
  ribbon: c("물결 초승달이 셋으로 펼쳐짐 (양옆은 60%)", "the ripple crescent fans out into three (sides 60%)", "さざ波の三日月が3つに広がる（両側60%）"),
  dream: c("다음 기술이 머리 위에 보이고, 대시하면 다른 기술로 바뀜 · 기술 피해 1.1배", "the next skill shows above your head and a dash rerolls it · skills deal 1.1x", "次の技が頭上に見え、ダッシュで別の技に変わる · 技のダメージ1.1倍"),
};

/** 상상의 도구 설명 */
export function museDesc(st: WaveStyle, lang: Lang): string {
  return KIND[st.wave][lang];
}

export const WV_PASSIVE_NAMES: Record<WvSkill & PassiveId, Names> = {
  wvButterfly: c("물나비", "Water Butterflies", "水の蝶"),
  wvSpear: c("물창", "Water Spear", "水の槍"),
  wvArmor: c("물의 갑옷", "Water Armor", "水の鎧"),
  wvGoddess: c("바다의 보석", "Gem of the Sea", "海の宝石"),
  wvWhale: c("꿈의 고래", "Dream Whale", "夢の鯨"),
  wvBubble: c("거품 감옥", "Bubble Prison", "泡の牢獄"),
  wvClock: c("물시계", "Water Clock", "水時計"),
  wvJelly: c("해파리 등불", "Jellyfish Lanterns", "クラゲの灯"),
  wvMirror: c("물거울", "Water Mirror", "水鏡"),
  wvCloud: c("소나기 구름", "Shower Cloud", "にわか雨の雲"),
  wvSpout: c("용오름", "Waterspout", "竜巻"),
  wvLotus: c("물연꽃", "Water Lotus", "水の蓮"),
  wvSurf: c("파도 타기", "Surf Ride", "波乗り"),
  wvSpiral: c("물방울 회오리", "Droplet Spiral", "しずくの渦"),
  wvFlood: c("만조", "High Tide", "満潮"),
  wvSchool: c("물고기 떼", "School of Fish", "魚の群れ"),
  wvRope: c("물밧줄", "Water Rope", "水の縄"),
  wvBalloon: c("물풍선", "Water Balloon", "水風船"),
  wvPearl: c("진주 구슬", "Pearl Ball", "真珠玉"),
  wvHands: c("물의 손", "Hands of Water", "水の手"),
  wvFountain: c("분수", "Fountain", "噴水"),
  wvSkip: c("물수제비", "Stone Skipping", "水切り"),
  wvSiren: c("인어의 노래", "Mermaid's Song", "人魚の歌"),
  wvMist: c("물안개", "Sea Mist", "水霧"),
  wvOctopus: c("대왕 문어", "Giant Octopus", "大王ダコ"),
  wvWings: c("물의 날개", "Wings of Water", "水の翼"),
  wvEye: c("심해의 눈", "Eye of the Deep", "深海の眼"),
  wvEbb: c("밀물 썰물", "Ebb and Flow", "満ち潮引き潮"),
  wvTrail: c("물발자국", "Water Footprints", "水の足跡"),
  wvTsunami: c("자유의 해일", "Tsunami of Freedom", "自由の津波"),
};

export { WV_EFFECTS } from "./waveEffects";
