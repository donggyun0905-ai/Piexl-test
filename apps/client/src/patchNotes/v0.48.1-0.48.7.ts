import type { PatchNote } from "./types";

// 지난 기록 (0.48.1~0.48.7)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.7",
    date: "2026-10-22",
    items: {
      ko: [
        "메인 화면 뒤에 로비가 보입니다. 왼쪽 아래 '로비'를 누르면 파수꾼으로 로비를 돌아다닐 수 있습니다",
        "로비 게임기 8대 (앞에서 F): 블랙잭 · 숫자 타일 · 사과 상자 · 블록 쌓기 · 조커 게임 · 슬롯머신 · 주사위 대소 · 하이로우",
        "칩 게임은 놀이용 칩만 씁니다 (매일 1000개까지 채워 줌, 쿠폰·스킨으로 바꿀 수 없음)",
        "상점에 '로비 꾸밈' 추가: 해변 · 크리스마스 · 할로윈 · 학교 · 새해 · 일본풍 · 중국풍 · 미국풍 (쿠폰 50장)",
      ],
      en: [
        "A lobby now shows behind the main menu. Press 'Lobby' at the bottom left to walk around it as the Warden",
        "8 lobby machines (press F in front): Blackjack · Number Tiles · Apple Box · Block Stack · Joker Game · Slot Machine · Dice Big/Small · High-Low",
        "Chip games use play chips only (refilled to 1000 daily, can't be exchanged for coupons or skins)",
        "New 'Lobby' tab in the Shop: Beach · Christmas · Halloween · School · New Year · Japanese · Chinese · American (50 coupons)",
      ],
      ja: [
        "メイン画面の後ろにロビーが見えます。左下の「ロビー」で番人になってロビーを歩き回れます",
        "ロビーのゲーム機8台（前でF）：ブラックジャック・数字タイル・リンゴ箱・ブロック積み・ジョーカーゲーム・スロット・サイコロ大小・ハイ&ロー",
        "チップゲームは遊び用チップのみ（毎日1000枚まで補充、クーポン・スキンには交換不可）",
        "ショップに「ロビー」タブ追加：ビーチ・クリスマス・ハロウィン・学校・お正月・和風・中華風・アメリカ風（クーポン50枚）",
      ],
    },
  },
  {
    version: "0.48.6",
    date: "2026-10-21",
    items: {
      ko: [
        "상점이 생겼습니다! 업적을 달성하거나 일일 미션을 하면 만능 쿠폰을 받고, 쿠폰으로 스킨을 사거나 뽑기를 할 수 있습니다",
        "스킨 112개: 캐릭터 14명마다 수영복 · 크리스마스 · 할로윈 · 학교 · 새해(한복) · 일본풍 · 중국풍 · 미국풍",
        "일일 미션: 매일 3개 (하나에 쿠폰 2장, 모두 하면 2장 더)",
        "상태이상 피해 숫자 옆에 아이콘: 출혈 핏방울 · 화상 불꽃 · 독 거품 · 저주 해골",
      ],
      en: [
        "New Shop! Earn coupons from achievements and daily missions, then buy skins or try the gacha",
        "112 skins: every one of the 14 characters in Swimsuit · Christmas · Halloween · School · New Year (hanbok) · Japanese · Chinese · American styles",
        "Daily missions: 3 a day (2 coupons each, 2 more for finishing all)",
        "Status damage numbers now have icons: bleed drop · burn flame · poison bubbles · curse skull",
      ],
      ja: [
        "ショップ登場！実績やデイリーミッションで万能クーポンをもらい、スキンの購入やガチャができます",
        "スキン112種：14人それぞれに水着・クリスマス・ハロウィン・学校・お正月（韓服）・和風・中華風・アメリカ風",
        "デイリーミッション：毎日3つ（1つでクーポン2枚、全部で2枚追加）",
        "状態異常ダメージの数字の横にアイコン：出血は血のしずく・火傷は炎・毒は泡・呪いはドクロ",
      ],
    },
  },
  {
    version: "0.48.5",
    date: "2026-10-21",
    items: {
      ko: [
        "상태이상 피해 숫자에 색이 생겼습니다: 출혈 빨강 · 화상 주황 · 독(의사 가스) 초록 · 저주(음양사 수양 부적) 보라",
        "캐릭터 그림 새로 꾸밈: 파수꾼(붉은 망토의 영웅 기사) · 거너(해골 가면의 서부 사신, 총구 불꽃) · 음양사(화려한 옷의 여성 음양사) · 격투가(배가 드러난 탑의 여성 격투가) · 닌자(날렵한 몸·긴 목도리·등에 칼) · 시간술사(은발·시계 후광·별 무늬 로브) · 소환술사(사슴뿔 관·초록 망토·따라다니는 정령)",
        "풋내기는 평범한 옷으로 시작해 5·10·15·20레벨마다 옷이 바뀝니다 (가죽 조끼 → 망토 → 사슬 갑옷 → 금관과 붉은 망토의 영웅)",
      ],
      en: [
        "Status damage numbers now have colors: bleed red · burn orange · poison (Doctor's gas) green · curse (Mystic's Discipline Talismans) purple",
        "New character looks: Warden (heroic knight with a red cape) · Gunner (skull-masked western reaper with muzzle flash) · Mystic (a woman onmyoji in splendid robes) · Brawler (a woman fighter in a crop top) · Ninja (lean build, long scarf, sword on the back) · Chronomancer (silver hair, clock halo, starry robe) · Summoner (antler crown, green cloak, a spirit that follows)",
        "The Novice starts in plain clothes and gets new gear at levels 5, 10, 15 and 20 (leather vest → cape → chainmail → a hero with a golden crown and red cape)",
      ],
      ja: [
        "状態異常ダメージの数字に色が付きました：出血は赤 · 火傷はオレンジ · 毒（医者のガス）は緑 · 呪い（陰陽師の修養の符）は紫",
        "キャラクターの絵を一新：番人（赤いマントの英雄騎士）· ガンナー（骸骨仮面の西部の死神、銃口の炎）· 陰陽師（華やかな衣装の女性陰陽師）· 格闘家（お腹の見えるトップスの女性格闘家）· 忍者（細身・長いマフラー・背中の刀）· 時間術師（銀髪・時計の光輪・星模様のローブ）· 召喚術師（鹿の角の冠・緑のマント・ついてくる精霊）",
        "見習いは普通の服で始まり、5・10・15・20レベルごとに服が変わります（革のベスト → マント → 鎖かたびら → 金の冠と赤いマントの英雄）",
      ],
    },
  },
  {
    version: "0.48.4",
    date: "2026-10-21",
    items: {
      ko: ["야수 그림을 암호랑이 느낌으로 바꿨습니다 (줄무늬 두건·둥근 호랑이 귀·어깨까지 오는 머리·줄무늬 꼬리·할퀴기 발톱 자국)"],
      en: ["The Beast now looks like a tigress (striped hood, round tiger ears, shoulder-length hair, striped tail and claw marks when attacking)"],
      ja: ["野獣の絵をメスの虎らしく変更（縞模様のフード・丸い虎の耳・肩までの髪・縞模様のしっぽ・引っかきの爪跡）"],
    },
  },
  {
    version: "0.48.3",
    date: "2026-10-21",
    items: {
      ko: ["마법사·떠돌이처럼 나머지 캐릭터 12명에게도 도트 그림이 생겼습니다 (앞·뒤·옆 걷기와 공격 모습)"],
      en: ["Like the Mage and Drifter, the other 12 characters now have pixel-art sprites (walking front, back and side, plus an attack pose)"],
      ja: ["魔法使い・放浪者のように、残り12人のキャラクターにもドット絵が付きました（前・後ろ・横の歩きと攻撃ポーズ）"],
    },
  },
  {
    version: "0.48.2",
    date: "2026-10-21",
    items: {
      ko: [
        "닌자 환영진: 표식 3개가 아니라 5개가 쌓이면 발동합니다 (대신 피해 조금 증가)",
        "세이렌: 노래(음표)에 홀려 끌려가는 동안에는 공격도, 물약 등 사용 아이템도 쓸 수 없습니다",
      ],
      en: [
        "Ninja Phantom Circle: now triggers at 5 marks instead of 3 (damage raised a little to compensate)",
        "Siren: while charmed by her song and pulled in, you can't attack or use items such as potions",
      ],
      ja: [
        "忍者の幻影陣：印が3つではなく5つ溜まると発動します（代わりにダメージ少し増加）",
        "セイレーン：歌（音符）に魅了されて引き寄せられている間は、攻撃もポーションなどのアイテムも使えません",
      ],
    },
  },
  {
    version: "0.48.1",
    date: "2026-10-21",
    items: {
      ko: [
        "치명타가 터지면 피해 숫자가 크게 튀어나오는 주황 숫자로 바뀌고 왼쪽에 번개 표시가 붙고, ‘챙!’ 하는 경쾌한 소리가 납니다. 연속으로 터지면 소리가 한 음씩 올라갑니다 (거너·원소술사 번개 검·풋내기)",
        "소환술사: 소환수끼리 겹쳐 한 마리처럼 보이지 않게 서로 비켜 섭니다",
        "풋내기: 라스트 보스에 도전하면 시작 방의 여신의 축복을 다른 캐릭터처럼 받을 수 있습니다 (던전 보상·상점에는 원래 나오지 않음)",
      ],
      en: [
        "Critical hits now pop out as bigger orange damage numbers with a lightning bolt on the left and a crisp ‘clang!’ that climbs higher with each crit in a row (Gunner, Elementalist's thunder blades, Novice)",
        "Summoner: summons no longer stack on top of each other and look like one",
        "Novice: the Goddess's Blessing in the final boss's starting room is now available like for other characters (it never appears in dungeon rewards or shops)",
      ],
      ja: [
        "クリティカルが出るとダメージ数字が大きく飛び出すオレンジ色になり、左に稲妻マークが付き、「カキン！」と軽快な音が鳴ります。連続で出ると音が1つずつ上がります（ガンナー・元素術師の雷の剣・見習い）",
        "召喚術師：召喚獣同士が重なって1体に見えないよう、互いに避けて並びます",
        "見習い：ラストボスに挑むと、開始部屋の女神の祝福を他のキャラクターと同じく受け取れます（ダンジョンの報酬・ショップには元々出ません）",
      ],
    },
  },
];
