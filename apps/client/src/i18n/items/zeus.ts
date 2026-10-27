// 제우스(히든) 글자 (한·영·일): 번개 무기 이름·설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsZeus·ZEUS_PERKS와 맞춤)
import type { PassiveId, ThunderStyle, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type ZsWeapon = "zsBolt" | "zsSky" | "zsChain" | "zsStorm" | "zsAegis" | "zsEagle" | "zsClap" | "zsSpear" | "zsOrb" | "zsTitan";
type ZsPassive = "zsKing" | "zsCloud" | "zsNectar" | "zsSkyEye" | "zsConductor" | "zsOverload" | "zsWrath" | "zsStep" | "zsRetort" | "zsGiant";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const ZS_WEAPON_NAMES: Record<ZsWeapon & WeaponId, Names> = {
  zsBolt: c("번개창", "Lightning Javelin", "雷の槍"),
  zsSky: c("하늘의 벼락", "Bolt from the Sky", "天の雷"),
  zsChain: c("연쇄 번개", "Chain Lightning", "連鎖する雷"),
  zsStorm: c("폭풍 구름", "Storm Cloud", "嵐の雲"),
  zsAegis: c("아이기스", "Aegis", "アイギス"),
  zsEagle: c("신의 독수리", "Eagle of the Sky King", "天空王の鷲"),
  zsClap: c("천둥소리", "Thunderclap", "雷鳴"),
  zsSpear: c("신의 벼락창", "Divine Thunder Spear", "神の雷槍"),
  zsOrb: c("구전", "Ball Lightning", "球雷"),
  zsTitan: c("거인 사냥", "Titan Hunt", "巨人狩り"),
};

/** 번개 무기 설명 (모양에서 만듦) */
export function zeusDesc(st: ThunderStyle, lang: Lang): string {
  const mode: Record<ThunderStyle["mode"], Names> = {
    javelin: c(`빠른 번개창 · 맞으면 ${st.chains}번 옮겨 붙음`, `fast javelin · chains ${st.chains} times on hit`, `速い雷の槍 · 当たると${st.chains}回連鎖`),
    sky: c("노린 적 머리 위로 벼락이 내리꽂힘 (둘레도)", "a bolt slams down on the target (and around it)", "狙った敵の頭上に雷が落ちる（周りも）"),
    chain: c(`손끝에서 뻗어 적 ${st.chains}을 잇따라 지짐`, `arcs from your hand through ${st.chains} foes`, `指先から伸びて敵${st.chains}体を次々と焼く`),
    storm: c("적 위에 구름을 띄워 3초 동안 벼락이 쏟아짐", "a cloud over foes rains bolts for 3s", "敵の上に雲を浮かべ3秒間雷が降る"),
    aegis: c("신의 방패로 앞을 밀쳐 1초 기절 · 들고 있으면 받는 피해 -25%", "bash ahead with the divine shield, stunning 1s · -25% damage taken while held", "神の盾で前を押しのけ1秒気絶 · 持っている間被ダメージ-25%"),
    eagle: c("독수리가 끝까지 쫓아가 꿰뚫음", "an eagle hunts down and pierces foes", "鷲がどこまでも追って貫く"),
    clap: c("둘레로 천둥 파동 · 맞은 적은 잠깐 멈춤", "a thunder wave around you briefly stops foes", "周りに雷鳴の波 · 当たった敵は一瞬止まる"),
    spear: c("느리지만 방 끝까지 뻗는 거대한 벼락", "slow, but a giant bolt across the whole room", "遅いが部屋の端まで伸びる巨大な雷"),
    orb: c("천천히 떠다니며 둘레 적을 계속 지지는 번개 구슬", "a slow orb that keeps shocking nearby foes", "ゆっくり漂いながら周りの敵を焼き続ける雷の玉"),
    titan: c("보스에게 3배 · 맞힌 자리 둘레로 벼락 셋", "×3 to bosses · three more bolts around the target", "ボスに3倍 · 当てた場所の周りに雷3本"),
  };
  return mode[st.mode][lang];
}

export const ZS_PASSIVE_NAMES: Record<ZsPassive & PassiveId, Names> = {
  zsKing: c("올림포스의 왕", "King of Olympus", "オリュンポスの王"),
  zsCloud: c("구름 타기", "Cloud Rider", "雲乗り"),
  zsNectar: c("신들의 술", "Nectar of the Gods", "神々の酒"),
  zsSkyEye: c("높은 하늘의 눈", "Eye of the High Sky", "高天の眼"),
  zsConductor: c("전도", "Conduction", "伝導"),
  zsOverload: c("과부하", "Overload", "過負荷"),
  zsWrath: c("분노한 신", "Wrathful God", "怒れる神"),
  zsStep: c("번개 걸음", "Lightning Step", "稲妻の歩み"),
  zsRetort: c("신들의 왕의 응징", "Sky King's Retribution", "天空王の報い"),
  zsGiant: c("거인 학살자", "Giant Slayer", "巨人殺し"),
};

export const ZS_EFFECTS: Partial<Record<ZsPassive & PassiveId, Names>> = {
  zsConductor: c("번개가 {n}번 더 옮겨 붙음", "Lightning chains {n} more times", "雷が{n}回多く連鎖"),
  zsOverload: c("감전이 다 쌓인 적은 터지며 둘레를 지짐 (공격력 {mul:pct}%)", "Fully shocked foes burst, shocking those around ({mul:pct}%)", "感電が溜まりきった敵は弾けて周りを焼く（攻撃力{mul:pct}%）"),
  zsWrath: c("천벌 게이지가 {mul}배로 참", "The Wrath gauge fills ×{mul}", "天罰ゲージが{mul}倍で溜まる"),
  zsStep: c("대시한 길의 번개 {mul}배 · 대시하는 동안 무적", "Dash lightning ×{mul} · invincible while dashing", "ダッシュの道の雷{mul}倍 · ダッシュ中無敵"),
  zsRetort: c("맞으면 {chance:pct}% 확률로 적 {n}에게 벼락 (공격력 {mul:pct}%)", "When hit, {chance:pct}% chance to strike {n} foes ({mul:pct}%)", "被弾時{chance:pct}%で敵{n}体に雷（攻撃力{mul:pct}%）"),
  zsGiant: c("보스에게 피해 +{mul:up}%", "+{mul:up}% damage to bosses", "ボスへのダメージ+{mul:up}%"),
};
