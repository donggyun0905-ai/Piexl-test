// 시즌 2 테라코어 붐버·아티팩터 글자 (한·영·일): 무기 이름 · 터뜨리는 방식 설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsBomber·weaponsArtifacter·*_PERKS와 맞춤)
import type { Lang } from "../index";
import type { BombStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type BombWeapon = "bmGrenade" | "bmSticky" | "bmCluster" | "bmMine" | "bmRocket" | "bmDynamite" | "bmFirework" | "bmNapalm" | "bmChain" | "bmMega";
type TerraPassive = "bmPowder" | "bmWide" | "bmFuse" | "bmMore" | "bmShrapnel" | "bmSuit" | "bmArtist" | "bmEcho" | "bmBurn" | "bmFinale" | "afTattoo" | "afFocus" | "afWide" | "afPush" | "afDouble" | "afCrafter" | "afLucky" | "afBlueprint" | "afShield" | "afSurge" | "afPhoenix" | "afOverdrive" | "afGolem" | "afSingularity" | "afInfinity";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const TERRA2B_WEAPON_NAMES: Record<(BombWeapon | "afRepulsor") & WeaponId, Names> = {
  bmGrenade: c("수류탄", "Grenade", "手榴弾"),
  bmSticky: c("끈끈이 폭탄", "Sticky Bomb", "粘着爆弾"),
  bmCluster: c("집속탄", "Cluster Bomb", "クラスター爆弾"),
  bmMine: c("지뢰", "Land Mine", "地雷"),
  bmRocket: c("로켓", "Rocket", "ロケット"),
  bmDynamite: c("다이너마이트", "Dynamite", "ダイナマイト"),
  bmFirework: c("불꽃놀이", "Fireworks", "花火"),
  bmNapalm: c("네이팜", "Napalm", "ナパーム"),
  bmChain: c("연쇄 폭약", "Chain Charge", "連鎖爆薬"),
  bmMega: c("메가 폭탄", "Mega Bomb", "メガ爆弾"),
  afRepulsor: c("리펄스 총", "Repulsor Gun", "リパルスガン"),
};

/** 붐버 무기 설명: 터뜨리는 방식 + 예술 연쇄 */
export function bombDesc(st: BombStyle, lang: Lang): string {
  const n = st.n ?? 0;
  const how: Record<BombStyle["mode"], Names> = {
    lob: c("겨눈 곳에 던져 터뜨림", "thrown where you aim and explodes", "狙った所に投げて爆発"),
    sticky: c("적 몸에 붙어 4.5초 뒤 터짐 · 많이 붙을수록 범위와 힘 증가", "sticks to a foe and blows 4.5s later · more bombs = bigger, stronger blast", "敵の体にくっつき4.5秒後に爆発 · 多く付くほど範囲と威力が増す"),
    cluster: c(`터지며 작은 폭탄 ${n}개가 흩어짐`, `bursts into ${n} bomblets`, `爆発して小型爆弾${n}個が散らばる`),
    mine: c(`적이 없어도 유도 지뢰를 박아 둠 (최대 ${n}) · 적이 오면 눈을 뜨고 달려가 터짐`, `plants homing mines even with no foes (up to ${n}) · they wake, run at foes and explode`, `敵がいなくても誘導地雷を埋める（最大${n}）· 敵が来ると目を開けて走り寄り爆発`),
    rocket: c("늘 쫓아가 맞으면 터짐 · 25% 확률로 등 뒤에서 작은 유도 미사일", "always homes in and explodes · 25% chance of small homing missiles from your back", "常に追尾し当たると爆発 · 25%で背中から小さな誘導ミサイル"),
    fan: c(`${n}개를 부채꼴로 던짐`, `throws ${n} in a fan`, `${n}本を扇状に投げる`),
    firework: c(`하늘로 쏘아 올려 넓게 별처럼 ${n}번 터짐`, `launches skyward and bursts wide ${n} times like stars`, `空へ打ち上げ広く星のように${n}回爆発`),
    napalm: c("화염병처럼 넓게 번지는 불바다 · 불꽃 스택 x1~x5", "a wide, molotov-like sea of flames · flame stacks x1–x5", "火炎瓶のように広がる火の海 · 炎スタックx1〜x5"),
    chain: c(`가까운 적에게 이어서 ${n}번까지 터짐`, `chains to nearby foes up to ${n} times`, `近くの敵へ最大${n}回連鎖爆発`),
    mega: c("아주 느리고 아주 큰 한 방", "very slow, very big blast", "とても遅くとても大きな一発"),
  };
  return [how[st.mode], c(`폭발 반경 ${st.r}`, `blast radius ${st.r}`, `爆発半径${st.r}`), c("잇따라 터지면 예술 연쇄", "consecutive blasts build an Art Chain", "連続爆発で芸術連鎖"), c("폭발에 휘말리면 나도 피해 20", "you take 20 damage if caught in a blast", "爆発に巻き込まれると自分も20ダメージ")].map((p) => p[lang]).join(" · ");
}

/** 리펄스 총 설명 */
export const REPULSOR_DESC: Names = c(
  "푸른 반발탄이 맞은 자리를 터뜨리며 적을 밀어냄 · 쓰러뜨린 적으로 제작 게이지가 차면 아이템을 만듦",
  "blue repulsor shots burst on impact and push foes away · defeated foes fill the craft gauge to make items",
  "青い反発弾が当たった所で弾け敵を押し返す · 倒した敵で製作ゲージが溜まるとアイテムを作る",
);

export const TERRA2B_PASSIVE_NAMES: Record<TerraPassive & PassiveId, Names> = {
  bmPowder: c("화약 증량", "Extra Powder", "火薬増量"),
  bmWide: c("넓은 폭발", "Wide Blast", "広い爆発"),
  bmFuse: c("짧은 도화선", "Short Fuse", "短い導火線"),
  bmMore: c("하나 더", "One More", "もう一つ"),
  bmShrapnel: c("파편", "Shrapnel", "破片"),
  bmSuit: c("방폭복", "Bomb Suit", "防爆服"),
  bmArtist: c("예술가의 혼", "Soul of the Artist", "芸術家の魂"),
  bmEcho: c("여진", "Aftershock", "余震"),
  bmBurn: c("불꽃 예술", "Art of Flame", "炎の芸術"),
  bmFinale: c("피날레", "Grand Finale", "フィナーレ"),
  afTattoo: c("빛나는 문신", "Glowing Tattoo", "光る刺青"),
  afFocus: c("집속 회로", "Focus Circuit", "集束回路"),
  afWide: c("확산 문양", "Spread Glyph", "拡散紋様"),
  afPush: c("강한 반발", "Strong Repulse", "強い反発"),
  afDouble: c("쌍발", "Double Shot", "双発"),
  afCrafter: c("숙련공", "Master Crafter", "熟練工"),
  afLucky: c("행운의 손", "Lucky Hands", "幸運の手"),
  afBlueprint: c("설계도", "Blueprint", "設計図"),
  afShield: c("반발 보호막", "Repulse Shield", "反発シールド"),
  afSurge: c("회로 폭주", "Circuit Surge", "回路暴走"),
  afPhoenix: c("불사의 문신", "Undying Tattoo", "不死の刺青"),
  afOverdrive: c("과부하 문양", "Overdrive Glyph", "過負荷紋様"),
  afGolem: c("수호 골렘 문신", "Golem Ward Tattoo", "守護ゴーレムの刺青"),
  afSingularity: c("특이점", "Singularity", "特異点"),
  afInfinity: c("무한 회로", "Infinity Circuit", "無限回路"),
};

export const TERRA2B_EFFECTS: Partial<Record<TerraPassive & PassiveId, Names>> = {
  bmPowder: c("폭발 피해 +{mul:up}%", "Blast damage +{mul:up}%", "爆発ダメージ+{mul:up}%"),
  bmWide: c("폭발 반경 +{r:up}%", "Blast radius +{r:up}%", "爆発半径+{r:up}%"),
  bmMore: c("한 번에 폭탄 +{n}", "+{n} bomb per throw", "1回の爆弾+{n}"),
  bmShrapnel: c("터질 때 파편 {n}개 (공격력 {mul:pct}%)", "Blasts fling {n} shards ({mul:pct}% damage)", "爆発で破片{n}個（攻撃力{mul:pct}%）"),
  bmSuit: c("받는 피해 -{taken:down}%", "Damage taken -{taken:down}%", "被ダメージ-{taken:down}%"),
  bmArtist: c("예술 연쇄 최대 {max}칸", "Art Chain up to {max} stacks", "芸術連鎖の最大{max}段"),
  bmEcho: c("{chance:pct}% 확률로 같은 자리가 한 번 더 ({mul:pct}%)", "{chance:pct}% chance the spot blows again ({mul:pct}%)", "{chance:pct}%で同じ所がもう一度（{mul:pct}%）"),
  bmBurn: c("모든 폭발이 불태움", "Every blast sets foes on fire", "すべての爆発が燃やす"),
  bmFinale: c("터져 쓰러진 적의 여진이 공격력 {mul:pct}%", "Aftershocks from blasted foes deal {mul:pct}% damage", "爆発で倒れた敵の余震が攻撃力{mul:pct}%"),
  afFocus: c("반발탄 피해 +{mul:up}%", "Repulsor damage +{mul:up}%", "反発弾ダメージ+{mul:up}%"),
  afWide: c("반발 폭발 범위 +{r:up}%", "Repulse blast +{r:up}%", "反発爆発の範囲+{r:up}%"),
  afPush: c("밀침 {push}배 · 맞은 적이 잠깐 멈춤", "Knockback ×{push} · briefly stuns", "押し返し{push}倍 · 当たった敵が少し停止"),
  afDouble: c("반발탄을 두 발", "Fires two repulsor shots", "反発弾を2発"),
  afCrafter: c("제작 게이지가 {mul:up}% 빨리 참", "Craft gauge fills {mul:up}% faster", "製作ゲージが{mul:up}%早く溜まる"),
  afLucky: c("숨겨진 아이템이 나올 확률 {mul}배", "Hidden item chance ×{mul}", "隠しアイテムの確率{mul}倍"),
  afBlueprint: c("제작할 때 아이템 {n}개", "Crafting makes {n} items", "製作でアイテム{n}個"),
  afShield: c("받는 피해 -{taken:down}%", "Damage taken -{taken:down}%", "被ダメージ-{taken:down}%"),
  afSurge: c("제작한 뒤 {ticks:sec}초 동안 공격 속도 +{speed:up}%", "After crafting, +{speed:up}% attack speed for {ticks:sec}s", "製作後{ticks:sec}秒間 攻撃速度+{speed:up}%"),
  afPhoenix: c("(숨겨진 아이템) 한 번 쓰러지면 체력 {hp:pct}%로 되살아남", "(Hidden) Revive once at {hp:pct}% HP", "（隠し）一度だけ体力{hp:pct}%で復活"),
  afOverdrive: c("(숨겨진 아이템) 공격 속도 +40%", "(Hidden) Attack speed +40%", "（隠し）攻撃速度+40%"),
  afGolem: c("(숨겨진 아이템) 받는 피해 -{taken:down}%", "(Hidden) Damage taken -{taken:down}%", "（隠し）被ダメージ-{taken:down}%"),
  afSingularity: c("(숨겨진 아이템) 반발탄이 둘레 적을 끌어당긴 뒤 {r}배 범위로 터짐", "(Hidden) Repulsor shots pull foes in, then burst ×{r} wider", "（隠し）反発弾が周りの敵を引き寄せ{r}倍の範囲で爆発"),
  afInfinity: c("(숨겨진 아이템) 제작 게이지 {mul}배 · 공격력 +5", "(Hidden) Craft gauge ×{mul} · damage +5", "（隠し）製作ゲージ{mul}倍 · 攻撃力+5"),
};
