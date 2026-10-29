// 히든 아이템 셋째 묶음 이름·설명 (동료·변신: 거짓된 용사 · 순례자의 월계선 · 큐피트의 정령 · 바스러져가는 왕관). 첫 묶음은 hidden.ts
import type { Names } from "./names";

const HID = { ko: "[히든] ", en: "[Hidden] ", ja: "[ヒドゥン] " };
const h = (ko: string, en: string, ja: string): Names => ({ ko: HID.ko + ko, en: HID.en + en, ja: HID.ja + ja });

export const HIDDEN2_NAMES = {
  falseHero: { ko: "거짓된 용사", en: "False Hero", ja: "偽りの勇者" },
} satisfies Record<string, Names>;

export const HIDDEN2_DESC = {
  falseHero: h(
    "풋내기 동료가 같이 싸움 (무기 무작위, 레벨이 오르면 능력치를 무작위로 고름 · 쓰러지면 다음 층에 다시) · 가까이 가서 F = 내 회복약 먹이기",
    "A Novice ally fights with you (random weapon; picks random stats on level-up · comes back next floor if downed) · get close and press F to feed it your potion",
    "新米の仲間が一緒に戦う (武器はランダム、レベルアップで能力をランダムに選ぶ · 倒れたら次の階でまた) · 近づいてF = 自分の回復薬を飲ませる",
  ),
} satisfies Record<string, Names>;

export const HIDDEN2_USE_NAMES = {
  laurelShip: { ko: "순례자의 월계선", en: "Pilgrim's Laurel Ark", ja: "巡礼者の月桂船" },
  cupidSpirit: { ko: "큐피트의 정령", en: "Cupid's Spirit", ja: "キューピッドの精霊" },
} satisfies Record<string, Names>;

export const HIDDEN2_USE_DESC = {
  crumblingCrown: h(
    "이 방에서 한 번, 거인만 한 옛 제국의 왕으로 변신 (붉은 츠바이핸더 · 체력 1000·공격력 100·방어력 30·재생력 50·치명타 50%·치명타 피해 300%·사거리 90) · 방을 나가면 풀림 · 얻으면 로비 전시장에 '영혼 조각'",
    "Once in this room, become a giant king of the old empire (red zweihänder · 1000 HP, 100 damage, 30 defense, 50 regen, 50% crit, 300% crit damage, 90 range) · ends when you leave the room · obtaining it places a 'Soul Shard' in the lobby hall",
    "この部屋で一度、巨人ほどの古き帝国の王に変身 (赤いツヴァイヘンダー · 体力1000・攻撃力100・防御力30・再生力50・クリティカル50%・クリティカルダメージ300%・射程90) · 部屋を出ると解ける · 手に入れるとロビーの展示場に「魂のかけら」",
  ),
  laurelShip: h(
    "무작위 히든 캐릭터 하나를 불러 같이 싸움 (무기 무작위 · 그 캐릭터 전용 패시브를 모두 가진 만큼 셈) · 가까이 가서 F = 내 회복약 먹이기 · 얻으면 로비 전시장에 거대한 방주 '월계선'",
    "Summon a random hidden character to fight with you (random weapon · as strong as owning all its exclusive passives) · get close and press F to feed it your potion · obtaining it places the giant 'Laurel Ark' in the lobby hall",
    "ランダムなヒドゥンキャラを呼んで一緒に戦う (武器ランダム · そのキャラ専用パッシブを全部持つ強さ) · 近づいてF = 自分の回復薬を飲ませる · 手に入れるとロビーの展示場に巨大な方舟「月桂船」",
  ),
  cupidSpirit: h(
    "정령사의 대정령 열 중 하나가 곁에 와서 정령사처럼 몇 초마다 큰 기술을 씀 (다시 쓰면 다른 대정령)",
    "One of the Spiritist's ten great spirits joins you and casts its big skill every few seconds, just like for a Spiritist (use again for a different one)",
    "精霊使いの大精霊10体のうち1体がそばに来て、精霊使いのように数秒ごとに大技を使う (もう一度使うと別の大精霊)",
  ),
} satisfies Record<string, Names>;
