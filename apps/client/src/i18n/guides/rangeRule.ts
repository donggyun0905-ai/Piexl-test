// 캐릭터마다 사거리 증가가 공격에 들어가는지 (설명 끝에 한 줄 · 캐릭터 선택창 설명과 캐릭터 설명 창이 같이 씀)
// 조사 2026-11-08: 계산 코드가 사거리(stats.range · sim/util.reachOf)를 쓰는지로 나눔. 바뀌면 여기도 고침 (CLAUDE.md 규칙)
import type { CharacterId } from "@pixel-rogue/shared";
import type { Lang } from "../index";

type L3 = Record<Lang, string>;
const c = (ko: string, en: string, ja: string): L3 => ({ ko, en, ja });

/** 사거리 증가를 먹어도 공격 범위가 늘지 않는 캐릭터 */
const NO = new Set<CharacterId>(["brawler", "remnant", "orca", "fenrir", "ian", "gabriel", "wave", "rafael", "blast", "onyx", "noir", "rouge", "bleu"]);
/** 일부만 늘어나는 캐릭터: 늘어나는 것 */
const PART: Partial<Record<CharacterId, L3>> = {
  thorken: c("철구슬만 (닻으로 때리는 공격은 그대로)", "the iron ball only (anchor strikes stay the same)", "鉄球のみ（錨で殴る攻撃はそのまま）"),
  tail: c("발밑 바다 영역만 (상어 꼬리 공격은 그대로)", "the sea zone underfoot only (shark tail strikes stay the same)", "足元の海の領域のみ（サメの尾の攻撃はそのまま）"),
  hook: c("갈고리 던지는 거리만 (산탄총은 그대로)", "the hook's throw distance only (the shotgun stays the same)", "鉤を投げる距離のみ（散弾銃はそのまま）"),
};
const HEAD = c("사거리 증가", "Range bonus", "射程増加");
const YES = c("공격 범위와 이펙트가 늘어남", "attack reach and effects grow", "攻撃範囲とエフェクトが広がる");
const NOPE = c("늘어나지 않음 (공격 범위 고정)", "no effect (fixed attack reach)", "伸びない（攻撃範囲固定）");
const SOME = c("일부만", "partly", "一部のみ");

/** 설명 끝에 붙는 한 줄: "사거리 증가: …" */
export function rangeLine(ch: CharacterId, lang: Lang): string {
  const part = PART[ch];
  const body = part ? `${SOME[lang]} — ${part[lang]}` : NO.has(ch) ? NOPE[lang] : YES[lang];
  return `${HEAD[lang]}: ${body}`;
}
