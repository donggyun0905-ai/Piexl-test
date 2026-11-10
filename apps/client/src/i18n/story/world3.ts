// 스토리 시즌 3 글자: 7~9장 제목·줄거리 · 새로 말하는 사람 이름 (world.ts에서 합침)
import type { Lang } from "../index";

type L = Record<Lang, string>;
const c = (ko: string, en: string, ja: string): L => ({ ko, en, ja });

export const S3_TITLE: Record<"ch7" | "ch8" | "ch9", L> = {
  ch7: c("시작", "Beginning", "始まり"),
  ch8: c("심연", "The Abyss", "深淵"),
  ch9: c("교류", "Exchange", "交流"),
};

export const S3_SUMMARY: Record<"ch7" | "ch8" | "ch9", L> = {
  ch7: c(
    "악의 사도가 아직 '천의 사도'라 불리던 시절. 악마 사냥꾼 '새벽의 성흔'의 감옥에서 깨어난 아스모데우스의 화신체, 그리고 사도의 몸에 스며든 보랏빛 악.",
    "Back when the Apostle of Malice was still the 'Apostle of Heaven'. The Avatar of Asmodeus awakens in the prison of the demon hunters, the 'Dawn Stigmata' — and a violet evil seeps into the apostle.",
    "悪の使徒がまだ「天の使徒」と呼ばれていた頃。悪魔狩り「暁の聖痕」の牢で目覚めたアスモデウスの化身、そして使徒の体に染み込んだ紫の悪。",
  ),
  ch8: c(
    "흩어진 성흔을 받아 준 성국. 제국에서 사람들을 빼내려던 네 사람 앞을 악에 물든 이클립스가 막아서고, 학살자는 마지막 성수를 건넨다.",
    "The Holy Kingdom shelters the scattered Stigmata. Four who try to pull people out of the Empire are blocked by a malice-stained Eclipse, and the Slayer hands over the last holy water.",
    "散った聖痕を受け入れた聖国。帝国から人々を連れ出そうとした四人の前に悪に染まったエクリプスが立ちはだかり、虐殺者は最後の聖水を託す。",
  ),
  ch9: c(
    "먼바다의 탈라시아가 연합에 손을 내밀고, 잠들어 있던 신수들이 하나둘 깨어난다. 그리고 멀리서 그 모든 것을 지켜보는 아스모데우스.",
    "Far-off Thalassia reaches out to the Alliance, and the slumbering divine beasts wake one by one. And from afar, Asmodeus watches it all.",
    "遠い海のタラシアが連合に手を差し伸べ、眠っていた神獣たちが一体ずつ目覚める。そして遠くからそのすべてを見つめるアスモデウス。",
  ),
};

export const S3_SPEAKERS = {
  asmodeus: c("아스모데우스의 화신체", "Avatar of Asmodeus", "アスモデウスの化身"),
  heavenApostle: c("천의 사도", "Apostle of Heaven", "天の使徒"),
};
