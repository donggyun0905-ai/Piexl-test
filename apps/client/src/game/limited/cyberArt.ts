// 네온 펄스 그림 조각 (글자 지도 → 픽셀, tigerArt.drawMap으로 그림): 네온 발자국 · 대기 때 따라다니는 드론 · 코드 조각
/** 네온 발자국 (위가 걷는 쪽, 밑창 줄무늬): 색은 그릴 때 바꿈 (o = 빛, l = 밝은 테) */
export const FOOT = [".ll.", "lool", "l..l", "lool", "l..l", "lool", ".ll."];

/** 드론 (오른쪽을 봄): 프로펠러 위 · 아래 */
export const DRONE = [
  ["ww.....ww", ".kkkkkkk.", "kcccccccK", "kcpppppck", ".kkkkkkk.", "...k.k..."],
  [".ww...ww.", ".kkkkkkk.", "kcccccccK", "kcpppppck", ".kkkkkkk.", "...k.k..."],
];
export const DRONE_COLORS: Record<string, string> = { w: "#e8f0ff", k: "#1a1430", K: "#3cf0ff", c: "#3a3058", p: "#ff3ce0" };

/** 떠오르는 코드 조각 (0 · 1) */
export const BITS = [[".o.", "o.o", "o.o", ".o."], [".o.", "oo.", ".o.", "ooo"]];
