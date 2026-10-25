// 이드라(비르디아) 글자 (한·영·일): 무기 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsIdra·IDRA_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type IdraPassive =
  | "idSprout" | "idSap" | "idBreeze" | "idRoots" | "idClover" | "idPetal" | "idAcorn" | "idDew" | "idSplitArrow" | "idRootArrow"
  | "idTwinStab" | "idBreaker" | "idThornShield" | "idAncientWall" | "idLongWhip" | "idBramble" | "idBloomSwap" | "idGaiaGrace" | "idFourSeasons" | "idWorldHeart";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const IDRA_WEAPON_NAMES: Record<"gaia" & WeaponId, Names> = {
  gaia: c("가이아", "Gaia", "ガイア"),
};

/** 가이아 설명 (무기 설명 뒤에 붙음) */
export const GAIA_DESC: Names = c(
  "대시 키로 모습이 바뀜 (바꿀 때 둘레에 변환 일격): 세계수 대궁(느리고 센 관통 화살) → 우드브레이커(아주 빠른 단검, 5번째마다 묶는 일격) → 가이아 버클러(반원 강타·보호막, 받는 피해 -30%) → 브라이어 스커지(한 줄을 휘감는 가시 채찍, 독)",
  "The dash key changes form (a burst around you as it shifts): World Tree Longbow (slow, heavy piercing arrows) → Woodbreaker (very fast dagger, every 5th strike roots) → Gaia Buckler (half-circle bash and shield, -30% damage taken) → Briar Scourge (thorn whip lashing a whole line, poison)",
  "ダッシュキーで姿が変わる（変わる時に周囲へ変換の一撃）：世界樹の大弓（遅く強い貫通矢）→ ウッドブレイカー（とても速い短剣、5回目ごとに縛る一撃）→ ガイアバックラー（半円の強打・シールド、被ダメージ-30%）→ ブライアスカージ（一列を薙ぐ棘の鞭、毒）",
);

export const IDRA_PASSIVE_NAMES: Record<IdraPassive & PassiveId, Names> = {
  idSprout: c("새싹 잎", "Sprout Leaf", "新芽の葉"),
  idSap: c("세계수 수액", "World Tree Sap", "世界樹の樹液"),
  idBreeze: c("산들바람", "Gentle Breeze", "そよ風"),
  idRoots: c("깊은 뿌리", "Deep Roots", "深い根"),
  idClover: c("네잎 클로버", "Four-Leaf Clover", "四つ葉のクローバー"),
  idPetal: c("꽃잎 신발", "Petal Shoes", "花びらの靴"),
  idAcorn: c("도토리", "Acorn", "どんぐり"),
  idDew: c("아침 이슬", "Morning Dew", "朝露"),
  idSplitArrow: c("갈래 화살", "Forked Arrow", "分かれ矢"),
  idRootArrow: c("뿌리 화살", "Root Arrow", "根の矢"),
  idTwinStab: c("쌍단검", "Twin Daggers", "双短剣"),
  idBreaker: c("나무 쪼개기", "Timber Split", "木割り"),
  idThornShield: c("가시 방패", "Thorn Shield", "棘の盾"),
  idAncientWall: c("태고의 벽", "Primeval Wall", "太古の壁"),
  idLongWhip: c("긴 가시 채찍", "Long Thorn Whip", "長い棘の鞭"),
  idBramble: c("가시덤불", "Bramble", "茨の茂み"),
  idBloomSwap: c("만개", "Full Bloom", "満開"),
  idGaiaGrace: c("가이아의 은총", "Gaia's Grace", "ガイアの恩寵"),
  idFourSeasons: c("사계", "Four Seasons", "四季"),
  idWorldHeart: c("세계수의 심장", "Heart of the World Tree", "世界樹の心臓"),
};

export const IDRA_EFFECTS: Partial<Record<IdraPassive & PassiveId, Names>> = {
  idDew: c("{every:sec}초마다 체력 {heal} 회복", "Heal {heal} HP every {every:sec}s", "{every:sec}秒ごとに体力{heal}回復"),
  idSplitArrow: c("대궁 화살이 세 갈래", "Longbow arrows fork into three", "大弓の矢が三本に分かれる"),
  idRootArrow: c("대궁 화살에 맞은 적이 {ticks:sec}초 묶임", "Longbow arrows root foes for {ticks:sec}s", "大弓の矢が当たった敵を{ticks:sec}秒縛る"),
  idTwinStab: c("단검이 두 번 찌름", "The dagger stabs twice", "短剣が二回突く"),
  idBreaker: c("우드브레이커 일격 3배 → {mul}배", "Woodbreaker strike ×3 → ×{mul}", "ウッドブレイカーの一撃3倍 → {mul}倍"),
  idThornShield: c("방패 모습일 때 맞으면 둘레 적에게 공격력 {mul}배 피해", "In buckler form, getting hit deals {mul}× damage around you", "盾の姿で被弾すると周囲の敵に攻撃力{mul}倍のダメージ"),
  idAncientWall: c("방패 모습일 때 받는 피해 -30% → -50% · 보호막 {gain}배", "Buckler form: damage taken -30% → -50% · shield ×{gain}", "盾の姿：被ダメージ-30% → -50%・シールド{gain}倍"),
  idLongWhip: c("채찍 사거리 +40% · 폭 +{width}", "Whip reach +40% · width +{width}", "鞭の射程+40%・幅+{width}"),
  idBramble: c("채찍 독 {poison}배 · 맞은 적이 느려짐", "Whip poison ×{poison} · lashed foes are slowed", "鞭の毒{poison}倍・当たった敵が遅くなる"),
  idBloomSwap: c("변환 일격의 범위·피해 {mul}배", "Form-shift burst range and damage ×{mul}", "変換の一撃の範囲・ダメージ{mul}倍"),
  idGaiaGrace: c("모습을 바꿀 때 체력 {heal} 회복", "Heal {heal} HP when changing form", "姿を変える時に体力{heal}回復"),
  idFourSeasons: c("네 모습을 모두 거치면 {ticks:sec}초 동안 피해 +35%", "Cycling through all four forms grants +35% damage for {ticks:sec}s", "四つの姿をすべて巡ると{ticks:sec}秒間ダメージ+35%"),
  idWorldHeart: c(
    "최대 체력 +10 · 체력이 절반 아래로 내려가면 방마다 한 번 최대 체력 25% 회복 + 2초 무적",
    "Max HP +10 · once per room, dropping below half HP heals 25% max HP and grants 2s invulnerability",
    "最大体力+10・体力が半分を下回ると部屋ごとに一度、最大体力25%回復＋2秒無敵",
  ),
};
