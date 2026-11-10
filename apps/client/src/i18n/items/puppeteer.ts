// 실베르 인형술사 글자 (한·영·일): 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsPuppet·PUPPET_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type PpPassive =
  | "ppDollRibbon" | "ppDollSpiral" | "ppDollJester" | "ppDollHat" | "ppDollPrincess" | "ppDollDancer" | "ppDollHood" | "ppDollCat" | "ppCorpse" | "ppGolem"
  | "ppBlack" | "ppClone" | "ppCrown" | "ppSpool" | "ppLong" | "ppWeb" | "ppDance" | "ppBow" | "ppStitch" | "ppChain";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const PP_WEAPON_NAMES: Record<"ppHand" & WeaponId, Names> = {
  ppHand: c("인형술사의 손", "Puppeteer's Hand", "人形使いの手"),
};

export const PP_PASSIVE_NAMES: Record<PpPassive & PassiveId, Names> = {
  ppDollRibbon: c("리본 인형", "Ribbon Doll", "リボン人形"),
  ppDollSpiral: c("태엽 인형", "Wind-up Doll", "ゼンマイ人形"),
  ppDollJester: c("광대 인형", "Jester Doll", "道化人形"),
  ppDollHat: c("신사 인형", "Gentleman Doll", "紳士人形"),
  ppDollPrincess: c("공주 인형", "Princess Doll", "姫人形"),
  ppDollDancer: c("춤추는 인형", "Dancing Doll", "踊る人形"),
  ppDollHood: c("빨간 망토 인형", "Red Hood Doll", "赤ずきん人形"),
  ppDollCat: c("고양이 인형", "Cat Doll", "猫人形"),
  ppCorpse: c("시체 폭발", "Corpse Burst", "死体爆発"),
  ppGolem: c("내 친구~", "My Friend~", "ぼくのともだち〜"),
  ppBlack: c("검은 실", "Black Thread", "黒い糸"),
  ppClone: c("분신", "Doppelganger", "分身"),
  ppCrown: c("네 번째 왕관", "Fourth Crown", "四つ目の冠"),
  ppSpool: c("실타래", "Spool", "糸巻き"),
  ppLong: c("긴 실", "Long Thread", "長い糸"),
  ppWeb: c("거미줄", "Cobweb", "蜘蛛の巣"),
  ppDance: c("꼭두각시 춤", "Marionette Dance", "操り人形の舞"),
  ppBow: c("마지막 인사", "Final Bow", "最後のお辞儀"),
  ppStitch: c("바느질", "Stitching", "縫い合わせ"),
  ppChain: c("금사슬", "Golden Chain", "金の鎖"),
};

const DOLL = c("실로 때릴 때 확률로 내 쪽에서 미니 인형이 나와 적에게 달려가 터짐 (공격력의 140%) · ", "Thread strikes may send a mini doll from you that rushes a foe and bursts (140% of damage) · ", "糸で叩くと確率で自分からミニ人形が飛び出し敵に突っ込んで弾ける（攻撃力の140%）・");
const doll = (ko: string, en: string, ja: string) => c(DOLL.ko + ko, DOLL.en + en, DOLL.ja + ja);

export const PP_EFFECTS: Partial<Record<PpPassive & PassiveId, Names>> = {
  ppDollRibbon: doll("리본 인형: 터지면 둘레 적을 {stun:sec}초 묶음", "Ribbon Doll: binds nearby foes for {stun:sec}s", "リボン人形：弾けると周りの敵を{stun:sec}秒拘束"),
  ppDollSpiral: doll("태엽 인형: 터지면 반지름 {r} 안 적을 가운데로 끌어당김", "Wind-up Doll: pulls foes within {r} to the center", "ゼンマイ人形：弾けると半径{r}内の敵を中心へ引き寄せる"),
  ppDollJester: doll("광대 인형: 터지면 파편 {n}개가 사방으로 (공격력의 {mul:pct}%)", "Jester Doll: {n} shards fly in all directions ({mul:pct}% of damage)", "道化人形：弾けると破片{n}個が四方へ（攻撃力の{mul:pct}%）"),
  ppDollHat: doll("신사 인형: {size}배 크게 터지고 피해 {mul}배", "Gentleman Doll: bursts {size}x wider for {mul}x damage", "紳士人形：{size}倍大きく弾けダメージ{mul}倍"),
  ppDollPrincess: doll("공주 인형: 터지면 체력 {heal} 회복", "Princess Doll: heals you {heal} HP", "姫人形：弾けると体力{heal}回復"),
  ppDollDancer: doll("춤추는 인형: 터진 뒤 다른 적에게 {bounce}번 더 튀어 터짐", "Dancing Doll: bounces to another foe {bounce} more time", "踊る人形：弾けた後、別の敵へ{bounce}回跳ねて弾ける"),
  ppDollHood: doll("빨간 망토 인형: 터지면 불태움 (피해의 {burn:pct}%)", "Red Hood Doll: sets foes ablaze ({burn:pct}% of the hit)", "赤ずきん人形：弾けると燃やす（ダメージの{burn:pct}%）"),
  ppDollCat: doll("고양이 인형: 터지면 {slow:sec}초 느려짐", "Cat Doll: slows foes for {slow:sec}s", "猫人形：弾けると{slow:sec}秒遅くなる"),
  ppCorpse: c("새 기술: 처치한 적이 {chance:pct}% 확률로 앉아 있는 거대한 인형이 되어 {delay:sec}초 뒤 반지름 {r}로 터짐 (공격력의 {mul:pct}%)", "New skill: slain foes have a {chance:pct}% chance to become a giant sitting doll that bursts after {delay:sec}s in a {r} radius ({mul:pct}% of damage)", "新技：倒した敵が{chance:pct}%の確率で座った巨大人形になり{delay:sec}秒後に半径{r}で爆発（攻撃力の{mul:pct}%）"),
  ppGolem: c("새 기술: 거대 인형 친구가 곁을 돌아다니며 내 둘레 {guard} 안에 들어온 적을 내려침 (체력 {hp} · 공격력의 {mul:pct}% · {rate:sec}초마다 · 느림) · 쓰러지면 {respawn:sec}초 뒤 다시", "New skill: a giant doll friend wanders beside you and slams foes within {guard} of you ({hp} HP · {mul:pct}% of damage · every {rate:sec}s · slow) · returns {respawn:sec}s after falling", "新技：巨大人形の友達がそばを歩き回り、周り{guard}内に入った敵を叩く（体力{hp}・攻撃力の{mul:pct}%・{rate:sec}秒ごと・遅い）・倒れると{respawn:sec}秒後に復活"),
  ppBlack: c("새 능력: 실로 때릴 때마다 적에게 실이 묶임 (보스도) · {slow}개면 크게 느려지고 {burst}개면 검게 변해 터짐 (그 적에게 공격력의 {mul:pct}% · 둘레에 {area:pct}%)", "New ability: each thread strike ties a thread to the foe (bosses too) · at {slow} they slow heavily, at {burst} the threads turn black and burst ({mul:pct}% of damage to it · {area:pct}% around)", "新能力：糸で叩くたびに敵に糸が結ばれる（ボスにも）・{slow}本で大きく遅くなり、{burst}本で黒く変わって弾ける（その敵に攻撃力の{mul:pct}%・周りに{area:pct}%）"),
  ppClone: c("새 기술: 피해를 받으면 방 어딘가에 내 분신(체력 {hp})이 {ticks:sec}초 나타나 적이 모두 분신을 쫓음 ({cd:sec}초마다)", "New skill: taking damage summons a doppelganger ({hp} HP) somewhere in the room for {ticks:sec}s, drawing every foe to it (every {cd:sec}s)", "新技：ダメージを受けると部屋のどこかに分身（体力{hp}）が{ticks:sec}秒現れ、敵がみな分身を追う（{cd:sec}秒ごと）"),
  ppCrown: c("새 능력: 나무 왕관 {more}개 더 · 왕관 쓴 아군 체력 {hp}배", "New ability: {more} more wooden crown · crowned allies have {hp}x HP", "新能力：木の冠が{more}つ増える・冠をかぶった味方の体力{hp}倍"),
  ppSpool: c("새 능력: 조종 게이지가 {fill}배 빨리 차고 손이 떠나도 {decay}배로 천천히 줄어듦", "New ability: the control gauge fills {fill}x faster and drains at {decay}x when your hand leaves", "新能力：操りゲージが{fill}倍速くたまり、手が離れても{decay}倍でゆっくり減る"),
  ppLong: c("새 능력: 손이 {reach}배 멀리 닿고 {size}배 커짐", "New ability: your hand reaches {reach}x farther and grows {size}x larger", "新能力：手が{reach}倍遠くまで届き{size}倍大きくなる"),
  ppWeb: c("새 기술: 실 내리친 자리에 거미줄이 {ticks:sec}초 남아 올라선 적을 느리게 함", "New skill: thread strikes leave a cobweb for {ticks:sec}s that slows foes on it", "新技：糸で叩いた場所に蜘蛛の巣が{ticks:sec}秒残り、乗った敵を遅くする"),
  ppDance: c("새 능력: 왕관 쓴 아군·인형 친구가 {rate}배 간격으로 더 빨리, 피해 {mul}배로 때림", "New ability: crowned allies and your doll friend attack at {rate}x the interval for {mul}x damage", "新能力：冠をかぶった味方・人形の友達が{rate}倍の間隔で速く、ダメージ{mul}倍で叩く"),
  ppBow: c("새 기술: 왕관 쓴 아군이 쓰러지면 그 자리에서 반지름 {r}로 터짐 (공격력의 {mul:pct}%)", "New skill: a fallen crowned ally bursts in a {r} radius ({mul:pct}% of damage)", "新技：冠をかぶった味方が倒れると、その場で半径{r}の爆発（攻撃力の{mul:pct}%）"),
  ppStitch: c("새 능력: 왕관을 씌우면 체력 {crown} 회복 · 아군이 적을 처치하면 체력 {kill} 회복", "New ability: crowning a foe heals {crown} HP · an ally's kill heals {kill} HP", "新能力：冠をかぶせると体力{crown}回復・味方が敵を倒すと体力{kill}回復"),
  ppChain: c("새 기술: 실 내리치기가 가까운 적 {n}개에게 이어서 튐 (거리 {dist} · 피해의 {mul:pct}%)", "New skill: thread strikes chain to {n} nearby foes (within {dist} · {mul:pct}% of the hit)", "新技：糸叩きが近い敵{n}体へ連鎖する（距離{dist}・ダメージの{mul:pct}%）"),
};
