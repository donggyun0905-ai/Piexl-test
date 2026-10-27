import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.151",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전: 체력 ×10을 없애고 모두(AI 포함) 원래 체력에 보호막 500으로 시작",
        "상점 휴지통: F를 누르면 판매 창이 열려 무기·사용 아이템·패시브를 모두 팔 수 있음 (한 번 누르면 확인, 한 번 더 누르면 판매 · 무기를 팔면 빈손) · 장비 줄 아래 판매 줄은 없앰",
        "변희: 사냥 경험치 막대를 노랑으로 (풋내기와 구분) · 경험치로 능력을 얻으면 머리 위에 그 능력이 떠오름 · 각성하면 화면 테두리 안쪽에 동물마다 다른 효과(번개·불꽃·거미줄·독·땅 갈라짐 등)가 1.5초 동안 번쩍이다 꺼짐",
      ],
      en: [
        "Champion Clash: removed the 10× HP; everyone (AI included) starts with normal HP and a 500 shield",
        "Shop trash can: press F to open a sell window where you can sell your weapon, consumables and passives (tap once to confirm, again to sell; selling your weapon leaves you empty-handed) · removed the sell bar under the loadout",
        "Byeonhui: the hunting XP bar is now yellow (unlike the Novice's) · abilities gained from XP pop up above your head · awakening flashes an animal-themed border effect inside the screen edge (lightning, flames, webs, venom, cracks and more) for 1.5 seconds",
      ],
      ja: [
        "覇王戦: 体力×10をやめ、全員（AI含む）元の体力にシールド500で開始",
        "ショップのゴミ箱: Fで売却ウィンドウが開き、武器・使用アイテム・パッシブをすべて売れる（1回で確認、もう1回で売却 · 武器を売ると素手）· 装備欄下の売却欄は廃止",
        "ビョンヒ: 狩りの経験値バーを黄色に（ノービスと区別）· 経験値で能力を得ると頭上にその能力が浮かぶ · 覚醒すると画面の縁の内側に動物ごとの効果（雷・炎・蜘蛛の巣・毒・地割れなど）が1.5秒光って消える",
      ],
    },
  },
];
