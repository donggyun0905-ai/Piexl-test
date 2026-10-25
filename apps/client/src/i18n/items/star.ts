// 별지기(히든) 글자 (한·영·일): 무기 이름 · 별 설명 · 전용 아이템 이름·효과 (수치는 weaponsStar·STAR_PERKS와 맞춤)
import type { PassiveId, StarStyle, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type StarWeapon = "starStaff" | "cometTail" | "twinStars" | "blackStar" | "novaHeart" | "polaris" | "meteorShower" | "milkyWay" | "frostStar" | "tinySun";
type StarPassive = "brightStar" | "longNight" | "wideSky" | "extraStar" | "starfall" | "stardust" | "starWard" | "zodiac" | "eclipse" | "armillary";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const STAR_WEAPON_NAMES: Record<StarWeapon & WeaponId, Names> = {
  starStaff: c("별자리 지팡이", "Constellation Staff", "星座の杖"),
  cometTail: c("혜성 꼬리", "Comet Tail", "彗星の尾"),
  twinStars: c("쌍둥이 별", "Twin Stars", "双子星"),
  blackStar: c("검은 별", "Black Star", "黒い星"),
  novaHeart: c("초신성의 심장", "Heart of a Supernova", "超新星の心臓"),
  polaris: c("북극성", "Polaris", "北極星"),
  meteorShower: c("유성우", "Meteor Shower", "流星群"),
  milkyWay: c("은하수", "Milky Way", "天の川"),
  frostStar: c("얼음별", "Frost Star", "氷の星"),
  tinySun: c("작은 태양", "Tiny Sun", "小さな太陽"),
};

const BASE = c("별을 박아 별자리를 그림, 가까운 별끼리 빛줄기로 이어져 닿는 적을 태우고 별이 차면 모두 터짐", "Pin stars to draw a constellation; linked stars burn foes with beams, and a full constellation bursts", "星を打ち込み星座を描く、近い星同士が光の線でつながり敵を焼き、満ちると全て弾ける");
const d = (ko: string, en: string, ja: string): Names => c(`${BASE.ko} · ${ko}`, `${BASE.en} · ${en}`, `${BASE.ja} · ${ja}`);

/** 무기 설명 */
export const STAR_DESC: Record<StarStyle, Names> = {
  plain: d("별 5개", "5 stars", "星5つ"),
  comet: d("별을 박을 때 나에서 별까지 지나간 길의 적도 때림", "also strikes every foe on the path to the star", "星を打つとき自分から星までの道の敵も攻撃"),
  twin: d("별을 두 개씩 나란히 박음", "pins two stars side by side", "星を2つずつ並べて打つ"),
  blackhole: d("별이 둘레 적을 천천히 끌어당김 (보스 제외)", "stars slowly pull nearby foes in (not bosses)", "星が周りの敵をゆっくり引き寄せる（ボス除く）"),
  nova: d("별 3개면 완성, 터지는 힘이 아주 셈", "completes at 3 stars with a huge burst", "星3つで完成、とても強く弾ける"),
  polaris: d("나도 별 하나 (나와 가까운 별 사이에도 빛줄기)", "you are a star too (beams link you to nearby stars)", "自分も星の一つ（自分と近い星の間にも光の線）"),
  meteor: d("별을 박을 때 둘레에 유성이 2개 더 떨어짐", "two meteors also fall around each star", "星を打つと周りに流星がさらに2つ落ちる"),
  galaxy: d("빛줄기가 훨씬 멀리 이어지고 별 7개 (빛줄기는 조금 약함)", "beams reach much farther, 7 stars (slightly weaker beams)", "光の線がずっと遠くまでつながり星7つ（線は少し弱い）"),
  frost: d("빛줄기에 닿은 적이 느려짐", "beams slow foes", "光の線に触れた敵が遅くなる"),
  sun: d("빛줄기·터짐이 적을 불태움", "beams and bursts set foes ablaze", "光の線・爆発が敵を燃やす"),
};

export const STAR_PASSIVE_NAMES: Record<StarPassive & PassiveId, Names> = {
  brightStar: c("밝은 별", "Bright Star", "明るい星"),
  longNight: c("긴 밤", "Long Night", "長い夜"),
  wideSky: c("넓은 하늘", "Wide Sky", "広い空"),
  extraStar: c("별 하나 더", "One More Star", "もう一つの星"),
  starfall: c("별똥별", "Shooting Star", "流れ星"),
  stardust: c("별가루", "Stardust", "星屑"),
  starWard: c("별의 가호", "Star's Blessing", "星の加護"),
  zodiac: c("황도 12궁", "Zodiac", "黄道十二宮"),
  eclipse: c("일식", "Eclipse", "日食"),
  armillary: c("천구의", "Armillary Sphere", "天球儀"),
};

export const STAR_EFFECTS: Partial<Record<StarPassive & PassiveId, Names>> = {
  brightStar: c("빛줄기 피해 +{line:up}%", "+{line:up}% beam damage", "光の線のダメージ+{line:up}%"),
  longNight: c("별이 {life:up}% 더 오래 남음", "Stars last {life:up}% longer", "星が{life:up}%長く残る"),
  wideSky: c("빛줄기가 이어지는 거리 +{link:up}%", "+{link:up}% beam link distance", "光の線がつながる距離+{link:up}%"),
  extraStar: c("별자리에 별 +{more} (빛줄기가 더 많아짐)", "+{more} star per constellation (more beams)", "星座の星+{more}（光の線が増える）"),
  starfall: c("별을 박을 때 {chance:pct}% 확률로 둘레에 별 하나 더", "{chance:pct}% chance to pin an extra star nearby", "星を打つとき{chance:pct}%の確率で周りにもう一つ"),
  stardust: c("별자리가 완성될 때마다 최대 체력의 {heal:pct}% 회복", "Heal {heal:pct}% max HP whenever a constellation completes", "星座が完成するたびに最大体力の{heal:pct}%回復"),
  starWard: c("별자리가 완성될 때마다 보호막 {shield} (이 아이템으로는 최대 {max})", "Gain a {shield} shield whenever a constellation completes (up to {max} from this item)", "星座が完成するたびにシールド{shield}（このアイテムでは最大{max}）"),
  zodiac: c("별을 {every}개 박을 때마다 다음 별자리 터짐 {mul}배", "Every {every} stars, the next burst deals {mul}×", "星を{every}個打つたびに次の星座の爆発{mul}倍"),
  eclipse: c("별자리가 터질 때 맞은 적이 {stun:sec}초 기절", "Constellation bursts stun foes for {stun:sec}s", "星座の爆発に当たった敵が{stun:sec}秒気絶"),
};
