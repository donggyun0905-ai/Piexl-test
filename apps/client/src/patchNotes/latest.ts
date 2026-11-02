import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.349",
    date: "2026-11-02",
    items: {
      ko: [
        "제단의 방: 증강 기술이 새겨진 패시브는 칸에 ✦ 표시 · 마우스를 올리면 새겨진 기술이 보임 · 다시 제단에 와도 그 패시브는 빼앗기지 않음 · 패시브가 둘 이상일 때만 '증강' 카드를 고를 수 있음",
        "악마의 방: 석상을 조금 줄이고 거래 물건을 아래로 내려 가운데 물건이 가려지지 않음",
        "도박꾼의 방: 탁자를 줄이고 지나갈 수 없는 물체로 · 탁자 앞에서 F로 시작 · 꽝이면 어떤 능력치가 깎였는지 화면에 보여 줌",
        "시련의 방: 어떤 시련인지 · 거절해서 무엇을 빼앗겼는지 · 보상 상자에서 무엇을 얻었는지 화면 가운데에 알려 줌",
        "시련 1000점 상자로 비밀의 방·히든 상점에 들어갔다 나오면 시련의 방으로 돌아옴 (남은 보상 상자를 잃지 않음)",
        "암흑가 경매장: 의자에 앉으면 왕좌 등받이가 캐릭터 앞에 보임",
      ],
      en: [
        "Altar Room: passives with engraved augments show a ✦ · hover to see the engraved skills · altars never take them again · the 'Augment' card needs at least two passives",
        "Devil's Room: smaller statue and lower deals so the middle offer is no longer hidden",
        "Gambler's Room: a smaller table you can't walk through · press F in front of it to play · a miss now shows which stats dropped",
        "Trial Room: the screen now tells you which trial started, what refusing took, and what each reward chest gave",
        "Entering a secret room or the hidden shop from the 1000-point trial chest now brings you back to the trial room (keep your remaining chests)",
        "Underworld Auction: when seated, the throne's back is drawn in front of your character",
      ],
      ja: [
        "祭壇の部屋：増強技が刻まれたパッシブは枠に✦ · マウスを乗せると刻まれた技が見える · 再び祭壇に来てもそのパッシブは奪われない · 「増強」カードはパッシブが2つ以上の時だけ選べる",
        "悪魔の部屋：石像を少し小さくし取引の品を下げて、中央の品が隠れないように",
        "ギャンブラーの部屋：テーブルを小さくし通れない物体に · テーブルの前でFで開始 · ハズレならどの能力値が下がったか画面に表示",
        "試練の部屋：どの試練か · 拒んで何を奪われたか · 報酬箱で何を得たかを画面中央で知らせる",
        "試練1000点の箱で秘密の部屋・隠しショップに入って出ると試練の部屋に戻る（残りの報酬箱を失わない）",
        "闇街オークション：椅子に座ると玉座の背もたれがキャラクターの前に見える",
      ],
    },
  },
  {
    version: "0.48.348",
    date: "2026-11-02",
    items: {
      ko: [
        "새 방 그림: 시련의 비석·보상 상자 · 제단·성좌 8 · 금 간 벽 · 악마의 석상·거래 제단 · 도박꾼(표정 4)·야바위 탁자·컵 · 경매장 무대·상품 받침·진행자(자세)·값 팻말·손님 의자·내 왕좌 (빛·문자·촛불 효과는 그대로)",
        "암흑가 경매장: 진행자가 무대 오른쪽 옆으로 (상품을 가리지 않음)",
        "도박꾼의 방: 상자를 두 배 빠르게 섞음 (눈으로 따라갈 수 없음, 당첨 확률 1/3)",
        "연습장 '방' 탭: 누를 때마다 성좌·악마의 거래·경매 상품 등이 새로 무작위로 나옴",
      ],
      en: [
        "New room art: trial monolith and reward chests · altar and 8 constellations · cracked wall · devil statue and deal altars · gambler (4 expressions), shell-game table and cups · auction stage, lot stands, auctioneer poses, price paddle, guest chairs and your throne (glows, runes and candles kept)",
        "Underworld Auction: the auctioneer now stands to the right of the stage (no longer blocking the lots)",
        "Gambler's Room: the cups shuffle twice as fast (too fast to follow — a 1-in-3 chance)",
        "Practice 'Rooms' tab: every press rolls a new constellation, devil deals, auction lots and so on",
      ],
      ja: [
        "新しい部屋の絵：試練の石碑・報酬箱 · 祭壇・星座8 · ひびの入った壁 · 悪魔の石像・取引の祭壇 · ギャンブラー（表情4）・シェルゲームのテーブル・カップ · オークションの舞台・品物の台・司会者（ポーズ）・価格の札・客の椅子・自分の玉座（光・文字・ろうそくの効果はそのまま）",
        "闇街オークション：司会者が舞台の右横に（品物を隠さない）",
        "ギャンブラーの部屋：カップを2倍速く混ぜる（目で追えない、当たり確率1/3）",
        "練習場「部屋」タブ：押すたびに星座・悪魔の取引・オークションの品などが新しくランダムに出る",
      ],
    },
  },
];
