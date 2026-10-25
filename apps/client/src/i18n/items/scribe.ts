// 서기관(히든) 글자 (한·영·일): 무기 이름 · 무기 설명(글자) · 전용 아이템 이름·효과 (수치는 weaponsScribe·SCRIBE_PERKS와 맞춤)
import type { PassiveId, ScribeWord, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type ScribeWeapon = "quillPen" | "inkBrush" | "sealScroll" | "thunderTome" | "frostCodex" | "flameTablet" | "chronicle" | "starScripture" | "oblivionPage" | "akashicOrigin";
type ScribePassive = "inkWell" | "thickNib" | "footnote" | "preface" | "parchment" | "sealStamp" | "shorthand" | "censor" | "revision" | "forbiddenBook";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const SCRIBE_WEAPON_NAMES: Record<ScribeWeapon & WeaponId, Names> = {
  quillPen: c("깃펜", "Quill Pen", "羽根ペン"),
  inkBrush: c("먹붓", "Ink Brush", "墨筆"),
  sealScroll: c("봉인서", "Sealing Scroll", "封印の書"),
  thunderTome: c("뇌전 문서", "Thunder Tome", "雷電の文書"),
  frostCodex: c("빙결 문서", "Frost Codex", "氷結の文書"),
  flameTablet: c("화염 서판", "Flame Tablet", "火炎の書板"),
  chronicle: c("기록의 서", "The Chronicle", "記録の書"),
  starScripture: c("별의 성서", "Star Scripture", "星の聖書"),
  oblivionPage: c("망각의 페이지", "Page of Oblivion", "忘却のページ"),
  akashicOrigin: c("아카식 원본", "Akashic Original", "アカシックの原本"),
};

/** 글자 설명 (무기 설명 뒤에 붙음) */
export const WORD_DESC: Record<ScribeWord, Names> = {
  blade: c("글자 「劍」: 나와 적 사이를 잉크 칼날로 가름", "Glyph 「劍」: an ink blade cuts the line between you and the foe", "文字「劍」：自分と敵の間を墨の刃で斬る"),
  burst: c("글자 「爆」: 겨눈 곳이 터짐", "Glyph 「爆」: the target spot explodes", "文字「爆」：狙った場所が爆発"),
  seal: c("글자 「封」: 둘레 적을 봉인해 멈춤", "Glyph 「封」: seals and stuns nearby foes", "文字「封」：周りの敵を封じて止める"),
  bolt: c("글자 「雷」: 기록이 많은 적부터 연쇄 번개", "Glyph 「雷」: chain lightning, most-recorded foes first", "文字「雷」：記録の多い敵から連鎖の雷"),
  frost: c("글자 「氷」: 둘레를 얼려 피해 + 멈춤", "Glyph 「氷」: freezes around you, damage + stun", "文字「氷」：周りを凍らせダメージ＋停止"),
  flame: c("글자 「炎」: 겨눈 곳 둘레를 불태움", "Glyph 「炎」: sets the target area ablaze", "文字「炎」：狙った周りを燃やす"),
  recall: c("글자 「再」: 기록된 적마다 새긴 수만큼 피해 (기록이 지워짐)", "Glyph 「再」: damages each recorded foe per mark (marks are cleared)", "文字「再」：記録された敵に刻んだ数だけダメージ（記録は消える）"),
  star: c("글자 「星」: 별똥별 다섯", "Glyph 「星」: five shooting stars", "文字「星」：流れ星5つ"),
  void: c("글자 「滅」: 가장 약한 적 하나를 크게", "Glyph 「滅」: a massive hit on the weakest foe", "文字「滅」：最も弱い敵ひとりに大ダメージ"),
  origin: c("모든 글자를 차례로 씀", "Writes every glyph in turn", "すべての文字を順に書く"),
};

export const SCRIBE_PASSIVE_NAMES: Record<ScribePassive & PassiveId, Names> = {
  inkWell: c("잉크병", "Inkwell", "インク壺"),
  thickNib: c("두꺼운 펜촉", "Thick Nib", "太いペン先"),
  footnote: c("각주", "Footnote", "脚注"),
  preface: c("서문", "Preface", "序文"),
  parchment: c("양피지", "Parchment", "羊皮紙"),
  sealStamp: c("낙관", "Seal Stamp", "落款"),
  shorthand: c("속기", "Shorthand", "速記"),
  censor: c("검열", "Censor", "検閲"),
  revision: c("개정판", "Revised Edition", "改訂版"),
  forbiddenBook: c("금서", "Forbidden Book", "禁書"),
};

export const SCRIBE_EFFECTS: Partial<Record<ScribePassive & PassiveId, Names>> = {
  inkWell: c("글자가 {every}번 더 자주 써짐", "Glyphs are written {every} attack sooner", "文字が{every}回早く書かれる"),
  thickNib: c("잉크 탄이 적 {pierce}명을 뚫음", "Ink shots pierce {pierce} foes", "墨の弾が敵{pierce}人を貫く"),
  footnote: c("기록 하나당 그 적이 받는 피해 +{per:pct}%", "+{per:pct}% damage taken per record on a foe", "記録1つにつき、その敵の被ダメージ+{per:pct}%"),
  preface: c("방에 들어와 처음 공격하면 바로 글자", "Your first attack in each room writes a glyph", "部屋に入って最初の攻撃ですぐ文字"),
  parchment: c("글자를 쓸 때마다 보호막 {shield} (최대 체력의 {max:pct}%까지)", "+{shield} shield per glyph (up to {max:pct}% of max HP)", "文字を書くたびにシールド{shield}（最大体力の{max:pct}%まで）"),
  sealStamp: c("글자 피해 +{damage:up}%", "+{damage:up}% glyph damage", "文字のダメージ+{damage:up}%"),
  shorthand: c("잉크 탄이 두 발씩 (공격력 -10%)", "Two ink shots at a time (-10% damage)", "墨の弾が2発ずつ（攻撃力-10%）"),
  censor: c("글자에 맞은 적이 {stun:sec}초 멈춤", "Foes hit by glyphs freeze for {stun:sec}s", "文字に当たった敵が{stun:sec}秒止まる"),
  revision: c("글자가 한 번 더 ({power:pct}% 세기)", "Each glyph is written again at {power:pct}% power", "文字がもう一度（{power:pct}%の強さ）"),
  forbiddenBook: c("최대 체력 +15 · 기록이 새겨진 적을 쓰러뜨리면 체력 {heal} 회복", "+15 max HP · heal {heal} HP when a recorded foe falls", "最大体力+15 · 記録された敵を倒すと体力{heal}回復"),
};
