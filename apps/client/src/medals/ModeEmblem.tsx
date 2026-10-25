// 모드 훈장 가운데 문양: 무한 = ∞ · 레이드 아레나 = 우승컵 · 영웅의 길 = 별 박힌 방패 · 타워 디펜스 = 성탑
import type { ModeKind } from "./modeMedals";

export function ModeEmblem({ kind }: { kind: ModeKind }) {
  if (kind === "endless")
    return <path d="M50 62 C44 52 34 52 34 62 C34 72 44 72 50 62 C56 52 66 52 66 62 C66 72 56 72 50 62 Z" fill="none" stroke="#e8f4ff" strokeWidth="3.4" strokeLinejoin="round" />;
  if (kind === "arena")
    return (
      <g fill="#ffe27a" stroke="#7a4a08" strokeWidth="1">
        <path d="M40 48 L60 48 L58 60 C57 66 53 68 50 68 C47 68 43 66 42 60 Z" />
        <path d="M40 51 C33 51 34 60 42 60 M60 51 C67 51 66 60 58 60" fill="none" stroke="#ffe27a" strokeWidth="2" />
        <rect x="47.5" y="68" width="5" height="5" />
        <rect x="42" y="73" width="16" height="4" rx="1" />
      </g>
    );
  if (kind === "hero")
    return (
      <g>
        <path d="M38 48 L62 48 L62 62 C62 70 56 75 50 78 C44 75 38 70 38 62 Z" fill="#2a8a4a" stroke="#e8ffe0" strokeWidth="2" />
        <path d="M50 52 L52.6 58.6 L59.5 58.9 L54 63.2 L56 70 L50 66 L44 70 L46 63.2 L40.5 58.9 L47.4 58.6 Z" fill="#ffe27a" />
      </g>
    );
  return (
    <g fill="#d8c0a0" stroke="#3a2410" strokeWidth="1">
      <path d="M42 76 L42 56 L40 56 L40 50 L43 50 L43 53 L46 53 L46 50 L49 50 L49 53 L51 53 L51 50 L54 50 L54 53 L57 53 L57 50 L60 50 L60 56 L58 56 L58 76 Z" />
      <path d="M47 76 L47 69 C47 66 53 66 53 69 L53 76 Z" fill="#2a1a0a" />
      <rect x="48.5" y="58" width="3" height="5" fill="#ffd040" />
      <path d="M50 50 L50 40 L57 43 L50 46" fill="#8ad0ff" stroke="#3a2410" />
    </g>
  );
}
