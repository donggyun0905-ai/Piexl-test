// 역병의사(헬리오스) 글자 (한·영·일): 무기 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsPlague·PLAGUE_PERKS와 맞춤)
import type { PassiveId, PlagueKind, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type PlagueWeapon = "mosquitoSwarm" | "miasmaCenser" | "ratKing" | "deathGrip";
type PlaguePassive = "plGland" | "plHive" | "plSmog" | "plBurrow" | "plBlackDeath" | "plRust" | "plMask" | "plBloodlet" | "plContagion" | "plReaper";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const PLAGUE_WEAPON_NAMES: Record<PlagueWeapon & WeaponId, Names> = {
  mosquitoSwarm: c("모기떼", "Mosquito Swarm", "蚊の群れ"),
  miasmaCenser: c("역병 향로", "Miasma Censer", "疫病の香炉"),
  ratKing: c("쥐의 왕", "Rat King", "鼠の王"),
  deathGrip: c("죽음의 손아귀", "Grip of Death", "死の手"),
};

/** 무기 설명 (무기 설명 뒤에 붙음) */
export const PLAGUE_DESC: Record<PlagueKind, Names> = {
  swarm: c("모기떼가 가까운 적에게 날아가, 누르고 있는 동안 쉬지 않고 넓은 둘레를 갈아버림", "A mosquito swarm flies to the nearest foe and, while you hold attack, relentlessly grinds everything in a wide area", "蚊の群れが近くの敵へ飛び、押している間ずっと広い範囲をすり潰し続ける"),
  miasma: c("적 자리에 큰 연기 구역 (5초, 둘까지): 안의 적은 독·불·죽음·부식(받는 피해 +5%)", "A great smoke zone on a foe (5s, up to two): foes inside suffer poison, burn, death and corrosion (+5% damage taken)", "敵の場所に大きな煙の領域（5秒、2つまで）：中の敵に毒・炎・死・腐食（被ダメージ+5%）"),
  rats: c("맵 곳곳에서 쥐 여섯 마리가 튀어나와 둘레 적들을 1씩 갉아먹다 20%로 흑사병 (1초마다 최대 체력의 20%, 보스는 1/5의 20%) · 걸리면 붙은 쥐는 10 피해로 터지고, 흑사병이 끝날 때까지 다시 붙지 않음", "Six rats pop up all over the map and gnaw nearby foes for 1 with a 20% chance of the Black Death (20% max HP per second, 20% of a fifth for bosses) · clinging rats then burst for 10 and won't cling again until it ends", "マップのあちこちから鼠6匹が現れ周りの敵を1ずつかじり20%で黒死病（毎秒最大体力の20%、ボスは1/5の20%）· 罹ると張り付いた鼠は10ダメージで弾け、終わるまで再び張り付かない"),
  grip: c("앞쪽을 움켜쥠 · 34%로 즉사 (보스는 최대 체력 1/4의 20%) · 사거리·공격 속도는 오르지 않음", "Grasps ahead · 34% chance to kill outright (20% of a quarter of max HP for bosses) · range and attack speed never increase", "前方を掴む · 34%で即死（ボスは最大体力1/4の20%）· 射程・攻撃速度は上がらない"),
};

export const PLAGUE_PASSIVE_NAMES: Record<PlaguePassive & PassiveId, Names> = {
  plGland: c("독샘", "Venom Gland", "毒腺"),
  plHive: c("굶주린 모기", "Hungry Hive", "飢えた蚊"),
  plSmog: c("짙은 연기", "Thick Smog", "濃い煙"),
  plBurrow: c("쥐구멍", "Rat Burrow", "鼠の穴"),
  plBlackDeath: c("검은 죽음", "Black Death", "黒い死"),
  plRust: c("녹", "Rust", "錆"),
  plMask: c("새부리 가면", "Beak Mask", "鳥嘴の仮面"),
  plBloodlet: c("사혈", "Bloodletting", "瀉血"),
  plContagion: c("전염", "Contagion", "伝染"),
  plReaper: c("사신의 손", "Reaper's Hand", "死神の手"),
};

export const PLAGUE_EFFECTS: Partial<Record<PlaguePassive & PassiveId, Names>> = {
  plGland: c("독·불·죽음·흑사병 피해 +{mul:up}%", "Poison, burn, death and plague damage +{mul:up}%", "毒・炎・死・黒死病ダメージ+{mul:up}%"),
  plHive: c("모기떼 반경 +{r:up}%", "Mosquito swarm radius +{r:up}%", "蚊の群れの範囲+{r:up}%"),
  plSmog: c("연기 구역이 {dur:up}% 오래 남고 하나 더", "Smoke zones last {dur:up}% longer, one more at a time", "煙の領域が{dur:up}%長く残り、1つ多く"),
  plBurrow: c("쥐가 {rats}마리 더", "{rats} more rats", "鼠が{rats}匹多く"),
  plBlackDeath: c("흑사병 확률 {chance:pct}%", "Black Death chance becomes {chance:pct}%", "黒死病の確率{chance:pct}%"),
  plRust: c("부식이 받는 피해 +{corrode:pct}%", "Corrosion makes foes take +{corrode:pct}% damage", "腐食で被ダメージ+{corrode:pct}%"),
  plMask: c("받는 피해 -{taken:down}%", "Damage taken -{taken:down}%", "被ダメージ-{taken:down}%"),
  plBloodlet: c("상태이상에 걸린 적을 쓰러뜨리면 체력 {heal} 회복", "Heal {heal} HP when a foe with a status ailment falls", "状態異常の敵を倒すと体力{heal}回復"),
  plContagion: c("흑사병에 걸린 적이 쓰러지면 둘레 적에게 옮음", "When a plagued foe falls, the plague spreads to foes around it", "黒死病の敵が倒れると周りの敵に移る"),
  plReaper: c("죽음의 손아귀 즉사 확률 +{chance:pct}%", "Grip of Death kill chance +{chance:pct}%", "死の手の即死確率+{chance:pct}%"),
};
