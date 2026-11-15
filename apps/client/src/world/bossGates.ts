// 세계 지도 최종보스 입구 (2026-11-15 사용자: 서브 퀘스트, 강해진 뒤 와서 깸) · 스토리에 맞는 나라에 둠 · F → 보스 창 → 7층 보스방으로 바로 (world/BossTry)
// 자리는 걸어서 갈 수 있고 장소·사냥터와 떨어진 칸 (자동으로 찾음) · 기록·업적·순위에는 안 넣고 보상만 (칩 · 1~2성 장신구)
import type { LastBossKind } from "@pixel-rogue/shared";

export interface BossGate {
  boss: LastBossKind;
  region: string;
  tx: number;
  ty: number;
  /** 권장 투력 */
  power: number;
}

export const BOSS_GATES: readonly BossGate[] = [
  /** 파멸의 용: 아스칼론을 습격한 용 (북쪽 산자락 둥지) */
  { boss: "dragon", region: "ascalon", tx: 70, ty: 11, power: 4000 },
  /** 태초의 빛과 어둠: 대사막 태초의 신전에 봉인되어 있던 둘 (신전 옆 봉인의 문) */
  { boss: "plight", region: "desert", tx: 210, ty: 113, power: 5000 },
  /** 검은 잔영: 모래벌레·전갈·괴조를 부르는 그림자 (대사막 북쪽) */
  { boss: "umbra", region: "desert", tx: 126, ty: 9, power: 5500 },
  /** 갓이터: 헬리오스 */
  { boss: "godeater", region: "helios", tx: 104, ty: 8, power: 4500 },
  /** 괴력난신: 싸움을 좋아하는 반신 (테라코어 콜로세움 옆) */
  { boss: "demigod", region: "terracore", tx: 150, ty: 132, power: 6000 },
  /** 제천대성: 성국 */
  { boss: "sage", region: "seongguk", tx: 57, ty: 6, power: 6500 },
  /** 레비아탄: 해저 도시 */
  { boss: "leviathan", region: "undersea", tx: 85, ty: 8, power: 7000 },
  /** 켈베로스 · 아스모데우스의 화신체: 지옥 */
  { boss: "cerberus", region: "hell", tx: 153, ty: 6, power: 7000 },
  { boss: "asmodeus", region: "hell", tx: 99, ty: 7, power: 7500 },
];

export const gatesIn = (region: string): BossGate[] => BOSS_GATES.filter((g) => g.region === region);
export const gateOf = (boss: string): BossGate | undefined => BOSS_GATES.find((g) => g.boss === boss);
