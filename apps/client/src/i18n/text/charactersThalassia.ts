import type { Lang } from "../index";

// 화면 글자: 탈라시아(바다의 나라) 캐릭터 이름·설명
export const CHARACTER_TEXT_THALASSIA = {
  thorken: { ko: "토르켄", en: "Thorken", ja: "トルケン" },
  thorkenDesc: {
    ko: "탈라시아. 자유의 바다를 누비는 뱃사람. 거대한 닻과 사슬로 이은 철구공으로 싸움 · 처음 누르면 철구공을 던져 떨어진 자리에 천둥 · 그 뒤 닻을 휘두를 때마다(느리지만 넓고 셈) 사슬 끝 철구공이 같이 크게 휘둘러짐 · 대시하면 철구공을 감아 들여 다시 던질 수 있음 · 때릴수록 폭풍 게이지가 차고, 가득 차면 태풍을 불러 천둥이 내리침 · 무기는 철구공만 바뀜 (10가지)",
    en: "Thalassia. A sailor of the free sea who fights with a giant anchor and a chained iron ball · First press throws the ball, thunder strikes where it lands · then every anchor swing (slow but wide and heavy) whips the chained ball around in a huge arc · dash reels the ball back to throw again · hits fill the Storm gauge; when full, you call a typhoon and thunder rains down · only the ball changes as a weapon (10 kinds)",
    ja: "タラシア。自由の海を駆ける船乗り。巨大な錨と鎖でつないだ鉄球で戦う · 最初の入力で鉄球を投げ、落ちた場所に雷 · 以後は錨を振るたび（遅いが広く強い）鎖の先の鉄球も大きく振り回される · ダッシュで鉄球を巻き戻してまた投げられる · 当てるほど嵐ゲージがたまり、満ちると台風を呼んで雷が降る · 武器は鉄球だけが変わる（10種）",
  },
  anchor: { ko: "닻과 철구", en: "Anchor & Ball", ja: "錨と鉄球" },
} satisfies Record<string, Record<Lang, string>>;
