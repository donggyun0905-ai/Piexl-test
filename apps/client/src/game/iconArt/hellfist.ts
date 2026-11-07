// 새벽의 성흔 헬피스트 아이콘: 적혈의 주먹 (검붉은 악마 팔·붉은 핏줄·흰 마디) · 전용 아이템 20 (주먹 5 · 악마화 5 · 허공 긁기 5 · 적혈 5)
import type { Pen } from "./pen";

const SKIN = "#3a1418";
const RED = "#d8202a";
const HOT = "#ff4a3a";
const DARK = "#1a0608";
const BONE = "#f0e4dc";
const EMBER = "#ff8a3a";
const WHITE = "#ffffff";
const STONE = "#6a6470";

/** 주먹 (왼쪽 위 x,y · 크기 n) */
function fist(g: Pen, x: number, y: number, n = 6): void {
  g.rect(x, y, n, n, SKIN).rect(x + 1, y + 1, n - 2, n - 2, RED);
  for (let i = 0; i < n - 1; i += 2) g.px(x + n - 1, y + i, BONE);
  g.px(x + 1, y + n - 2, DARK);
}
/** 팔뚝 (x0,y0 → x1,y1, 붉은 핏줄) */
function arm(g: Pen, x0: number, y0: number, x1: number, y1: number): void {
  g.line(x0, y0, x1, y1, SKIN).line(x0, y0 + 1, x1, y1 + 1, SKIN).line(x0 + 1, y0, x1, y1, HOT);
}
/** 손톱 긁은 자국 셋 (x,y에서 오른쪽 아래로) */
function claws(g: Pen, x: number, y: number, n = 3, len = 7, c = RED): void {
  for (let i = 0; i < n; i++) g.line(x + i * 3, y, x + i * 3 + len, y + len, c).px(x + i * 3, y, WHITE);
}
/** 가리키는 검지 (x,y에서 오른쪽으로) */
function finger(g: Pen, x: number, y: number): void {
  g.rect(x, y, 4, 4, SKIN).rect(x + 4, y + 1, 5, 2, SKIN).px(x + 9, y + 1, BONE).px(x + 9, y + 2, BONE);
}

export const HF_WEAPON_ART = {
  hfFist: (g: Pen) => {
    arm(g, 2, 13, 8, 8);
    fist(g, 8, 3, 6);
    g.px(4, 11, HOT).px(6, 9, HOT);
  },
};

export const HF_PASSIVE_ART = {
  hfKnuckle: (g: Pen) => {
    fist(g, 4, 4, 8);
    g.px(13, 5, WHITE).px(13, 9, WHITE);
  },
  hfDouble: (g: Pen) => {
    fist(g, 2, 3, 6);
    fist(g, 8, 8, 6);
  },
  hfCrush: (g: Pen) => {
    fist(g, 5, 2, 6);
    g.rect(1, 12, 14, 2, STONE).line(4, 11, 8, 9, DARK).line(8, 11, 12, 9, DARK);
  },
  hfQuake: (g: Pen) => {
    g.rect(1, 11, 14, 3, STONE).line(3, 11, 6, 8, DARK).line(6, 8, 8, 11, DARK).line(10, 11, 13, 7, DARK);
    g.px(4, 5, EMBER).px(8, 4, EMBER).px(12, 5, EMBER);
  },
  hfIron: (g: Pen) => {
    arm(g, 1, 12, 7, 7);
    fist(g, 7, 2, 7);
    g.ring(10, 6, 5, STONE);
  },
  hfGrow: (g: Pen) => {
    arm(g, 1, 14, 11, 4);
    g.px(13, 2, HOT).px(12, 1, HOT).px(14, 3, HOT);
  },
  hfSpread: (g: Pen) => {
    arm(g, 2, 13, 9, 6);
    g.line(9, 6, 14, 2, HOT).line(9, 6, 14, 8, HOT).line(9, 6, 12, 12, HOT);
  },
  hfHold: (g: Pen) => {
    g.ring(8, 8, 6, RED).disc(8, 8, 3, DARK).px(8, 8, HOT);
  },
  hfFeed: (g: Pen) => {
    arm(g, 2, 12, 8, 7);
    g.disc(11, 6, 3, DARK).px(10, 5, HOT).px(12, 5, HOT).line(9, 8, 13, 8, BONE);
  },
  hfMaw: (g: Pen) => {
    g.disc(8, 8, 6, DARK);
    for (let i = 3; i < 14; i += 2) g.px(i, 6, BONE).px(i, 10, BONE);
    g.px(5, 4, HOT).px(11, 4, HOT);
  },
  hfNail: (g: Pen) => {
    claws(g, 2, 3, 4, 8);
  },
  hfAim: (g: Pen) => {
    finger(g, 1, 6);
    g.ring(13, 7, 2, RED).px(13, 7, HOT);
  },
  hfRend: (g: Pen) => {
    claws(g, 2, 2, 3, 7);
    g.px(6, 12, RED).px(9, 13, RED).px(12, 12, RED).px(9, 14, "#7a1020");
  },
  hfFar: (g: Pen) => {
    finger(g, 0, 10);
    claws(g, 8, 1, 2, 5);
  },
  hfEcho: (g: Pen) => {
    claws(g, 1, 3, 3, 6, "#7a1020");
    claws(g, 5, 5, 3, 6);
  },
  hfBlood: (g: Pen) => {
    g.disc(8, 9, 4, RED).px(8, 3, RED).rect(7, 4, 3, 3, RED).px(7, 8, WHITE);
  },
  hfLong: (g: Pen) => {
    g.disc(8, 8, 6, DARK).px(5, 7, HOT).px(11, 7, HOT).line(6, 11, 10, 11, RED).px(4, 2, RED).px(12, 2, RED).px(3, 3, RED).px(13, 3, RED);
  },
  hfFrenzy: (g: Pen) => {
    fist(g, 6, 5, 6);
    g.line(1, 6, 4, 6, HOT).line(1, 9, 4, 9, HOT).line(2, 12, 5, 12, HOT);
  },
  hfLeech: (g: Pen) => {
    g.rect(6, 3, 4, 9, RED).rect(5, 5, 6, 5, RED).px(7, 6, WHITE);
    g.rect(3, 12, 10, 2, DARK);
  },
  hfBurst: (g: Pen) => {
    g.ring(8, 8, 6, HOT).ring(8, 8, 3, EMBER).px(8, 8, WHITE);
    g.px(8, 1, EMBER).px(1, 8, EMBER).px(15, 8, EMBER).px(8, 15, EMBER);
  },
};
