// 성국 유리엘 글자 (한·영·일): 성수 수정구 & 집행의 철퇴 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsYuriel·YURIEL_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type YrPassive =
  | "yrInquest" | "yrPyre" | "yrBloom" | "yrStigma" | "yrNoMercy" | "yrHeavy" | "yrChain" | "yrWrist" | "yrBaptism" | "yrVerdict"
  | "yrSanct" | "yrBulwark" | "yrVigil" | "yrThorn" | "yrGuard" | "yrTouch" | "yrOrb" | "yrGrace" | "yrHeaven" | "yrPrayer";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const YR_WEAPON_NAMES: Record<"yrFlail" & WeaponId, Names> = {
  yrFlail: c("성수 수정구 & 집행의 철퇴", "Holy Water Orb & Flail of Execution", "聖水の水晶球＆執行の鉄槌"),
};

export const YR_PASSIVE_NAMES: Record<YrPassive & PassiveId, Names> = {
  yrInquest: c("이단 심문", "Inquisition", "異端審問"),
  yrPyre: c("정화의 불길", "Purifying Pyre", "浄化の炎"),
  yrBloom: c("넓은 정화", "Wide Purge", "広がる浄化"),
  yrStigma: c("죄의 낙인", "Stigma of Sin", "罪の烙印"),
  yrNoMercy: c("자비 없음", "No Mercy", "慈悲なし"),
  yrHeavy: c("무거운 철퇴", "Heavy Flail", "重い鉄槌"),
  yrChain: c("긴 사슬", "Long Chain", "長い鎖"),
  yrWrist: c("집행자의 손목", "Executioner's Wrist", "執行者の手首"),
  yrBaptism: c("성수 세례", "Holy Baptism", "聖水の洗礼"),
  yrVerdict: c("집행의 무게", "Weight of Verdict", "執行の重み"),
  yrSanct: c("넓은 성역", "Wide Sanctuary", "広い聖域"),
  yrBulwark: c("굳건한 결계", "Steadfast Ward", "堅固な結界"),
  yrVigil: c("영원한 기도", "Eternal Vigil", "永遠の祈り"),
  yrThorn: c("빛의 가시", "Thorns of Light", "光の棘"),
  yrGuard: c("성국의 수호자", "Guardian of the Kingdom", "聖国の守護者"),
  yrTouch: c("성녀의 손길", "Saint's Touch", "聖女の手"),
  yrOrb: c("성수 수정구", "Holy Water Orb", "聖水の水晶球"),
  yrGrace: c("넘치는 은총", "Overflowing Grace", "溢れる恩寵"),
  yrHeaven: c("천상의 철퇴", "Heavenly Flail", "天上の鉄槌"),
  yrPrayer: c("경건한 기도", "Devout Prayer", "敬虔な祈り"),
};

export const YR_EFFECTS: Partial<Record<YrPassive & PassiveId, Names>> = {
  yrInquest: c("맞힐 때 {chance:pct}% 확률로 단죄 하나 더", "{chance:pct}% chance to add one more Sin on hit", "命中時{chance:pct}%の確率で断罪をもう1つ"),
  yrPyre: c("정화의 빛 피해 {mul}배", "{mul}x Purging Light damage", "浄化の光のダメージ{mul}倍"),
  yrBloom: c("정화의 빛이 터지는 범위 {r}배", "Purging Light bursts {r}x wider", "浄化の光の範囲{r}倍"),
  yrStigma: c("단죄 하나마다 적이 받는 피해 +{taken:pct}%", "+{taken:pct}% damage taken per Sin on a foe", "断罪1つごとに敵の被ダメージ+{taken:pct}%"),
  yrNoMercy: c("정화의 빛에 맞은 적 {stun:sec}초 기절", "Foes hit by Purging Light are stunned {stun:sec}s", "浄化の光を受けた敵が{stun:sec}秒気絶"),
  yrHeavy: c("1·2타 철퇴 피해 {mul}배", "{mul}x damage on swings 1 and 2", "1・2撃目の鉄槌ダメージ{mul}倍"),
  yrChain: c("사슬 철퇴 한 바퀴 범위 {r}배", "Chain spin {r}x wider", "鎖の一回転の範囲{r}倍"),
  yrWrist: c("1·2타가 더 넓은 부채꼴", "Swings 1 and 2 cover a wider arc", "1・2撃目がより広い扇形"),
  yrBaptism: c("3타에 맞은 적에게 단죄 {more}개 더", "Spin adds {more} more Sin", "3撃目で断罪を{more}つ多く"),
  yrVerdict: c("집행의 철퇴 범위 {r}배 · 기절 {stun}배", "Flail of Execution {r}x area · {stun}x stun", "執行の鉄槌の範囲{r}倍・気絶{stun}倍"),
  yrSanct: c("결계 범위 {r}배", "{r}x ward radius", "結界の範囲{r}倍"),
  yrBulwark: c("결계 안에서 받는 피해 -{taken:down}% (원래 30%)", "-{taken:down}% damage taken inside a ward (was 30%)", "結界の中で受けるダメージ-{taken:down}%（元30%）"),
  yrVigil: c("수호 결계 +{more:sec}초", "Guardian Ward lasts +{more:sec}s", "守護結界+{more:sec}秒"),
  yrThorn: c("결계 안 적이 더 자주 빛 피해 (간격 {every}배)", "Foes inside a ward take light damage more often ({every}x interval)", "結界の中の敵がより頻繁に光ダメージ（間隔{every}倍）"),
  yrGuard: c("방에 들어서면 최대 체력 {shield:pct}% 보호막", "Gain a shield of {shield:pct}% max HP on entering a room", "部屋に入るとき最大体力{shield:pct}%のシールド"),
  yrTouch: c("유리엘의 모든 회복 {heal}배", "{heal}x all of Yuriel's healing", "ユリエルの全回復{heal}倍"),
  yrOrb: c("정화의 빛 대기 -{cd:down}% · 범위 {r}배", "-{cd:down}% Light of Purification cooldown · {r}x area", "浄化の光の待機-{cd:down}%・範囲{r}倍"),
  yrGrace: c("넘친 회복의 {keep:pct}%를 보호막으로 (최대 체력 {cap:pct}%까지)", "{keep:pct}% of overhealing becomes a shield (up to {cap:pct}% max HP)", "溢れた回復の{keep:pct}%をシールドに（最大体力{cap:pct}%まで）"),
  yrHeaven: c("성녀의 단죄 피해 {mul}배 · 성녀 강림 +{more:sec}초", "{mul}x Saint's Judgment damage · Saint's Descent +{more:sec}s", "聖女の断罪ダメージ{mul}倍・聖女降臨+{more:sec}秒"),
  yrPrayer: c("모든 스킬 대기 -{cd:down}%", "-{cd:down}% all skill cooldowns", "全スキル待機-{cd:down}%"),
};
