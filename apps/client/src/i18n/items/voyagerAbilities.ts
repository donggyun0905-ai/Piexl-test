// 운명의 여행자 능력 36칸 이름 · 버프·기술·능력 종류별 설명 (한·영·일, 값은 shared voyagerFates.FATES에서 채움)
import { FATES, type AbilityKind, type BuffKind, type SkillKind } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import { BUFF_NAMES, SKILL_NAMES } from "./voyagerFates";

type Row = readonly [ko: string, en: string, ja: string];
const L = { ko: 0, en: 1, ja: 2 } as const satisfies Record<Lang, number>;

export const ABILITY_NAMES: readonly Row[] = [
  ["작은 쪽배", "Little Skiff", "小舟"],
  ["바다 신의 파도", "Sea God's Wave", "海神の波"],
  ["소용돌이", "Maelstrom", "大渦"],
  ["세이렌의 노래", "Siren Song", "セイレーンの歌"],
  ["돌고래", "Dolphin", "イルカ"],
  ["거대한 전함", "Great Warship", "巨大な軍船"],
  ["바람의 자루", "Bag of Winds", "風の袋"],
  ["날개 달린 신발", "Winged Sandals", "翼のサンダル"],
  ["빠른 걸음", "Swift Stride", "速い足取り"],
  ["폭풍 구름", "Storm Cloud", "嵐雲"],
  ["바람의 방패", "Wind Shield", "風の盾"],
  ["거대 회오리", "Great Cyclone", "巨大竜巻"],
  ["거인의 바위", "Giant's Boulder", "巨人の岩"],
  ["바다 괴물의 촉수", "Sea Beast's Tentacle", "海の怪物の触手"],
  ["돼지 마법", "Swine Spell", "豚の魔法"],
  ["세이렌의 합창", "Siren Chorus", "セイレーンの合唱"],
  ["로토스 향기", "Lotus Scent", "ロートスの香り"],
  ["그림자 사냥개", "Shadow Hound", "影の猟犬"],
  ["지혜의 올빼미", "Owl of Wisdom", "知恵のフクロウ"],
  ["천둥 번개", "Thunderbolt", "雷霆"],
  ["태양 마차의 불꽃", "Sun Chariot's Flame", "太陽の戦車の炎"],
  ["저승의 망령", "Underworld Shades", "冥界の亡霊"],
  ["올림포스의 가호", "Olympian Aegis", "オリュンポスの加護"],
  ["요정의 섬", "Nymph's Island", "妖精の島"],
  ["병사들", "Soldiers", "兵士たち"],
  ["방패 벽", "Shield Wall", "盾の壁"],
  ["나무 목마", "Wooden Horse", "木馬"],
  ["병사 행렬", "Marching Soldiers", "兵士の行列"],
  ["전리품 자루", "Sack of Spoils", "戦利品の袋"],
  ["개선 행진", "Triumphal March", "凱旋行進"],
  ["충견", "Loyal Hound", "忠犬"],
  ["기다림", "Patient Waiting", "待ち続ける心"],
  ["올리브 그늘", "Olive Shade", "オリーブの木陰"],
  ["활 시위 시험", "Trial of the Bow", "弓の試練"],
  ["신들의 전령", "Messenger of the Gods", "神々の使者"],
  ["신들의 축복", "Blessing of the Gods", "神々の祝福"],
];

const pct = (v: number) => Math.round(v * 100);
const BUFF_DESC: Record<BuffKind, (v: number) => Row> = {
  mul: (v) => [`한 발 피해 ×${v}`, `Shot damage ×${v}`, `一発のダメージ×${v}`],
  crit: (v) => [`${pct(v)}% 확률로 3배`, `${pct(v)}% chance for ×3`, `${pct(v)}%で3倍`],
  quick: (v) => [`모으는 시간 ×${v}`, `Charge time ×${v}`, `溜め時間×${v}`],
  pierce: (v) => [`관통 +${v}`, `Pierce +${v}`, `貫通+${v}`],
  giant: (v) => [`화살 크기 ×${v} · 피해 +30%`, `Arrow size ×${v} · +30% damage`, `矢の大きさ×${v} · ダメージ+30%`],
  execute: (v) => [`체력 ${pct(v)}% 아래 보통 적은 끝`, `Normal foes below ${pct(v)}% HP are finished`, `体力${pct(v)}%未満の普通の敵は即終わり`],
  boss: (v) => [`보스에게 ×${v}`, `×${v} against bosses`, `ボスに×${v}`],
  blast: (v) => [`맞으면 터짐 (범위 ${v})`, `Explodes on hit (radius ${v})`, `当たると爆発（範囲${v}）`],
  shred: (v) => [`맞은 적은 5초간 내 화살에 +${pct(v)}%`, `Hit foes take +${pct(v)}% from you for 5s`, `当たった敵は5秒間+${pct(v)}%`],
  leech: (v) => [`준 피해의 ${pct(v)}% 회복`, `Heal ${pct(v)}% of damage dealt`, `与ダメージの${pct(v)}%回復`],
  stun: (v) => [`맞은 적 ${v / 60}초 기절`, `Stuns for ${v / 60}s`, `${v / 60}秒気絶`],
  first: (v) => [`운명이 바뀐 뒤 첫 발 ×${v}`, `First shot after each flip ×${v}`, `運命が変わった後の最初の一発×${v}`],
};
const SKILL_DESC: Record<SkillKind, (n: number) => Row> = {
  homing: (n) => [`유도 화살 ${n}발`, `${n} homing arrows`, `誘導の矢${n}本`],
  curve: (n) => [`양옆으로 휘었다가 적에게 꺾이는 화살 ${n}발`, `${n} arrows curving in from the sides`, `左右に曲がって敵へ向かう矢${n}本`],
  fan: (n) => [`부채꼴로 ${n}발`, `${n} arrows in a fan`, `扇形に${n}本`],
  giant: () => ["모든 것을 꿰뚫는 거대한 마력 화살", "A giant mana arrow piercing everything", "全てを貫く巨大な魔力の矢"],
  rain: (n) => [`적 머리 위로 화살비 ${n}곳`, `Arrow rain on ${n} spots`, `敵の頭上に矢の雨${n}か所`],
  bounce: (n) => [`벽에 ${n}번 튕김`, `Bounces off walls ${n} times`, `壁で${n}回跳ねる`],
  back: () => ["끝까지 날아갔다가 되돌아오며 꿰뚫음", "Flies out and returns, piercing", "飛んで戻りながら貫く"],
  split: (n) => [`맞으면 갈라짐 (관통 ${n - 1})`, `Splits on hit (pierce ${n - 1})`, `当たると分裂（貫通${n - 1}）`],
  beam: (n) => [`방 끝까지 빛줄기 (굵기 ×${n})`, `A beam across the room (width ×${n})`, `部屋の端まで光の筋（太さ×${n}）`],
  chain: (n) => [`맞으면 번개가 ${n}번 옮겨 붙음`, `Lightning chains ${n} times on hit`, `当たると雷が${n}回連鎖`],
  ring: (n) => [`사방으로 ${n}발`, `${n} arrows all around`, `四方に${n}本`],
  volley: (n) => [`${n}발 잇따라`, `${n} arrows in a row`, `${n}本連続`],
  meteor: (n) => [`적에게 운석 ${n}개`, `${n} meteors on foes`, `敵に隕石${n}個`],
  cross: () => ["십자로 네 발 (유도)", "Four homing arrows in a cross", "十字に4本（誘導）"],
  ghost: () => ["벽을 지나 쫓아가는 유령 화살", "A ghost arrow that passes walls and chases", "壁を抜けて追う幽霊の矢"],
  seek: (n) => [`끝까지 쫓아가는 작은 화살 ${n}발`, `${n} small seeking arrows`, `どこまでも追う小さな矢${n}本`],
  twin: (n) => [`나란히 ${n}발`, `${n} parallel arrows`, `並んで${n}本`],
  wave: () => ["느리게 하는 넓은 물결", "A wide slowing wave", "鈍らせる広い波"],
  snipe: (n) => [`아주 빠르고 멀리 가는 저격 ×${n}`, `A very fast, long snipe ×${n}`, `とても速く遠くへの狙撃×${n}`],
  spiral: (n) => [`사방으로 퍼졌다가 적에게 꺾이는 ${n}발`, `${n} arrows spiral out then turn on foes`, `四方に広がり敵へ曲がる${n}本`],
};
const ABILITY_DESC: Record<AbilityKind, (v: number) => Row> = {
  ship: (v) => [`4초마다 배가 방을 가로지름 (${pct(v)}%)`, `Every 4s a ship sails across (${pct(v)}%)`, `4秒ごとに船が横切る（${pct(v)}%）`],
  soldiers: (v) => [`1.5초마다 병사 ${v}명이 창을 던짐`, `Every 1.5s ${v} soldiers throw spears`, `1.5秒ごとに兵士${v}人が槍を投げる`],
  wind: (v) => [`3초마다 바람이 적을 ${v}만큼 밀어냄`, `Every 3s wind pushes foes ${v}`, `3秒ごとに風が敵を${v}押し出す`],
  shield: (v) => [`5초마다 보호막 +${v}`, `Shield +${v} every 5s`, `5秒ごとにシールド+${v}`],
  regen: (v) => [`1초마다 체력 +${v}`, `+${v} HP per second`, `1秒ごとに体力+${v}`],
  siren: (v) => [`6초마다 보통 적 모두 ${(30 + 60 * v) / 60}초 기절`, `Every 6s stuns normal foes ${(30 + 60 * v) / 60}s`, `6秒ごとに普通の敵を${(30 + 60 * v) / 60}秒気絶`],
  boulder: (v) => [`3초마다 거대한 바위 (${pct(v)}%)`, `A huge boulder every 3s (${pct(v)}%)`, `3秒ごとに巨大な岩（${pct(v)}%）`],
  wave: (v) => [`5초마다 파도가 모든 적을 덮침 (${pct(v)}%)`, `Every 5s a wave hits all foes (${pct(v)}%)`, `5秒ごとに波が全ての敵を襲う（${pct(v)}%）`],
  whirl: (v) => [`둘레 적을 끌어당기며 0.5초마다 ${pct(v)}%`, `Pulls nearby foes, ${pct(v)}% every 0.5s`, `周りの敵を引き寄せ0.5秒ごとに${pct(v)}%`],
  swift: (v) => [`이동 속도 ×${v}`, `Move speed ×${v}`, `移動速度×${v}`],
  gold: (v) => [`처치마다 돈 +${v}`, `+${v} gold per kill`, `撃破ごとにお金+${v}`],
  dog: (v) => [`가까운 적을 물어뜯음 (${pct(v)}%)`, `Bites nearby foes (${pct(v)}%)`, `近くの敵に噛みつく（${pct(v)}%）`],
  bolt: (v) => [`2초마다 번개 (${pct(v)}%)`, `Lightning every 2s (${pct(v)}%)`, `2秒ごとに雷（${pct(v)}%）`],
  pig: () => ["4초마다 적 하나를 돼지로 (3초 기절 · 내 화살 2배)", "Every 4s turns a foe into a pig (3s stun · ×2 from you)", "4秒ごとに敵を豚に（3秒気絶 · 自分の矢2倍）"],
  calypso: (v) => [`10초마다 ${1.5 * v}초 무적`, `${1.5 * v}s invincible every 10s`, `10秒ごとに${1.5 * v}秒無敵`],
  owl: (v) => [`화살 피해 ×${v}`, `Arrow damage ×${v}`, `矢のダメージ×${v}`],
  horse: () => ["10초마다 목마가 터지며 창이 사방으로", "Every 10s a wooden horse bursts, spears flying", "10秒ごとに木馬が弾け槍が四方へ"],
  lotus: () => ["둘레 적이 느려짐", "Nearby foes slow down", "周りの敵が遅くなる"],
  hermes: (v) => [`대시가 ${v + 1}배 빨리 돌아옴`, `Dash recharges ×${v + 1} faster`, `ダッシュが${v + 1}倍速く戻る`],
  shade: (v) => [`처치마다 망령 ${v}이 적을 쫓음`, `Each kill sends ${v} shade(s) hunting`, `撃破ごとに亡霊${v}体が敵を追う`],
  sun: (v) => [`2초마다 둘레가 불탐 (${pct(v)}%)`, `Flames around you every 2s (${pct(v)}%)`, `2秒ごとに周りが燃える（${pct(v)}%）`],
  gods: () => ["번개 · 배 · 보호막이 함께", "Lightning, ships and shields together", "雷・船・シールドが共に"],
};

/** 운명 한 칸의 이름·설명 (버프 · 기술 · 능력) */
export function fateParts(i: number, lang: Lang): { name: string; desc: string }[] {
  const f = FATES[i]!;
  const l = L[lang];
  return [
    { name: BUFF_NAMES[i]![l], desc: BUFF_DESC[f.buff[0]](f.buff[1])[l] },
    { name: SKILL_NAMES[i]![l], desc: SKILL_DESC[f.skill[0]](f.skill[1])[l] },
    { name: ABILITY_NAMES[i]![l], desc: ABILITY_DESC[f.ability[0]](f.ability[1])[l] },
  ];
}
