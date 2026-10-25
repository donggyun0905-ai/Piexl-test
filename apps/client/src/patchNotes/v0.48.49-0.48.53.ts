import type { PatchNote } from "./types";

// 지난 기록 (0.48.49~0.48.53)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.53",
    date: "2026-10-23",
    items: {
      ko: ["이무기 콤보 100: 브레스를 없애고, 무기 빛깔 한 색으로 물든 거대한 용(최종 보스 용 모습)이 맵 아래에서 위로 날아 지나가며 모든 적에게 공격력 450% · 전용 아이템 '긴 숨결'은 '쌍룡'(용이 한 번 더 지나감, 두 번째는 피해 50%)으로 바뀜"],
      en: ["Imugi combo 100: the breath is gone — a giant dragon (the final boss's form) in your weapon's single color flies up across the map from the bottom, hitting every foe for 450% damage · The item 'Long Breath' is now 'Twin Dragons' (the dragon passes again at 50% damage)"],
      ja: ["イムギのコンボ100：ブレスをなくし、武器の色一色に染まった巨大な龍（最終ボスの龍の姿）がマップの下から上へ飛び抜け、全ての敵に攻撃力450% · 専用アイテム「長い息吹」は「双龍」（龍がもう一度通り過ぎる、2回目はダメージ50%）に変更"],
    },
  },
  {
    version: "0.48.52",
    date: "2026-10-23",
    items: {
      ko: [
        "새 캐릭터 이무기 (용창): 찌르기와 휘두르기를 한 번에, 맞힐 때마다 콤보가 쌓임 (층을 넘어가도 이어짐) · 콤보 50이면 금빛 오라(공격력·체력·보호막·이동·공격 속도 강화), 100이면 무기 빛깔의 용이 내려와 맵 전체를 내려치고 5초 동안 바닥에서 브레스 · 무기 11개(청룡·적룡·풍룡·토룡·성룡·암룡·은룡·사룡·천룡·여의주)마다 다른 추가 공격 · 전용 아이템 10개",
        "새 캐릭터 악의 사도 (십자가): 하늘에서 뒤집힌 십자가가 떨어져 짓누름 · 일곱 죄의 십자가는 화상·잠·부패·독·서로 공격·속박·중력 장판 · 사탄의 가면(죽음) · 역천의 베드로(하늘색 불꽃·업화) · 회복약은 오히려 피해, 쓰러진 적의 영혼을 먹어야 회복 · 전용 아이템 10개",
        "새 상태이상 피해 숫자: 부패(주황·녹아내린 구슬) · 죽음(검정·해골) · 업화(하늘색·푸른 불꽃) · 폭풍",
      ],
      en: [
        "New character Imugi (dragon spear): thrust and swing at once, every hit builds combo (carries across floors) · At 50 a golden aura boosts damage, HP, shield, speed and attack speed; at 100 a dragon in your weapon's color slams the whole map and breathes from the ground for 5s · 11 weapons (Azure, Crimson, Gale, Earth, Holy, Shadow, Silver, Venom, Sky Dragon, Dragon Pearl) each add a different follow-up · 10 exclusive items",
        "New character Apostle of Malice (cross): inverted crosses fall from the sky to crush foes · Crosses of the seven sins leave burn, sleep, rot, poison, infighting, bind and gravity fields · Mask of Satan (Death) · Peter the Defiant (sky-blue flame, Hellfire) · Potions hurt; eat the souls of the fallen to heal · 10 exclusive items",
        "New status damage numbers: Rot (orange, melting orb) · Death (black, skull) · Hellfire (sky blue, blue flame) · Storm",
      ],
      ja: [
        "新キャラ イムギ（龍槍術）：突きと薙ぎを同時に、当てるたびにコンボがたまる（階をまたいでも続く）· コンボ50で金色のオーラ（攻撃力・体力・シールド・移動・攻撃速度強化）、100で武器の色の龍が降りてマップ全体を叩きつけ、5秒間床からブレス · 武器11個（青龍・赤龍・風龍・土龍・聖龍・暗龍・銀龍・蛇龍・天龍・如意宝珠）ごとに違う追加攻撃 · 専用アイテム10個",
        "新キャラ 悪の使徒（十字架）：空から逆さ十字が落ちて押し潰す · 七つの罪の十字架は火傷・眠り・腐敗・毒・同士討ち・拘束・重力の床 · サタンの仮面（死）· 逆天のペテロ（空色の炎・業火）· 回復薬は逆にダメージ、倒した敵の魂を食べて回復 · 専用アイテム10個",
        "新しい状態異常ダメージ数字：腐敗（オレンジ・溶けた珠）· 死（黒・ドクロ）· 業火（空色・青い炎）· 嵐",
      ],
    },
  },
  {
    version: "0.48.51",
    date: "2026-10-23",
    items: {
      ko: [
        "연습장 도구 새로 정리: 캐릭터는 접어 두는 칸(이름이 세로로 찌그러지지 않게) · 무기·패시브를 '지금 캐릭터 → 공용 → 다른 캐릭터 전용' 묶음으로 나눔 · 이름으로 찾기",
        "연습장: 능력치 패시브(+ 표시)는 누를 때마다 하나 더 얻음(×숫자), 칸 위 −로 하나 빼기 · 사용 아이템도 빼기",
        "연습장 적 부르기: 졸개·1~3단계 보스·라스트 보스로 나누고 몬스터 그림 표시 · 세기(1~7층)를 골라 그 층의 적처럼 강하게 부르기",
      ],
      en: [
        "Practice tools reorganized: the character list folds away (names no longer squeeze vertically) · weapons and passives grouped as 'this character → common → other characters' · search by name",
        "Practice: stat passives (marked +) stack with each click (×count); use − on a slot to drop one · consumables can be dropped too",
        "Practice enemies: grouped into minions, tier 1-3 bosses and last bosses with portraits · pick a floor (1-7) to spawn them as strong as on that floor",
      ],
      ja: [
        "練習ツールを整理：キャラ一覧は折りたたみ（名前が縦に潰れない）· 武器・パッシブを「今のキャラ → 共通 → 他キャラ専用」に分類 · 名前で検索",
        "練習場：能力値パッシブ（＋印）は押すたびに1つ増える（×数）、枠の−で1つ外す · 使用アイテムも外せる",
        "練習場の敵呼び出し：雑魚・第1〜3段階ボス・ラストボスに分けて絵を表示 · 強さ（1〜7階）を選んでその階の敵と同じ強さで呼ぶ",
      ],
    },
  },
  {
    version: "0.48.50",
    date: "2026-10-23",
    items: {
      ko: ["베두인 '풍뎅이 부적': 행운 +2에 더해 보스에게 주는 피해 +30%"],
      en: ["Bedouin 'Scarab Charm': on top of luck +2, deals +30% damage to bosses"],
      ja: ["ベドウィン「スカラベのお守り」：幸運+2に加えてボスへのダメージ+30%"],
    },
  },
  {
    version: "0.48.49",
    date: "2026-10-23",
    items: {
      ko: [
        "베두인 '회오리 고리'를 '잔상 고리'로 바꿈: 날아가는 차크람이 지나간 자리에 잔상을 남기고, 잔상은 3초 동안 돌며 닿은 적을 0.5초마다 공격력 30%로 벰",
        "베두인 '신기루 걸음': 대시 대기 시간 -30% → -40%",
      ],
      en: [
        "Bedouin 'Whirling Ring' is now 'Afterimage Ring': a flying chakram leaves afterimages that spin for 3s, cutting touching foes for 30% damage every 0.5s",
        "Bedouin 'Mirage Step': dash cooldown -30% → -40%",
      ],
      ja: [
        "ベドウィン「旋風の輪」を「残像の輪」に変更：飛んでいるチャクラムが通った跡に残像を残し、残像は3秒間回り続けて触れた敵を0.5秒ごとに攻撃力30%で斬る",
        "ベドウィン「蜃気楼の歩み」：ダッシュ待ち時間-30% → -40%",
      ],
    },
  },
];
