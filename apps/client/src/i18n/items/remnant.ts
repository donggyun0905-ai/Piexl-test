// 아스칼론 잔영 글자 (한·영·일): 그림자 단검 이름·설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsRemnant·REMNANT_PERKS와 맞춤)
import type { PassiveId, PhantomStyle, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type RmWeapon = "rmDagger" | "rmTwin" | "rmClaw" | "rmStiletto" | "rmKunai" | "rmSpin" | "rmFlash" | "rmReaper" | "rmFang" | "rmEclipse";
type RmPassive = "rmStep" | "rmBackstab" | "rmExecute" | "rmEcho" | "rmVanish" | "rmBlood" | "rmHaste" | "rmSwift" | "rmFrenzy" | "rmShroud";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const RM_WEAPON_NAMES: Record<RmWeapon & WeaponId, Names> = {
  rmDagger: c("잔영 단검", "Afterimage Dagger", "残影の短剣"),
  rmTwin: c("쌍단검", "Twin Daggers", "双短剣"),
  rmClaw: c("그림자 발톱", "Shadow Claws", "影の爪"),
  rmStiletto: c("스틸레토", "Stiletto", "スティレット"),
  rmKunai: c("그림자 투척", "Shadow Throw", "影の投擲"),
  rmSpin: c("회전 칼날", "Spinning Blades", "回転刃"),
  rmFlash: c("섬영", "Flash Shadow", "閃影"),
  rmReaper: c("그림자 낫", "Shadow Sickle", "影の鎌"),
  rmFang: c("독니", "Venom Fang", "毒牙"),
  rmEclipse: c("월식", "Eclipse", "月蝕"),
};

/** 그림자 단검 설명 (모양에서 만듦) */
export function phantomDesc(st: PhantomStyle, lang: Lang): string {
  const parts: Names[] = [
    st.arc <= -1 ? c("몸 둘레를 모두 벰", "cuts all around you", "体の周りをすべて斬る") : st.hits > 1 ? c(`한 번에 ${st.hits}번 벰`, `${st.hits} cuts per attack`, `一度に${st.hits}回斬る`) : c("빠르게 벰", "quick cuts", "素早く斬る"),
    c(`멀면 적 뒤로 순간이동 (${(st.blinkGap / 60).toFixed(1)}초마다)`, `blinks behind far foes (every ${(st.blinkGap / 60).toFixed(1)}s)`, `遠い敵の背後へ瞬間移動（${(st.blinkGap / 60).toFixed(1)}秒ごと）`),
    c(`뒤에서 치면 ${st.backMul}배`, `×${st.backMul} from behind`, `背後から${st.backMul}倍`),
  ];
  if (st.throws) parts.push(c(`그림자 칼 ${st.throws}개를 같이 던짐`, `also throws ${st.throws} shadow knives`, `影の刃${st.throws}本も投げる`));
  if (st.venom) parts.push(c("벨 때마다 독", "poisons on hit", "斬るたびに毒"));
  if (st.burst) parts.push(c("남긴 잔영이 크게 터짐", "afterimages explode", "残した残影が大きく弾ける"));
  return parts.map((p) => p[lang]).join(" · ");
}

export const RM_PASSIVE_NAMES: Record<RmPassive & PassiveId, Names> = {
  rmStep: c("그림자 걸음", "Shadow Step", "影歩き"),
  rmBackstab: c("등 뒤의 칼", "Knife in the Back", "背中の刃"),
  rmExecute: c("처형", "Execution", "処刑"),
  rmEcho: c("겹친 잔영", "Double Afterimage", "重なる残影"),
  rmVanish: c("사라짐", "Vanish", "消失"),
  rmBlood: c("피의 칼날", "Bloody Edge", "血の刃"),
  rmHaste: c("그림자 손놀림", "Shadow Hands", "影の手さばき"),
  rmSwift: c("소리 없는 발", "Silent Feet", "音なき足"),
  rmFrenzy: c("연쇄 암살", "Chain Assassination", "連鎖暗殺"),
  rmShroud: c("그림자 숨기", "Shadow Shroud", "影隠れ"),
};

export const RM_EFFECTS: Partial<Record<RmPassive & PassiveId, Names>> = {
  rmStep: c("순간이동 대기 -{cd:down}%", "Blink cooldown -{cd:down}%", "瞬間移動の待ち時間-{cd:down}%"),
  rmBackstab: c("뒤에서 친 피해 +{add:pct}%", "+{add:pct}% damage from behind", "背後からのダメージ+{add:pct}%"),
  rmExecute: c("체력 {hp:pct}% 이하 적에게 피해 +{mul:up}%", "+{mul:up}% damage to foes under {hp:pct}% HP", "体力{hp:pct}%以下の敵へダメージ+{mul:up}%"),
  rmEcho: c("남긴 잔영이 {n}번 벰", "Afterimages cut {n} times", "残影が{n}回斬る"),
  rmVanish: c("순간이동한 뒤 {ticks:sec}초 무적", "Invulnerable for {ticks:sec}s after a blink", "瞬間移動後{ticks:sec}秒無敵"),
  rmBlood: c("벨 때 출혈", "Cuts cause bleeding", "斬ると出血"),
  rmFrenzy: c("적을 쓰러뜨리면 순간이동 대기가 바로 끝남", "Kills reset the blink cooldown", "敵を倒すと瞬間移動の待ち時間がすぐ終わる"),
  rmShroud: c("대시하면 가까운 적 뒤로 순간이동", "Dashing blinks you behind a nearby foe", "ダッシュすると近くの敵の背後へ瞬間移動"),
};
