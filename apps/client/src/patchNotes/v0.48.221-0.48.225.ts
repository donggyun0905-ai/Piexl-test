import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.225",
    date: "2026-10-29",
    items: {
      ko: [
        "히든 아이템 둘째 묶음 7개: 포탈건(쓴 방을 기억 → 다시 쓰면 그 방으로) · 블리자드 랜스(등 뒤 얼음 창 다섯, 공격마다 30%로 한 줄 돌진·20% 빙결) · 떨어진 신의 날개(몸 좌우 반투명 날개, 이동 속도 + · 몸박치기에 안 맞음) · 운명의 주사위(머리 위 주사위 1~6 운명) · 저주받은 주사위(숫자를 고르고 굴림: 맞히면 화려한 보물 상자, 틀리면 저주) · 애호의 피리(로비 동물 모두 같이 다님) · 테라포밍(이 층 보스·맵을 고른 보스로)",
      ],
      en: [
        "Second batch of 7 hidden items: Portal Gun (marks a room, use again to return) · Blizzard Lance (five ice lances on your back; 30% per attack to charge in a line, 20% to freeze) · Fallen God's Wings (floating translucent wings, more speed, immune to contact hits) · Fate Dice (a 1-6 fate over your head) · Cursed Dice (pick a number and roll: hit it for a dazzling treasure chest, miss for a curse) · Flute of Fondness (every lobby pet comes along) · Terraform (choose this floor's boss and map)",
      ],
      ja: [
        "ヒドゥンアイテム第2弾7個: ポータルガン (使った部屋を記憶 → もう一度使うとその部屋へ) · ブリザードランス (背中に氷の槍5本、攻撃ごとに30%で一列突進・20%で凍結) · 堕ちた神の翼 (体の左右に浮かぶ半透明の翼、移動速度+ · 体当たりを受けない) · 運命のサイコロ (頭上のサイコロ1〜6の運命) · 呪われたサイコロ (数字を選んで振る: 当たれば豪華な宝箱、外れると呪い) · 愛護の笛 (ロビーの動物みんなが一緒に) · テラフォーミング (この階のボス・マップを選んだボスに)",
      ],
    },
  },
  {
    version: "0.48.224",
    date: "2026-10-29",
    items: {
      ko: ["차원의 순례자 그림을 캐릭터처럼 새로 그림: 하늘색 단발 · 진한 파랑 눈동자 안에 노란 십자 · 흰 셔츠와 청바지 · 키보다 훨씬 큰 배낭(침낭·칼·지팡이·깃발·물약·황금 잔이 삐죽삐죽) · 앞·뒤·옆 걷기"],
      en: ["Redrew the Dimensional Pilgrim like a playable character: sky-blue bob, deep-blue pupils with a yellow cross, white shirt and jeans, a backpack far bigger than she is (bedroll, sword, staff, flag, potion and golden cup poking out), with front, back and side walks"],
      ja: ["次元の巡礼者をキャラクターのように描き直し: 水色のボブ · 濃い青の瞳に黄色い十字 · 白シャツとジーンズ · 背より大きなリュック (寝袋・剣・杖・旗・薬・金の杯がはみ出す) · 前・後ろ・横の歩き"],
    },
  },
  {
    version: "0.48.223",
    date: "2026-10-29",
    items: {
      ko: [
        "히든 상점 '차원의 순례자' (혼자 하기·무한·협동): 층마다 8% 확률로 전투방 하나가 몬스터 없는 빈 방 · 들어가면 위쪽 포탈에서 커다란 배낭을 멘 꼬마가 걸어 나와 \"안녕? 이것 좀 봐봐!\" 하고 히든 물건 3개를 골드로 진열",
        "히든 아이템 첫 묶음 16개: 에테르 폭탄(폭탄 3배·더 넓게) · 대마법사의 금지된 주문서(방 전체 메테오) · 차원이동문(이 층 건너뛰기, 마지막 층이면 클리어) · 아티팩터의 금기된 아티팩트 7색(처치마다 공격력·공격 속도·방어력·치명타·치명타 피해·체력·재생력이 쌓임, 왼쪽 위 그 색 스택 창) · 이프리트의 발톱(5번까지 겹치는 화상) · 실피드의 화살통(50% 회오리) · 노움의 망치(맞힌 자리 범위 공격) · 드라이어드의 수정구(1초마다 30%로 체력 3%) · 아프로디테의 거울(맞으면 30%로 2배 빛 레이저) · 떨어진 신의 파편(열 가지 신의 힘 중 하나)",
      ],
      en: [
        "Hidden shop 'Dimensional Pilgrim' (Solo, Endless, Co-op): each floor has an 8% chance that one battle room is empty · walk in and a little girl with a huge backpack steps out of a portal, says \"Hi! Take a look at these!\" and lays out 3 hidden goods for gold",
        "First 16 hidden items: Aether Bomb (3x bomb, wider) · Archmage's Forbidden Scroll (meteors across the room) · Dimension Gate (skip this floor; clears on the last) · the Artifacter's 7 Forbidden Artifacts (each kill stacks damage, attack speed, defense, crit, crit damage, HP or regen, with a colored stack window top left) · Ifrit's Claw (burns that stack 5 times) · Sylph's Quiver (50% whirlwind) · Gnome's Hammer (area strike where you hit) · Dryad's Crystal Orb (30% each second to heal 3%) · Aphrodite's Mirror (30% on hit for a double-damage light laser) · Fallen God's Shard (one of ten divine powers)",
      ],
      ja: [
        "ヒドゥンショップ「次元の巡礼者」(ソロ・エンドレス・協力): 階ごとに8%で戦闘部屋の一つがモンスターのいない空き部屋に · 入ると上のポータルから大きなリュックを背負った女の子が出てきて「こんにちは! これ見て見て!」とヒドゥン品3つをゴールドで並べる",
        "ヒドゥンアイテム第1弾16個: エーテル爆弾 (爆弾の3倍・より広く) · 大魔法使いの禁じられた呪文書 (部屋中にメテオ) · 次元移動門 (この階を飛ばす、最後の階ならクリア) · アーティファクターの禁じられたアーティファクト7色 (撃破ごとに攻撃力・攻撃速度・防御力・クリティカル・クリティカルダメージ・体力・再生力が溜まる、左上にその色のスタック) · イフリートの爪 (5回まで重なる火傷) · シルフィードの矢筒 (50%でつむじ風) · ノームの槌 (当てた所に範囲攻撃) · ドライアドの水晶玉 (1秒ごとに30%で体力3%) · アフロディーテの鏡 (被弾時30%で2倍の光レーザー) · 堕ちた神の欠片 (十の神の力のうち一つ)",
      ],
    },
  },
  {
    version: "0.48.222",
    date: "2026-10-29",
    items: {
      ko: [
        "업적 보상 13개 추가 (달성하면 그 물건이 나오기 시작함): 3층 도착 사냥꾼의 눈 · 5층 부메랑 · 6층 두 번째 숨 · 한 판 30처치 단도 · 70처치 분노의 인장 · 170처치 투창 · 보스 3마리 무거운 판금 · 안 맞고 보스 3마리 회피 망토 · 한 판 300 벌기 돈 주머니 · 100 모으기 깃털 촉 · 150 쓰기 연발 쇠뇌 · 패시브 5개 재생 부적 · 사용 칸 둘 다 투석끈",
        "패왕전: 체력 줄 위에 캐릭터 이름이 작게 뜸 (스킨을 입어도 누군지 알게) · 위쪽 '이름' 버튼·N 키·설정에서 켜고 끔",
      ],
      en: [
        "13 new achievement rewards (the item starts appearing once unlocked): reach floor 3 Hunter's Eye · floor 5 Boomerang · floor 6 Second Wind · 30 kills in a run Dagger · 70 kills Fury Seal · 170 kills Javelin · 3 bosses Heavy Plate · 3 flawless bosses Dodge Cloak · earn 300 in a run Gold Pouch · hold 100 Feather Tip · spend 150 Repeater · 5 passives Regen Charm · both item slots full Sling",
        "Champion Clash: character names now show above health bars (so you can tell who is who even in skins) · toggle with the 'Names' button at the top, the N key, or in settings",
      ],
      ja: [
        "実績報酬を13個追加 (達成するとそのアイテムが出始める): 3階到達 狩人の目 · 5階 ブーメラン · 6階 二度目の息 · 1回で30撃破 短刀 · 70撃破 憤怒の印 · 170撃破 投げ槍 · ボス3体 重い板金 · 無被弾ボス3体 回避のマント · 1回で300稼ぐ 金の袋 · 100貯める 羽の鏃 · 150使う 連弩 · パッシブ5個 再生の護符 · アイテム枠2つとも スリング",
        "覇王戦: 体力バーの上にキャラ名が小さく表示 (スキンを着ていても誰か分かる) · 上の「名前」ボタン・Nキー・設定でオン・オフ",
      ],
    },
  },
  {
    version: "0.48.221",
    date: "2026-10-29",
    items: {
      ko: [
        "아티팩터: 모든 상점(라스트 보스 층 포함)이 거대한 제작대로 바뀜. F로 들어가 골드를 내고 · 강화 = 자기 패시브를 50% 확률로 한 단계 강화 (최대 3단계, 단계마다 효과 +50%), 일반 패시브 두 개를 고르면 무작위 자기 패시브 하나로 합침 (히든 10%) · 교체 = 자기 패시브는 다른 자기 패시브로, 일반 패시브는 다른 일반 패시브로 · 튜닝 = 자기 패시브를 50% 확률로 히든 패시브로, 실패하면 부서짐 · 성공·실패·파괴 연출",
        "추적자: 라스트 보스 층 상점이 튜닝소로 바뀜. 창 가득한 저격총에서 부위(총열·조준경·개머리판·탄창·총구·레일)를 눌러 부품을 갈아 끼우거나 골드로 강화 (부위마다 부품 4개, 효과는 사거리·이동 속도·탄속·체력·행운·스킬 대기·암습·연발 흔들림 등 편의성만, 공격력 없음) · 강화 성공 확률 100 → 75 → 50 → 25 → 10%, 실패하면 한 단계 내려감 · 단계마다 효과 +15%",
      ],
      en: [
        "Artifacter: every shop (including the last boss floor) is now a Grand Workbench. Press F and pay gold to · Enhance = upgrade one of your own passives by a level at 50% (up to 3 levels, +50% effect each), or pick two general passives to fuse them into a random passive of your own (10% hidden) · Swap = own passive into another own passive, general into another general · Tune = turn an own passive into a hidden one at 50%, or it breaks · success, failure and destruction effects",
        "Tracker: the shop on the last boss floor is now a Tuning Bay. Click a part of the rifle that fills the window (barrel, scope, stock, magazine, muzzle, rail) to swap in another part or upgrade it with gold (4 parts per slot; effects are convenience only: range, move speed, bullet speed, HP, luck, skill cooldowns, ambush and rapid-fire spread, no damage) · upgrade success 100 → 75 → 50 → 25 → 10%, failure drops one level · +15% effect per level",
      ],
      ja: [
        "アーティファクター: すべてのショップ (ラスボス階も) が巨大な作業台に。Fで入りゴールドを払って · 強化 = 自分のパッシブを50%で1段階強化 (最大3段階、段階ごとに効果+50%)、一般パッシブを2つ選ぶとランダムな自分のパッシブ1つに合成 (ヒドゥン10%) · 交換 = 自分のパッシブは別の自分のパッシブに、一般パッシブは別の一般パッシブに · チューニング = 自分のパッシブを50%でヒドゥンに、失敗すると壊れる · 成功・失敗・破壊の演出",
        "トラッカー: ラスボス階のショップがチューニング工房に。画面いっぱいの狙撃銃で部位 (銃身・スコープ・銃床・弾倉・銃口・レール) を押してパーツを交換したりゴールドで強化 (部位ごとにパーツ4つ、効果は射程・移動速度・弾速・体力・幸運・スキル待ち時間・暗襲・連射のぶれなど利便性のみ、攻撃力なし) · 強化成功率 100 → 75 → 50 → 25 → 10%、失敗すると1段階下がる · 段階ごとに効果+15%",
      ],
    },
  },
];
