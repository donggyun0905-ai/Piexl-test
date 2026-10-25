// 소환술사 글자 (한·영·일): 채찍 이름 · 채찍 설명(소환수) · 전용 아이템 이름·효과 (수치는 weaponsSummon·sim/summon·summons·SUMMON_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export type SummonWeapon = "leatherwhip" | "thornwhip" | "chainwhip" | "bonewhip" | "flamewhip" | "vinewhip" | "shadowwhip" | "starwhip" | "stormwhip" | "dragonwhip";
type SummonPassive = "horde" | "oldPact" | "lash" | "soulHarvest" | "empower" | "longWhip" | "sacrifice" | "command" | "bondShield" | "twinSummon";

export const SUMMON_WEAPON_NAMES: Record<SummonWeapon & WeaponId, Names> = {
  leatherwhip: { ko: "가죽 채찍", en: "Leather Whip", ja: "革の鞭" },
  thornwhip: { ko: "가시 채찍", en: "Thorn Whip", ja: "棘の鞭" },
  chainwhip: { ko: "사슬 채찍", en: "Chain Whip", ja: "鎖の鞭" },
  bonewhip: { ko: "뼈 채찍", en: "Bone Whip", ja: "骨の鞭" },
  flamewhip: { ko: "불꽃 채찍", en: "Flame Whip", ja: "炎の鞭" },
  vinewhip: { ko: "덩굴 채찍", en: "Vine Whip", ja: "蔓の鞭" },
  shadowwhip: { ko: "그림자 채찍", en: "Shadow Whip", ja: "影の鞭" },
  starwhip: { ko: "별빛 채찍", en: "Starlight Whip", ja: "星光の鞭" },
  stormwhip: { ko: "폭풍 채찍", en: "Storm Whip", ja: "嵐の鞭" },
  dragonwhip: { ko: "용비늘 채찍", en: "Dragonscale Whip", ja: "竜鱗の鞭" },
};

/** 채찍 설명: 맞힌 적 n명마다 (소환수), 최대 m */
const d = (n: number, m: number, ko: string, en: string, ja: string): Names => ({
  ko: `앞을 길게 채찍질 · 맞힌 적 ${n}명마다 ${ko} 소환 (최대 ${m}, 12초)`,
  en: `Long lash ahead · Every ${n} foes hit summons ${en} (up to ${m}, 12s)`,
  ja: `前方を長く鞭打つ · 当てた敵${n}体ごとに${ja}を召喚（最大${m}、12秒）`,
});

export const SUMMON_DESC: Record<SummonWeapon, Names> = {
  leatherwhip: d(3, 3, "해골 병사(달려가 벰)", "a skeleton soldier (charges in to slash)", "骸骨兵（駆け寄って斬る）"),
  thornwhip: d(3, 3, "임프(거리를 두고 불덩이)", "an imp (hurls fireballs from range)", "インプ（距離を取って火の玉）"),
  chainwhip: d(5, 2, "돌 골렘(느리지만 둘레를 크게 내려침)", "a stone golem (slow, but slams everything around it)", "岩ゴーレム（遅いが周りを大きく叩きつける）"),
  bonewhip: d(3, 3, "해골 궁수(뚫는 화살)", "a skeleton archer (piercing arrows)", "骸骨弓兵（貫く矢）"),
  flamewhip: d(3, 4, "불꽃 정령(달려가 터지고 사라짐)", "a flame spirit (rushes in and explodes)", "炎の精霊（駆け寄って爆発して消える）"),
  vinewhip: d(3, 4, "독버섯(제자리에서 포자, 맞은 적은 느려짐)", "a toadstool (stays put, spores slow foes)", "毒キノコ（その場で胞子、当たった敵は遅くなる）"),
  shadowwhip: d(4, 4, "늑대 둘(빠르게 물어뜯음)", "two wolves (fast bites)", "狼2匹（素早く噛みつく）"),
  starwhip: d(3, 3, "요정(내 둘레를 돌며 유도 별)", "a fairy (circles you, fires homing stars)", "妖精（周りを回って追尾する星）"),
  stormwhip: d(4, 6, "박쥐 셋(아주 빠름)", "three bats (very fast)", "コウモリ3匹（とても速い）"),
  dragonwhip: d(6, 1, "새끼 용(터지는 불덩이)", "a baby dragon (exploding fireballs)", "子竜（爆発する火の玉）"),
};

export const SUMMON_PASSIVE_NAMES: Record<SummonPassive & PassiveId, Names> = {
  horde: { ko: "군단", en: "Horde", ja: "軍団" },
  oldPact: { ko: "오래된 계약", en: "Ancient Pact", ja: "古の契約" },
  lash: { ko: "채찍질", en: "Lash", ja: "鞭撻" },
  soulHarvest: { ko: "영혼 수확", en: "Soul Harvest", ja: "魂の収穫" },
  empower: { ko: "강화 소환", en: "Empowered Summons", ja: "強化召喚" },
  longWhip: { ko: "긴 채찍", en: "Long Whip", ja: "長い鞭" },
  sacrifice: { ko: "희생", en: "Sacrifice", ja: "犠牲" },
  command: { ko: "지휘", en: "Command", ja: "指揮" },
  bondShield: { ko: "계약의 방패", en: "Bond Shield", ja: "契約の盾" },
  twinSummon: { ko: "쌍 소환", en: "Twin Summon", ja: "双召喚" },
};

export const SUMMON_EFFECTS: Record<Exclude<SummonPassive, "longWhip"> & PassiveId, Names> = {
  horde: { ko: "소환수 최대 수 +{stacks}", en: "+{stacks} max summons", ja: "召喚獣の最大数+{stacks}" },
  oldPact: { ko: "소환수가 {mul}배 오래 남음", en: "Summons last {mul}x longer", ja: "召喚獣が{mul}倍長く残る" },
  lash: { ko: "채찍으로 맞힐 때마다 {ticks:sec}초 동안 소환수 공격 속도 +{speed:pct}%", en: "Whip hits give summons +{speed:pct}% attack speed for {ticks:sec}s", ja: "鞭を当てるたびに{ticks:sec}秒間召喚獣の攻撃速度+{speed:pct}%" },
  soulHarvest: { ko: "소환수가 적을 쓰러뜨리면 소환 게이지 +1", en: "Summon kills add 1 to the summon gauge", ja: "召喚獣が敵を倒すと召喚ゲージ+1" },
  empower: { ko: "소환수 피해 +{damage:up}%", en: "Summon damage +{damage:up}%", ja: "召喚獣のダメージ+{damage:up}%" },
  sacrifice: { ko: "소환수가 사라질 때 터짐 (공격력 {damage:pct}%)", en: "Summons explode when they expire ({damage:pct}% damage)", ja: "召喚獣が消える時に爆発（攻撃力{damage:pct}%）" },
  command: { ko: "내 둘레 {radius} 안의 소환수 피해 +{damage:up}%", en: "Summons within {radius} of you deal +{damage:up}% damage", ja: "自分の周り{radius}以内の召喚獣のダメージ+{damage:up}%" },
  bondShield: { ko: "소환수 하나마다 받는 피해 -{taken:pct}% (최대 -{below:pct}%)", en: "-{taken:pct}% damage taken per summon (up to -{below:pct}%)", ja: "召喚獣1体ごとに被ダメージ-{taken:pct}%（最大-{below:pct}%）" },
  twinSummon: { ko: "소환할 때 {chance:pct}% 확률로 하나 더", en: "{chance:pct}% chance to summon one extra", ja: "召喚時{chance:pct}%の確率でもう1体" },
};
