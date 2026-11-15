// 메인 퀘스트 표 (docs/QUEST.md 5절): 차례대로 하나씩 · 할 일(need)을 모두 이루면 끝 → 장(stage)·모드(opens)·다음 퀘스트에 필요한 나라(fields)가 열림
// 할 일: visit = 그 장소에 가서 말 걸기·쓰기 (region = 그 장소가 있는 지역 id, 화살표·안내 글) · leave = 아지트 밖으로 · 나머지는 던전 기록 (storyStage와 같은 기록)
// 글자: i18n/text/quest (q{번호}Title · q{번호}Done) · 레이드는 연합 국가가 정해질 때까지 퀘스트 없음 (사용자 2026-11-15)
import type { TextKey } from "../i18n";
import type { Feature } from "./storyStage";

export type QuestCond =
  | { visit: string; region: string; name: TextKey }
  | { leave: true }
  | { floor: number }
  | { wins: number }
  | { lastBoss: true }
  | { hero: number }
  | { endless: number };

export interface Quest {
  need: readonly QuestCond[];
  /** 끝나면 이 장까지 열림 (그 장 이야기 장면을 보여 줌) */
  stage?: number;
  /** 끝나면 열리는 모드 */
  opens?: readonly Feature[];
  /** 끝나면 들어갈 수 있는 지역 (다음 퀘스트 장소 · 장으로 아직 안 열렸어도) */
  fields?: readonly string[];
}

export const QUESTS: readonly Quest[] = [
  /** 0 첫 페이지: 아지트 밖으로 */
  { need: [{ leave: true }] },
  /** 1 무너진 성벽: 아스칼론 성채의 장수 → 1장 · 로그 시작(던전 입구) */
  { need: [{ visit: "ascalonGeneral", region: "ascalonKeep", name: "general" }], stage: 1, opens: ["solo"] },
  /** 2 첫 흉수: 던전 1층 보스 → 로비(아지트 오락실 문) · 함께 하기 · 협동 */
  { need: [{ floor: 2 }], opens: ["lobby", "battle", "coop"] },
  /** 3 기억의 탑: 탑에 가 보기 + 던전 3층 보스 → 2장 · 영웅의 길 */
  { need: [{ visit: "memoryTower", region: "ascalon", name: "wpTower" }, { floor: 4 }], stage: 2, opens: ["hero"] },
  /** 4 끝없는 계단: 영웅의 길 1단계 → 무한 모드 · 사막·헬리오스 길 */
  { need: [{ hero: 1 }], opens: ["endless"], fields: ["desert", "helios"] },
  /** 5 제국의 광장: 첫 클리어 + 헬리오스 황제 석상 → 3장 · 레이드 아레나 · 실베르 길 */
  { need: [{ wins: 1 }, { visit: "heliosStatue", region: "helios", name: "wpStatue" }], stage: 3, opens: ["arena"], fields: ["silber"] },
  /** 6 북쪽의 문: 무한 모드 10층 + 실베르 문 앞 아수라 → 4장 · 타워 디펜스 */
  { need: [{ endless: 10 }, { visit: "gateGuard", region: "silber", name: "asura" }], stage: 4, opens: ["td"] },
  /** 7 날마다 적히는 이야기: (게시판은 Q5에서) → 일일 도전 · 이벤트 */
  { need: [{ wins: 2 }], opens: ["daily", "events"] },
  /** 8 모래 밑의 신전: 라스트 보스 + 태초의 신전 → 5장 · 광야의 새벽 */
  { need: [{ lastBoss: true }, { visit: "temple", region: "desert", name: "wpTemple" }], stage: 5, opens: ["swarm"] },
  /** 9 왕들의 싸움: 영웅의 길 3단계 + 테라코어 콜로세움 → 6장 · 패왕전 */
  { need: [{ hero: 3 }, { visit: "colosseum", region: "terracore", name: "wpColosseum" }], stage: 6, opens: ["paewang"] },
  /** 10~12 뒷이야기: 클리어 5·8·12번 → 7·8·9장 (9장에 금기) */
  { need: [{ wins: 5 }], stage: 7 },
  { need: [{ wins: 8 }], stage: 8 },
  { need: [{ wins: 12 }], stage: 9, opens: ["taboo"] },
];
