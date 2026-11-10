// 성국 베아트리스 글자 (한·영·일): 쌍검 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsBeatrice·BEATRICE_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type BtPassive =
  | "btGrudge" | "btSin" | "btExecutor" | "btVerdict" | "btWitness" | "btEmber" | "btCore" | "btScorch" | "btFlare" | "btBrand"
  | "btUndying" | "btVow" | "btOath" | "btGrace" | "btSilver" | "btNoon" | "btTotality" | "btSwift" | "btMercy" | "btBreaker";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const BT_WEAPON_NAMES: Record<"btTwin" & WeaponId, Names> = {
  btTwin: c("사멸·절멸의 쌍검", "Twin Blades of Demise & Annihilation", "死滅・絶滅の双剣"),
};

export const BT_PASSIVE_NAMES: Record<BtPassive & PassiveId, Names> = {
  btGrudge: c("원한의 낙인", "Brand of Grudge", "怨恨の烙印"),
  btSin: c("죄의 무게", "Weight of Sin", "罪の重さ"),
  btExecutor: c("처단자", "Executioner", "処断者"),
  btVerdict: c("최후의 심판", "Final Verdict", "最後の審判"),
  btWitness: c("증인", "Witness", "証人"),
  btEmber: c("불씨", "Ember", "火種"),
  btCore: c("태양의 핵", "Solar Core", "太陽の核"),
  btScorch: c("작열", "Scorch", "灼熱"),
  btFlare: c("홍염", "Crimson Flare", "紅炎"),
  btBrand: c("낙인 각인", "Engraved Brand", "烙印刻印"),
  btUndying: c("꺼지지 않는 불꽃", "Undying Flame", "消えない炎"),
  btVow: c("성녀의 서약", "Saint's Vow", "聖女の誓約"),
  btOath: c("피의 맹세", "Blood Oath", "血の誓い"),
  btGrace: c("은총", "Grace", "恩寵"),
  btSilver: c("백은의 갑주", "Holy Silver Armor", "白銀の甲冑"),
  btNoon: c("정오의 태양", "Noon Sun", "正午の太陽"),
  btTotality: c("개기일식", "Totality", "皆既日食"),
  btSwift: c("성국의 신속", "Holy Kingdom's Swiftness", "聖国の神速"),
  btMercy: c("무한한 자애", "Boundless Mercy", "無限の慈愛"),
  btBreaker: c("성채 파쇄", "Fortress Breaker", "城砦破砕"),
};

export const BT_EFFECTS: Partial<Record<BtPassive & PassiveId, Names>> = {
  btGrudge: c("악이 쌓일 때 {chance:pct}% 확률로 하나 더", "{chance:pct}% chance to add one more Evil", "悪が溜まる時{chance:pct}%の確率でもう1つ"),
  btSin: c("악 하나마다 받는 피해 +{taken:pct}% (원래 4%)", "Each Evil: +{taken:pct}% damage taken (was 4%)", "悪1つごとに被ダメージ+{taken:pct}%（元4%）"),
  btExecutor: c("처단 X자 +{more}개 · 피해 {mul}배", "+{more} Execution crosses · {mul}x damage", "処断のX字+{more}個 · ダメージ{mul}倍"),
  btVerdict: c("처단으로 지운 악 {at}개마다 심판 (원래 100)", "Judgment every {at} purged Evil (was 100)", "処断で消した悪{at}個ごとに審判（元100）"),
  btWitness: c("처단할 때 둘레 적에게도 악 +{evil}", "Executions add +{evil} Evil to nearby foes", "処断時、周りの敵にも悪+{evil}"),
  btEmber: c("화상 최대 {max}겹 (원래 5)", "Burn stacks up to {max} (was 5)", "火傷最大{max}重（元5）"),
  btCore: c("화염 계수 +{fire:pct}%", "+{fire:pct}% fire coefficient", "火炎係数+{fire:pct}%"),
  btScorch: c("화상 피해 {mul}배", "{mul}x burn damage", "火傷ダメージ{mul}倍"),
  btFlare: c("화상이 가득 겹친 적이 쓰러지면 불꽃으로 터짐 (화염 계수 {mul:pct}%)", "Foes with full Burn explode in flame on death ({mul:pct}% fire coefficient)", "火傷が満タンの敵が倒れると炎で爆発（火炎係数{mul:pct}%）"),
  btBrand: c("태양의 낙인 폭 {width}배 · 맞은 적에게 악 +{evil}", "Solar Brand {width}x wider · +{evil} Evil on hit", "太陽の烙印の幅{width}倍 · 当たった敵に悪+{evil}"),
  btUndying: c("재생력 최대 {regen} (원래 30)", "Max regeneration {regen} (was 30)", "再生力最大{regen}（元30）"),
  btVow: c("체력이 {below:pct}% 이하면 받는 피해 -{taken:down}%", "-{taken:down}% damage taken at or below {below:pct}% HP", "体力{below:pct}%以下で被ダメージ-{taken:down}%"),
  btOath: c("처단할 때 최대 체력의 {heal:pct}% 회복", "Executions heal {heal:pct}% max HP", "処断時、最大体力の{heal:pct}%回復"),
  btGrace: c("자애 뒤 회복 불가 {ticks:sec}초 (원래 10초)", "No-heal after Mercy lasts {ticks:sec}s (was 10s)", "慈愛後の回復不可{ticks:sec}秒（元10秒）"),
  btSilver: c("받는 피해 -{taken:down}% · 맞으면 {ticks:sec}초 동안 재생력 +{regen}", "-{taken:down}% damage taken · +{regen} regeneration for {ticks:sec}s when hit", "被ダメージ-{taken:down}% · 被弾時{ticks:sec}秒間再生力+{regen}"),
  btNoon: c("태양 검날 {more:sec}초 더 오래", "Solar Blade lasts {more:sec}s longer", "太陽剣刃が{more:sec}秒長く続く"),
  btTotality: c("일식의 춤 거리 {dash}배 · 강화 베기 {twins}번", "Eclipse Dance {dash}x farther · {twins} empowered slashes", "日食の舞の距離{dash}倍 · 強化斬り{twins}回"),
  btSwift: c("모든 스킬 대기 -{cd:down}%", "-{cd:down}% all skill cooldowns", "全スキル待機-{cd:down}%"),
  btMercy: c("자애 대기 {cd:sec}초 (원래 60초)", "Mercy cooldown {cd:sec}s (was 60s)", "慈愛の待機{cd:sec}秒（元60秒）"),
  btBreaker: c("3타 X자 {r}배 넓음 · 보스에게 피해 {boss}배", "3rd-hit cross {r}x wider · {boss}x damage to bosses", "3撃目のX字{r}倍広い · ボスへのダメージ{boss}倍"),
};
