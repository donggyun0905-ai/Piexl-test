// 버려진 자들 글자 (한·영·일): 무기 이름 · 기술·특수기 이름 · 무기 설명(조합 표에서 만듦) · 전용 아이템 이름·효과
import { TAG_SETS, type PassiveId, type TagMoveKind, type TagSpecialKind, type WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type AbWeapon = "streetKids" | "scrapShield" | "twinPistols" | "rooftopRifle" | "brokenBlade" | "ironPipe" | "fireworks" | "rustyChain" | "neonBat" | "lastPromise";
type AbPassive = "alleyBond" | "quickSwap" | "tagStrike" | "eldestShield" | "lastMag" | "rustyEdge" | "grewTogether" | "threeAsOne" | "streetScars" | "backAlleyRun";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const ABANDONED_WEAPON_NAMES: Record<AbWeapon & WeaponId, Names> = {
  streetKids: c("골목 삼남매", "Alley Siblings", "路地の三兄妹"),
  scrapShield: c("고철 방패", "Scrap Shield", "鉄くずの盾"),
  twinPistols: c("쌍권총", "Twin Pistols", "二丁拳銃"),
  rooftopRifle: c("옥상 저격총", "Rooftop Rifle", "屋上の狙撃銃"),
  brokenBlade: c("부러진 칼", "Broken Blade", "折れた刀"),
  ironPipe: c("쇠파이프", "Iron Pipe", "鉄パイプ"),
  fireworks: c("불꽃놀이", "Fireworks", "花火"),
  rustyChain: c("녹슨 쇠사슬", "Rusty Chain", "錆びた鎖"),
  neonBat: c("네온 야구방망이", "Neon Bat", "ネオンバット"),
  lastPromise: c("마지막 약속", "Last Promise", "最後の約束"),
};

/** 세 아이 이름 (P1 방패 · P2 총 · P3 검) */
export const MEMBER_NAMES: readonly Names[] = [c("P1 방패", "P1 Shield", "P1 盾"), c("P2 총", "P2 Gun", "P2 銃"), c("P3 검", "P3 Sword", "P3 剣")];

const MOVE_NAMES: Record<TagMoveKind, Names> = {
  bash: c("방패 치기", "Shield Bash", "盾打ち"),
  charge: c("방패 돌진", "Shield Charge", "盾突進"),
  slam: c("내려찍기", "Slam", "叩きつけ"),
  wall: c("방패 벽", "Shield Wall", "盾の壁"),
  guard: c("막기", "Guard", "防御"),
  shot: c("한 발", "Shot", "一発"),
  burst: c("세 발", "Burst", "三連射"),
  spray: c("다섯 발", "Spray", "五連射"),
  pierce: c("관통탄", "Piercer", "貫通弾"),
  grenade: c("수류탄", "Grenade", "手榴弾"),
  snipe: c("저격", "Snipe", "狙撃"),
  slash: c("베기", "Slash", "斬り"),
  thrust: c("찌르기", "Thrust", "突き"),
  spin: c("한 바퀴", "Spin", "回転斬り"),
  wave: c("검기", "Blade Wave", "剣気"),
  cross: c("X자 베기", "Cross Cut", "十字斬り"),
  dash: c("돌진 베기", "Dash Cut", "突進斬り"),
};

export const SPECIAL_NAMES: Record<TagSpecialKind, Names> = {
  shadow: c("그림자 질주", "Shadow Rush", "影の疾走"),
  blink: c("그림자 베기", "Phantom Cut", "影斬り"),
  kata: c("건 카타", "Gun Kata", "ガン・カタ"),
  waltz: c("탄환 왈츠", "Bullet Waltz", "弾丸ワルツ"),
  meteor: c("하늘 찍기", "Sky Breaker", "天落とし"),
  pinball: c("맞받아치기", "Ricochet", "打ち返し"),
};


const TAG = c("탭", "Tag", "タッチ");
const FIXED = c("공격 속도가 오르지 않음 · 틀리면 처음부터", "Attack speed never increases · a mistake restarts the chain", "攻撃速度は上がらない · 間違えると最初から");

/** 무기 설명: 세 아이의 콤보 · 조합 순서(단계마다) · 특수기 */
export function tagDesc(tag: string, lang: Lang): string {
  const set = TAG_SETS[tag];
  if (!set) return "";
  const moves = set.moves.map((list, m) => `${MEMBER_NAMES[m]![lang]}: ${list.map((mv) => MOVE_NAMES[mv.kind][lang]).join("·")}`).join(" / ");
  const step = [0, 0, 0];
  const stages = set.stages.map((st, i) => {
    const parts = st.map((n, m) => {
      const idx = Array.from({ length: n }, () => ++step[m]!).join("+");
      return `P${m + 1} ${idx}`;
    });
    const spc = set.specials[i]!;
    return `${i + 1}) ${parts.join(` ▸ ${TAG[lang]} ▸ `)} ★${SPECIAL_NAMES[spc.kind][lang]}${spc.alt ? "+" : ""}`;
  });
  return `${moves} · ${stages.join(` ▸ ${TAG[lang]} ▸ `)} ▸ ${TAG[lang]} · ${FIXED[lang]}`;
}

export const ABANDONED_PASSIVE_NAMES: Record<AbPassive & PassiveId, Names> = {
  alleyBond: c("골목의 의리", "Alley Loyalty", "路地の義理"),
  quickSwap: c("빠른 손바꿈", "Quick Swap", "素早い交代"),
  tagStrike: c("교대 일격", "Tag Strike", "交代の一撃"),
  eldestShield: c("맏이의 방패", "Eldest's Shield", "長子の盾"),
  lastMag: c("마지막 탄창", "Last Magazine", "最後の弾倉"),
  rustyEdge: c("녹슨 칼날", "Rusty Edge", "錆びた刃"),
  grewTogether: c("함께 자란 아이들", "Grew Up Together", "共に育った子ら"),
  threeAsOne: c("셋이서 하나", "Three as One", "三人で一つ"),
  streetScars: c("흉터", "Street Scars", "傷跡"),
  backAlleyRun: c("뒷골목 질주", "Back-Alley Run", "裏路地の疾走"),
};

export const ABANDONED_EFFECTS: Partial<Record<AbPassive & PassiveId, Names>> = {
  alleyBond: c("특수기 피해 +{damage:up}%", "+{damage:up}% special damage", "特殊技ダメージ+{damage:up}%"),
  quickSwap: c("탭 무적 0.5초 → {ticks:sec}초", "Tag invulnerability 0.5s → {ticks:sec}s", "タッチ無敵0.5秒 → {ticks:sec}秒"),
  tagStrike: c("탭할 때 들어오는 아이가 앞을 한 번 침 (공격력 {mul:pct}%)", "The incoming kid strikes ahead on tag ({mul:pct}% damage)", "タッチで入る子が前を一度攻撃（攻撃力{mul:pct}%）"),
  eldestShield: c("P1(방패)이 나와 있는 동안 받는 피해 -{taken:down}%", "-{taken:down}% damage taken while P1 (shield) is out", "P1（盾）が出ている間、受けるダメージ-{taken:down}%"),
  lastMag: c("P2(총) 공격 피해 +{damage:up}%", "+{damage:up}% P2 (gun) damage", "P2（銃）の攻撃ダメージ+{damage:up}%"),
  rustyEdge: c("P3(검) 공격 피해 +{damage:up}%, 맞은 적 출혈", "+{damage:up}% P3 (sword) damage; hits cause bleeding", "P3（剣）の攻撃ダメージ+{damage:up}%、当たった敵は出血"),
  grewTogether: c("특수기를 쓰면 최대 체력의 {heal:pct}% 회복", "Specials heal {heal:pct}% of max HP", "特殊技で最大体力の{heal:pct}%回復"),
  threeAsOne: c("특수기를 쓰면 {ticks:sec}초 동안 공격력 +{damage:up}%", "Specials give +{damage:up}% damage for {ticks:sec}s", "特殊技で{ticks:sec}秒間攻撃力+{damage:up}%"),
};
