// 사멸(헬리오스) 글자 (한·영·일): 독침 이름 · 던지는 모양 설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsSamyeol·SAMYEOL_PERKS와 맞춤)
import type { Lang } from "../index";
import type { NeedleStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type SamyeolWeapon = "tangNeedle" | "stormNeedles" | "lotusNeedles" | "threadNeedle" | "fanNeedles" | "chainNeedles" | "mistNeedles" | "soulNeedle" | "scorpionNeedles" | "thousandNeedles";
type SamyeolPassive = "smVenom" | "smReaper" | "smMist" | "smCloud" | "smMore" | "smPierce" | "smSilk" | "smKiss" | "smTang" | "smBloom";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const SAMYEOL_WEAPON_NAMES: Record<SamyeolWeapon & WeaponId, Names> = {
  tangNeedle: c("당가 독침", "Tang Needles", "唐家の毒針"),
  stormNeedles: c("폭우침", "Needle Storm", "暴雨針"),
  lotusNeedles: c("연화침", "Lotus Needles", "蓮華針"),
  threadNeedle: c("실침", "Thread Needle", "糸針"),
  fanNeedles: c("부채침", "Fan of Needles", "扇針"),
  chainNeedles: c("연사침", "Needle Volley", "連射針"),
  mistNeedles: c("안개침", "Mist Needles", "霧針"),
  soulNeedle: c("혼침", "Soul Needle", "魂針"),
  scorpionNeedles: c("전갈침", "Scorpion Needles", "蠍針"),
  thousandNeedles: c("만천화우", "Rain of a Thousand Flowers", "満天花雨"),
};

/** 독침 설명: 몇 개를 어떤 모양으로 + 더하는 것 */
export function needleDesc(st: NeedleStyle, lang: Lang): string {
  const n = st.n;
  const shape: Record<NeedleStyle["pattern"], Names> = {
    fan: c(`침 ${n}개를 부채꼴로`, `${n} needles in a fan`, `針${n}本を扇状に`),
    ring: c(`침 ${n}개를 사방으로`, `${n} needles in every direction`, `針${n}本を四方へ`),
    rain: c(`침 ${n}개를 앞으로 흩뿌림`, `scatters ${n} needles ahead`, `針${n}本を前方へばらまく`),
    volley: c(`침 ${n}개를 잇따라`, `${n} needles in quick succession`, `針${n}本を連続で`),
    line: c("모두 꿰뚫는 침 하나", "one needle that pierces everything", "すべて貫く針1本"),
  };
  const parts: Names[] = [shape[st.pattern], c("맞으면 독 + 죽음", "each hit inflicts poison and death", "当たると毒＋死")];
  if (st.plusFan) parts.push(c(`앞으로 ${st.plusFan}개 더`, `plus ${st.plusFan} forward`, `前方へさらに${st.plusFan}本`));
  if (st.doom) parts.push(c(`죽음 ${st.doom}배`, `death ×${st.doom}`, `死${st.doom}倍`));
  if (st.venom) parts.push(c(`독 ${st.venom}배`, `poison ×${st.venom}`, `毒${st.venom}倍`));
  if (st.slow) parts.push(c("맞으면 느려짐", "slows on hit", "当たると鈍化"));
  if (st.mist) parts.push(c("던질 때 겨눈 곳에 독가스", "poison gas blooms where you aim", "投げると狙った所に毒ガス"));
  parts.push(c("침 30개마다 독가스 (최대 6)", "poison gas every 30 needles (max 6)", "針30本ごとに毒ガス（最大6）"));
  return parts.map((p) => p[lang]).join(" · ");
}

export const SAMYEOL_PASSIVE_NAMES: Record<SamyeolPassive & PassiveId, Names> = {
  smVenom: c("당가 비독", "Tang Secret Venom", "唐家の秘毒"),
  smReaper: c("저승 꽃", "Underworld Blossom", "冥府の花"),
  smMist: c("짙은 안개", "Dense Mist", "濃い霧"),
  smCloud: c("퍼지는 독무", "Spreading Miasma", "広がる毒霧"),
  smMore: c("소매 속 침", "Needles up the Sleeve", "袖の中の針"),
  smPierce: c("관통침", "Piercing Needles", "貫通針"),
  smSilk: c("비단 옷", "Silk Robe", "絹の衣"),
  smKiss: c("독의 입맞춤", "Venom Kiss", "毒の口づけ"),
  smTang: c("당가의 비전", "Tang Clan Secret Art", "唐家の秘伝"),
  smBloom: c("독꽃", "Poison Bloom", "毒花"),
};

export const SAMYEOL_EFFECTS: Partial<Record<SamyeolPassive & PassiveId, Names>> = {
  smVenom: c("독 피해 +{mul:up}%", "Poison damage +{mul:up}%", "毒ダメージ+{mul:up}%"),
  smReaper: c("죽음 피해 +{mul:up}%", "Death damage +{mul:up}%", "死ダメージ+{mul:up}%"),
  smMist: c("침 {every}개마다 독가스", "Poison gas every {every} needles", "針{every}本ごとに毒ガス"),
  smCloud: c("독가스 범위 +{r:up}%, {dur:up}% 오래", "Poison gas +{r:up}% wider, lasts {dur:up}% longer", "毒ガスの範囲+{r:up}%、{dur:up}%長く"),
  smMore: c("한 번에 침 +{n}", "+{n} needles per throw", "1回の針+{n}"),
  smPierce: c("침이 적 {n}명을 더 꿰뚫음", "Needles pierce {n} more foe", "針が敵を{n}体多く貫く"),
  smSilk: c("독가스 안에서 받는 피해 -{taken:down}%", "Damage taken -{taken:down}% inside poison gas", "毒ガスの中で被ダメージ-{taken:down}%"),
  smKiss: c("독·죽음에 걸린 적을 쓰러뜨리면 체력 {heal} 회복", "Heal {heal} HP when a poisoned or doomed foe falls", "毒・死の敵を倒すと体力{heal}回復"),
  smBloom: c("독에 걸린 적이 쓰러지면 그 자리에 독가스", "Poisoned foes leave poison gas where they fall", "毒の敵が倒れるとその場に毒ガス"),
};
