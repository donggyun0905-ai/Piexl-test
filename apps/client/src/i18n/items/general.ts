// 장수 글자 (한·영·일): 무기 이름 · 콤보 설명 · 필살기 이름 · 전용 아이템 이름·효과 (수치는 weaponsGeneral·sim/general·GENERAL_PERKS와 맞춤)
import type { LegendKind, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export type GeneralWeapon = "trainingSpear" | "skyHalberd" | "greenDragonBlade" | "serpentSpear" | "heavenSword" | "twinSwords" | "hwarangSword" | "loneBlade" | "cliffSpear" | "twinDragonSword" | "gyebaekBlade";
type GeneralPassive = "hiddenPower" | "redHare" | "ironWall" | "spearMastery" | "warCry" | "bloodBlade" | "momentum" | "armorPierce" | "unbreakable" | "martialSoul" | "loyalty" | "warBanner";

export const GENERAL_WEAPON_NAMES: Record<GeneralWeapon & WeaponId, Names> = {
  trainingSpear: { ko: "훈련용 창", en: "Training Spear", ja: "訓練用の槍" },
  skyHalberd: { ko: "방천화극", en: "Sky Piercer Halberd", ja: "方天画戟" },
  greenDragonBlade: { ko: "청룡언월도", en: "Green Dragon Crescent Blade", ja: "青龍偃月刀" },
  serpentSpear: { ko: "장팔사모", en: "Serpent Spear", ja: "丈八蛇矛" },
  heavenSword: { ko: "의천검", en: "Heaven Sword", ja: "倚天剣" },
  twinSwords: { ko: "쌍고검", en: "Twin Swords", ja: "双股剣" },
  hwarangSword: { ko: "화랑 보검", en: "Hwarang Sword", ja: "花郎の宝剣" },
  loneBlade: { ko: "고려 대도", en: "Goryeo Greatblade", ja: "高麗の大刀" },
  cliffSpear: { ko: "애각창", en: "Cliff Spear", ja: "涯角槍" },
  twinDragonSword: { ko: "쌍룡검", en: "Twin Dragon Sword", ja: "双竜剣" },
  gyebaekBlade: { ko: "결사의 장검", en: "Blade of the Last Stand", ja: "決死の長剣" },
};

/** 콤보 설명 (찌르기 T · 휘두르기 S · 돌진 L …) · 필살기 주인 */
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });
export const SPEAR_DESC: Record<GeneralWeapon, Names> = {
  trainingSpear: c("찌르기 3 → 휘두르기 2 → 돌진 내리꽂기", "3 thrusts → 2 swings → lunging slam", "突き3 → 薙ぎ2 → 突進叩きつけ"),
  skyHalberd: c("휘두르기·찌르기·휘두르기 → 회전 2 → 적토 돌파 · 여포의 무기", "Swing, thrust, swing → 2 spins → breakthrough charge · Lü Bu's weapon", "薙ぎ・突き・薙ぎ → 回転2 → 突破突進 · 呂布の武器"),
  greenDragonBlade: c("크게 베기·휘두르기 → 검기 → 크게 베기 → 큰 검기 · 관우의 무기", "Great cleave, swing → blade wave → cleave → giant wave · Guan Yu's weapon", "大薙ぎ・薙ぎ → 剣気 → 大薙ぎ → 大剣気 · 関羽の武器"),
  serpentSpear: c("긴 찌르기 3 → 다섯 번 연속 찌르기 → 호령 충격파 · 장비의 무기", "3 long thrusts → 5-hit flurry → roaring shockwave · Zhang Fei's weapon", "長い突き3 → 五連突き → 咆哮の衝撃波 · 張飛の武器"),
  heavenSword: c("빠른 베기 4 → X자 베기 → 돌파 · 조조의 검", "4 quick cuts → X cut → breakthrough · Cao Cao's sword", "素早い斬り4 → X字斬り → 突破 · 曹操の剣"),
  twinSwords: c("쌍검 찌르기·베기·쌍검 찌르기 → X자 베기 → 회전 · 유비의 쌍검", "Twin-blade thrust, cut, twin-blade thrust → X cut → spin · Liu Bei's twin swords", "双剣突き・斬り・双剣突き → X字斬り → 回転 · 劉備の双剣"),
  hwarangSword: c("찌르기·베기 → 검기 → 찌르기 → 부채꼴 검기 3 · 김유신의 검", "Thrust, cut → wave → thrust → 3-way wave fan · Kim Yu-sin's sword", "突き・斬り → 剣気 → 突き → 扇状の剣気3 · 金庾信の剣"),
  loneBlade: c("크게 베기 2 → 회전 → 돌파 → 마무리 큰 베기 · 척준경의 대도", "2 great cleaves → spin → breakthrough → final cleave · Cheok Jun-gyeong's blade", "大薙ぎ2 → 回転 → 突破 → 締めの大薙ぎ · 拓俊京の大刀"),
  cliffSpear: c("찌르기·휘두르기 → 연속 찌르기 → 찌르기 → 돌파 → 회전 · 조운의 창", "Thrust, swing → flurry → thrust → breakthrough → spin · Zhao Yun's spear", "突き・薙ぎ → 連続突き → 突き → 突破 → 回転 · 趙雲の槍"),
  twinDragonSword: c("베기 2 → 검기 → 부채꼴 검기 → 충격파 · 이순신의 검", "2 cuts → wave → wave fan → shockwave · Yi Sun-sin's sword", "斬り2 → 剣気 → 扇状の剣気 → 衝撃波 · 李舜臣の剣"),
  gyebaekBlade: c("베기·찌르기·베기 → 크게 베기 → 결사 충격파 · 계백의 검", "Cut, thrust, cut → great cleave → do-or-die shockwave · Gyebaek's sword", "斬り・突き・斬り → 大薙ぎ → 決死の衝撃波 · 階伯の剣"),
};

/** 필살기 이름 (숨겨진 힘) */
export const LEGEND_NAMES: Record<LegendKind, Names> = {
  charge: c("돌격", "Charge!", "突撃"),
  frenzy: c("광풍난무", "Raging Gale Frenzy", "狂風乱舞"),
  dragonCleave: c("청룡참", "Green Dragon Cleave", "青龍斬"),
  roar: c("장판교 호령", "Bridge-Holding Roar", "長坂橋の咆哮"),
  hegemon: c("패도", "Way of the Hegemon", "覇道"),
  benevolence: c("인덕", "Benevolence", "仁徳"),
  unify: c("삼한일통", "Three Kingdoms United", "三韓一統"),
  loneHero: c("일기당천", "One Against a Thousand", "一騎当千"),
  sevenCharge: c("칠진칠출", "Seven In, Seven Out", "七進七出"),
  craneWing: c("학익진", "Crane Wing Formation", "鶴翼の陣"),
  lastStand: c("황산벌 결사", "Last Stand at Hwangsan", "黄山伐の決死"),
};

export const GENERAL_PASSIVE_NAMES: Record<GeneralPassive & PassiveId, Names> = {
  hiddenPower: c("숨겨진 힘", "Hidden Power", "秘めた力"),
  redHare: c("적토마", "Red Hare", "赤兎馬"),
  ironWall: c("철벽진", "Iron Wall", "鉄壁の陣"),
  spearMastery: c("창술 달인", "Spear Mastery", "槍術の達人"),
  warCry: c("함성", "War Cry", "鬨の声"),
  bloodBlade: c("피 묻은 칼날", "Bloodied Edge", "血塗られた刃"),
  momentum: c("명장의 기세", "General's Momentum", "名将の勢い"),
  armorPierce: c("갑옷 꿰뚫기", "Armor Pierce", "鎧貫き"),
  unbreakable: c("불굴", "Unbreakable", "不屈"),
  martialSoul: c("무인의 혼", "Martial Soul", "武人の魂"),
  loyalty: c("충의", "Loyalty", "忠義"),
  warBanner: c("군기", "War Banner", "軍旗"),
};

export const GENERAL_EFFECTS: Partial<Record<GeneralPassive & PassiveId, Names>> = {
  hiddenPower: c("콤보 마지막에 당대 최고의 장수들이 가진 필살기를 사용합니다 (무기마다 다름)", "At the end of each combo, unleash the signature technique of the greatest generals of their age (differs per weapon)", "コンボの最後に当代最高の武将たちの必殺技を使う（武器ごとに異なる）"),
  redHare: c("이동 속도 +0.2 · 돌진 거리 {lunge}배", "+0.2 move speed · {lunge}x lunge distance", "移動速度+0.2 · 突進距離{lunge}倍"),
  ironWall: c("콤보 묶음 사이 쉬는 동안 받는 피해 -{taken:down}%", "Take {taken:down}% less damage while pausing between combo sets", "コンボの間の休みの間、受けるダメージ-{taken:down}%"),
  warCry: c("콤보를 끝까지 하면 {ticks:sec}초 동안 피해 +{damage:up}%", "Finishing a combo gives +{damage:up}% damage for {ticks:sec}s", "コンボを最後まで行うと{ticks:sec}秒間ダメージ+{damage:up}%"),
  bloodBlade: c("찌르기에 맞은 적이 출혈", "Thrusts make foes bleed", "突きが当たった敵が出血"),
  momentum: c("적을 쓰러뜨리면 다음 기술 피해 {damage}배", "Defeating a foe makes your next move deal {damage}x damage", "敵を倒すと次の技のダメージ{damage}倍"),
  armorPierce: c("보스에게 피해 +{damage:up}%", "+{damage:up}% damage to bosses", "ボスへのダメージ+{damage:up}%"),
  unbreakable: c("체력 {below:pct}% 이하면 콤보 사이에 쉬지 않음", "No pause between combo sets below {below:pct}% health", "体力{below:pct}%以下ならコンボの間に休まない"),
  loyalty: c("콤보를 끝까지 하면 최대 체력의 {heal:pct}% 회복", "Finishing a combo heals {heal:pct}% max HP", "コンボを最後まで行うと最大体力の{heal:pct}%回復"),
  warBanner: c("돌진 내리꽂기 폭발 범위 +{area:up}%", "Lunge slam blast area +{area:up}%", "突進叩きつけの爆発範囲+{area:up}%"),
};
