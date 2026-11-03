// 방 설명 창 글: 시련의 방 · 제단의 방 (나머지 방은 roomGuide). 수치는 게임 계산 값에서 바로 가져옴
import { ALTAR, ALTAR_IDS, TRIAL_FOE_RULES as F, TRIAL_RULES as R, TRIAL_RUN_RULES as RR } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "./index";

export type L = [string, string, string];
export const pct = (x: number) => Math.round(x * 1000) / 10;
export const pick = (lang: Lang, lines: L[]) => lines.map((x) => x[lang === "en" ? 1 : lang === "ja" ? 2 : 0]);

function trial(t: (k: TextKey) => string): L[] {
  const sum = R.W_DARK + R.W_HP1 + R.W_BOSS + R.W_ENDLESS;
  const w = [R.W_DARK, R.W_HP1, R.W_BOSS, R.W_ENDLESS].map((x, i) => `${t(`trialKind_${i + 1}` as TextKey).replace(/^[^:：]*[:：]\s*/, "")} ${pct(x / sum)}%`).join(" · ");
  const pens = Array.from({ length: 10 }, (_, i) => t(`trialPen_${i + 1}` as TextKey)).join(" / ");
  return [
    [`나오는 곳: ${R.FROM_FLOOR}층부터 층마다 하나 (새빨간 방) · 비석 앞 F → 시작? YES / NO`, `Where: one per floor from floor ${R.FROM_FLOOR} (crimson room) · F at the monolith → YES / NO`, `出現: ${R.FROM_FLOOR}階から各階に1つ (真っ赤な部屋) · 石碑の前でF → YES / NO`],
    [`YES → 시련 넷 중 하나: ${w}`, `YES → one of four trials: ${w}`, `YES → 試練4つのどれか: ${w}`],
    ["무리·보스 시련: 다 이기면 1000점 · 쓰러지면 진짜 죽음", "Horde / boss trials: win them all for 1000 pts · falling is a real death", "群れ・ボスの試練: 全部勝てば1000点 · 倒れたら本当に死ぬ"],
    [`무리 ${RR.WAVES}물결 · 보스 ${RR.BOSSES}마리 한꺼번에 (사용 아이템 금지)`, `Horde: ${RR.WAVES} waves · Bosses: ${RR.BOSSES} at once (items sealed)`, `群れ ${RR.WAVES}波 · ボス${RR.BOSSES}体同時 (使用アイテム禁止)`],
    [`시련 뒤 몬스터 강화: 얻은 점수 비율만큼 (${F.CAP}점에 체력 +${pct(F.HP)}% · 피해 +${pct(F.DMG)}%, 그 위로는 그대로)`, `Monsters grow after trials by your score (at ${F.CAP} pts: HP +${pct(F.HP)}% · damage +${pct(F.DMG)}%, no more beyond)`, `試練後モンスター強化: 得た点数の割合で (${F.CAP}点で体力 +${pct(F.HP)}% · ダメージ +${pct(F.DMG)}%、それ以上は同じ)`],
    [`끝없는 무리: 처치 하나에 ${RR.KILL_SCORE}점 (최대 1000) · 쓰러져도 죽지 않고 그때 점수로 끝 (체력은 시작 때로)`, `Endless horde: ${RR.KILL_SCORE} pts per kill (max 1000) · falling doesn't kill you, it ends with that score (HP restored)`, `果てなき群れ: 1体${RR.KILL_SCORE}点 (最大1000) · 倒れても死なずその点数で終了 (体力は開始時に戻る)`],
    [`암흑·보스·끝없는 시련: 몬스터를 잡을 때마다 이동 속도 -${pct(F.SLOW_KILL)}% (보스 -${pct(F.SLOW_BOSS)}%, 최대 절반까지) · 시련 중에는 제단 증강이 나가지 않음`, `Dark, boss and endless trials: each kill slows you ${pct(F.SLOW_KILL)}% (bosses ${pct(F.SLOW_BOSS)}%, down to half speed) · altar augments are off during trials`, `暗闇・ボス・終わらない試練: 倒すたびに移動速度-${pct(F.SLOW_KILL)}%（ボス-${pct(F.SLOW_BOSS)}%、最大半分まで）· 試練中は祭壇の増強が発動しない`],
    ["100점마다 보상 상자 (아래 표) · 1000점이면 비밀의 방 고르기 상자도 · 시련 중 방을 나가면 시련은 사라짐 (보상 없음)", "Reward chests every 100 pts (table below) · 1000 pts also gives a secret-room chest · leaving mid-trial ends it (no reward)", "100点ごとに報酬箱 (下の表) · 1000点なら秘密の部屋を選ぶ箱も · 試練中に部屋を出ると試練は消える (報酬なし)"],
    [`NO → 벌칙 하나 (할 수 있는 것 중 같은 확률): ${pens}`, `NO → one penalty (equal odds among possible ones): ${pens}`, `NO → 罰1つ (可能なものから同じ確率): ${pens}`],
    ["한 판의 시련 점수는 합쳐서 최대 1000점 (예: 3층 300점 → 다음 시련은 최대 700점) · 1000점을 채우면 시련의 방이 더 나오지 않음", "Trial scores add up to at most 1000 per run (e.g. 300 on floor 3 → the next trial is capped at 700) · after 1000, no more trial rooms appear", "1ランの試練の点数は合計最大1000点（例：3階で300点 → 次の試練は最大700点）· 1000点に達すると試練の部屋はもう出ない"],
    ["비석을 건드리지 않고 나가면 아무 일 없음", "Leaving without touching the monolith does nothing", "石碑に触れずに出れば何もない"],
  ];
}

function altar(t: (k: TextKey) => string): L[] {
  const each = pct(1 / ALTAR_IDS.length);
  const names = ALTAR_IDS.map((id) => t(`altar_${id}` as TextKey)).join(" / ");
  const ig = pct(ALTAR.ignoreChance);
  return [
    [`나오는 곳: ${ALTAR.fromFloor}층부터 층마다 하나 (푸른 바다 방) · 성좌 앞 F → 카드 셋`, `Where: one per floor from floor ${ALTAR.fromFloor} (deep-blue room) · F at the constellation → three cards`, `出現: ${ALTAR.fromFloor}階から各階に1つ (青い海の部屋) · 星座の前でF → カード3枚`],
    [`성좌 ${ALTAR_IDS.length}개 중 하나 (각 ${each}%): ${names}`, `One of ${ALTAR_IDS.length} constellations (${each}% each): ${names}`, `星座${ALTAR_IDS.length}つのどれか (各${each}%): ${names}`],
    ["카드 1 거래: 성좌마다 정해진 능력치를 받고 다른 능력치를 내줌 (100%)", "Card 1 Bargain: gain that constellation's stat and give up another (100%)", "カード1 取引: 星座ごとの能力値を得て別の能力値を渡す (100%)"],
    [`카드 2 증강: 패시브 ${ALTAR.takePassives}개를 바치고 남은 패시브 하나(무작위)에 증강 기술 둘 · 패시브가 둘 이상 필요 · 한 판에 하나 (이미 있으면 최대 체력 ${ALTAR.swapHp}을 내고 바꾸기)`, `Card 2 Augment: give up ${ALTAR.takePassives} passives, a random remaining one gets two augment skills · needs at least two passives · one per run (if you have one, pay ${ALTAR.swapHp} max HP to swap)`, `カード2 増強: パッシブ${ALTAR.takePassives}つを捧げ、残り1つ(ランダム)に増強技2つ · パッシブが2つ以上必要 · 1ランに1つ（既にあれば最大体力${ALTAR.swapHp}で付け替え）`],
    [`카드 3 무시: ${ig}%로 벌칙 (카드 1에서 내주는 능력치, 또는 패시브 둘 · ??? 성좌는 패시브 ${ALTAR.unknownIgnore}개) · ${pct(1 - ALTAR.ignoreChance)}%는 아무 일 없음`, `Card 3 Ignore: ${ig}% penalty (card 1's cost, or two passives · ??? takes ${ALTAR.unknownIgnore}) · ${pct(1 - ALTAR.ignoreChance)}% nothing happens`, `カード3 無視: ${ig}%で罰 (カード1で渡す能力値、またはパッシブ2つ · ???はパッシブ${ALTAR.unknownIgnore}つ) · ${pct(1 - ALTAR.ignoreChance)}%は何もない`],
    ["카드를 고르기 전에는 방을 나갈 수 없음", "You can't leave until you pick a card", "カードを選ぶまで部屋を出られない"],
  ];
}

export function roomGuide2(kind: "trial" | "altar", lang: Lang, t: (k: TextKey) => string): string[] {
  return pick(lang, kind === "trial" ? trial(t) : altar(t));
}
