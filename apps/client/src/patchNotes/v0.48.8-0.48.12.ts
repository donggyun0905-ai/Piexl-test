import type { PatchNote } from "./types";

// 지난 기록 (0.48.8~0.48.12)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.12",
    date: "2026-10-22",
    items: {
      ko: [
        "숫자 타일: 바닥 타일을 눌러 빌려 와 내 타일과 새 묶음을 만들 수 있습니다 (예: 10 네 색 무리에서 검정 10을 빌려 내 검정 8·9·11과 줄 만들기). 남은 바닥 묶음도 맞아야 하고, 줄 가운데를 빼면 두 줄로 나뉩니다. 바닥 묶음에 붙일 때는 묶음 끝의 '+'",
        "조커 게임: 뽑은 카드가 무엇인지 보여 주고, 짝이 손에 있으면 직접 그 짝을 눌러 버립니다",
      ],
      en: [
        "Number Tiles: tap table tiles to borrow them into a new set with your own tiles (e.g. take the black 10 from a four-color 10 group to make black 8-9-10-11). What's left on the table must still be valid; taking from the middle of a run splits it in two. Tap '+' at the end of a set to add to it",
        "Joker Game: the card you drew is shown, and if it makes a pair you tap the matching card in your hand to discard them",
      ],
      ja: [
        "数字タイル：場のタイルを押して借り、自分のタイルと新しい組を作れます（例：10の4色の組から黒の10を借りて、自分の黒8・9・11と連番に）。残った場の組も正しいこと、連番の真ん中を抜くと2つに分かれます。場の組に付けるときは組の端の「+」",
        "ジョーカーゲーム：引いたカードを表示し、手札に組があれば自分でその組を押して捨てます",
      ],
    },
  },
  {
    version: "0.48.11",
    date: "2026-10-22",
    items: {
      ko: ["로비의 블랙잭 · 숫자 타일 · 조커 게임을 다른 사람과 같이 할 수 있습니다: 빠른 시작 · 방 만들기(코드로 친구 초대) · 코드로 들어가기. 빈자리는 컴퓨터가 채웁니다"],
      en: ["Play Blackjack, Number Tiles and the Joker Game in the lobby with others: quick match, create a room (invite friends by code) or join by code. CPUs fill empty seats"],
      ja: ["ロビーのブラックジャック・数字タイル・ジョーカーゲームを他の人と遊べます：クイックスタート・部屋を作る（コードで招待）・コードで入る。空席はCPUが埋めます"],
    },
  },
  {
    version: "0.48.10",
    date: "2026-10-22",
    items: {
      ko: ["로비 미니 게임 화면을 크게 (최대 2.5배, 화면이 작으면 화면에 맞춤)"],
      en: ["Lobby mini-game windows are much bigger (up to 2.5×, fitted to smaller screens)"],
      ja: ["ロビーのミニゲーム画面を大きく（最大2.5倍、小さい画面では画面に合わせる）"],
    },
  },
  {
    version: "0.48.9",
    date: "2026-10-22",
    items: {
      ko: ["로비 꾸밈마다 캐릭터가 앉을 자리(벤치·선베드)를 두어, 어떤 꾸밈에서도 소파에 앉은 캐릭터가 자연스럽게 앉아 있습니다"],
      en: ["Every lobby style now has a seat (bench or deck chair), so the relaxing characters always have somewhere to sit"],
      ja: ["どのロビー装飾にも座る場所（ベンチ・デッキチェア）を置き、くつろぐキャラがいつも自然に座っています"],
    },
  },
  {
    version: "0.48.8",
    date: "2026-10-22",
    items: {
      ko: ["로비가 파티룸이 됐습니다: 캐릭터들이 게임을 하고, 응원하고, 수다 떨고, 춤추고, 소파에서 쉬고, 산책합니다. 펫 6마리(고양이·강아지·슬라임·아기 용·토끼·병아리)와 무대 조명·풍선·깃발·색종이·미러볼"],
      en: ["The lobby is now a party room: characters play games, cheer, chat, dance, relax on the sofa and stroll around, with 6 pets (cat, puppy, slime, baby dragon, bunny, chick) plus stage lights, balloons, bunting, confetti and a mirror ball"],
      ja: ["ロビーがパーティールームに：キャラたちがゲーム・応援・おしゃべり・ダンス・ソファでくつろぎ・散歩。ペット6匹（猫・子犬・スライム・子ドラゴン・ウサギ・ひよこ）とステージライト・風船・旗・紙吹雪・ミラーボール"],
    },
  },
];
