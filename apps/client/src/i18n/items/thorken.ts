// 탈라시아 토르켄 글자 (한·영·일): 철구공 무기 이름·기술 설명 · 전용 아이템 이름·효과 (수치는 weaponsThorken·THORKEN_PERKS와 맞춤)
import type { BallKind, FlailStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type TkWeapon = "tkIron" | "tkTide" | "tkVolt" | "tkWhirl" | "tkUrchin" | "tkTwin" | "tkGeyser" | "tkFloe" | "tkKraken" | "tkMaelstrom";
type TkPassive = "tkSail" | "tkGull" | "tkPearl" | "tkCompass" | "tkBell" | "tkBarnacle" | "tkWhale" | "tkTrident" | "tkCoral" | "tkLighthouse";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const TK_WEAPON_NAMES: Record<TkWeapon & WeaponId, Names> = {
  tkIron: c("무쇠 철구", "Iron Ball", "鉄の鉄球"),
  tkTide: c("조수 철구", "Tide Ball", "潮の鉄球"),
  tkVolt: c("뇌운 철구", "Thundercloud Ball", "雷雲の鉄球"),
  tkWhirl: c("소용돌이 철구", "Whirlpool Ball", "渦潮の鉄球"),
  tkUrchin: c("성게 철구", "Urchin Ball", "ウニの鉄球"),
  tkTwin: c("쌍둥이 철구", "Twin Balls", "双子の鉄球"),
  tkGeyser: c("간헐천 철구", "Geyser Ball", "間欠泉の鉄球"),
  tkFloe: c("빙해 철구", "Ice Floe Ball", "氷海の鉄球"),
  tkKraken: c("크라켄 철구", "Kraken Ball", "クラーケンの鉄球"),
  tkMaelstrom: c("대해일 철구", "Maelstrom Ball", "大海嘯の鉄球"),
};

/** 철구공마다 기술 */
const BALL: Record<BallKind, Names> = {
  iron: c("무겁고 단단한 기본 철구", "a heavy, solid ball", "重く硬い基本の鉄球"),
  tide: c("휘두른 끝에서 물결이 퍼져 적을 밀어냄", "a wave bursts where the swing ends, pushing foes away", "振り終わりで波が広がり敵を押し流す"),
  volt: c("철구에 맞은 적 둘레로 번개가 두 갈래 튐", "lightning forks to 2 foes near each one hit", "鉄球が当たった敵の周りに雷が2本跳ぶ"),
  whirl: c("철구가 멈춘 자리에 소용돌이 (끌어당김, 셋까지)", "leaves a whirlpool where it stops (pulls, up to 3)", "止まった場所に渦潮（引き寄せ、3つまで）"),
  urchin: c("휘두른 끝에서 가시 8개가 사방으로 튐", "8 spines burst out where the swing ends", "振り終わりでトゲ8本が四方に飛ぶ"),
  twin: c("사슬 끝에 공 둘 (반대쪽도 같이 휩씀)", "two balls on the chain (the far side sweeps too)", "鎖の先に球が2つ（反対側も一緒に薙ぐ）"),
  geyser: c("세 번 휘두를 때마다 공 자리에 물기둥 (띄워 기절)", "every 3rd swing, a geyser erupts at the ball (launch-stun)", "3回振るごとに球の場所に水柱（打ち上げ気絶）"),
  floe: c("맞은 적이 얼어붙듯 느려짐 · 느려진 적은 +25% 아픔", "hits slow foes as if frozen · slowed foes take +25%", "当たった敵が凍えたように鈍化 · 鈍化した敵は+25%"),
  kraken: c("사슬이 35% 길고, 사슬에 닿은 적도 벰", "a 35% longer chain that also cuts foes it touches", "鎖が35%長く、鎖に触れた敵も斬る"),
  maelstrom: c("한 번에 한 바퀴를 돌며 휘두름 (느리지만 가장 넓음)", "each swing goes a full circle (slow but widest)", "一振りで一回転（遅いが最も広い）"),
};

/** 닻 무기 설명: 철구공 기술 */
export function flailDesc(st: FlailStyle, lang: Lang): string {
  const ball = c(`철구 피해 ×${st.power}`, `ball ×${st.power}`, `鉄球ダメージ ×${st.power}`);
  return `${ball[lang]} · ${BALL[st.ball][lang]}`;
}

/** 캐릭터 설명용: 닻·철구공이 움직이는 법 */
export const ANCHOR_DESC = c(
  "처음 누르면 철구공을 던져 떨어진 자리에 천둥 · 그 뒤 닻을 휘두를 때마다 사슬 끝 철구공이 같이 크게 휘둘러짐 · 대시하면 철구공을 감아 들임 · 폭풍 게이지가 차면 태풍 + 천둥",
  "First press throws the ball (thunder where it lands) · every anchor swing then whips the chained ball around too · dash reels it back · a full Storm gauge calls a typhoon + thunder",
  "最初の入力で鉄球を投げ、落ちた場所に雷 · 以後は錨を振るたび鎖の先の鉄球も大きく振り回される · ダッシュで鉄球を巻き戻す · 嵐ゲージが満ちると台風 + 雷",
);

export const TK_PASSIVE_NAMES: Record<TkPassive & PassiveId, Names> = {
  tkSail: c("순풍의 돛", "Tailwind Sail", "順風の帆"),
  tkGull: c("갈매기 깃털", "Gull Feather", "カモメの羽"),
  tkPearl: c("심해 진주", "Deep-Sea Pearl", "深海の真珠"),
  tkCompass: c("해방의 나침반", "Compass of Liberty", "解放の羅針盤"),
  tkBell: c("해방의 종", "Bell of Liberty", "解放の鐘"),
  tkBarnacle: c("따개비 사슬", "Barnacle Chain", "フジツボの鎖"),
  tkWhale: c("고래의 노래", "Whale Song", "クジラの歌"),
  tkTrident: c("바다의 삼지창", "Sea Trident", "海の三叉槍"),
  tkCoral: c("산호 갑옷", "Coral Armor", "珊瑚の鎧"),
  tkLighthouse: c("등대", "Lighthouse", "灯台"),
};

export const TK_EFFECTS: Partial<Record<TkPassive & PassiveId, Names>> = {
  tkSail: c("대시가 끝나면 {ticks:sec}초 동안 휘두르기가 {speed}배 빨라짐", "After a dash, swing {speed}x faster for {ticks:sec}s", "ダッシュ後{ticks:sec}秒間、振りが{speed}倍速く"),
  tkGull: c("폭풍 게이지가 {mul}배 빨리 참", "Storm gauge fills {mul}x faster", "嵐ゲージが{mul}倍速くたまる"),
  tkPearl: c("태풍이 불 때 천둥 +{bolts}", "+{bolts} thunderbolts when a typhoon is called", "台風のとき雷+{bolts}"),
  tkCompass: c("철구공 한 번에 적 {need}명 이상 맞히면 최대 체력 {heal:pct}% 회복", "Hit {need}+ foes with one ball swing to heal {heal:pct}% max HP", "鉄球の一振りで敵{need}体以上に当てると最大体力の{heal:pct}%回復"),
  tkBell: c("태풍이 불면 {invuln:sec}초 무적 + 둘레 적 탄을 지움", "Calling a typhoon grants {invuln:sec}s invincibility and clears nearby enemy shots", "台風を呼ぶと{invuln:sec}秒無敵 + 周りの敵弾を消す"),
  tkBarnacle: c("사슬 길이 +{chain:up}%", "+{chain:up}% chain length", "鎖の長さ+{chain:up}%"),
  tkWhale: c("던진 철구공의 천둥 범위 +{r:up}% · 피해 {mul}배", "The thrown ball's thunder: +{r:up}% radius · {mul}x damage", "投げた鉄球の雷: 範囲+{r:up}% · ダメージ{mul}倍"),
  tkTrident: c("닻을 휘두르면 앞으로 물살 {n}줄기 (공격력 {mul:pct}%)", "Anchor swings send {n} water jets forward ({mul:pct}% attack)", "錨を振ると前方に水流{n}本（攻撃力{mul:pct}%）"),
  tkCoral: c("철구공이 나가 있는 동안 받는 피해 -{taken:down}%", "-{taken:down}% damage taken while the ball is out", "鉄球が出ている間、被ダメージ-{taken:down}%"),
  tkLighthouse: c("태풍 시간 {ticks}배 · 끌어당김 {pull}배", "Typhoons last {ticks}x and pull {pull}x harder", "台風の時間{ticks}倍 · 引き寄せ{pull}倍"),
};
