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
  const hits = st.hits ?? 1;
  const cuts = st.cuts ?? 3;
  const sec = (st.slow / 60).toFixed(1);
  const parts: Names[] = [
    hits > 1 ? c(`짧게 ${hits}번 내려찍기`, `short ${hits}× stab`, `短く${hits}回突き下ろす`) : st.arc < 0 ? c("앞을 넓게 내려찍기", "wide short stab", "前を広く突き下ろす") : c("짧게 내려찍기", "short stab", "短く突き下ろす"),
    c(`대시로 피하면 ${sec}초 슬로우모션`, `dash-dodge: ${sec}s slow motion`, `ダッシュで避けると${sec}秒スローモーション`),
    c(`그 안에 클릭하면 확정 치명타 ${cuts}연속 베기 (${Math.round(st.flurryMul * 100)}%${st.spin ? ", 모두 몸 둘레" : ""})`, `click in it: ${cuts} sure-crit slashes (${Math.round(st.flurryMul * 100)}%${st.spin ? ", all around" : ""})`, `その間にクリックで確定会心${cuts}連斬り（${Math.round(st.flurryMul * 100)}%${st.spin ? "、全周" : ""}）`),
  ];
  if (st.throws) parts.push(c(`그림자 칼 ${st.throws}개를 같이 던짐`, `also throws ${st.throws} shadow knives`, `影の刃${st.throws}本も投げる`));
  if (st.venom) parts.push(c("찍을 때마다 독", "poisons on hit", "突くたびに毒"));
  if (st.burst) parts.push(c("마지막 베기 뒤 검은 달이 터짐", "a black moon bursts after the last slash", "最後の斬撃の後に黒い月が弾ける"));
  return parts.map((p) => p[lang]).join(" · ");
}

export const RM_PASSIVE_NAMES: Record<RmPassive & PassiveId, Names> = {
  rmStep: c("그림자 걸음", "Shadow Step", "影歩き"),
  rmBackstab: c("등 뒤의 칼", "Knife in the Back", "背中の刃"),
  rmExecute: c("처형", "Execution", "処刑"),
  rmEcho: c("겹친 칼", "Layered Blades", "重なる刃"),
  rmVanish: c("사라짐", "Vanish", "消失"),
  rmBlood: c("피의 칼날", "Bloody Edge", "血の刃"),
  rmHaste: c("그림자 손놀림", "Shadow Hands", "影の手さばき"),
  rmSwift: c("소리 없는 발", "Silent Feet", "音なき足"),
  rmFrenzy: c("연쇄 처형", "Chain Execution", "連鎖処刑"),
  rmShroud: c("그림자 장막", "Shadow Veil", "影の帳"),
};

export const RM_EFFECTS: Partial<Record<RmPassive & PassiveId, Names>> = {
  rmStep: c("슬로우모션 +{ticks:sec}초", "Slow motion +{ticks:sec}s", "スローモーション+{ticks:sec}秒"),
  rmBackstab: c("연속 베기 피해 +{add:pct}%", "Slash flurry damage +{add:pct}%", "連斬りのダメージ+{add:pct}%"),
  rmExecute: c("체력 {hp:pct}% 이하 적에게 피해 +{mul:up}%", "+{mul:up}% damage to foes under {hp:pct}% HP", "体力{hp:pct}%以下の敵へダメージ+{mul:up}%"),
  rmEcho: c("연속 베기 +{n}번", "Slash flurry +{n} cut", "連斬り+{n}回"),
  rmVanish: c("대시로 피하면 체력 {heal} 회복", "Dash-dodging heals {heal} HP", "ダッシュで避けると体力{heal}回復"),
  rmBlood: c("벨 때 출혈", "Cuts cause bleeding", "斬ると出血"),
  rmFrenzy: c("연속 베기로 적을 쓰러뜨리면 대시 대기가 바로 끝남", "Flurry kills reset the dash cooldown", "連斬りで敵を倒すとダッシュの待ち時間がすぐ終わる"),
  rmShroud: c("대시로 피하면 둘레 적이 {ticks:sec}초 멈춤", "Dash-dodging freezes nearby foes for {ticks:sec}s", "ダッシュで避けると周りの敵が{ticks:sec}秒止まる"),
};
