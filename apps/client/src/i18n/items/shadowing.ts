// 실베르 쉐도잉 글자 (한·영·일): 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsShadowing·SHADOWING_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type SdPassive =
  | "sdSword" | "sdScroll" | "sdLotus" | "sdCrane" | "sdSakura" | "sdChain" | "sdFlame" | "sdFrost" | "sdVortex" | "sdMoon"
  | "sdStar" | "sdClock" | "sdGhost" | "sdThorn" | "sdComet" | "sdButterfly" | "sdGate" | "sdWings" | "sdMeteor" | "sdDragon";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const SD_WEAPON_NAMES: Record<"sdBrush" & WeaponId, Names> = {
  sdBrush: c("마법 붓", "Magic Brush", "魔法の筆"),
};

export const SD_PASSIVE_NAMES: Record<SdPassive & PassiveId, Names> = {
  sdSword: c("검무 일필", "Sword Dance Stroke", "剣舞一筆"),
  sdScroll: c("수묵 산수화", "Ink Landscape", "水墨山水画"),
  sdLotus: c("연꽃 각성", "Lotus Awakening", "蓮華覚醒"),
  sdCrane: c("학과 구름", "Crane and Cloud", "鶴と雲"),
  sdSakura: c("벚꽃 물결", "Sakura Wave", "桜の波"),
  sdChain: c("봉인 사슬", "Sealing Chain", "封印の鎖"),
  sdFlame: c("불기둥 획", "Flame Pillar Stroke", "火柱の線"),
  sdFrost: c("얼음 결정", "Ice Crystal", "氷の結晶"),
  sdVortex: c("먹 소용돌이", "Ink Vortex", "墨の渦"),
  sdMoon: c("달 낙관", "Moon Seal Stamp", "月の落款"),
  sdStar: c("별 꺾임", "Star Corners", "星の角"),
  sdClock: c("멈춘 시계", "Stopped Clock", "止まった時計"),
  sdGhost: c("유령 먹", "Ghost Ink", "幽霊の墨"),
  sdThorn: c("가시 장미", "Thorned Rose", "棘の薔薇"),
  sdComet: c("혜성 붓", "Comet Brush", "彗星の筆"),
  sdButterfly: c("나비 붓끝", "Butterfly Tip", "蝶の筆先"),
  sdGate: c("황금 문", "Golden Gate", "黄金の門"),
  sdWings: c("날개 획", "Winged Stroke", "翼の線"),
  sdMeteor: c("유성 낙하", "Meteor Fall", "流星落下"),
  sdDragon: c("먹의 용", "Ink Dragon", "墨の龍"),
};

export const SD_EFFECTS: Partial<Record<SdPassive & PassiveId, Names>> = {
  sdSword: c("새 기술: 일필 베기 끝에서 검기 {n}개가 줄 방향으로 날아감 (공격력의 {mul:pct}%, 뚫고 지나감)", "New skill: {n} sword waves fly from the end of a One-Stroke Slash ({mul:pct}% of damage, piercing)", "新技：一筆斬りの終わりから剣気{n}つが線の方向へ飛ぶ（攻撃力の{mul:pct}%、貫通）"),
  sdScroll: c("새 기술: 봉인 자리에 두루마리가 펼쳐지고 {delay:sec}초 뒤 먹의 용이 솟음 (원의 {size}배 넓이 · 공격력의 {mul:pct}%)", "New skill: a scroll unrolls on the Seal, and after {delay:sec}s an ink dragon bursts out ({size}x the loop · {mul:pct}% of damage)", "新技：封印の場所に巻物が広がり{delay:sec}秒後に墨の龍が昇る（円の{size}倍の広さ・攻撃力の{mul:pct}%）"),
  sdLotus: c("새 기술: 봉인 원 안에 연꽃이 {ticks:sec}초 피어 안의 적에게 {every:sec}초마다 공격력의 {mul:pct}% · 내가 안에 있으면 체력 {heal} 회복", "New skill: a lotus blooms in the Seal for {ticks:sec}s, dealing {mul:pct}% of damage to foes inside every {every:sec}s · heals you {heal} HP while inside", "新技：封印の円の中に蓮が{ticks:sec}秒咲き、中の敵に{every:sec}秒ごとに攻撃力の{mul:pct}%・自分が中にいると体力{heal}回復"),
  sdCrane: c("새 기술: 획을 마칠 때마다 학이 날아가 가까운 적에게 부딪혀 구름으로 터짐 (공격력의 {mul:pct}%)", "New skill: each finished stroke sends a crane at the nearest foe, bursting into clouds ({mul:pct}% of damage)", "新技：線を描き終えるたびに鶴が飛び、近い敵にぶつかって雲になって弾ける（攻撃力の{mul:pct}%）"),
  sdSakura: c("새 기술: 일필 베기가 벚꽃 물결이 되어 줄 위 적을 밀쳐 냄", "New skill: One-Stroke Slash becomes a sakura wave that knocks foes away", "新技：一筆斬りが桜の波になり線上の敵を押し出す"),
  sdChain: c("새 능력: 봉인 원 안 적을 사슬로 {stun:sec}초 묶음", "New ability: chains bind foes in a Seal for {stun:sec}s", "新能力：封印の円の中の敵を鎖で{stun:sec}秒拘束"),
  sdFlame: c("새 기술: 획이 사라질 때 끝에서 불기둥이 솟아 불태움 (공격력의 {mul:pct}%)", "New skill: when a stroke fades, a flame pillar erupts at its end and burns ({mul:pct}% of damage)", "新技：線が消える時、端から火柱が上がり燃やす（攻撃力の{mul:pct}%）"),
  sdFrost: c("새 능력: 획에 닿은 적이 {slow:sec}초 느려짐 · 봉인 가운데 얼음 가시", "New ability: foes touching a stroke are slowed for {slow:sec}s · ice spikes in the center of a Seal", "新能力：線に触れた敵が{slow:sec}秒遅くなる・封印の中心に氷の棘"),
  sdVortex: c("새 기술: 봉인 원 안 적을 {ticks:sec}초 동안 가운데로 끌어당김", "New skill: pulls foes in a Seal toward its center for {ticks:sec}s", "新技：封印の円の中の敵を{ticks:sec}秒間中心へ引き寄せる"),
  sdMoon: c("새 기술: {every}번째 획을 마칠 때마다 달이 떨어짐 (공격력의 {mul:pct}%)", "New skill: every {every}th finished stroke drops a moon ({mul:pct}% of damage)", "新技：{every}本目の線を描き終えるたびに月が落ちる（攻撃力の{mul:pct}%）"),
  sdStar: c("새 기술: 획이 크게 꺾인 자리마다 별이 터짐 (한 획에 {max}개까지 · 공격력의 {mul:pct}%)", "New skill: stars burst at every sharp corner of a stroke (up to {max} per stroke · {mul:pct}% of damage)", "新技：線が大きく曲がった場所ごとに星が弾ける（1本で{max}個まで・攻撃力の{mul:pct}%）"),
  sdClock: c("새 능력: 잉크를 다 쓰면 {ticks:sec}초 동안 잉크가 닳지 않음 ({cool:sec}초마다)", "New ability: when ink runs out, it doesn't drain for {ticks:sec}s (every {cool:sec}s)", "新能力：インクを使い切ると{ticks:sec}秒間インクが減らない（{cool:sec}秒ごと）"),
  sdGhost: c("새 기술: 붓 그림으로 처치한 적에서 유령이 나와 가까운 적에게 날아감 (공격력의 {mul:pct}%)", "New skill: foes slain by your painting release a ghost that flies at the nearest foe ({mul:pct}% of damage)", "新技：筆の絵で倒した敵から幽霊が出て近い敵へ飛ぶ（攻撃力の{mul:pct}%）"),
  sdThorn: c("새 능력: 획이 {life}배 오래 남고 획 피해 {mul}배", "New ability: strokes last {life}x longer and deal {mul}x damage", "新能力：線が{life}倍長く残り線のダメージ{mul}倍"),
  sdComet: c("새 기술: 대시하면 붓 끝에서 혜성이 가까운 적에게 날아감 (공격력의 {mul:pct}% · {cool:sec}초마다)", "New skill: dashing fires a comet from the brush tip at the nearest foe ({mul:pct}% of damage · every {cool:sec}s)", "新技：ダッシュすると筆先から彗星が近い敵へ飛ぶ（攻撃力の{mul:pct}%・{cool:sec}秒ごと）"),
  sdButterfly: c("새 기술: 그리는 동안 {every}픽셀마다 붓 끝에서 나비가 날아감 (공격력의 {mul:pct}%)", "New skill: every {every}px painted releases a butterfly from the brush tip ({mul:pct}% of damage)", "新技：描いている間{every}ピクセルごとに筆先から蝶が飛ぶ（攻撃力の{mul:pct}%）"),
  sdGate: c("새 능력: 봉인 원 안에 내가 있으면 {ticks:sec}초 동안 받는 피해 {taken:pct}%", "New ability: sealing yourself inside a loop sets damage taken to {taken:pct}% for {ticks:sec}s", "新能力：封印の円の中に自分がいると{ticks:sec}秒間被ダメージ{taken:pct}%"),
  sdWings: c("새 기술: 대시한 길을 따라 잉크 없이 획이 그려짐", "New skill: dashing paints a stroke along your path without ink", "新技：ダッシュした道に沿ってインクなしで線が描かれる"),
  sdMeteor: c("새 기술: 지름 {size}이 넘는 큰 봉인 원 안에 유성 {n}개가 떨어짐 (공격력의 {mul:pct}%)", "New skill: a Seal wider than {size} calls down {n} meteors inside ({mul:pct}% of damage)", "新技：直径{size}を超える大きな封印の円の中に流星{n}個が落ちる（攻撃力の{mul:pct}%）"),
  sdDragon: c("새 기술: 잉크를 {ink} 넘게 쓴 긴 획을 마치면 먹의 용이 획을 따라 날아감 (닿는 적마다 공격력의 {mul:pct}%)", "New skill: finishing a long stroke that used over {ink} ink sends an ink dragon flying along it ({mul:pct}% of damage per foe)", "新技：インクを{ink}以上使った長い線を描き終えると墨の龍が線に沿って飛ぶ（触れた敵ごとに攻撃力の{mul:pct}%）"),
};
