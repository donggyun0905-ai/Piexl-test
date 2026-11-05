// 헬리오스 이클립스 글자 (한·영·일): 태양의 도끼 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsEclipse.ECLIPSE·ECLIPSE_PERKS와 맞춤)
import { ECLIPSE, type PassiveId, type WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type EcPassive = "ecDawn" | "ecCorona" | "ecFlare" | "ecSunspot" | "ecUmbra" | "ecHorizon" | "ecTotality" | "ecTwilight" | "ecCrown" | "ecMoonAxe";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const EC_WEAPON_NAMES: Record<"ecAxe" & WeaponId, Names> = {
  ecAxe: c("태양의 도끼", "Axe of the Sun", "太陽の斧"),
};

export const EC_PASSIVE_NAMES: Record<EcPassive & PassiveId, Names> = {
  ecDawn: c("여명의 손길", "Touch of Dawn", "黎明の手"),
  ecCorona: c("코로나", "Corona", "コロナ"),
  ecFlare: c("태양 플레어", "Solar Flare", "ソーラーフレア"),
  ecSunspot: c("흑점", "Sunspot", "黒点"),
  ecUmbra: c("본영", "Umbra", "本影"),
  ecHorizon: c("사건의 지평선", "Event Horizon", "事象の地平線"),
  ecTotality: c("개기일식", "Totality", "皆既日食"),
  ecTwilight: c("황혼", "Twilight", "黄昏"),
  ecCrown: c("헬리오스의 왕관", "Crown of Helios", "ヘリオスの王冠"),
  ecMoonAxe: c("월식의 대도끼", "Great Axe of the Eclipse", "月食の大斧"),
};

export const EC_EFFECTS: Partial<Record<EcPassive & PassiveId, Names>> = {
  ecDawn: c("태양 모습 치유의 빛 회복 +{heal:up}%", "Sun form's healing light restores +{heal:up}%", "太陽の姿の癒しの光の回復+{heal:up}%"),
  ecCorona: c("이글거리는 영역·죽음의 영역 반지름 +{r:up}%", "+{r:up}% radius for the Blazing and Death zones", "灼熱の領域・死の領域の半径+{r:up}%"),
  ecFlare: c("태양 5타 깊은 찌르기가 {size:up}% 더 길고 크게", "Sun's 5th-hit deep thrust is {size:up}% longer and larger", "太陽の5撃目の深い突きが{size:up}%長く大きく"),
  ecSunspot: c("태양 모습 치명타 확률 +{crit:pct}%p · 치명타 피해 +{critDmg:pct}%p", "Sun form: +{crit:pct}%p crit chance · +{critDmg:pct}%p crit damage", "太陽の姿：会心率+{crit:pct}%p · 会心ダメージ+{critDmg:pct}%p"),
  ecUmbra: c("죽음의 영역 피해 +{dmg:up}% · 둔화 {slow:up}% 더 길게", "Death zone deals +{dmg:up}% · slows {slow:up}% longer", "死の領域のダメージ+{dmg:up}% · 鈍化が{slow:up}%長く"),
  ecHorizon: c("블랙홀 크기·끌어당김·남는 시간 +{size:up}%", "Black hole size, pull and duration +{size:up}%", "ブラックホールの大きさ・引き寄せ・持続+{size:up}%"),
  ecTotality: c("모습이 바뀌는 순간 둘레 적에게 공격력 {mul:pct}% · {stun:sec}초 기절", "Changing form deals {mul:pct}% attack to nearby foes · stuns {stun:sec}s", "姿が変わる瞬間、周りの敵に攻撃力{mul:pct}% · {stun:sec}秒気絶"),
  ecTwilight: c("게이지가 {gain:up}% 더 빨리 참", "The gauge fills {gain:up}% faster", "ゲージが{gain:up}%早くたまる"),
  ecCrown: c("최대 체력 +20 · 모습이 바뀐 뒤 {ticks:sec}초 동안 공격력 +{dmg:pct}%", "+20 max HP · +{dmg:pct}% attack for {ticks:sec}s after changing form", "最大体力+20 · 姿が変わった後{ticks:sec}秒間攻撃力+{dmg:pct}%"),
  ecMoonAxe: c("일식 도끼 사거리 +{reach:up}% · 일식 낙하 반지름 +{slam:up}%", "+{reach:up}% Eclipse axe reach · +{slam:up}% Eclipse Fall radius", "日食の斧の射程+{reach:up}% · 日食落下の半径+{slam:up}%"),
};

const pct = (v: number) => Math.round(v * 100);

/** 태양의 도끼 설명 (수치는 ECLIPSE에서) */
export function solarDesc(lang: Lang): string {
  const E = ECLIPSE;
  const sec = (t: number) => Math.round((t / 60) * 10) / 10;
  return {
    ko: `태양(여자): 누를 때마다 작은 불의 도끼로 90°로 꺾인 긴 직각 검격(공격력 ${pct(E.sunDmg * E.cutMul)}%, 위·가운데·아래에서 꺾이고 꺾이는 끝이 앞으로 멀리 뻗음) · 4·5타는 깊게 찌름, 5타(${pct(E.sunDmg * E.sunFinMul)}%) · 기본 치명타 ${pct(E.sunCrit)}% · 이글거리는 영역(${sec(E.sunEvery)}초마다 불태움) + 치유의 빛(${sec(E.healEvery)}초마다 최대 체력 ${E.heal * 100}%)\n일식(남자): 누를 때마다 거대한 도끼로 느리지만 강한 6연 콤보(공격력 ${pct(E.nightDmg)}%): 내려베기 → 올려베기 → 흑월 회전 → 그림자 돌진 → 초승달 참격 → 일식 낙하(뛰어오른 동안 무적, 거대한 내려찍기 ${pct(E.slamMul)}% + 가운데 블랙홀) · 치명타 없음 · 죽음의 영역(피해 + 둔화)\n맞힐 때마다 게이지가 차고, 다 차면 오라에 감싸여 ${sec(E.shiftTicks)}초 무적으로 다른 모습이 됨`,
    en: `Sun (her): each press swings a small fire axe in a long slash bent at 90° (${pct(E.sunDmg * E.cutMul)}% attack, bending high, middle and low, the bend reaching far ahead) · the 4th and 5th stab deep, the 5th at (${pct(E.sunDmg * E.sunFinMul)}%) · ${pct(E.sunCrit)}% base crit · Blazing zone (burns every ${sec(E.sunEvery)}s) + healing light (${E.heal * 100}% max HP every ${sec(E.healEvery)}s)\nEclipse (him): each press swings a giant axe in a slow but heavy 6-hit combo (${pct(E.nightDmg)}% attack): Hew → Rising Cut → Black Moon Spin → Shadow Rush → Crescent Slash → Eclipse Fall (invincible in the air, huge slam ${pct(E.slamMul)}% + black hole in the center) · no crits · Death zone (damage + slow)\nEvery hit fills the gauge; when full, an aura wraps you (invincible ${sec(E.shiftTicks)}s) and you change form`,
    ja: `太陽（女）：押すたびに小さな炎の斧で90°に折れた長い直角の斬撃（攻撃力${pct(E.sunDmg * E.cutMul)}%、上・中・下で折れ、折れる先が前へ遠く伸びる）· 4・5撃目は深く突き、5撃目は（${pct(E.sunDmg * E.sunFinMul)}%）· 基本会心${pct(E.sunCrit)}% · 灼熱の領域（${sec(E.sunEvery)}秒ごとに焼く）+ 癒しの光（${sec(E.healEvery)}秒ごとに最大体力${E.heal * 100}%）\n日食（男）：押すたびに巨大な斧で遅いが強い6連コンボ（攻撃力${pct(E.nightDmg)}%）：振り下ろし → 斬り上げ → 黒月回転 → 影の突進 → 三日月斬 → 日食落下（跳んでいる間は無敵、巨大な叩きつけ${pct(E.slamMul)}% + 中央にブラックホール）· 会心なし · 死の領域（ダメージ + 鈍化）\n当てるたびにゲージがたまり、満タンでオーラに包まれ${sec(E.shiftTicks)}秒無敵になって姿が変わる`,
  }[lang];
}
