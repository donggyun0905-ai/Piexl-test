// 금기의 서 금기 30개 이름·설명 (한·영·일). 설명은 한 번 걸 때 바뀌는 양 (수치는 shared/taboo와 맞춤)
import type { TabooId } from "@pixel-rogue/shared";
import type { Lang } from "./index";

type T = Record<Lang, string>;
const c = (ko: string, en: string, ja: string): T => ({ ko, en, ja });

export const TABOO_TEXT: Record<TabooId, { name: T; desc: T }> = {
  fleshHp: { name: c("굳은 살갗", "Hardened Flesh", "硬い皮膚"), desc: c("일반 적 체력 +20%", "+20% normal enemy HP", "通常の敵の体力+20%") },
  bossHp: { name: c("군주의 위엄", "Tyrant's Majesty", "君主の威厳"), desc: c("보스 체력 +20%", "+20% boss HP", "ボスの体力+20%") },
  horde: { name: c("떼거리", "The Horde", "群れ"), desc: c("전투방 적 +1", "+1 enemy per battle room", "戦闘部屋の敵+1") },
  eliteMore: { name: c("정예의 행진", "Elite March", "精鋭の行進"), desc: c("강한 적 방 적 +2", "+2 enemies in elite rooms", "強敵部屋の敵+2") },
  haste: { name: c("서두르는 발", "Hurried Feet", "急ぐ足"), desc: c("적 이동 속도 +10%", "+10% enemy move speed", "敵の移動速度+10%") },
  fury: { name: c("성급한 손", "Restless Hands", "せっかちな手"), desc: c("적 공격 속도 +15%", "+15% enemy attack speed", "敵の攻撃速度+15%") },
  bulletSpeed: { name: c("쏜살", "Swift Bolts", "矢のように"), desc: c("적 탄 속도 +15%", "+15% enemy projectile speed", "敵の弾の速度+15%") },
  deathBurst: { name: c("죽음의 메아리", "Death's Echo", "死のこだま"), desc: c("쓰러진 적 자리에 잠시 뒤 폭발", "Fallen enemies explode shortly after", "倒れた敵の場所で少し後に爆発") },
  fangs: { name: c("날선 송곳니", "Sharp Fangs", "鋭い牙"), desc: c("적 몸에 닿는 피해 +25%", "+25% enemy contact damage", "敵に触れた時のダメージ+25%") },
  frail: { name: c("유리 그릇", "Glass Vessel", "ガラスの器"), desc: c("받는 모든 피해 +15%", "+15% damage taken", "受けるダメージ+15%") },
  shortInvuln: { name: c("짧은 숨", "Short Breath", "短い息"), desc: c("맞은 뒤 무적 시간 -30%", "-30% invulnerability after being hit", "被弾後の無敵時間-30%") },
  poverty: { name: c("빈 주머니", "Empty Purse", "空の財布"), desc: c("얻는 돈 -20%", "-20% gold gained", "得るお金-20%") },
  inflation: { name: c("물가 폭등", "Price Surge", "物価高騰"), desc: c("상점 가격 +25%", "+25% shop prices", "ショップの価格+25%") },
  emptyShelf: { name: c("빈 진열대", "Bare Shelves", "空の陳列棚"), desc: c("상점 물건 1칸 줄어듦 (사용 아이템 → 무기)", "One fewer shop item (use item, then weapon)", "ショップの商品が1枠減る（使用アイテム → 武器）") },
  rerollTax: { name: c("새로고침 세금", "Reroll Tax", "更新税"), desc: c("상점 새로고침 가격 2배", "Shop reroll costs x2", "ショップ更新の価格2倍") },
  noUseDrop: { name: c("마른 전리품", "Dry Spoils", "乾いた戦利品"), desc: c("방을 정리해도 사용 아이템이 나오지 않음", "No use items from cleared rooms", "部屋をクリアしても使用アイテムが出ない") },
  fewChoices: { name: c("좁은 선택", "Narrow Choice", "狭い選択"), desc: c("보스 보상 패시브 고르기 -1", "One fewer boss reward to choose", "ボス報酬のパッシブ選択-1") },
  poorTreasure: { name: c("빈 보물", "Hollow Treasure", "空っぽの宝"), desc: c("보물방에 무기만", "Treasure rooms hold only a weapon", "宝部屋は武器のみ") },
  lessLuck: { name: c("불운", "Ill Fortune", "不運"), desc: c("행운 -1", "-1 luck", "幸運-1") },
  weakBody: { name: c("야윈 몸", "Frail Body", "痩せた体"), desc: c("최대 체력 -10%", "-10% max HP", "最大体力-10%") },
  dullBlade: { name: c("무딘 날", "Dull Edge", "鈍い刃"), desc: c("공격력 -10%", "-10% damage", "攻撃力-10%") },
  heavyFeet: { name: c("무거운 발", "Heavy Feet", "重い足"), desc: c("이동 속도 -10%", "-10% move speed", "移動速度-10%") },
  slowHands: { name: c("굳은 손", "Stiff Hands", "こわばった手"), desc: c("공격 속도 -10%", "-10% attack speed", "攻撃速度-10%") },
  shortReach: { name: c("짧은 팔", "Short Reach", "短い腕"), desc: c("사거리 -10%", "-10% range", "射程-10%") },
  slowDash: { name: c("느린 숨결", "Slow Breath", "遅い息遣い"), desc: c("대시 재사용 시간 +25%", "+25% dash cooldown", "ダッシュの再使用時間+25%") },
  bitterPotion: { name: c("쓴 약", "Bitter Potion", "苦い薬"), desc: c("회복약 회복량 -25%", "-25% potion healing", "回復薬の回復量-25%") },
  dryWell: { name: c("마른 샘", "Dry Well", "涸れた泉"), desc: c("쉼터 회복 -50%", "-50% rest room healing", "休憩所の回復-50%") },
  lessHeal: { name: c("메마른 피", "Thin Blood", "乾いた血"), desc: c("모든 회복 -20%", "-20% all healing", "すべての回復-20%") },
  bloodToll: { name: c("피의 통행료", "Blood Toll", "血の通行料"), desc: c("방에 들어갈 때마다 체력 -2", "Lose 2 HP entering each room", "部屋に入るたびに体力-2") },
  fleeCost: { name: c("잠긴 문의 값", "Price of the Locked Door", "閉ざされた扉の代価"), desc: c("잠긴 출구로 나갈 때 내는 체력 +10%p", "+10%p HP cost to force a locked exit", "閉じた出口から出る時の体力+10%p") },
};
