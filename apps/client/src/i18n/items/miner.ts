// 에테르 광부(히든) 글자 (한·영·일): 곡괭이 이름·설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsMiner·MINER_PERKS와 맞춤)
import type { PassiveId, PickStyle, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type MnWeapon = "mnPick" | "mnDrill" | "mnSledge" | "mnTnt" | "mnCart" | "mnPit" | "mnMagnet" | "mnGem" | "mnThrow" | "mnEther";
type MnPassive = "mnLamp" | "mnHelmet" | "mnMuscle" | "mnVein" | "mnGold" | "mnCanary" | "mnChain" | "mnMole" | "mnExpert" | "mnJackpot";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const MN_WEAPON_NAMES: Record<MnWeapon & WeaponId, Names> = {
  mnPick: c("낡은 곡괭이", "Old Pickaxe", "古いつるはし"),
  mnDrill: c("에테르 드릴", "Ether Drill", "エーテルドリル"),
  mnSledge: c("거대 곡괭이", "Giant Pickaxe", "巨大つるはし"),
  mnTnt: c("발파 곡괭이", "Blasting Pick", "発破つるはし"),
  mnCart: c("광차 곡괭이", "Minecart Pick", "トロッコつるはし"),
  mnPit: c("구덩이 삽", "Pit Shovel", "落とし穴スコップ"),
  mnMagnet: c("자석 곡괭이", "Magnet Pick", "磁石つるはし"),
  mnGem: c("보석 곡괭이", "Gem Pick", "宝石つるはし"),
  mnThrow: c("던지는 곡괭이", "Throwing Pick", "投げつるはし"),
  mnEther: c("에테르 공명 곡괭이", "Ether Resonance Pick", "エーテル共鳴つるはし"),
};

/** 곡괭이 설명 (모양에서 만듦) */
export function pickDesc(st: PickStyle, lang: Lang): string {
  const mode: Record<PickStyle["mode"], Names> = {
    swing: st.arc < 0 ? c("넓게 크게 찍음", "wide, heavy swings", "広く大きく振り下ろす") : c("앞쪽을 찍음", "strikes ahead", "前方を打つ"),
    drill: c("아주 빠르게 갈아 냄 · 원석 두 배", "grinds very fast · double ore", "とても速く削る · 原石2倍"),
    tnt: c("찍을 때마다 가장 가까운 적 발밑에 다이너마이트 (공격력 250%)", "every swing drops dynamite under the nearest foe (250%)", "振るたびに一番近い敵の足元にダイナマイト（攻撃力250%）"),
    cart: c("세 번째마다 광차가 굴러가며 다 치고 지나감 (공격력 200%)", "every 3rd swing sends a minecart through everything (200%)", "3回目ごとにトロッコが全部をはね飛ばして走る（攻撃力200%）"),
    pit: c("네 번째마다 적 발밑에 구덩이 · 빠진 보통 적은 그대로 끝, 보스는 크게 다침 (600%)", "every 4th swing digs a pit under a foe · normal foes that fall in are gone, bosses take 600%", "4回目ごとに敵の足元に穴 · 落ちた普通の敵はそのまま終わり、ボスは大ダメージ（600%）"),
    magnet: c("찍을 때마다 둘레 적을 끌어당김", "every swing pulls nearby foes in", "振るたびに周りの敵を引き寄せる"),
    gem: c("맞은 적이 25% 확률로 보석이 되어 굳고, 굳은 적을 찍으면 3배로 깨짐", "25% to turn foes into frozen gems; striking a gem shatters it for ×3", "25%で敵が宝石になって固まり、固まった敵を打つと3倍で砕ける"),
    throw: c("빙글빙글 날아가 뚫고 되돌아옴", "spins out, pierces and comes back", "くるくる飛んで貫き、戻ってくる"),
    pillar: c("맞힐 때마다 다른 적 머리 위로 에테르 기둥 (공격력 150%)", "each hit drops an Ether Pillar on another foe (150%)", "当てるたびに別の敵の頭上にエーテルの柱（攻撃力150%）"),
  };
  const parts: Names[] = [mode[st.mode]];
  if (st.crack === 1) parts.push(c("찍을 때마다 땅이 크게 갈라짐", "every swing splits the ground wide", "振るたびに地面が大きく割れる"));
  else if (st.crack > 1) parts.push(c(`${st.crack}번째마다 땅이 갈라짐`, `every ${st.crack}th swing splits the ground`, `${st.crack}回目ごとに地面が割れる`));
  return parts.map((p) => p[lang]).join(" · ");
}

export const MN_PASSIVE_NAMES: Record<MnPassive & PassiveId, Names> = {
  mnLamp: c("광부의 등불", "Miner's Lamp", "鉱夫のランプ"),
  mnHelmet: c("안전모", "Hard Hat", "安全帽"),
  mnMuscle: c("광부의 근력", "Miner's Brawn", "鉱夫の腕力"),
  mnVein: c("광맥 감지", "Vein Sense", "鉱脈探知"),
  mnGold: c("금맥", "Gold Vein", "金脈"),
  mnCanary: c("카나리아", "Canary", "カナリア"),
  mnChain: c("연쇄 발파", "Chain Blasting", "連鎖発破"),
  mnMole: c("두더지", "Mole", "モグラ"),
  mnExpert: c("붕괴 전문가", "Cave-In Expert", "落盤の専門家"),
  mnJackpot: c("대박 원석", "Jackpot Ore", "大当たり原石"),
};

export const MN_EFFECTS: Partial<Record<MnPassive & PassiveId, Names>> = {
  mnVein: c("원석이 {mul}배로 나옴", "Ore ×{mul}", "原石が{mul}倍"),
  mnGold: c("원석을 캘 때마다 돈 +{gold}", "+{gold} gold per ore mined", "原石を掘るたびにお金+{gold}"),
  mnCanary: c("체력이 {hp:pct}% 아래로 맞으면 카나리아가 울어 보통 적이 모두 {stun:sec}초 기절 ({cool:sec}초마다)", "When hit below {hp:pct}% HP, the canary sings and stuns all normal foes for {stun:sec}s (every {cool:sec}s)", "体力{hp:pct}%未満で被弾するとカナリアが鳴き、普通の敵が全員{stun:sec}秒気絶（{cool:sec}秒ごと）"),
  mnChain: c("결정을 깨면 폭발 (공격력 {mul:pct}%) · 광산 붕괴 바위 {rocks}배", "Shattered crystals explode ({mul:pct}%) · Cave-In rocks ×{rocks}", "結晶を割ると爆発（攻撃力{mul:pct}%）· 落盤の岩{rocks}倍"),
  mnMole: c("땅굴에서 나올 때 범위 {r}배 · 피해 {mul}배", "Tunnel exit: radius ×{r}, damage ×{mul}", "トンネルから出る時 範囲{r}倍 · ダメージ{mul}倍"),
  mnExpert: c("광산 붕괴에 필요한 원석 절반", "Cave-In needs half the ore", "落盤に必要な原石が半分"),
  mnJackpot: c("맞힐 때마다 {chance:pct}% 확률로 보통 적이 그대로 에테르 결정이 됨", "Each hit has a {chance:pct}% chance to turn a normal foe straight into an Ether Crystal", "当てるたびに{chance:pct}%で普通の敵がそのままエーテル結晶になる"),
};
