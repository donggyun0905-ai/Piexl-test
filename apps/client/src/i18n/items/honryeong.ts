// 실베르 혼령 글자 (한·영·일): 무기 10 이름 · 전용 아이템 10 이름·효과 (수치는 weaponsHonryeong·HONRYEONG_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type HrWeapon = "hrPipe" | "hrEmber" | "hrFrost" | "hrVenom" | "hrHerb" | "hrBolt" | "hrBlood" | "hrLong" | "hrShort" | "hrDream";
type HrPassive = "hrWolf" | "hrTiger" | "hrOwl" | "hrDragon" | "hrDecoy" | "hrHunt" | "hrFear" | "hrThick" | "hrPact" | "hrBreath";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const HR_WEAPON_NAMES: Record<HrWeapon & WeaponId, Names> = {
  hrPipe: c("곰방대", "Long Pipe", "キセル"),
  hrEmber: c("불씨 곰방대", "Ember Pipe", "火種のキセル"),
  hrFrost: c("서리 곰방대", "Frost Pipe", "霜のキセル"),
  hrVenom: c("독초 곰방대", "Poison Herb Pipe", "毒草のキセル"),
  hrHerb: c("약초 곰방대", "Healing Herb Pipe", "薬草のキセル"),
  hrBolt: c("뇌전 곰방대", "Thunder Pipe", "雷電のキセル"),
  hrBlood: c("혈연초 곰방대", "Bloodleaf Pipe", "血煙草のキセル"),
  hrLong: c("장죽", "Great Pipe", "長ギセル"),
  hrShort: c("단죽", "Short Pipe", "短ギセル"),
  hrDream: c("몽환 곰방대", "Dream Pipe", "夢幻のキセル"),
};

export const HR_PASSIVE_NAMES: Record<HrPassive & PassiveId, Names> = {
  hrWolf: c("혼 - 랑", "Spirit: Wolf", "魂・狼"),
  hrTiger: c("혼 - 범", "Spirit: Tiger", "魂・虎"),
  hrOwl: c("혼 - 효", "Spirit: Owl", "魂・梟"),
  hrDragon: c("혼 - 룡", "Spirit: Dragon", "魂・龍"),
  hrDecoy: c("혼 - 영", "Spirit: Shade", "魂・影"),
  hrHunt: c("혼령사냥", "Spirit Hunt", "魂霊狩り"),
  hrFear: c("혼 - 귀", "Spirit: Ghost", "魂・鬼"),
  hrThick: c("짙은 연기", "Thick Smoke", "濃い煙"),
  hrPact: c("혼의 계약", "Spirit Pact", "魂の契約"),
  hrBreath: c("깊은 들숨", "Deep Breath", "深い一服"),
};

export const HR_EFFECTS: Partial<Record<HrPassive & PassiveId, Names>> = {
  hrWolf: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 혼령 늑대 {n}마리를 부름 (맵에 {max}마리까지, {life:sec}초) · 체력은 낮지만({hp}) 물 때마다 공격력의 {mul:pct}%",
    "New skill: each attack has a {chance:pct}% chance to call {n} spirit wolves (up to {max} on the map, {life:sec}s) · low HP ({hp}) but each bite deals {mul:pct}% of damage",
    "新技：攻撃ごとに{chance:pct}%の確率で魂霊の狼を{n}匹呼ぶ（マップに{max}匹まで、{life:sec}秒）・体力は低い（{hp}）が噛むたびに攻撃力の{mul:pct}%",
  ),
  hrTiger: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 혼령 범 1마리를 부름 (맵에 {max}마리까지, {life:sec}초) · 체력 {hp} · 할퀼 때마다 둘레 적에게 공격력의 {mul:pct}%",
    "New skill: each attack has a {chance:pct}% chance to call a spirit tiger (up to {max} on the map, {life:sec}s) · {hp} HP · each swipe deals {mul:pct}% of damage to foes around it",
    "新技：攻撃ごとに{chance:pct}%の確率で魂霊の虎を1匹呼ぶ（マップに{max}匹まで、{life:sec}秒）・体力{hp}・引っかくたびに周りの敵へ攻撃力の{mul:pct}%",
  ),
  hrOwl: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 혼령 부엉이를 그 자리에 앉힘 (맵에 {max}마리까지 · 체력 없이 방을 나갈 때까지) · 범위 안에 적이 있으면 날아올라 낙하 공격(공격력의 {mul:pct}%)하고 그 자리에 다시 앉아 되풀이",
    "New skill: each attack has a {chance:pct}% chance to perch a spirit owl where you stand (up to {max} · no HP, stays until you leave the room) · when a foe is in range it flies up and dive-bombs for {mul:pct}% of damage, then perches there and repeats",
    "新技：攻撃ごとに{chance:pct}%の確率で魂霊のフクロウをその場に止まらせる（マップに{max}羽まで・体力なし、部屋を出るまで）・範囲内に敵がいると飛び上がって急降下攻撃（攻撃力の{mul:pct}%）し、その場に止まって繰り返す",
  ),
  hrDragon: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 방을 덮는 거대한 연기 용이 왼쪽 끝에서 오른쪽 끝으로 지나감 · 방의 모든 적을 {hits}번 따로 때림 (모두 합쳐 공격력의 {mul:pct}%, 보스는 {bossMul:pct}%만)",
    "New skill: each attack has a {chance:pct}% chance to send a giant smoke dragon across the whole room from left to right · it hits every foe in the room {hits} separate times ({mul:pct}% of damage in total, bosses take {bossMul:pct}% of that)",
    "新技：攻撃ごとに{chance:pct}%の確率で部屋を覆う巨大な煙の龍が左端から右端へ通り抜ける・部屋のすべての敵を{hits}回別々に攻撃（合計で攻撃力の{mul:pct}%、ボスはその{bossMul:pct}%）",
  ),
  hrDecoy: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 혼령 분신을 방 어딘가에 세움 (맵에 {max}명까지, {life:sec}초) · 공격하지 않는 인형이지만 적이 분신을 쫓음 · 체력({hp})이 다하면 연기가 터져 둘레 적에게 공격력의 {mul:pct}%",
    "New skill: each attack has a {chance:pct}% chance to raise a spirit shade somewhere in the room (up to {max}, {life:sec}s) · it never attacks, but foes chase it · when its HP ({hp}) runs out it bursts into smoke for {mul:pct}% of damage around it",
    "新技：攻撃ごとに{chance:pct}%の確率で魂霊の分身を部屋のどこかに立たせる（マップに{max}体まで、{life:sec}秒）・攻撃しない人形だが敵が分身を追う・体力（{hp}）が尽きると煙が弾けて周りの敵へ攻撃力の{mul:pct}%",
  ),
  hrHunt: c(
    "새 능력: 내가 구름 안에서 은신하면 소환수도 은신해 적 몸에 닿아도 피해를 받지 않음 · 은신한 늑대는 적마다 첫 타격이 확정 치명타({crit}배)에 출혈 · 은신한 범은 {size}배 커지고 공격력·체력 {mul}배 · 부엉이는 앉지 않고 방 어디든 계속 날아다니며 공격",
    "New ability: while you hide in a cloud your summons hide too and take no contact damage · a hidden wolf's first bite on each foe is a guaranteed crit (x{crit}) with bleed · a hidden tiger grows x{size} with x{mul} damage and HP · owls stop perching and keep flying anywhere in the room to attack",
    "新能力：雲の中で隠れると召喚獣も隠れ、敵に触れてもダメージを受けない・隠れた狼は敵ごとに最初の一撃が確定クリティカル（{crit}倍）で出血・隠れた虎は{size}倍に大きくなり攻撃力・体力{mul}倍・フクロウは止まらず部屋のどこでも飛び続けて攻撃",
  ),
  hrFear: c(
    "새 능력: 연기 구름 안에 들어온 적은 {every:sec}초마다 {chance:pct}% 확률로 겁에 질려 {ticks:sec}초 동안 공포 (도망침 · 보스 제외)",
    "New ability: foes inside a smoke cloud have a {chance:pct}% chance every {every:sec}s to be terrified for {ticks:sec}s (they flee · bosses excluded)",
    "新能力：煙の雲に入った敵は{every:sec}秒ごとに{chance:pct}%の確率で怯え、{ticks:sec}秒間恐怖（逃げる・ボスを除く）",
  ),
  hrThick: c(
    "새 능력: 은신 동안 혼령과 소환수의 피해 {mul}배 · 구름 안의 적은 {every:sec}초마다 공격력의 {dot:pct}% 연기 피해",
    "New ability: while hidden, you and your summons deal x{mul} damage · foes inside clouds take {dot:pct}% of damage as smoke every {every:sec}s",
    "新能力：隠れている間、魂霊と召喚獣のダメージ{mul}倍・雲の中の敵は{every:sec}秒ごとに攻撃力の{dot:pct}%の煙ダメージ",
  ),
  hrPact: c(
    "새 능력: 소환 확률 {chance}배 · 소환수 공격력 {mul}배 · 소환수 체력 {hp}배",
    "New ability: summon chance x{chance} · summon damage x{mul} · summon HP x{hp}",
    "新能力：召喚確率{chance}倍・召喚獣の攻撃力{mul}倍・召喚獣の体力{hp}倍",
  ),
  hrBreath: c(
    "새 능력: 구름 안에서 은신하는 동안 {every:sec}초마다 체력 {heal} 회복",
    "New ability: while hidden in a cloud, restore {heal} HP every {every:sec}s",
    "新能力：雲の中で隠れている間、{every:sec}秒ごとに体力{heal}回復",
  ),
};
