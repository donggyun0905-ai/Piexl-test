// 진영 특징 시스템 상태 (sim/faction*) · 모두 선택 값 (예전 저장에는 없음)

/** 아스칼론 맹세 종류: 맞지 않기 · 빠르게 정리 · 대시 절제 · 사용 아이템 안 쓰기 · 강한 적 먼저 · 자리 지키기 */
export type OathKind = "unhit" | "swift" | "still" | "noItem" | "elite" | "hold";

export interface FactionPlayerState {
  /** 탈라시아 물결 콤보 · 마지막으로 센 틱 */
  fcCombo?: number;
  fcComboT?: number;
  /** 헬리오스 타락 스택 · 폭주 남은 틱 */
  fcTaint?: number;
  fcRampage?: number;
  /** 테라코어 열 · 과부하 남은 틱 · 마지막으로 맞힌 틱 · 지난 틱 대시 중이었는지 */
  fcHeat?: number;
  fcOver?: number;
  fcHeatT?: number;
  fcDash?: boolean;
  /** 아스칼론 영광 · 이번 방 맹세 (at 방 "층/방" · t 시작 틱 · x,y 들어선 자리 · n 어긴/센 횟수 · u 찬 사용 아이템 칸 · elite 먼저 쓰러뜨릴 적 · dash 지난 틱 대시 · done 방을 끝냄 · intro 카드가 떠 있는 남은 틱 · end 끝난 틱(화면 연출)) */
  fcGlory?: number;
  fcOath?: { kind: OathKind; at: string; t: number; x: number; y: number; n: number; u?: number; elite?: number; dash?: boolean; broken?: boolean; kept?: boolean; done?: boolean; intro?: number; end?: number };
  /** 비르디아 정령 처치 수 · 다음 쏘기까지 틱 · 자리 */
  fcSpKills?: number;
  fcSpCd?: number;
  fcSpX?: number;
  fcSpY?: number;
  /** 성국 스킬 사용 수 · 지난 틱 스킬 대기 · 핵심 스킬 위력이 붙는 남은 틱 */
  fcUses?: number;
  fcCds?: number[];
  fcCoreT?: number;
}

/** 효과: 탈라시아 콤보 10단계마다 물보라 · 타락 폭주 시작 · 과열 배출 증기 폭발 · 과부하 연기 · 맹세 지킴 · 맹세 깨짐 · 정령 자람 · 정령 탄 맞음 · 핵심 스킬 각성 · 각성 핵심 스킬 금빛 빛기둥 */
export type FactionFx = "fcTideUp" | "fcRampage" | "fcVent" | "fcOverload" | "fcOathKept" | "fcOathBroken" | "fcSpGrow" | "fcSpHit" | "fcCoreOn" | "fcCorePillar" | "fcCoreArt" | "fcCoreBolt";
