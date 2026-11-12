import type { PatchNote } from "./types";

// 지난 패치 노트 0.52.36~0.52.38 (latest.ts에서 옮김)
export const NOTES: PatchNote[] = [
  {
    version: "0.52.38",
    date: "2026-11-12",
    items: {
      ko: [
        "피해 출처 2차: 캐릭터 스킬·소환수·기본 패시브·장치·진영 특징·세트 효과 등을 무기 줄에서 빼서 따로 표시 (예: 스킬 · 소환수 · 고양이 · 회전체 · 마법 문양 · 그림자 분신 · 일곱 죄의 장판 · 공생 정령 · 로비 펫) — 무기 줄에는 기본 공격만 남음",
        "게임 중 능력치 칸에 '피해 출처' 버튼: 누르면 지금까지 무엇이 얼마나 줬는지 펼쳐짐 (1초마다 갱신)",
        "아카이브 빌드 통계: 무기·패시브 줄을 펼치면 '연습장에서 써 보기' — 그 캐릭터가 그걸 든 채로 연습장이 열림",
      ],
      en: [
        "Damage sources, stage 2: character skills, summons, base passives, devices, faction traits, set effects and more are split out of the weapon row (e.g. Skills · Summons · Cats · Orbiters · Magic rune · Shadow clones · Seven Sins fields · Symbiotic spirit · Lobby pet) — the weapon row now holds basic attacks only",
        "In-game stats column: new 'Damage sources' button that unfolds what has dealt how much so far (refreshes every second)",
        "Archive Build Stats: open a weapon or passive row for 'Try it in the practice room' — the practice room opens with that character already holding it",
      ],
      ja: [
        "ダメージの出どころ 第2弾：キャラのスキル・召喚獣・基本パッシブ・装置・陣営特性・セット効果などを武器の行から分けて表示（例：スキル · 召喚獣 · 猫 · 回転体 · 魔法紋 · 影分身 · 七つの罪の領域 · 共生精霊 · ロビーペット）— 武器の行は通常攻撃だけに",
        "ゲーム中の能力値欄に「ダメージの出どころ」ボタン：押すとこれまで何がどれだけ与えたかが開く（1秒ごとに更新）",
        "アーカイブのビルド統計：武器・パッシブの行を開くと「練習場で試す」— そのキャラがそれを持った状態で練習場が開く",
      ],
    },
  },
  {
    version: "0.52.37",
    date: "2026-11-12",
    items: {
      ko: [
        "아카이브에 '빌드 통계' 추가: 캐릭터마다 사람들이 많이 쓰는 무기·패시브를 고른 비율·클리어율과 함께 순위로 보여 줌 (혼자 하기 한 판이 끝날 때마다 마지막 장비가 모임 · 줄을 누르면 설명)",
        "입문 추천 표시: 이 캐릭터로 많이 고르는 패시브는 설명 말풍선에 ★ 줄이 붙고, 처음 20판 동안은 바닥 아이템 위에도 ★ (기록이 5판 이상 모인 캐릭터부터)",
        "결과 창 요약에 '피해 출처' 추가: 무기·기본 기술 / 직접 피해를 주는 패시브마다 / 상태이상 종류마다 얼마나 줬는지 막대로 (1차: 패시브 구간 130여 곳 · 능력치만 올리는 패시브와 아직 나누지 못한 기술은 무기 줄에 합쳐짐)",
      ],
      en: [
        "Archive: new 'Build Stats' — per character, the weapons and passives people use most, ranked with pick rate and clear rate (the final build of every finished solo run is collected · tap a row for its description)",
        "Beginner recommendations: passives popular with your character get a ★ line in the tooltip, and for your first 20 runs a ★ floats over them on the floor (for characters with at least 5 recorded runs)",
        "Result summary: new 'Damage sources' — bars for weapon & base skills, each passive that deals damage itself, and each status type (stage 1: about 130 passive code paths · stat-only passives and skills not split yet are counted in the weapon row)",
      ],
      ja: [
        "アーカイブに「ビルド統計」を追加：キャラごとによく使われる武器・パッシブを選択率・クリア率つきでランキング表示（ソロの1プレイが終わるたびに最後の装備を集計 · 行を押すと説明）",
        "入門おすすめ表示：そのキャラでよく選ばれるパッシブは説明の吹き出しに★の行が付き、最初の20プレイは床のアイテムの上にも★（記録が5プレイ以上集まったキャラから）",
        "結果画面のまとめに「ダメージの出どころ」を追加：武器・基本技／直接ダメージを与えるパッシブごと／状態異常の種類ごとにどれだけ与えたかをバーで表示（第1弾：パッシブの処理約130か所 · 能力値だけ上げるパッシブと、まだ分けていない技は武器の行に合算）",
      ],
    },
  },
  {
    version: "0.52.36",
    date: "2026-11-12",
    items: {
      ko: [
        "도박꾼의 야바위: 섞는 시간이 3초 길어짐 (10번 → 28번) · 섞는 동안 방해 3번 — 연막이 탁자를 덮음 · 도박꾼이 카드를 뿌림 · 방 한쪽에서 금화 폭죽 (판마다 순서가 다름)",
        "결과 창 요약: 피해 상세 추가 — 보통 공격 · 치명타 · 상태이상 종류 전부를 많이 준 순서로, 피해량 · 비율 · 막대로 보여 줌",
      ],
      en: [
        "Gambler's shell game: shuffling lasts 3 seconds longer (10 → 28 swaps) · three distractions during the shuffle — smoke covers the table · the gambler throws cards · a coin burst goes off at one side of the room (order differs each game)",
        "Result summary: damage breakdown added — normal hits, criticals and every status type, highest first, with amount, share and a bar",
      ],
      ja: [
        "ギャンブラーのシェルゲーム：混ぜる時間が3秒長く（10回 → 28回）・混ぜている間に妨害が3回 — 煙幕がテーブルを覆う・ギャンブラーがカードをばらまく・部屋の片側で金貨の花火（毎回順番が変わる）",
        "結果画面のまとめ：ダメージ内訳を追加 — 通常攻撃・クリティカル・すべての状態異常を多い順に、ダメージ量・割合・バーで表示",
      ],
    },
  },
];
