// 게임 화면에 넘기는 값 (모드별 콜백)
import type { BalanceValues, CharacterId, RunState, TickInput } from "@pixel-rogue/shared";
import type { ReactNode } from "react";
import type { Lang, TextKey } from "../i18n";
import type { DrawOverlay } from "./render";
import type { Controls } from "./controls";

export type GameMode = "solo" | "daily" | "battle" | "practice" | "tutorial" | "coop" | "swarm" | "paewang";

export interface GameScreenProps {
  mode: GameMode;
  characterId: CharacterId;
  seedText: string;
  /** 이어하기 (혼자 하기만) */
  initialRun?: RunState;
  /** 이 판의 게임 수치 (배틀 방에서 정한 것. 없으면 서버에서 마지막으로 받은 값) */
  balance?: BalanceValues;
  /** 서든데스 (일일 도전): 한 대 맞으면 끝 */
  sudden?: boolean;
  /** 무한 모드 (혼자 하기 새 판만) */
  endless?: boolean;
  /** 레이드 아레나 (혼자 하기) */
  arena?: boolean;
  /** 영웅의 길 (혼자 하기) */
  hero?: boolean;
  /** 해금된 업적 (혼자 하기만, 다른 모드는 빈 목록) */
  unlocks: readonly string[];
  /** 다른 창 안에 넣은 작은 연습장 (캐릭터 설명 큰 창): Esc·캐릭터 설명 버튼을 쓰지 않음 (바깥 창이 받음) */
  embedded?: boolean;
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
  /** sameSeed: 같은 시드로 다시 */
  onRetry?: (sameSeed: boolean) => void;
  /** 연습장: 캐릭터 바꾸기 */
  onPracticeCharacter?: (id: CharacterId) => void;
  /** 매 틱 입력 (일일 도전 입력 기록) */
  onInput?: (input: TickInput) => void;
  /** 틱을 진행한 프레임마다 (배틀 상태 전달) */
  onAdvance?: (run: RunState) => void;
  /** 판이 끝났을 때 (일일 도전 기록 제출 등) */
  onRunEnd?: (run: RunState) => void;
  /** 결과 창에 덧붙일 내용 (순위 등) */
  resultExtra?: ReactNode;
  /** 결과 창 대신 보여 줄 화면 (배틀 관전) */
  afterRun?: ReactNode;
  /** 게임 위에 띄우는 창 (입력을 보내야 하는 패왕전 상점 등) */
  withControls?: (controls: () => Controls | null) => ReactNode;
  /** HUD 시간 글자 (배틀 남은 시간) */
  timeText?: () => string;
  /** 바깥에서 판을 끝냄 (배틀 시간 끝) */
  forceEnd?: boolean;
  /** 협동: 틱 진행을 바깥에 맡김 (initialRun과 함께) */
  step?: (run: RunState, input: TickInput) => boolean;
  /** 협동: 화면 맨 위에 더 그리기 (이름표·신호) */
  overlay?: DrawOverlay;
  /** 협동: 화면용 상태 만들기 (확정 + 짐작) */
  show?: (run: RunState) => void;
}
