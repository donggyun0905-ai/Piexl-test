// 실베르 빙설 글자 (한·영·일): 무기 10 이름 · 전용 아이템 10 이름·효과 (수치는 weaponsBingseol·BINGSEOL_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type BsWeapon = "bsBlade" | "bsScythe" | "bsDagger" | "bsGreat" | "bsPike" | "bsShard" | "bsFan" | "bsWhip" | "bsRing" | "bsStaff";
type BsPassive = "bsUlt" | "bsBow" | "bsLance" | "bsDust" | "bsHoming" | "bsRapid" | "bsSpike" | "bsWall" | "bsStorm" | "bsShatter";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const BS_WEAPON_NAMES: Record<BsWeapon & WeaponId, Names> = {
  bsBlade: c("얼음칼", "Ice Blade", "氷の剣"),
  bsScythe: c("얼음 낫", "Ice Scythe", "氷の鎌"),
  bsDagger: c("서리 단검", "Frost Dagger", "霜の短剣"),
  bsGreat: c("빙하 대검", "Glacier Greatsword", "氷河の大剣"),
  bsPike: c("고드름 창", "Icicle Pike", "つららの槍"),
  bsShard: c("빙인 투척", "Ice Edge Throw", "氷刃投げ"),
  bsFan: c("눈꽃 부채", "Snowflake Fan", "雪花の扇"),
  bsWhip: c("서리 채찍", "Frost Whip", "霜の鞭"),
  bsRing: c("빙륜", "Ice Wheel", "氷輪"),
  bsStaff: c("눈보라 지팡이", "Blizzard Staff", "吹雪の杖"),
};

export const BS_PASSIVE_NAMES: Record<BsPassive & PassiveId, Names> = {
  bsUlt: c("궁극기 - 빙설창", "Ultimate: Frostsnow Lance", "奥義・氷雪槍"),
  bsBow: c("빙설무장 - 활", "Frost Arms: Bow", "氷雪武装・弓"),
  bsLance: c("빙설무장 - 창", "Frost Arms: Spears", "氷雪武装・槍"),
  bsDust: c("얼음가루", "Ice Dust", "氷の粉"),
  bsHoming: c("얼음가루(속)", "Ice Dust: Swift", "氷の粉（速）"),
  bsRapid: c("얼음가루(강)", "Ice Dust: Strong", "氷の粉（強）"),
  bsSpike: c("빙격", "Ice Strike", "氷撃"),
  bsWall: c("영역강화", "Field Fortify", "領域強化"),
  bsStorm: c("눈보라 확장", "Spreading Blizzard", "吹雪拡張"),
  bsShatter: c("쇄빙", "Icebreaker", "砕氷"),
};

export const BS_EFFECTS: Partial<Record<BsPassive & PassiveId, Names>> = {
  bsUlt: c(
    "궁극기: 공격마다 {chance:pct}% 확률로 몸 위에 빙설창이 생겨 {charge:sec}초 기를 모은 뒤 마우스 쪽으로 날아감 · 적에 닿으면 슬로우 모션이 되어 그 적을 {hits}번 빠르게 때림(모두 합쳐 공격력의 {mul:pct}%) · 관통해 다음 적 … 맵 끝까지",
    "Ultimate: each attack has a {chance:pct}% chance to raise a Frostsnow Lance above you; it gathers power for {charge:sec}s, then flies toward your mouse · each foe it reaches triggers slow motion and {hits} rapid hits ({mul:pct}% of damage in total) · then it pierces on to the next foe, all the way to the edge of the map",
    "奥義：攻撃ごとに{chance:pct}%の確率で頭上に氷雪槍が現れ、{charge:sec}秒力をためてからマウスの方向へ飛ぶ・敵に触れるとスローモーションになりその敵を{hits}回素早く攻撃（合計で攻撃力の{mul:pct}%）・貫通して次の敵へ…マップの端まで",
  ),
  bsBow: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 몸 좌우에 커다란 얼음 활을 세움 (맵에 {max}개까지, {life:sec}초) · 활은 {every:sec}초마다 둘레 적에게 화살을 쏴 공격력의 {mul:pct}%",
    "New skill: each attack has a {chance:pct}% chance to raise a giant ice bow at your left or right (up to {max} on the map, {life:sec}s) · each bow fires an arrow at a nearby foe every {every:sec}s for {mul:pct}% of damage",
    "新技：攻撃ごとに{chance:pct}%の確率で体の左右に大きな氷の弓を立てる（マップに{max}個まで、{life:sec}秒）・弓は{every:sec}秒ごとに周りの敵へ矢を放ち攻撃力の{mul:pct}%",
  ),
  bsLance: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 머리 위에 얼음 창 {min}~{max}개가 하나씩 차례로 생겨 앞으로 날아감 · 창마다 처음 맞힌 적에게 공격력의 {mul:pct}% (관통 없음)",
    "New skill: each attack has a {chance:pct}% chance to form {min}-{max} ice spears above your head one by one, then launch them forward · each spear hits the first foe for {mul:pct}% of damage (no pierce)",
    "新技：攻撃ごとに{chance:pct}%の確率で頭上に氷の槍が{min}～{max}本ひとつずつ現れ前へ飛ぶ・槍ごとに最初に当たった敵へ攻撃力の{mul:pct}%（貫通なし）",
  ),
  bsDust: c(
    "새 기술: 공격마다 얼음가루 {min}~{max}개가 얼음 영역 안에 흩날림 (맵에 {cap}개까지, {life:sec}초) · 닿은 적에게 고정 피해 {dmg}",
    "New skill: each attack scatters {min}-{max} ice dust inside your frost field (up to {cap} on the map, {life:sec}s) · foes that touch one take {dmg} fixed damage",
    "新技：攻撃ごとに氷の粉が{min}～{max}個、氷の領域に舞う（マップに{cap}個まで、{life:sec}秒）・触れた敵に固定ダメージ{dmg}",
  ),
  bsHoming: c(
    "새 기술: 얼음가루가 {need}개 생길 때마다 {need}개가 모여 유도 얼음이 되어 적을 쫓아가 터짐(반지름 {r}) 공격력의 {mul:pct}% · {chain}번 연속 뒤 {cd:sec}초 쉼",
    "New skill: every {need} ice dust created, {need} gather into homing ice that chases a foe and bursts (radius {r}) for {mul:pct}% of damage · rests {cd:sec}s after {chain} in a row",
    "新技：氷の粉が{need}個できるたびに{need}個が集まって誘導氷になり、敵を追って爆発（半径{r}）攻撃力の{mul:pct}%・{chain}回連続のあと{cd:sec}秒休む",
  ),
  bsRapid: c(
    "새 기술: 얼음가루가 {need}개 생길 때마다 {need}개가 모여 급속 얼음이 되어 적에게 날아감 · 닿는 적 모두 관통하며 공격력의 {mul:pct}% · {chain}번 뒤 {cd:sec}초 쉼",
    "New skill: every {need} ice dust created, {need} gather into rapid ice that shoots at a foe · pierces every foe it touches for {mul:pct}% of damage · rests {cd:sec}s after {chain}",
    "新技：氷の粉が{need}個できるたびに{need}個が集まって急速氷になり敵へ飛ぶ・触れた敵すべてを貫通し攻撃力の{mul:pct}%・{chain}回のあと{cd:sec}秒休む",
  ),
  bsSpike: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 앞에 얼음 빙각이 솟아 반지름 {r} 안 적에게 공격력의 {mul:pct}% · {stun:sec}초 구속 (보스는 {bossSlow:sec}초 느려짐)",
    "New skill: each attack has a {chance:pct}% chance to raise an ice spike ahead, dealing {mul:pct}% of damage within radius {r} · binds foes for {stun:sec}s (bosses are slowed for {bossSlow:sec}s)",
    "新技：攻撃ごとに{chance:pct}%の確率で前に氷の棘がそびえ、半径{r}内の敵に攻撃力の{mul:pct}%・{stun:sec}秒拘束（ボスは{bossSlow:sec}秒遅くなる）",
  ),
  bsWall: c(
    "새 기술: 얼음 영역 테두리에 눈 결정 벽 {n}개가 돎 · 방어력 +{defense} · 결정에 닿은 적 탄을 막음 · {every:sec}초마다 결정 둘레 적에게 공격력의 {mul:pct}% · 공격마다 {dustChance:pct}% 확률로 얼음가루 {dustMin}~{dustMax}개",
    "New skill: {n} snow-crystal walls circle the edge of your frost field · +{defense} defense · crystals block enemy shots · every {every:sec}s they hit nearby foes for {mul:pct}% of damage · each attack has a {dustChance:pct}% chance to make {dustMin}-{dustMax} ice dust",
    "新技：氷の領域の縁を雪の結晶の壁{n}個が回る・防御力+{defense}・結晶に触れた敵の弾を防ぐ・{every:sec}秒ごとに結晶の周りの敵に攻撃力の{mul:pct}%・攻撃ごとに{dustChance:pct}%の確率で氷の粉{dustMin}～{dustMax}個",
  ),
  bsStorm: c(
    "능력: 얼음 영역 크기 {size:up}% 증가 · 영역 안 적에게 {every:sec}초마다 냉기 피해 공격력의 {mul:pct}%",
    "Ability: frost field size +{size:up}% · foes inside take chill damage of {mul:pct}% of damage every {every:sec}s",
    "能力：氷の領域の大きさ{size:up}%増加・領域内の敵に{every:sec}秒ごとに冷気ダメージ（攻撃力の{mul:pct}%）",
  ),
  bsShatter: c(
    "능력: 얼음 영역 안 적에게 주는 빙설의 피해 {mul:up}% 증가 · 얼음가루 고정 피해 {dust}배",
    "Ability: Bingseol deals {mul:up}% more damage to foes inside the frost field · ice dust fixed damage x{dust}",
    "能力：氷の領域内の敵に与える氷雪のダメージ{mul:up}%増加・氷の粉の固定ダメージ{dust}倍",
  ),
};
