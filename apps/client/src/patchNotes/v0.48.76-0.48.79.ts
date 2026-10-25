import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.79",
    date: "2026-10-24",
    items: {
      ko: [
        "뽑기: 한정 테마 확률 2% → 1% (상점 스킨 43% → 44%)",
        "뽑기 연출: 봉투 위쪽을 옆으로 쓸면 뜯기며 카드가 나옴 (10번 뽑기는 반짝이는 금박 봉투). 카드는 뒷면으로 깔리고(1번은 큰 카드 1장, 10번은 5장씩 2줄 + 덤 1장) 누르면 빛나며 뒤집힘: 한정 스킨 무지개 · 스킨 금빛 · 만능 쿠폰 보라 (모두 뒤집기 버튼도 있음)",
        "떠돌이: 기본 치명타 25% (1.5배 피해)",
        "원소술사 트리거: 구슬이 빨리 돌수록(투사체 속도) 재장전도 그만큼 빨라짐",
        "야수 덮치기: 덮쳐 맞힐 때마다 게이지가 차고(발밑 막대), 다 차면 10초 동안 거대한 호랑이로 변신. 더 멀리 뛰어들어 둘레를 크게 할퀴고(피해 1.6배), 추가 체력 50이 먼저 깎임",
        "야수 발톱: 사거리가 늘어도 할퀴는 자국이 몸에서 늘어나지 않고 사거리 끝에 나옴 · 호랑이 발톱은 굵은 네 줄 발톱 자국",
        "소환술사: 소환수 공격이 적을 밀어내지 않고 피해만 줌",
        "악의 사도 사탄의 가면: 먹은 영혼으로 오른 공격력과 같은 비율로 공격 속도도 오름 (영혼 하나마다 +1%)",
      ],
      en: [
        "Gacha: limited theme rate 2% → 1% (shop skins 43% → 44%)",
        "Gacha effects: swipe across the top of the pack to tear it open (Pull ×10 uses a shiny gold-foil pack). Cards are dealt face down (one big card for ×1, two rows of 5 plus a bonus card for ×10); tap one and it glows and flips: rainbow for limited skins, gold for skins, purple for coupons (there's also a Flip all button)",
        "Drifter: 25% base crit chance (1.5x damage)",
        "Elementalist Trigger: the faster the orbs spin (projectile speed), the faster it reloads",
        "Beastkin Pounce: each pounce hit fills a gauge (bar under you); when full you become a giant tiger for 10s, leaping farther and swiping wide all around (1.6x damage), with 50 extra HP that's lost first",
        "Beastkin claws: with more range the scratch mark now appears at the end of your reach instead of stretching out from your body · Tiger Claw leaves a thick four-claw mark",
        "Summoner: summons no longer knock enemies back, they only deal damage",
        "Apostle of Malice Mask of Satan: the damage gained from eaten souls now also raises attack speed by the same share (+1% per soul)",
      ],
      ja: [
        "ガチャ：限定テーマの確率 2% → 1%（ショップスキン 43% → 44%）",
        "ガチャ演出：袋の上を横になぞると破れてカードが出る（10回は輝く金箔の袋）。カードは裏向きに並び（1回は大きいカード1枚、10回は5枚ずつ2列＋おまけ1枚）、押すと光ってめくれる：限定スキンは虹色・スキンは金色・万能クーポンは紫（全部めくるボタンもあり）",
        "流れ者：基本クリティカル25%（1.5倍ダメージ）",
        "元素術師トリガー：珠が速く回るほど（弾速）リロードもその分速くなる",
        "獣人の飛びかかり：当てるたびにゲージがたまり（足元のバー）、満タンで10秒間巨大な虎に変身。より遠くへ跳び周りを大きく引っかき（ダメージ1.6倍）、追加体力50が先に減る",
        "獣人の爪：射程が伸びても引っかき跡が体から伸びず射程の先に出る・虎の爪は太い4本の爪跡",
        "召喚術師：召喚獣の攻撃が敵を押し出さず、ダメージだけを与える",
        "悪の使徒 サタンの仮面：食べた魂で上がった攻撃力と同じ割合で攻撃速度も上がる（魂1つごとに+1%）",
      ],
    },
  },
  {
    version: "0.48.78",
    date: "2026-10-24",
    items: {
      ko: [
        "클리어하면 결과 창 맨 위에 '⏱ 클리어 시간'을 크게 보여 줌",
        "관리자 페이지에 '클리어 시간' 탭: 유저들이 캐릭터마다 혼자 하기 6층을 깨는 데 걸린 평균 시간·가장 빠른 시간·클리어 수 (금기·무작위 시작 장비·무한·영웅의 길·아레나·서든데스 판 제외)",
      ],
      en: [
        "When you clear a run, the result screen now shows '⏱ Clear time' in large text at the top",
        "Admin page 'Clear time' tab: average and fastest time players take to clear floor 6 in solo with each character, plus clear counts (taboo, random-kit, endless, Hero's Path, arena and sudden-death runs excluded)",
      ],
      ja: [
        "クリアすると結果画面の一番上に「⏱ クリアタイム」を大きく表示",
        "管理者ページに「クリアタイム」タブ：キャラごとにソロで6階をクリアするまでの平均時間・最速時間・クリア数（禁忌・ランダム装備・エンドレス・英雄の道・アリーナ・サドンデスは除外）",
      ],
    },
  },
  {
    version: "0.48.77",
    date: "2026-10-23",
    items: {
      ko: [
        "맵이 커짐: 모든 방이 15×9칸 → 21×13칸 (방 하나가 한 화면에 다 보임, 방 모양은 가운데) · 협동 3~5명 큰 방 25×15칸 · 라스트 보스방 29×17칸 (화면이 따라다님)",
        "게임 화면이 정수배로 줄지 않고 남는 곳 없이 화면을 꽉 채움 (PC·휴대폰)",
      ],
      en: [
        "Bigger maps: every room is now 21×13 tiles instead of 15×9 (a whole room still fits on one screen, room shapes are centered) · co-op big rooms for 3–5 players are 25×15 · final boss rooms are 29×17 (the camera follows you)",
        "The game view now fills the screen instead of shrinking to whole-number zoom (PC and phones)",
      ],
      ja: [
        "マップが大きく：すべての部屋が15×9マス → 21×13マス（部屋全体が1画面に収まる、部屋の形は中央）· 協力3〜5人の広い部屋は25×15 · ラストボス部屋は29×17（画面が追いかける）",
        "ゲーム画面が整数倍に縮まず、余白なく画面いっぱいに（PC・スマホ）",
      ],
    },
  },
  {
    version: "0.48.76",
    date: "2026-10-23",
    items: {
      ko: [
        "테스트 중: 캐릭터 선택창에 히든 캐릭터(별지기·오리)를 바로 고르는 버튼",
        "모바일: 게임 화면 아래 긴 조작 안내를 빼서 가로 화면에서 게임이 더 크게 보임 · 세로 화면에서도 층·돈·처치·시간이 체력 아래 작게 보이고 '가로로 돌리면 더 크게' 안내",
        "모바일: 연습장 도구가 화면 아래 절반 창으로 (게임이 가려지지 않음) · 일일 도전 탭 글자가 세로로 쪼개지던 것 고침 · 로비 안내가 '메인으로' 버튼과 겹치던 것 고침",
      ],
      en: [
        "Testing: buttons on character select to pick the hidden characters (Stargazer, Duck) directly",
        "Mobile: the long controls guide under the game is gone so the game is bigger in landscape · In portrait, floor/gold/kills/time now show in a small line under HP, with a 'turn sideways for a bigger view' tip",
        "Mobile: the Practice tools open as a bottom half sheet (the game stays visible) · Fixed Daily tab labels breaking into vertical letters · Fixed the lobby tip overlapping the Menu button",
      ],
      ja: [
        "テスト中：キャラ選択に隠しキャラ（星守り・アヒル）をすぐ選べるボタン",
        "モバイル：ゲーム下の長い操作説明をなくし横画面でゲームがより大きく · 縦画面でも階・お金・撃破・時間が体力の下に小さく表示、「横にすると大きく」案内",
        "モバイル：練習場ツールが画面下半分のシートに（ゲームが隠れない） · デイリーのタブ文字が縦に割れていたのを修正 · ロビーの案内が「メインへ」ボタンと重なっていたのを修正",
      ],
    },
  },
];
