import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.91",
    date: "2026-10-25",
    items: {
      ko: [
        "광야의 새벽 각성: 각성한 무기는 능력치에 더해 무기마다 다른 각성 기술 하나 (번개 폭풍 · 별똥별 · 서리 고리 · 회전 칼날 · 탄 세례 · 각성 파동)",
        "광야의 새벽 레벨 업 창을 새로: 무기·패시브 띠, 레벨 점, 조합 짝, 각성 기술 안내. 모두 다 키운 뒤에는 회복 · 돈 · 힘(피해 +5%, 쌓임) 중 고름",
        "광야의 새벽 위쪽 무기·패시브 칸에 마우스를 올리면 설명 말풍선 (레벨 · 조합 · 각성 기술)",
        "상점에 '이벤트' 탭: 이벤트 코인으로 타격 · 대기 · 걸음 이펙트와 데미지 스킨(범 발톱 · 황금 · 네온 숫자)을 사서 스킨과 따로 장착. 산 효과 그림은 '도트로 고치기'로 직접 그릴 수 있음",
        "뽑기에서 이미 가진 스킨(꽝)이 나오면 절반은 쿠폰 대신 이벤트 코인 1~3개",
        "버려진 자들 조합 표를 그림으로: 아이마다 방패·총·검 그림 칸, 탭 화살표, 지금 단계는 크게 + 특수기 이름, 다음에 할 칸이 깜빡임",
      ],
      en: [
        "Dawn of the Wilds awakening: awakened weapons now gain a unique skill besides the stat boost (Lightning Storm · Shooting Stars · Frost Ring · Spinning Blades · Bullet Barrage · Awakening Nova)",
        "Redesigned the Dawn of the Wilds level-up window: weapon/passive tags, level pips, combo partner and awakened skill info. Once everything is maxed, choose Heal · Gold · Might (+5% damage, stacks)",
        "Hover a weapon or passive slot at the top of Dawn of the Wilds for a tooltip (level · combo · awakened skill)",
        "New 'Event' tab in the shop: spend event coins on hit, idle and walk effects and damage skins (Tiger Claw · Golden · Neon numbers), equipped separately from skins. Bought effect art can be redrawn with 'Edit pixels'",
        "When the gacha gives a skin you already own, half the time you get 1–3 event coins instead of coupons",
        "The Abandoned combo chart is now pictures: shield/gun/sword icons per kid, tag arrows, the current stage enlarged with its special's name, and the next step blinks",
      ],
      ja: [
        "荒野の夜明けの覚醒：覚醒した武器は能力値に加えて武器ごとに違う覚醒技がひとつ（雷の嵐 · 流れ星 · 霜の輪 · 回転刃 · 弾の洗礼 · 覚醒の波動）",
        "荒野の夜明けのレベルアップ画面を一新：武器・パッシブの帯、レベルの点、組み合わせ相手、覚醒技の案内。すべて最大になったら回復 · お金 · 力（ダメージ+5%、重なる）から選ぶ",
        "荒野の夜明けの上の武器・パッシブ枠にマウスを乗せると説明の吹き出し（レベル · 組み合わせ · 覚醒技）",
        "ショップに「イベント」タブ：イベントコインで打撃 · 待機 · 歩きエフェクトとダメージスキン（虎爪 · 黄金 · ネオンの数字）を買い、スキンとは別に装着。買ったエフェクトの絵は「ドットで描き直す」で描ける",
        "ガチャで持っているスキン（ハズレ）が出ると、半分はクーポンの代わりにイベントコイン1〜3枚",
        "捨てられた者たちの組み合わせ表を絵に：子どもごとに盾・銃・剣の絵の枠、タッチの矢印、今の段階は大きく＋特殊技の名前、次にやる枠が点滅",
      ],
    },
  },
  {
    version: "0.48.90",
    date: "2026-10-25",
    items: {
      ko: [
        "광야의 새벽 맵 5개: 탁 트인 들판 · 폐허 도시(건물 사이 골목) · 변경 요새(돌벽 + 나를 돕는 미사일 타워) · 독 늪(물웅덩이·진흙) · 화산 지대(용암). 캐릭터를 고른 뒤 맵과 난이도(보통·어려움·지옥)를 고름",
        "맵·난이도를 깨면 이벤트 코인 (처음 깨면 많이, 다시 깨도 조금)",
        "보스 순서: 1단계 둘 · 2단계 둘 · 3단계 둘 · 최종 보스. 황금 상자는 보스만 떨어뜨림. 최종 보스를 잡으면 끝내거나 계속(끝없이 더 센 적과 보스) 고르기",
        "더 어렵게: 적이 더 많고 세짐, 받는 피해·회복 조정, 레벨이 오를수록 필요한 경험치가 크게 늘어남",
        "특수 이벤트(2분마다): 포위 · 메테오 비 · 아이 구출. 성공하면 내 앞에 아이템 3개",
        "이 모드에서만 캐릭터 제한: 처치 때 터지는 효과(악의 사도 영혼 등)는 확률로, 악의 사도는 고기를 먹으면 체력이 깎임, 풋내기 경험치 줄임, 아홉 목숨은 한 번",
        "바닥 아이템 그림을 알아보기 쉽게: 회복약 · 자석 · 폭탄 · 금화 · 황금 상자",
      ],
      en: [
        "Dawn of the Wilds now has 5 maps: Open Plains · Ruined City (alleys between buildings) · Frontier Fort (stone walls + missile towers that help you) · Poison Swamp (ponds, mud) · Volcanic Wastes (lava). Pick a map and difficulty (Normal · Hard · Hell) after choosing a character",
        "Clearing a map and difficulty gives event coins (lots on the first clear, a few on repeats)",
        "Boss order: two tier-1 · two tier-2 · two tier-3 · the final boss. Gold chests now drop only from bosses. After the final boss, end the run or continue (endless, ever-stronger foes and bosses)",
        "Harder: more and tougher foes, adjusted damage taken and regen, and XP needed grows much faster with level",
        "Special events (every 2 minutes): Surrounded · Meteor Shower · Rescue the Child. Succeed for 3 items in front of you",
        "Character limits in this mode only: on-kill effects (the Apostle's souls, etc.) trigger by chance, the Apostle loses HP from meat, the Novice gains less XP, Nine Lives works once",
        "Clearer floor item art: potion · magnet · bomb · gold coin · gold chest",
      ],
      ja: [
        "荒野の夜明けにマップ5つ：ひらけた草原 · 廃墟の街（建物の間の路地） · 辺境の砦（石壁＋味方のミサイル塔） · 毒の沼（水たまり・泥） · 火山地帯（溶岩）。キャラを選んだあとマップと難易度（ふつう · むずかしい · 地獄）を選ぶ",
        "マップ・難易度をクリアするとイベントコイン（初クリアはたくさん、再クリアでも少し）",
        "ボスの順番：1段階2体 · 2段階2体 · 3段階2体 · 最終ボス。金の箱はボスだけが落とす。最終ボスを倒したら終えるか続ける（終わりなく強くなる敵とボス）を選ぶ",
        "より難しく：敵が多く強く、被ダメージ・回復を調整、レベルが上がるほど必要経験値が大きく増える",
        "特殊イベント（2分ごと）：包囲 · メテオの雨 · 子ども救出。成功すると目の前にアイテム3つ",
        "このモードだけのキャラ制限：撃破時の効果（悪の使徒の魂など）は確率で、悪の使徒は肉で体力が減る、見習いの経験値を減らす、九つの命は1回だけ",
        "床アイテムの絵を見分けやすく：回復薬 · 磁石 · 爆弾 · 金貨 · 金の箱",
      ],
    },
  },
];
