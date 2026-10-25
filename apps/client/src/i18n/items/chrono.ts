// 시간술사 글자 (한·영·일): 무기 이름 · 무기 설명 · 전용 아이템 이름·효과 (수치는 weaponsChrono·sim/chrono·CHRONO_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export type ChronoWeapon = "pocketwatch" | "clockhands" | "hourglass" | "pendulum" | "timebomb" | "rewinddisc" | "stopwatch" | "gearstorm" | "futuresight" | "paradox";
type ChronoPassive = "longEcho" | "quickEcho" | "doubleEcho" | "timeSlow" | "haste" | "warpField" | "echoBurst" | "precision" | "clockwork" | "eternity";

export const CHRONO_WEAPON_NAMES: Record<ChronoWeapon & WeaponId, Names> = {
  pocketwatch: { ko: "회중시계", en: "Pocket Watch", ja: "懐中時計" },
  clockhands: { ko: "시곗바늘", en: "Clock Hands", ja: "時計の針" },
  hourglass: { ko: "모래시계", en: "Hourglass", ja: "砂時計" },
  pendulum: { ko: "진자", en: "Pendulum", ja: "振り子" },
  timebomb: { ko: "시한폭탄", en: "Time Bomb", ja: "時限爆弾" },
  rewinddisc: { ko: "되감기 원반", en: "Rewind Disc", ja: "巻き戻し円盤" },
  stopwatch: { ko: "스톱워치", en: "Stopwatch", ja: "ストップウォッチ" },
  gearstorm: { ko: "톱니 폭풍", en: "Gear Storm", ja: "歯車の嵐" },
  futuresight: { ko: "예지의 눈", en: "Foresight", ja: "予知の眼" },
  paradox: { ko: "패러독스", en: "Paradox", ja: "パラドックス" },
};

const ECHO = { ko: "본인은 70% · 1초 뒤 공격한 자리에서 잔상이 더 세게 한 번 더 (120%)", en: "You deal 70% · 1s later an echo repeats it harder where you attacked (120%)", ja: "本人は70% · 1秒後、攻撃した場所で残像がより強くもう一度（120%）" };
const d = (ko: string, en: string, ja: string): Names => ({ ko: `${ko} · ${ECHO.ko}`, en: `${en} · ${ECHO.en}`, ja: `${ja} · ${ECHO.ja}` });

export const CHRONO_DESC: Record<ChronoWeapon, Names> = {
  pocketwatch: d("시간탄을 쏨", "Fire a time bolt", "時間弾を撃つ"),
  clockhands: d("시곗바늘로 앞을 벰", "Slash ahead with clock hands", "時計の針で前を斬る"),
  hourglass: d("모래를 쏨, 맞은 적은 1초 느려짐", "Fire sand that slows foes for 1s", "砂を撃つ、当たった敵は1秒遅くなる"),
  pendulum: d("진자를 크게 흔들어 앞쪽 거의 반 바퀴를 벰", "Swing a pendulum through almost a half circle", "振り子を大きく振って前方ほぼ半周を斬る"),
  timebomb: d("겨눈 곳에 시한폭탄, 1초 뒤 폭발", "Lob a time bomb that explodes after 1s", "狙った場所に時限爆弾、1秒後に爆発"),
  rewinddisc: d("원반이 모두 뚫고 되감기듯 되돌아옴", "A disc pierces everything and rewinds back", "円盤がすべて貫き、巻き戻すように戻る"),
  stopwatch: d("둘레 적에게 피해, 0.4초 멈춤 (보스는 짧게)", "Damage nearby foes and freeze them for 0.4s (shorter for bosses)", "周りの敵にダメージ、0.4秒停止（ボスは短く）"),
  gearstorm: d("톱니 3개를 부채꼴로, 1명 관통", "Fire 3 gears in a fan, piercing 1", "歯車3つを扇状に、1体貫通"),
  futuresight: d("가까운 적의 미래를 보고 0.75초 뒤 그 자리에 낙뢰", "See a foe's future: lightning strikes it 0.75s later", "近くの敵の未来を見て0.75秒後その場所に落雷"),
  paradox: {
    ko: "약한 시간탄 · 잔상이 또 잔상을 남겨 2번 더 (120%씩)",
    en: "A weak time bolt · Its echo leaves another echo: 2 repeats (120% each)",
    ja: "弱い時間弾 · 残像がさらに残像を残し2回追加（120%ずつ）",
  },
};

export const CHRONO_PASSIVE_NAMES: Record<ChronoPassive & PassiveId, Names> = {
  longEcho: { ko: "긴 잔향", en: "Lingering Echo", ja: "長い残響" },
  quickEcho: { ko: "빠른 잔상", en: "Quick Echo", ja: "速い残像" },
  doubleEcho: { ko: "겹잔상", en: "Double Echo", ja: "重ね残像" },
  timeSlow: { ko: "시간 감속", en: "Time Slow", ja: "時間減速" },
  haste: { ko: "가속", en: "Haste", ja: "加速" },
  warpField: { ko: "시간 왜곡장", en: "Warp Field", ja: "時空歪曲" },
  echoBurst: { ko: "잔상 폭발", en: "Echo Burst", ja: "残像爆発" },
  precision: { ko: "정밀 시각", en: "Precise Timing", ja: "精密時刻" },
  clockwork: { ko: "태엽", en: "Clockwork", ja: "ゼンマイ" },
  eternity: { ko: "영원", en: "Eternity", ja: "永遠" },
};

export const CHRONO_EFFECTS: Record<Exclude<ChronoPassive, "haste"> & PassiveId, Names> = {
  longEcho: { ko: "잔상 피해 120% → {damage:pct}%", en: "Echo damage 120% → {damage:pct}%", ja: "残像のダメージ 120% → {damage:pct}%" },
  quickEcho: { ko: "잔상이 1초 → {ticks:sec}초 만에 나옴", en: "Echoes appear after {ticks:sec}s instead of 1s", ja: "残像が1秒 → {ticks:sec}秒で出る" },
  doubleEcho: { ko: "잔상이 {chance:pct}% 확률로 잔상을 하나 더 남김", en: "Echoes have a {chance:pct}% chance to leave another echo", ja: "残像が{chance:pct}%の確率でもう1つ残像を残す" },
  timeSlow: { ko: "맞은 적이 {ticks:sec}초 느려짐 (보스 제외)", en: "Foes hit are slowed for {ticks:sec}s (not bosses)", ja: "当たった敵が{ticks:sec}秒遅くなる（ボス除く）" },
  warpField: { ko: "사거리 안 적의 이동 속도 -{speed:down}% (보스 제외)", en: "Foes within range move {speed:down}% slower (not bosses)", ja: "射程内の敵の移動速度-{speed:down}%（ボス除く）" },
  echoBurst: { ko: "잔상이 나타날 때 그 자리에서 작은 폭발 (공격력 {damage:pct}%)", en: "Echoes burst where they appear ({damage:pct}% damage)", ja: "残像が現れる時その場で小さな爆発（攻撃力{damage:pct}%）" },
  precision: { ko: "{every}번째 공격마다 피해 {damage}배 (잔상도)", en: "Every {every:nth} attack deals {damage}x damage (echo too)", ja: "{every}回目の攻撃ごとにダメージ{damage}倍（残像も）" },
  clockwork: { ko: "이동 속도 +0.1, 대시 대기 시간 -{cooldown:down}%", en: "Move speed +0.1, dash cooldown -{cooldown:down}%", ja: "移動速度+0.1、ダッシュの待ち時間-{cooldown:down}%" },
  eternity: { ko: "최대 체력 +25, 잔상이 적을 맞힐 때마다 체력 {heal} 회복", en: "Max health +25; heal {heal} whenever an echo hits", ja: "最大体力+25、残像が敵に当たるたびに体力{heal}回復" },
};
