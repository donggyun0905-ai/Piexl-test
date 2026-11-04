import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.380",
    date: "2026-11-04",
    items: {
      ko: [
        "아이템 설명 말풍선에 패시브 꼬리표(색 칩)가 보임",
        "왼쪽 능력치 칸에 '빌드 세트': 모은 꼬리표마다 가진 수/다음 단계·★ 단계 · 마우스를 올리면 2·4·6단계 효과 · 단계가 오르면 화면 위에 알림",
        "제단의 방: 증강 카드에 받을 꼬리표 표시 · 알 수 없는 성좌는 증강을 누르면 꼬리표 15종 중 하나를 고름",
      ],
      en: [
        "Item tooltips now show the passive's tag (colored chip)",
        "'Build sets' in the left stats column: count / next tier and ★ tier for each tag you collect · hover for the 2/4/6 bonuses · a banner appears when a tier goes up",
        "Altar room: the augment card shows the tags you'll get · for the Unknown constellation, pick one of 15 tags after choosing the augment",
      ],
      ja: [
        "アイテム説明の吹き出しにパッシブのタグ（色チップ）を表示",
        "左の能力値欄に「ビルドセット」：集めたタグごとに所持数／次の段階・★段階・カーソルを合わせると2・4・6段階の効果・段階が上がると画面上に通知",
        "祭壇の部屋：増強カードに得るタグを表示・知られざる星座は増強を押すと15種のタグから1つ選ぶ",
      ],
    },
  },
  {
    version: "0.48.379",
    date: "2026-11-04",
    items: {
      ko: ["보상 편향: 가장 많이 모은 꼬리표의 패시브가 층 보상·상점·여신의 선물에 더 잘 나옴 (가진 수 1개마다 ×1.25, 최대 ×2.5) · 셋 중 한 칸은 늘 다른 꼬리표"],
      en: ["Reward bias: passives of your most-collected tag show up more in floor rewards, shops and the Goddess's Gift (×1.25 per tag owned, up to ×2.5) · one of three choices is always a different tag"],
      ja: ["報酬の偏り：一番多く集めたタグのパッシブがフロア報酬・ショップ・女神の贈り物に出やすい（所持1個ごとに×1.25、最大×2.5）・3つのうち1つは必ず別のタグ"],
    },
  },
  {
    version: "0.48.378",
    date: "2026-11-04",
    items: {
      ko: [
        "빌드 세트 효과: 모든 패시브에 꼬리표 15종(불·얼음·번개·독·빛·어둠·죽음·대지·물 / 날카로움·단단함·바람·행운·소환·피) 중 하나가 붙고, 같은 꼬리표를 2·4·6개 모으면 세트 효과가 생김 (예: 불 4개 — 화상 걸린 적이 쓰러지면 폭발, 단단함 6개 — 맞으면 보호막)",
        "제단의 방: 증강을 받으면 그 성좌의 꼬리표 둘이 세트에 하나씩 더해짐 (바다: 물·얼음 · 화산: 대지·불 · 하늘: 번개·단단함 · 바람: 날카로움·바람 · 빛과 어둠: 빛·어둠 · 그린우드: 독·소환 · 일곱 갈래의 마녀: 죽음·피 · 알 수 없는 성좌: 행운 + 고르는 꼬리표)",
        "패왕전·광야의 새벽에서는 세트 효과가 없음 · 꼬리표·세트 단계 표시는 다음 업데이트에서",
      ],
      en: [
        "Build set bonuses: every passive now carries one of 15 tags (Fire, Ice, Lightning, Poison, Light, Dark, Death, Earth, Water / Sharp, Sturdy, Wind, Luck, Summon, Blood); collect 2, 4 or 6 of the same tag for set bonuses (e.g. Fire 4: burning foes explode when they fall, Sturdy 6: gain a shield when hit)",
        "Altar room: taking an augment adds that constellation's two tags to your sets (Sea: Water·Ice · Volcano: Earth·Fire · Sky: Lightning·Sturdy · Wind: Sharp·Wind · Light and Dark: Light·Dark · Greenwood: Poison·Summon · Seven-Branched Witch: Death·Blood · Unknown: Luck + a tag you choose)",
        "No set bonuses in Champion Clash or Dawn of the Wilds · tag and set tier display comes in the next update",
      ],
      ja: [
        "ビルドのセット効果：すべてのパッシブに15種のタグ（火・氷・雷・毒・光・闇・死・大地・水／鋭さ・頑丈・風・幸運・召喚・血）のどれかが付き、同じタグを2・4・6個集めるとセット効果（例：火4個―燃えている敵が倒れると爆発、頑丈6個―被弾でシールド）",
        "祭壇の部屋：増強を受けるとその星座のタグ2つがセットに1つずつ加算（海：水・氷・火山：大地・火・空：雷・頑丈・風：鋭さ・風・光と闇：光・闇・グリーンウッド：毒・召喚・七つ枝の魔女：死・血・知られざる星座：幸運＋選ぶタグ）",
        "覇王戦・荒野の夜明けではセット効果なし・タグとセット段階の表示は次のアップデートで",
      ],
    },
  },
  {
    version: "0.48.377",
    date: "2026-11-04",
    items: {
      ko: [
        "쓰러질 때 연출: 바로 결과 창이 뜨지 않고, 쓰러지기 직전 장면이 느리게 다시 나온 뒤(맞은 공격이 보임) 몸이 옆으로 쓰러지고 나서 결과 창",
        "결과 창에 '쓰러진 원인': 마지막 한 방 · 이 방에서 무엇에 얼마나 맞았는지 막대 (맞은 횟수·가장 큰 한 방)",
        "단련의 방: 미니게임 설명 창에 저절로 해 보이는 예시 화면 (샌드백·랫풀다운·벤치 프레스)",
      ],
      en: [
        "Death sequence: instead of the result window popping up at once, the moments before you fall replay in slow motion (you see what hit you), your body topples, then the result window",
        "'What took you down' in the result window: the final blow and bars for what hit you in this room (hits and biggest hit)",
        "Training room: the minigame explanation now has a self-playing example (sandbag, lat pull, bench press)",
      ],
      ja: [
        "倒れたときの演出：すぐに結果ウィンドウを出さず、倒れる直前の場面をスローで再生（受けた攻撃が見える）→ 体が横に倒れてから結果ウィンドウ",
        "結果ウィンドウに「倒れた原因」：最後の一撃・この部屋で何にどれだけ受けたかのバー（被弾回数・最大の一撃）",
        "鍛錬の部屋：ミニゲーム説明ウィンドウに自動で遊ぶ例の画面（サンドバッグ・ラットプル・ベンチプレス）",
      ],
    },
  },
  {
    version: "0.48.376",
    date: "2026-11-03",
    items: {
      ko: [
        "끝없는 시련: 처치로 느려지는 이동 속도가 능력치 창에도 보임 · 시련 중에는 모든 회복이 막힘 (흡혈·재생·회복약·레벨업 회복 등) · 사용 아이템을 못 씀",
        "비밀의 방: 위쪽 출구가 없어지고, 들어온 쪽(아래 가운데)의 빛나는 뒷문으로 원래 방에 돌아감 (금 간 벽에서 조금 안쪽에 섬) · 시련 보상 상자로 들어간 비밀의 방도 같은 뒷문으로 시련의 방에 돌아옴",
      ],
      en: [
        "Endless trial: the move-speed slowdown from kills now shows in the stats window · all healing is blocked during the trial (lifesteal, regen, potions, level-up heals…) · use items can't be used",
        "Secret rooms: no more top exits — leave through the glowing back door where you came in (bottom center) to return to the original room (you stand just inside the cracked wall) · secret rooms opened from trial reward chests use the same back door to return to the trial room",
      ],
      ja: [
        "終わりなき試練：撃破で遅くなる移動速度が能力値ウィンドウにも表示・試練中はすべての回復が無効（吸血・再生・回復薬・レベルアップ回復など）・使用アイテム不可",
        "秘密の部屋：上の出口をなくし、入ってきた側(下の中央)の光る裏口から元の部屋に戻る（ひび割れた壁の少し内側に立つ）・試練の報酬箱から入った秘密の部屋も同じ裏口で試練の部屋に戻る",
      ],
    },
  },
];
