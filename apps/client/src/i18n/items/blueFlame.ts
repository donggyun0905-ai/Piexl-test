// 새벽의 성흔 블루 플레임 글자 (한·영·일): 청염의 활 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsBlueFlame·BLUE_FLAME_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type BzPassive =
  | "bzDraw" | "bzFletch" | "bzSplit" | "bzEmber" | "bzWide" | "bzPrison" | "bzCage" | "bzImplode" | "bzSeal" | "bzInner"
  | "bzPillar" | "bzTwin" | "bzBlaze" | "bzKnock" | "bzLinger" | "bzWing" | "bzSoul" | "bzSense" | "bzGreat" | "bzEndless";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const BZ_WEAPON_NAMES: Record<"bzBow" & WeaponId, Names> = {
  bzBow: c("청염의 활", "Blue Flame Bow", "青炎の弓"),
};

export const BZ_PASSIVE_NAMES: Record<BzPassive & PassiveId, Names> = {
  bzDraw: c("빠른 시위", "Quick Draw", "早引きの弦"),
  bzFletch: c("청염 깃", "Blue Fletching", "青炎の矢羽"),
  bzSplit: c("갈래 화살", "Split Arrow", "分かれ矢"),
  bzEmber: c("불씨 화살", "Ember Arrow", "火種の矢"),
  bzWide: c("넓은 감각", "Wide Sense", "広い感覚"),
  bzPrison: c("청염 감옥", "Blue Prison", "青炎の牢獄"),
  bzCage: c("단단한 감옥", "Sturdy Cage", "堅い牢獄"),
  bzImplode: c("감옥 붕괴", "Prison Collapse", "牢獄崩壊"),
  bzSeal: c("봉인", "Seal", "封印"),
  bzInner: c("가까운 공포", "Close Terror", "間近の恐怖"),
  bzPillar: c("솟는 불길", "Rising Blaze", "噴き上がる炎"),
  bzTwin: c("쌍기둥", "Twin Pillars", "双柱"),
  bzBlaze: c("불기둥 폭", "Pillar Breadth", "炎柱の幅"),
  bzKnock: c("불기둥 밀침", "Pillar Shove", "炎柱の押し出し"),
  bzLinger: c("남는 불꽃", "Lingering Flame", "残り火"),
  bzWing: c("푸른 날개", "Blue Wings", "青い翼"),
  bzSoul: c("영혼 소각", "Soul Burn", "魂の焼却"),
  bzSense: c("맹인의 감각", "Blind Sense", "盲目の感覚"),
  bzGreat: c("거대한 화살", "Giant Arrow", "巨大な矢"),
  bzEndless: c("꺼지지 않는 불", "Undying Flame", "消えない炎"),
};

export const BZ_EFFECTS: Partial<Record<BzPassive & PassiveId, Names>> = {
  bzDraw: c("기본 공격 간격 {time:pct}%", "Basic attack interval {time:pct}%", "通常攻撃の間隔{time:pct}%"),
  bzFletch: c("화살 피해 {mul}배", "{mul}x arrow damage", "矢のダメージ{mul}倍"),
  bzSplit: c("바깥 범위의 다른 적 {add}에게도 화살", "Also shoots {add} more foe in the outer ring", "外側の範囲の別の敵{add}体にも矢"),
  bzEmber: c("화살이 박힌 자리 둘레 {r}에 {mul:pct}% 피해", "Arrows deal {mul:pct}% within {r} of where they strike", "矢が刺さった周囲{r}に{mul:pct}%ダメージ"),
  bzWide: c("세 겹 범위 {r}배", "{r}x size for all three rings", "三重の範囲{r}倍"),
  bzPrison: c("불꽃 감옥 피해 {mul}배", "{mul}x Flame Prison damage", "炎の牢獄のダメージ{mul}倍"),
  bzCage: c("불꽃 감옥이 +{more:sec}초 더 가둠", "Flame Prison traps +{more:sec}s longer", "炎の牢獄が+{more:sec}秒長く閉じ込める"),
  bzImplode: c("불꽃 감옥 범위 {r}배", "{r}x Flame Prison radius", "炎の牢獄の範囲{r}倍"),
  bzSeal: c("불꽃 감옥에 갇힌 적 {stun:sec}초 기절", "Prisoned foes are stunned {stun:sec}s", "牢獄に閉じ込めた敵を{stun:sec}秒気絶"),
  bzInner: c("안쪽 범위가 사거리의 {ring:pct}%로", "Inner ring becomes {ring:pct}% of range", "内側の範囲が射程の{ring:pct}%に"),
  bzPillar: c("불꽃 기둥 피해 {mul}배", "{mul}x Flame Pillar damage", "炎の柱のダメージ{mul}倍"),
  bzTwin: c("가운데 범위의 다른 적 {add}에게도 기둥", "Also raises a pillar under {add} more foe in the middle ring", "真ん中の範囲の別の敵{add}体にも柱"),
  bzBlaze: c("불꽃 기둥 범위 {r}배", "{r}x Flame Pillar radius", "炎の柱の範囲{r}倍"),
  bzKnock: c("불꽃 기둥이 적을 {push}만큼 밀쳐냄", "Flame Pillar shoves foes {push} away", "炎の柱が敵を{push}押し出す"),
  bzLinger: c("청염 지속 {ticks}배", "{ticks}x Blue Flame duration", "青炎の持続{ticks}倍"),
  bzWing: c("공격할 때 {chance:pct}% 확률로 날개가 돋고 머리 위 활들이 앞쪽에 화살비", "{chance:pct}% chance on attack to sprout wings and rain arrows ahead from bows above your head", "攻撃時{chance:pct}%で翼が生え、頭上の弓から前方に矢の雨"),
  bzSoul: c("청염 피해 {mul}배", "{mul}x Blue Flame damage", "青炎のダメージ{mul}倍"),
  bzSense: c("성흔이 {gain}배 빨리 참", "Stigma fills {gain}x faster", "聖痕が{gain}倍早く満ちる"),
  bzGreat: c("각성 폭격 범위 {r}배 · 피해 {mul}배", "Awakening bombardment {r}x radius · {mul}x damage", "覚醒の爆撃 範囲{r}倍・ダメージ{mul}倍"),
  bzEndless: c("열화상 각성 +{more:sec}초", "Thermal Awakening +{more:sec}s", "熱感知覚醒+{more:sec}秒"),
};
