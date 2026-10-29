// 히든 아이템 이름·설명 (차원의 순례자 히든 상점, itemsHidden). 설명 앞에 [히든] 표시
import type { HIDDEN_PASSIVES } from "@pixel-rogue/shared";
import type { Names } from "./names";

type HiddenId = keyof typeof HIDDEN_PASSIVES;

export const HIDDEN_NAMES: Record<HiddenId, Names> = {
  relicRed: { ko: "아티팩터의 금기된 적색 아티팩트", en: "Artifacter's Forbidden Red Artifact", ja: "アーティファクターの禁じられた赤のアーティファクト" },
  relicBlue: { ko: "아티팩터의 금기된 청색 아티팩트", en: "Artifacter's Forbidden Blue Artifact", ja: "アーティファクターの禁じられた青のアーティファクト" },
  relicSilver: { ko: "아티팩터의 금기된 은색 아티팩트", en: "Artifacter's Forbidden Silver Artifact", ja: "アーティファクターの禁じられた銀のアーティファクト" },
  relicGold: { ko: "아티팩터의 금기된 금색 아티팩트", en: "Artifacter's Forbidden Gold Artifact", ja: "アーティファクターの禁じられた金のアーティファクト" },
  relicPrism: { ko: "아티팩터의 금기된 화려한 아티팩트", en: "Artifacter's Forbidden Prismatic Artifact", ja: "アーティファクターの禁じられた華やかなアーティファクト" },
  relicWhite: { ko: "아티팩터의 금기된 백색 아티팩트", en: "Artifacter's Forbidden White Artifact", ja: "アーティファクターの禁じられた白のアーティファクト" },
  relicGreen: { ko: "아티팩터의 금기된 녹색 아티팩트", en: "Artifacter's Forbidden Green Artifact", ja: "アーティファクターの禁じられた緑のアーティファクト" },
  ifritClaw: { ko: "이프리트의 발톱", en: "Ifrit's Claw", ja: "イフリートの爪" },
  sylphQuiver: { ko: "실피드의 화살통", en: "Sylph's Quiver", ja: "シルフィードの矢筒" },
  gnomeHammer: { ko: "노움의 망치", en: "Gnome's Hammer", ja: "ノームの槌" },
  dryadOrb: { ko: "드라이어드의 수정구", en: "Dryad's Crystal Orb", ja: "ドライアドの水晶玉" },
  aphroditeMirror: { ko: "아프로디테의 거울", en: "Aphrodite's Mirror", ja: "アフロディーテの鏡" },
  godShard: { ko: "떨어진 신의 파편", en: "Fallen God's Shard", ja: "堕ちた神の欠片" },
  blizzardLance: { ko: "블리자드 랜스", en: "Blizzard Lance", ja: "ブリザードランス" },
  fallenWings: { ko: "떨어진 신의 날개", en: "Fallen God's Wings", ja: "堕ちた神の翼" },
  petFlute: { ko: "애호의 피리", en: "Flute of Fondness", ja: "愛護の笛" },
};

const HID = { ko: "[히든] ", en: "[Hidden] ", ja: "[ヒドゥン] " };
const h = (ko: string, en: string, ja: string): Names => ({ ko: HID.ko + ko, en: HID.en + en, ja: HID.ja + ja });

export const HIDDEN_DESC: Record<HiddenId, Names> = {
  relicRed: h("적을 쓰러뜨릴 때마다 공격력 +0.02 (왼쪽 위 붉은 스택 창)", "+0.02 damage per kill (red stack window, top left)", "撃破するたびに攻撃力+0.02 (左上の赤いスタック)"),
  relicBlue: h("적을 쓰러뜨릴 때마다 공격 속도 +0.02%", "+0.02% attack speed per kill", "撃破するたびに攻撃速度+0.02%"),
  relicSilver: h("적을 쓰러뜨릴 때마다 방어력 +0.02", "+0.02 defense per kill", "撃破するたびに防御力+0.02"),
  relicGold: h("적을 쓰러뜨릴 때마다 치명타 확률 +0.02%", "+0.02% crit chance per kill", "撃破するたびにクリティカル率+0.02%"),
  relicPrism: h("적을 쓰러뜨릴 때마다 치명타 피해 +0.1%", "+0.1% crit damage per kill", "撃破するたびにクリティカルダメージ+0.1%"),
  relicWhite: h("적을 쓰러뜨릴 때마다 최대 체력 +0.1", "+0.1 max HP per kill", "撃破するたびに最大体力+0.1"),
  relicGreen: h("적을 쓰러뜨릴 때마다 재생력 +0.1", "+0.1 regen per kill", "撃破するたびに再生力+0.1"),
  ifritClaw: h("맞힐 때마다 화상 (5번까지 겹쳐 세짐)", "Every hit burns (stacks up to 5 times)", "当てるたびに火傷 (5回まで重なって強くなる)"),
  sylphQuiver: h("맞힐 때 50%로 적을 쫓아가며 베는 회오리", "50% on hit to raise a whirlwind that chases and cuts foes", "当てると50%で敵を追って斬るつむじ風"),
  gnomeHammer: h("맞힌 자리에 늘 작은 범위 공격 (피해 50%)", "Every hit also strikes the area around it (50% damage)", "当てた所に必ず小さな範囲攻撃 (ダメージ50%)"),
  dryadOrb: h("1초마다 30%로 최대 체력의 3% 회복", "Each second, 30% to restore 3% max HP", "1秒ごとに30%で最大体力の3%回復"),
  aphroditeMirror: h("맞으면 30%로 앞에 거울이 나타나 받은 피해의 2배 빛 레이저", "When hit, 30% for a mirror to fire a light laser for double the damage taken", "被弾すると30%で前に鏡が現れ、受けたダメージの2倍の光レーザー"),
  blizzardLance: h("등 뒤에 얼음 창 5개 · 맞힐 때 30%로 다섯 창이 한 줄로 돌진했다 돌아옴, 20%로 빙결 (공격력 10% 피해 + 1.5초 경직)", "Five ice lances float at your back · on hit, 30% for all five to charge in a line and return, 20% to freeze (10% damage + 1.5s stun)", "背中に氷の槍5本 · 当てると30%で5本が一列に突進して戻り、20%で凍結 (攻撃力10%ダメージ + 1.5秒硬直)"),
  fallenWings: h("몸 좌우에 커다란 신의 날개 · 이동 속도 + · 몸에 부딪히는 공격에 맞지 않음", "Huge divine wings at your sides · faster movement · immune to contact damage", "体の左右に大きな神の翼 · 移動速度アップ · 体当たり攻撃を受けない"),
  petFlute: h("로비의 모든 펫이 같이 다니며 능력도 모두 줌", "Every lobby pet follows you and grants its ability", "ロビーのペット全員が一緒に歩き、能力もすべて得る"),
  godShard: h("얻을 때 신의 힘 하나: 공격력 +30% · 공격 속도 +30% · 방어력 +15 · 재생력 +20 · 이동 속도 + · 치명타 +50% · 치명타 피해 +150% · 예리함 +30% · 행운 +10 · 사거리 +100 중", "Grants one divine power: +30% damage · +30% attack speed · +15 defense · +20 regen · move speed · +50% crit · +150% crit damage · +30% sharpness · +10 luck · +100 range", "神の力を一つ得る: 攻撃力+30% · 攻撃速度+30% · 防御力+15 · 再生力+20 · 移動速度 · クリティカル+50% · クリティカルダメージ+150% · 鋭さ+30% · 幸運+10 · 射程+100"),
};

export const HIDDEN_USE_NAMES = {
  aetherBomb: { ko: "에테르 폭탄", en: "Aether Bomb", ja: "エーテル爆弾" },
  forbiddenScroll: { ko: "대마법사의 금지된 주문서", en: "Archmage's Forbidden Scroll", ja: "大魔法使いの禁じられた呪文書" },
  dimensionGate: { ko: "차원이동문", en: "Dimension Gate", ja: "次元移動門" },
  portalGun: { ko: "포탈건", en: "Portal Gun", ja: "ポータルガン" },
  fateDice: { ko: "운명의 주사위", en: "Dice of Fate", ja: "運命のサイコロ" },
  cursedDice: { ko: "저주받은 주사위", en: "Cursed Dice", ja: "呪われたサイコロ" },
  terraform: { ko: "테라포밍", en: "Terraforming", ja: "テラフォーミング" },
};

export const HIDDEN_USE_DESC = {
  aetherBomb: h("폭탄의 3배 피해로 더 넓게 터짐", "Explodes wider for three times a bomb's damage", "爆弾の3倍のダメージでより広く爆発"),
  forbiddenScroll: h("방 전체에 메테오가 쏟아짐", "Meteors rain down across the whole room", "部屋中にメテオが降り注ぐ"),
  dimensionGate: h("이 층을 건너뛰고 다음 층으로 (마지막 층이면 클리어)", "Skip this floor and go to the next (clears the run on the last floor)", "この階を飛ばして次の階へ (最後の階ならクリア)"),
  portalGun: h("처음 쓰면 이 방을 기억 (아이템은 남음) · 다시 쓰면 그 방으로 돌아감 (같은 층, 쓰면 사라짐)", "First use marks this room (the item stays) · use again to return there (same floor; then it's gone)", "最初に使うとこの部屋を記憶 (アイテムは残る) · もう一度使うとその部屋へ戻る (同じ階、使うと消える)"),
  fateDice: h("머리 위 주사위가 굴러감 · 1 패시브 하나 뺏김 · 2 무기 바뀜 · 3 패시브 하나 · 4 체력 1 · 5 보상 꾸러미 · 6 공격력·방어력·재생력 6, 공격 속도 6%, 체력 60, 치명타 6%", "A die rolls overhead · 1 lose a passive · 2 weapon swaps · 3 gain a passive · 4 HP drops to 1 · 5 reward bundle · 6 +6 damage, defense and regen, +6% attack speed, +60 HP, +6% crit", "頭上でサイコロが転がる · 1 パッシブを一つ失う · 2 武器が変わる · 3 パッシブ一つ · 4 体力1 · 5 報酬の包み · 6 攻撃力・防御力・再生力6、攻撃速度6%、体力60、クリティカル6%"),
  cursedDice: h("숫자를 고르고 굴림 · 맞으면 화려한 보물 상자 (패시브 10 · 고르는 무기 · 아이템 2 · 큰 능력치) · 틀리면 저주 (몬스터·보스 소환 / 최대 체력 44 / 패시브 모두 없어짐 / 맨손 + 몬스터)", "Pick a number and roll · hit it for a dazzling treasure chest (10 passives, a weapon of choice, 2 items, big stats) · miss for a curse (monsters or a boss / max HP 44 / lose all passives / bare hands + monsters)", "数字を選んで振る · 当たれば華やかな宝箱 (パッシブ10 · 選べる武器 · アイテム2 · 大きな能力) · 外れると呪い (モンスター・ボス召喚 / 最大体力44 / パッシブ全消失 / 素手 + モンスター)"),
  terraform: h("이 층 보스와 맵을 고른 보스로 바꿈 (모든 층 보스, 최종 보스 제외 · 보스방에 들어가기 전에)", "Change this floor's boss and terrain to the boss you pick (any floor boss, not final bosses · before entering the boss room)", "この階のボスと地形を選んだボスに変える (全階のボス、最終ボス除く · ボス部屋に入る前に)"),
};
