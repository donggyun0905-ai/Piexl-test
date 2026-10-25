// 변희(비르디아) 글자 (한·영·일): 동물 무기 이름·설명 · 동물마다 전용 아이템 셋 (수치는 weaponsMorph·MORPH_PERKS와 맞춤)
import type { AnimalKind, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type MorphWeapon = "wolfForm" | "bearForm" | "eagleForm" | "snakeForm" | "boarForm" | "scorpionForm" | "batForm" | "elephantForm" | "spiderForm" | "phoenixForm";
type MorphPassive =
  | "wolfFang" | "wolfPack" | "wolfHowl" | "bearHide" | "bearRage" | "bearQuake" | "eagleEye" | "eagleStorm" | "eagleDive" | "snakeVenom"
  | "snakeCoil" | "snakeSpit" | "boarTusk" | "boarStampede" | "boarMud" | "scorpTail" | "scorpPincer" | "scorpShell" | "batDrain" | "batEcho"
  | "batSwarm" | "eleTrunk" | "eleMammoth" | "eleHerd" | "spiderNest" | "spiderFang" | "spiderBrood" | "phoenixFlare" | "phoenixSun" | "phoenixRebirth";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const MORPH_WEAPON_NAMES: Record<MorphWeapon & WeaponId, Names> = {
  wolfForm: c("늑대", "Wolf", "狼"),
  bearForm: c("곰", "Bear", "熊"),
  eagleForm: c("독수리", "Eagle", "鷲"),
  snakeForm: c("뱀", "Serpent", "蛇"),
  boarForm: c("멧돼지", "Boar", "猪"),
  scorpionForm: c("전갈", "Scorpion", "蠍"),
  batForm: c("박쥐", "Bat", "蝙蝠"),
  elephantForm: c("코끼리", "Elephant", "象"),
  spiderForm: c("거미", "Spider", "蜘蛛"),
  phoenixForm: c("불사조", "Phoenix", "不死鳥"),
};

/** 동물 설명 (무기 설명 뒤에 붙음) */
export const ANIMAL_DESC: Record<AnimalKind, Names> = {
  wolf: c("늑대로 변함: 빠른 물기, 3번째마다 2배로 세게 · 발이 빠름", "Become a wolf: quick bites, every 3rd bite deals double · fast feet", "狼に変身：素早い噛みつき、3回目ごとに2倍・足が速い"),
  bear: c("곰으로 변함: 넓은 앞발 할퀴기, 멀리 밀침 · 느림", "Become a bear: wide paw swipes that knock foes far · slow", "熊に変身：広い前足の引っかき、遠くへ押し飛ばす・遅い"),
  eagle: c("독수리로 변함: 깃털 셋을 날림", "Become an eagle: launch three feathers", "鷲に変身：羽根を三本飛ばす"),
  snake: c("뱀으로 변함: 앞으로 뻗는 독 물기 (한 줄의 적 모두, 3초 중독)", "Become a serpent: a lunging venom bite (hits a whole line, 3s poison)", "蛇に変身：前へ伸びる毒の噛みつき（一列の敵全員、3秒毒）"),
  boar: c("멧돼지로 변함: 앞으로 돌진하며 지나간 적을 들이받음", "Become a boar: charge forward, ramming every foe in the way", "猪に変身：前へ突進し、通り道の敵に体当たり"),
  scorpion: c("전갈로 변함: 멀리 찌르는 꼬리, 맞은 적이 잠깐 멈춤", "Become a scorpion: a long tail sting that briefly stops foes", "蠍に変身：遠くまで刺す尾、当たった敵が少し止まる"),
  bat: c("박쥐로 변함: 부채꼴 음파, 준 피해의 5%를 회복 · 발이 빠름", "Become a bat: a cone of sound, healing 5% of damage dealt · fast feet", "蝙蝠に変身：扇形の音波、与ダメージの5%回復・足が速い"),
  elephant: c("코끼리로 변함: 둘레를 짓밟아 기절 · 아주 느림", "Become an elephant: stomp around you, stunning foes · very slow", "象に変身：周囲を踏みつけて気絶・とても遅い"),
  spider: c("거미로 변함: 거미줄을 쏘아 느리게", "Become a spider: shoot webs that slow foes", "蜘蛛に変身：糸を撃って遅くする"),
  phoenix: c("불사조로 변함: 터지는 불덩이, 둘레 적을 불태움", "Become a phoenix: exploding fireballs that set foes ablaze", "不死鳥に変身：爆ぜる火の玉、周囲の敵を燃やす"),
};

export const MORPH_PASSIVE_NAMES: Record<MorphPassive & PassiveId, Names> = {
  wolfFang: c("송곳니", "Fang", "牙"),
  wolfPack: c("우두머리", "Pack Leader", "群れの長"),
  wolfHowl: c("늑대 울음", "Wolf Howl", "狼の遠吠え"),
  bearHide: c("두꺼운 가죽", "Thick Hide", "厚い毛皮"),
  bearRage: c("분노", "Rage", "怒り"),
  bearQuake: c("땅 울림", "Ground Quake", "地響き"),
  eagleEye: c("매의 눈", "Hawk Eye", "鷹の目"),
  eagleStorm: c("깃털 폭풍", "Feather Storm", "羽根の嵐"),
  eagleDive: c("급강하", "Nosedive", "急降下"),
  snakeVenom: c("맹독", "Deadly Venom", "猛毒"),
  snakeCoil: c("휘감기", "Coil", "巻きつき"),
  snakeSpit: c("독 침", "Venom Spit", "毒の唾"),
  boarTusk: c("엄니", "Tusks", "牙突"),
  boarStampede: c("폭주", "Stampede", "暴走"),
  boarMud: c("진흙 갑옷", "Mud Armor", "泥の鎧"),
  scorpTail: c("독 꼬리", "Venom Tail", "毒の尾"),
  scorpPincer: c("집게", "Pincers", "はさみ"),
  scorpShell: c("갑각", "Carapace", "甲殻"),
  batDrain: c("흡혈", "Blood Drain", "吸血"),
  batEcho: c("메아리", "Echo", "こだま"),
  batSwarm: c("박쥐 떼", "Bat Swarm", "蝙蝠の群れ"),
  eleTrunk: c("코 휘두르기", "Trunk Swing", "鼻振り"),
  eleMammoth: c("매머드", "Mammoth", "マンモス"),
  eleHerd: c("무리", "The Herd", "群れ"),
  spiderNest: c("거미줄 둥지", "Web Nest", "蜘蛛の巣"),
  spiderFang: c("독니", "Venom Fangs", "毒牙"),
  spiderBrood: c("새끼 거미", "Spiderlings", "子蜘蛛"),
  phoenixFlare: c("불꽃 날개", "Flame Wings", "炎の翼"),
  phoenixSun: c("태양", "The Sun", "太陽"),
  phoenixRebirth: c("불사의 불꽃", "Undying Flame", "不死の炎"),
};

export const MORPH_EFFECTS: Partial<Record<MorphPassive & PassiveId, Names>> = {
  wolfFang: c("공격력 +20%", "Damage +20%", "攻撃力+20%"),
  wolfPack: c("센 물기가 3번째 → {every}번째마다", "Strong bite every 3rd → every {every:nth}", "強い噛みつきが3回目 → {every}回目ごと"),
  wolfHowl: c("센 물기가 둘레 적을 겁먹게 함 ({stun:sec}초 멈춤)", "Strong bites frighten nearby foes ({stun:sec}s stop)", "強い噛みつきで周囲の敵を怯ませる（{stun:sec}秒停止）"),
  bearHide: c("곰일 때 받는 피해 -{taken:down}%", "As a bear, take {taken:down}% less damage", "熊の時、被ダメージ-{taken:down}%"),
  bearRage: c("체력이 절반 아래면 피해 +{damage:up}%", "Below half HP, damage +{damage:up}%", "体力が半分未満でダメージ+{damage:up}%"),
  bearQuake: c("{every}번째 할퀴기마다 둘레 충격파 (공격력 {mul}배)", "Every {every:nth} swipe sends a shockwave ({mul}× damage)", "{every}回目の引っかきごとに周囲へ衝撃波（攻撃力{mul}倍）"),
  eagleEye: c("사거리 +20% · 공격력 +10%", "Range +20% · damage +10%", "射程+20%・攻撃力+10%"),
  eagleStorm: c("깃털 {feathers}개", "{feathers} feathers", "羽根{feathers}本"),
  eagleDive: c("{every}번째 공격마다 가까운 적에게 내리꽂음 (공격력 {mul}배)", "Every {every:nth} attack dives onto the nearest foe ({mul}× damage)", "{every}回目の攻撃ごとに近くの敵へ急降下（攻撃力{mul}倍）"),
  snakeVenom: c("독 피해 {mul}배", "Poison damage ×{mul}", "毒ダメージ{mul}倍"),
  snakeCoil: c("물린 적이 {ticks:sec}초 묶임", "Bitten foes are bound for {ticks:sec}s", "噛まれた敵が{ticks:sec}秒縛られる"),
  snakeSpit: c("{every}번째 물기마다 독 침을 멀리 뱉음", "Every {every:nth} bite spits venom far ahead", "{every}回目の噛みつきごとに毒の唾を遠くへ吐く"),
  boarTusk: c("돌진 피해 +{mul:up}%", "Charge damage +{mul:up}%", "突進ダメージ+{mul:up}%"),
  boarStampede: c("돌진 거리 +{reach:up}%", "Charge distance +{reach:up}%", "突進距離+{reach:up}%"),
  boarMud: c("돌진하는 동안 무적", "Invulnerable while charging", "突進中は無敵"),
  scorpTail: c("꼬리에 찔린 적이 중독", "Stung foes are poisoned", "尾に刺された敵が毒状態に"),
  scorpPincer: c("찌르기 전에 앞쪽 가까운 적을 집게로 집음 (공격력 {mul:pct}%)", "Pinch nearby foes in front before stinging ({mul:pct}% damage)", "刺す前に前方の近い敵をはさむ（攻撃力{mul:pct}%）"),
  scorpShell: c("전갈일 때 받는 피해 -{taken:down}% · 최대 체력 +10", "As a scorpion, take {taken:down}% less damage · max HP +10", "蠍の時、被ダメージ-{taken:down}%・最大体力+10"),
  batDrain: c("회복 {mul}배", "Healing ×{mul}", "回復{mul}倍"),
  batEcho: c("음파가 {delay:sec}초 뒤 겨눈 곳에서 한 번 더 울림", "The sound wave echoes again at the target after {delay:sec}s", "音波が{delay:sec}秒後に狙った場所でもう一度響く"),
  batSwarm: c("{every}번째 공격마다 작은 박쥐 {bats}마리가 날아감", "Every {every:nth} attack sends out {bats} little bats", "{every}回目の攻撃ごとに小さな蝙蝠が{bats}匹飛んでいく"),
  eleTrunk: c("짓밟은 뒤 앞쪽 적을 멀리 밀침", "After stomping, fling foes in front far away", "踏みつけの後、前方の敵を遠くへ押し飛ばす"),
  eleMammoth: c("짓밟기 범위 +{reach:up}%", "Stomp range +{reach:up}%", "踏みつけ範囲+{reach:up}%"),
  eleHerd: c("코끼리일 때 받는 피해 -{taken:down}% · 최대 체력 +15", "As an elephant, take {taken:down}% less damage · max HP +15", "象の時、被ダメージ-{taken:down}%・最大体力+15"),
  spiderNest: c("거미줄이 맞은 자리에서 퍼져 둘레 적도 느려짐", "Webs burst on hit, slowing foes around", "糸が当たった場所で広がり周囲の敵も遅くなる"),
  spiderFang: c("느려진 적에게 피해 +{mul:pct}%", "+{mul:pct}% damage to slowed foes", "遅くなった敵へのダメージ+{mul:pct}%"),
  spiderBrood: c("{every}번째 공격마다 거미줄 세 갈래", "Every {every:nth} attack fires three webs", "{every}回目の攻撃ごとに糸が三本"),
  phoenixFlare: c("불덩이 폭발 범위 +{r:up}%", "Fireball blast range +{r:up}%", "火の玉の爆発範囲+{r:up}%"),
  phoenixSun: c("{every}번째 공격마다 둘레에 큰 불꽃", "Every {every:nth} attack erupts in a great flame around you", "{every}回目の攻撃ごとに周囲へ大きな炎"),
  phoenixRebirth: c("체력이 {below:pct}% 아래면 {every:sec}초마다 체력 {heal} 회복", "Below {below:pct}% HP, heal {heal} every {every:sec}s", "体力{below:pct}%未満で{every:sec}秒ごとに体力{heal}回復"),
};
