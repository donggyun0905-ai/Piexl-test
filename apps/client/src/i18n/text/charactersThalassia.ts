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
  levia: { ko: "리바이어", en: "Levia", ja: "リヴァイア" },
  leviaDesc: {
    ko: "탈라시아. 고래와 함께 자유로운 바다를 누비는 창술사. 바다의 창 4단 콤보 · 1타 앞 휘두르기 → 2타 찌르기 → 3타 한 바퀴 돌고 앞으로 고래 대돌격 → (곧바로) 4타 앞으로 돌진하고 부채꼴 충격파 · 타마다 확률로 고래가 같이 나와 더 넓게 쓸어 줌 (안 나올수록 다음엔 잘 나옴) · 무기는 창에 박는 힘의 보석 (10가지) · 전용 아이템 20 (창 10 · 고래 10)",
    en: "Thalassia. A spear dancer roaming the free sea with the whales. A 4-hit sea-spear combo · 1st: a wide forward sweep → 2nd: a thrust → 3rd: a full spin, then a giant whale charges forward → (right away) 4th: a lunge forward ending in a fan-shaped shockwave · a whale may join each hit to sweep even wider (more likely the longer it stays away) · weapons are power gems set in the spear (10 kinds) · 20 exclusive items (10 spear · 10 whale)",
    ja: "タラシア。クジラと共に自由な海を駆ける槍使い。海の槍の4段コンボ · 1段目 前へ薙ぎ払い → 2段目 突き → 3段目 一回転して前へクジラ大突撃 → （すぐ）4段目 前へ突進して扇形の衝撃波 · 各段で確率でクジラも現れ、さらに広く薙ぐ（出ないほど次は出やすい）· 武器は槍にはめる力の宝石（10種）· 専用アイテム20（槍10 · クジラ10）",
  },
  whale: { ko: "바다의 창", en: "Sea Spear", ja: "海の槍" },
  tail: { ko: "테일", en: "Tail", ja: "テイル" },
  tailDesc: {
    ko: "탈라시아. 물을 자유롭게 다루는 상어 수인. 둘레에 영역 바다가 펼쳐지고, 바다 안의 적을 물 상어가 저절로 공격 (확률로 바다 밑에서 솟아 삼키기 · 튀어나와 꿰뚫고 다시 잠수 · 솟구쳐 내리꽂기) · 누르면 꼬리 3연타 (위→아래 · 아래→위 · 내려치기) · 한 방에 쓰러뜨릴 적이 있으면 물 상어로 변해 번개처럼 돌진해 씹어먹고 체력 회복 · 무기는 바다의 종류 (10가지) · 전용 아이템 10",
    en: "Thalassia. A shark beastfolk who bends water freely. A sea domain spreads around Tail, and water sharks attack every foe inside it on their own (by chance: rise from below and gulp · leap out, pierce and dive back · soar and crash down) · pressing attack swings a 3-hit tail combo (down · up · slam) · if a foe can be finished in one bite, Tail turns into a water shark, darts in like lightning and devours it to heal · weapons are kinds of sea (10) · 10 exclusive items",
    ja: "タラシア。水を自在に操るサメの獣人。周りに領域の海が広がり、海の中の敵を水のサメが自動で攻撃（確率で海の底から現れて丸呑み · 飛び出して貫き再び潜る · 跳び上がって落下攻撃）· 押すと尾の3連撃（上→下 · 下→上 · 叩きつけ）· 一撃で倒せる敵がいれば水のサメに変わり稲妻のように突進して食らいつき体力回復 · 武器は海の種類（10種）· 専用アイテム10",
  },
  shark: { ko: "영역 바다", en: "Sea Domain", ja: "領域の海" },
} satisfies Record<string, Record<Lang, string>>;
