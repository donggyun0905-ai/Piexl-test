// 방 설명 창 글: 시련의 방 · 제단의 방 (나머지 방은 roomGuide). 수치는 게임 계산 값에서 바로 가져옴
import { ALTAR, ALTAR_IDS, TRIAL_RULES as R, TRIAL_RUN_RULES } from "@pixel-rogue/shared";
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
    [`끝없는 무리: 처치 하나에 ${TRIAL_RUN_RULES.KILL_SCORE}점 (최대 1000) · 쓰러져도 죽지 않고 그때 점수로 끝 (체력은 시작 때로)`, `Endless horde: ${TRIAL_RUN_RULES.KILL_SCORE} pts per kill (max 1000) · falling doesn't kill you, it ends with that score (HP restored)`, `果てなき群れ: 1体${TRIAL_RUN_RULES.KILL_SCORE}点 (最大1000) · 倒れても死なずその点数で終了 (体力は開始時に戻る)`],
    ["100점마다 보상 상자 (아래 표) · 1000점이면 비밀의 방 고르기 상자도 · 시련 중 방을 나가면 시련은 사라짐 (보상 없음)", "Reward chests every 100 pts (table below) · 1000 pts also gives a secret-room chest · leaving mid-trial ends it (no reward)", "100点ごとに報酬箱 (下の表) · 1000点なら秘密の部屋を選ぶ箱も · 試練中に部屋を出ると試練は消える (報酬なし)"],
    [`NO → 벌칙 하나 (할 수 있는 것 중 같은 확률): ${pens}`, `NO → one penalty (equal odds among possible ones): ${pens}`, `NO → 罰1つ (可能なものから同じ確率): ${pens}`],
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
    [`카드 2 증강: 패시브 ${ALTAR.takePassives}개를 바치고 남은 패시브 하나(무작위)에 증강 기술 둘 · 패시브가 하나는 있어야 함`, `Card 2 Augment: give up ${ALTAR.takePassives} passives, a random remaining one gets two augment skills · needs at least one passive`, `カード2 増強: パッシブ${ALTAR.takePassives}つを捧げ、残り1つ(ランダム)に増強技2つ · パッシブが1つは必要`],
    [`카드 3 무시: ${ig}%로 벌칙 (카드 1에서 내주는 능력치, 또는 패시브 둘 · ??? 성좌는 패시브 ${ALTAR.unknownIgnore}개) · ${pct(1 - ALTAR.ignoreChance)}%는 아무 일 없음`, `Card 3 Ignore: ${ig}% penalty (card 1's cost, or two passives · ??? takes ${ALTAR.unknownIgnore}) · ${pct(1 - ALTAR.ignoreChance)}% nothing happens`, `カード3 無視: ${ig}%で罰 (カード1で渡す能力値、またはパッシブ2つ · ???はパッシブ${ALTAR.unknownIgnore}つ) · ${pct(1 - ALTAR.ignoreChance)}%は何もない`],
    ["카드를 고르기 전에는 방을 나갈 수 없음", "You can't leave until you pick a card", "カードを選ぶまで部屋を出られない"],
  ];
}

export function roomGuide2(kind: "trial" | "altar", lang: Lang, t: (k: TextKey) => string): string[] {
  return pick(lang, kind === "trial" ? trial(t) : altar(t));
}
