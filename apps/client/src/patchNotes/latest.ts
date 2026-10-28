import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.174",
    date: "2026-10-28",
    items: {
      ko: [
        "새 몬스터 넷 (2층부터): 베놈 · 땅 물고기 / (3층부터): 도플갱어 · 그림자",
        "도플갱어: 내 캐릭터와 똑같은 모습(어둡고 붉은 눈). 내 무기가 멀리 쏘는 것이면 거리를 두고 쏘고, 아니면 다가와 벰 (능력치·무기는 따라 하지 못함)",
        "베놈: 독잠자리. 이리저리 날며 방 곳곳에 독가스를 퍼뜨림 · 가스 안에 있으면 조금씩 독 피해와 새 상태이상 '부식독'(3초 동안 모든 회복·재생 40% 감소)",
        "땅 물고기: 땅속에서 나를 따라오는 원 → 멈춰 빠르게 깜빡이면 솟구침 → 다른 자리로 뛰어드는데 그 자리도 표시되고 터짐. 뛰어오른 동안만 맞음",
        "그림자: 희미하게 비쳐 잘 보이지 않음. 내 등 뒤로 돌아가 큰 한 방 (칠 때만 짙어짐)",
        "연습장에서 새 몬스터와 시즌 2 새 보스 넷을 부를 수 있음",
      ],
      en: [
        "4 new monsters (from floor 2): Venom · Land Fish / (from floor 3): Doppelganger · Shadow",
        "Doppelganger: looks exactly like your character (dark, red eyes). Shoots from afar if your weapon is ranged, otherwise closes in to slash (can't copy your stats or weapon)",
        "Venom: a poison dragonfly that spreads poison gas around the room · standing in it deals light poison damage and inflicts the new status 'Corrosion' (all healing and regen −40% for 3s)",
        "Land Fish: a circle follows you underground → when it stops and blinks fast it bursts out → leaps into another marked spot that also explodes. Only hittable mid-leap",
        "Shadow: faint and hard to see. Slips behind you for a heavy blow (only darkens as it strikes)",
        "The new monsters and the 4 new Season 2 bosses can be summoned in Practice",
      ],
      ja: [
        "新モンスター4体（2階から）: ヴェノム・土ザカナ／（3階から）: ドッペルゲンガー・影",
        "ドッペルゲンガー: 自分のキャラとそっくりの姿（暗く赤い目）。武器が遠距離なら距離を取って撃ち、そうでなければ近づいて斬る（能力値・武器は真似できない）",
        "ヴェノム: 毒トンボ。飛び回って部屋中に毒ガスをまく・ガスの中にいると少しずつ毒ダメージと新しい状態異常「腐食毒」（3秒間すべての回復・再生40%減少）",
        "土ザカナ: 地中で追ってくる円 → 止まって速く点滅すると飛び出す → 別の場所に飛び込み、そこも表示されて爆発。跳んでいる間だけ攻撃が当たる",
        "影: かすかに透けて見えにくい。背後に回り込んで重い一撃（攻撃の瞬間だけ濃くなる）",
        "練習場で新モンスターとシーズン2の新ボス4体を呼べる",
      ],
    },
  },
  {
    version: "0.48.173",
    date: "2026-10-28",
    items: {
      ko: [
        "시즌 2 새 보스 넷: 1단계 늪의 두꺼비 왕(뛰어올라 덮치기 · 혀로 끌어당기기 · 진흙 덩이) · 1단계 불도롱뇽(불길 돌진 · 용암 잠수 뒤 발밑에서 솟구침) · 2단계 번개 해파리(물 감전 · 전기 방울 · 번개 줄) · 3단계 유령선 선장(대포 포격 · 닻 · 밀물 · 선원 부르기)",
        "새 보스방 모양 넷: 보스마다 늪 · 화산 · 물가 · 갑판 모양의 벽 배치와 바닥 색",
        "던전 지형 추가: 진흙(느려짐) · 용암(데미지) · 얕은 물(조금 느려지고 감전될 수 있음) · 가시 함정(주기적으로 솟음, 붉게 예고)",
        "원래 층에도 보스 컨셉에 맞게 지형이 조금씩: 하드플랜트·무리 여왕 층 진흙, 세이렌 층 물, 데스·검신·강철 거구 층 가시 함정 등",
      ],
      en: [
        "4 new Season 2 bosses: Tier 1 Bog Toad King (leap slam · tongue pull · mud blobs) · Tier 1 Magma Salamander (fire-trail charge · dives into lava and erupts under you) · Tier 2 Storm Jellyfish (electrified water · drifting orbs · lightning lines) · Tier 3 Ghost Ship Captain (cannon barrage · anchor · tide · calls crew)",
        "4 new boss room layouts: swamp, volcano, shore and deck wall shapes and floor colors",
        "New dungeon terrain: mud (slows) · lava (damage) · shallow water (slightly slows, can be electrified) · spike traps (rise periodically, warned in red)",
        "Existing floors get a bit of terrain matching their boss: mud on Hard Plant and Brood Queen floors, water on Siren floors, spike traps on Reaper, Sword God and Iron Hulk floors, and more",
      ],
      ja: [
        "シーズン2の新ボス4体: 1段階 沼のガマ王（跳びかかり・舌で引き寄せ・泥の塊）· 1段階 火山サラマンダー（炎の突進・溶岩に潜って足元から噴き上がる）· 2段階 雷クラゲ（水の感電・電気の玉・雷の線）· 3段階 幽霊船の船長（大砲の砲撃・錨・満ち潮・船員を呼ぶ）",
        "新しいボス部屋の形4つ: 沼・火山・水辺・甲板の壁配置と床の色",
        "ダンジョン地形を追加: 泥（遅くなる）· 溶岩（ダメージ）· 浅い水（少し遅くなり、感電することも）· トゲの罠（周期的に飛び出す、赤く予告）",
        "元の階にもボスのコンセプトに合わせて地形が少しずつ: ハードプラント・群れの女王の階に泥、セイレーンの階に水、デス・剣神・鋼鉄の巨体の階にトゲの罠など",
      ],
    },
  },
  {
    version: "0.48.172",
    date: "2026-10-28",
    items: {
      ko: [
        "이벤트 상점 테마 효과 10세트: 벚꽃 · 뇌전 · 서리 · 화염 · 은하 · 사탕 · 8비트 · 그림자 · 리듬 · 숲 (세트마다 타격 · 대기 · 걸음, 앞 8세트는 데미지 스킨도 · 모두 38개)",
        "칸마다 다른 세트를 섞어 낄 수 있고, 범 풍류 효과와도 같이 낄 수 있음 · 상점 카드에서 움직이는 미리 보기",
      ],
      en: [
        "10 themed effect sets in the event shop: Sakura · Thunder · Frost · Inferno · Galaxy · Candy · 8-Bit · Shadow · Rhythm · Forest (hits, idle and steps each, plus damage skins for the first 8 · 38 in total)",
        "Mix different sets per slot, even alongside the Tiger effects · animated previews on the shop cards",
      ],
      ja: [
        "イベントショップのテーマエフェクト10セット: 桜・雷電・霜・火炎・銀河・キャンディ・8ビット・影・リズム・森（セットごとに打撃・待機・歩み、最初の8セットはダメージスキンも・全38個）",
        "スロットごとに別セットを組み合わせ可能、虎の風流エフェクトとも併用可 · ショップのカードで動くプレビュー",
      ],
    },
  },
  {
    version: "0.48.171",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 시작 보호막 500 → 300",
        "패왕전 한정 캐릭터 밸런스: AI끼리 무작위 1대1 약 4,700판을 돌려 승률이 너무 높거나 낮은 캐릭터의 체력·공격력·받는 피해를 패왕전에서만 보정 (대부분 40~60% 사이로). 준비방에 그 캐릭터의 보정이 보임",
        "크게 낮춘 캐릭터: 묵인 · 격투가 · 잔영 · 오토마타 · 라이더 · 거인 · 오니 / 크게 올린 캐릭터: 버려진 자들 · 영사 · 풋내기 · 시간술사 · 악의 사도 · 떠돌이 · 변희 · 역병의사",
      ],
      en: [
        "Champion Clash starting shield 500 → 300",
        "Champion Clash-only character balance: after about 4,700 random AI 1v1s, HP, damage and damage taken were tuned only in Champion Clash for characters winning too much or too little (most now 40–60%). The prep room shows each character's tuning",
        "Toned down most: Mukin, Brawler, Remnant, Automata, Rider, Titan, Oni / Boosted most: Abandoned, Silk, Novice, Chronomancer, Apostle, Drifter, Byeonhui, Plague Doctor",
      ],
      ja: [
        "覇王戦の開始シールド 500 → 300",
        "覇王戦限定のキャラバランス: AI同士のランダム1対1を約4,700戦回し、勝率が高すぎる・低すぎるキャラの体力・攻撃力・被ダメージを覇王戦だけで補正（ほとんど40〜60%に）。準備室にそのキャラの補正が表示される",
        "大きく下げたキャラ: 黙忍・格闘家・残影・オートマタ・ライダー・巨人・鬼 / 大きく上げたキャラ: 捨てられた者たち・影糸使い・見習い・時間術師・悪の使徒・流れ者・ビョンヒ・疫病医",
      ],
    },
  },
  {
    version: "0.48.170",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 랭크전: 1대1 랭크·3대3 랭크 (점수 따로) · 빠른 매칭으로 모르는 사람과 대결 (사람이 모자라면 잠시 뒤 AI가 채움, 이때 점수 변화는 작게)",
        "티어: 흙 · 돌 · 청동 · 은 · 금 · 수정 (각 III → II → I, 100점마다) → 성좌 → 패왕(성좌 중 순위표 10위 안) · 티어마다 다른 로고",
        "패왕전 첫 화면에 내 티어 카드(점수 · 승패 · 승률 · 순위)와 순위표 · 끝나면 점수 변화와 새 티어 · 모두의 화면 결과가 같아야 점수에 반영, 중간에 나가면 패배",
      ],
      en: [
        "Champion Clash Ranked: 1v1 and 3v3 ranked (separate points) · quick matching against strangers (AI fills in after a short wait, with smaller point changes)",
        "Tiers: Clay · Stone · Bronze · Silver · Gold · Crystal (III → II → I, every 100 points) → Constellation → Overlord (top 10 of Constellation) · each tier has its own emblem",
        "Your tier cards (points, W/L, win rate, place) and leaderboards on the Champion Clash screen · point change and new tier after each game · counts only when everyone's screen agrees; leaving counts as a loss",
      ],
      ja: [
        "覇王戦ランク戦: 1対1ランク・3対3ランク（スコア別）· クイックマッチで知らない人と対戦（人数が足りなければ少し待ってAIが入り、その場合の変動は小さめ）",
        "ティア: 土 · 石 · 青銅 · 銀 · 金 · 水晶（各III → II → I、100点ごと）→ 星座 → 覇王（星座のうちランキング10位以内）· ティアごとに違うロゴ",
        "覇王戦の最初の画面に自分のティアカード（スコア・勝敗・勝率・順位）とランキング · 終了後にスコア変動と新ティア · 全員の画面の結果が一致したときだけ反映、途中退出は敗北",
      ],
    },
  },
];
