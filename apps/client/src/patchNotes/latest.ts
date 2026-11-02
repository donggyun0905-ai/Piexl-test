import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.353",
    date: "2026-11-02",
    items: {
      ko: [
        "시련의 방: 한 판의 시련 점수는 합쳐서 최대 1000점 (예: 3층에서 300점이면 다음 시련은 최대 700점) · 1000점을 채우면 시련의 방이 더 나오지 않음",
        "제단의 방: '증강' 카드는 한 판에 한 번만 (이미 새겼으면 비활성) · '거래'·'무시'는 여러 번 가능",
      ],
      en: [
        "Trial Room: trial scores add up to at most 1000 per run (e.g. 300 on floor 3 caps the next trial at 700) · after 1000, no more trial rooms appear",
        "Altar Room: the 'Augment' card can be taken only once per run (disabled afterwards) · 'Bargain' and 'Ignore' can be chosen any number of times",
      ],
      ja: [
        "試練の部屋：1ランの試練の点数は合計最大1000点（例：3階で300点なら次の試練は最大700点）· 1000点に達すると試練の部屋はもう出ない",
        "祭壇の部屋：「増強」カードは1ランで1回だけ（刻んだ後は無効）·「取引」「無視」は何度でも可",
      ],
    },
  },
  {
    version: "0.48.352",
    date: "2026-11-02",
    items: {
      ko: ["제단의 방 흰수염고래 거래가 뒤바뀌어 있던 것 고침: 재생력 +20을 주고 최대 체력 20을 가져감"],
      en: ["Fixed the Blue Whale altar bargain being reversed: it now gives +20 regen and takes 20 max HP"],
      ja: ["祭壇の部屋のシロナガスクジラの取引が逆になっていたのを修正：再生力+20を与え最大体力20を奪う"],
    },
  },
  {
    version: "0.48.351",
    date: "2026-11-02",
    items: {
      ko: ["버프 창에 '방에서 얻은 것' (금빛 줄, 마우스를 올리면 설명): 제단에서 고른 카드(성좌·거래 내용·벌칙) · ✦ 증강 기술이 새겨진 패시브(기술 이름·효과) · 방에서 바뀐 능력치 합계(시련·제단·도박꾼·악마) · 상태이상 면역 · 되살아남 · 악마와 거래 · 이번 층 시련 저주"],
      en: ["Buff panel now lists 'From rooms' (gold rows, hover for details): altar cards chosen (constellation, bargain, penalty) · ✦ passives with engraved augments (skill names and effects) · total stat changes from rooms (trial, altar, gambler, devil) · status immunity · revives · devil's pact · this floor's trial curse"],
      ja: ["バフ欄に「部屋で得たもの」（金色の行、マウスを乗せると説明）：祭壇で選んだカード（星座・取引内容・罰）· ✦ 増強技が刻まれたパッシブ（技名・効果）· 部屋で変わった能力値の合計（試練・祭壇・ギャンブラー・悪魔）· 状態異常無効 · 復活 · 悪魔との取引 · この階の試練の呪い"],
    },
  },
  {
    version: "0.48.350",
    date: "2026-11-02",
    items: {
      ko: ["잔영: 체력 45 고정을 없앰 (체력 아이템·단련의 방으로 최대 체력이 늘어남, 시작 체력은 45 그대로)"],
      en: ["Remnant: HP is no longer locked at 45 (HP items and the Training Room now raise max HP; starts at 45)"],
      ja: ["残影：体力45固定を廃止（体力アイテム・鍛錬の部屋で最大体力が増える。開始体力は45のまま）"],
    },
  },
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
