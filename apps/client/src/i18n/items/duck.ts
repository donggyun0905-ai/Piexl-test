// 오리(히든) 글자 (한·영·일): 무기 이름 · 무기 설명(꽥 방식과 새끼 오리) · 전용 아이템 이름·효과 (수치는 weaponsDuck·DUCK_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export type DuckWeapon = "rubberDuck" | "megaphone" | "featherFan" | "goldenEgg" | "motherDuck" | "puddleStomp" | "thunderQuack" | "swanSong" | "bubbleQuack" | "crownDuck";
type DuckPassive = "extraDuckling" | "loudQuack" | "goldenFeather" | "duckWalk" | "bigQuack" | "duckFamily" | "breadSnack" | "echoQuack" | "featherShield" | "braveDuckling";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const DUCK_WEAPON_NAMES: Record<DuckWeapon & WeaponId, Names> = {
  rubberDuck: c("고무 오리", "Rubber Duck", "ゴムのアヒル"),
  megaphone: c("확성기", "Megaphone", "拡声器"),
  featherFan: c("깃털 부채", "Feather Fan", "羽根の扇"),
  goldenEgg: c("황금알", "Golden Egg", "金の卵"),
  motherDuck: c("엄마 오리", "Mother Duck", "母アヒル"),
  puddleStomp: c("물웅덩이", "Puddle Stomp", "水たまり"),
  thunderQuack: c("천둥 꽥", "Thunder Quack", "雷のガーガー"),
  swanSong: c("백조의 노래", "Swan Song", "白鳥の歌"),
  bubbleQuack: c("거품 꽥", "Bubble Quack", "泡のガーガー"),
  crownDuck: c("왕관 오리", "Crowned Duck", "王冠のアヒル"),
};

/** 새끼 오리 n마리 */
const kids = (n: number) => c(`새끼 오리 ${n}마리`, `${n} ducklings`, `子アヒル${n}羽`);
const d = (ko: string, en: string, ja: string, n = 2): Names => {
  const k = kids(n);
  return c(`${ko} · ${k.ko}`, `${en} · ${k.en}`, `${ja} · ${k.ja}`);
};

export const DUCK_DESC: Record<DuckWeapon, Names> = {
  rubberDuck: d("앞쪽 부채꼴로 꽥, 맞은 적을 밀어냄", "Quacks in a cone, pushing foes back", "前方に扇形のガーガー、当たった敵を押し返す"),
  megaphone: d("좁고 멀리 가는 꽥", "A narrow quack that reaches far", "細く遠くまで届くガーガー"),
  featherFan: d("깃털 5개를 부채꼴로 날림", "Throws 5 feathers in a fan", "羽根5枚を扇形に飛ばす"),
  goldenEgg: d("가까운 적에게 황금알을 던져 크게 터뜨림", "Lobs a golden egg at a nearby foe for a big blast", "近くの敵に金の卵を投げて大きく爆発"),
  motherDuck: d("꽥은 약하지만 새끼가 많음", "Weak quacks, but lots of ducklings", "ガーガーは弱いが子だくさん", 6),
  puddleStomp: d("둘레 전체에 물보라, 맞은 적 1초 느려짐", "Splashes all around; hit foes are slowed for 1s", "周り全体に水しぶき、当たった敵は1秒遅くなる"),
  thunderQuack: d("2번째마다 큰 꽥", "A Big Quack every 2nd quack", "2回ごとに大ガーガー"),
  swanSong: d("체력이 낮을수록 피해 증가 (최대 2배)", "Deals more damage the lower your HP (up to ×2)", "体力が低いほどダメージ増加（最大2倍）"),
  bubbleQuack: d("느린 거품이 적에 닿으면 터짐", "Slow bubbles that pop on contact", "遅い泡が敵に触れると弾ける", 3),
  crownDuck: d("세고 넓은 꽥, 3번째마다 큰 꽥", "Strong, wide quacks; a Big Quack every 3rd", "強く広いガーガー、3回ごとに大ガーガー", 4),
};

export const DUCK_PASSIVE_NAMES: Record<DuckPassive & PassiveId, Names> = {
  extraDuckling: c("새끼 오리", "Duckling", "子アヒル"),
  loudQuack: c("우렁찬 꽥", "Loud Quack", "大声ガーガー"),
  goldenFeather: c("황금 깃털", "Golden Feather", "金の羽根"),
  duckWalk: c("뒤뚱 걸음", "Duck Waddle", "よちよち歩き"),
  bigQuack: c("큰 꽥 연습", "Big Quack Practice", "大ガーガーの練習"),
  duckFamily: c("오리 가족", "Duck Family", "アヒル一家"),
  breadSnack: c("빵 간식", "Bread Snack", "パンのおやつ"),
  echoQuack: c("메아리", "Echo", "こだま"),
  featherShield: c("깃털 방패", "Feather Shield", "羽根の盾"),
  braveDuckling: c("용감한 새끼", "Brave Duckling", "勇敢な子アヒル"),
};

export const DUCK_EFFECTS: Partial<Record<DuckPassive & PassiveId, Names>> = {
  extraDuckling: c("새끼 오리 +1 (여러 개 가질 수 있음)", "+1 duckling (stacks)", "子アヒル+1（複数持てる）"),
  bigQuack: c("큰 꽥이 {every}번 더 자주 (최소 2번째마다), 큰 꽥 피해 +{damage:up}%", "Big Quack comes {every} quack sooner (at least every 2nd), +{damage:up}% Big Quack damage", "大ガーガーが{every}回早く（最低2回ごと）、大ガーガーのダメージ+{damage:up}%"),
  duckFamily: c("새끼 오리 한 마리당 피해 +{per:pct}%", "+{per:pct}% damage per duckling", "子アヒル1羽ごとにダメージ+{per:pct}%"),
  breadSnack: c("새끼 오리가 탄을 막을 때마다 체력 {heal} 회복", "Heal {heal} HP whenever a duckling blocks a shot", "子アヒルが弾を防ぐたびに体力{heal}回復"),
  echoQuack: c("새끼 오리 꽥 피해 40% → {echo:pct}%, 범위 +{range:up}%", "Duckling quacks deal {echo:pct}% instead of 40%, +{range:up}% range", "子アヒルのガーガーのダメージ40% → {echo:pct}%、範囲+{range:up}%"),
  featherShield: c("큰 꽥을 하면 보호막 {shield} (최대 체력의 {max:pct}%까지)", "Big Quack grants a {shield} shield (up to {max:pct}% of max HP)", "大ガーガーでシールド{shield}（最大体力の{max:pct}%まで）"),
  braveDuckling: c("새끼 오리가 탄을 막은 뒤 다시 막기까지 1초 → {block:sec}초", "Ducklings can block again after {block:sec}s instead of 1s", "子アヒルが弾を防いでから次に防げるまで1秒 → {block:sec}秒"),
};
