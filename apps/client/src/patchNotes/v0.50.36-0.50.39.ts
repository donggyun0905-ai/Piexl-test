import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.50.39",
    date: "2026-11-09",
    items: {
      ko: [
        "달을 삼키는 자: 달이 빨리 참 (보름달까지 20초 → 11초, 체력 절반 아래 14초 → 8초) · 달 조각을 깨도 달은 조금만 줆 (25% → 10%) → 싸움 중에 월식이 꼭 옴",
        "달을 삼키는 자 강화: 체력 900 → 1250 · 손·낫·낙하 피해 높임 · 월식 피해 최대 체력 40% → 50% · 붙어서 때리면 떠난 자리에 그림자가 터지고 멀리 나타남 (2.5초마다)",
        "달을 삼키는 자 공격 범위 넓힘: 그림자 손 범위 13 → 20·흩어짐 46 → 64·개수 4 → 5 (절반 아래 6 → 8) · 초승달 낫 74 → 104 · 월광 낙하 15 → 22",
      ],
      en: [
        "Moon Devourer: the moon fills faster (full moon in 20s → 11s, 14s → 8s below half HP) · breaking a shard only wanes it a little (25% → 10%), so the eclipse always comes during the fight",
        "Moon Devourer buffed: HP 900 → 1250 · harder-hitting hands, reap and moonfall · eclipse deals 50% max HP (was 40%) · hug it and it bursts shadows where it stood and reappears far away (every 2.5s)",
        "Moon Devourer attacks reach wider: shadow hands radius 13 → 20, spread 46 → 64, count 4 → 5 (6 → 8 below half) · Crescent Reap 74 → 104 · Moonfall 15 → 22",
      ],
      ja: [
        "月を呑む者：月が早く満ちる（満月まで20秒 → 11秒、体力半分以下14秒 → 8秒）· 月の欠片を壊しても月は少しだけ欠ける（25% → 10%）→ 戦闘中に必ず月食が来る",
        "月を呑む者を強化：体力900 → 1250 · 手・鎌・落下のダメージ上昇 · 月食ダメージ最大体力の40% → 50% · 張り付いて殴るといた場所に影が弾け、遠くに現れる（2.5秒ごと）",
        "月を呑む者の攻撃範囲を拡大：影の手の範囲13 → 20・散らばり46 → 64・数4 → 5（半分以下6 → 8）· 三日月の鎌74 → 104 · 月光落下15 → 22",
      ],
    },
  },
  {
    version: "0.50.38",
    date: "2026-11-09",
    items: {
      ko: [
        "지옥문 수문장: 방에 들어가자마자 기절·무릎 꿇고 문이 복사되던 문제 고침 · 임프가 문마다 두 마리씩 (방에 최대 10마리)",
        "피로 이어진 쌍둥이 강화: 체력 루 300 → 420 · 레 260 → 360 · 뛰어들기 3 → 4번 · 공격 사이 짧게 · 새 패턴 교차 돌진(사람 양옆으로 순간이동해 서로를 향해 꿰뚫음, 체력 절반 아래면 십자로 두 번) · 새 패턴 핏줄 감옥(원 안에서 핏줄이 빙빙 돎 · 대시 무적으로도 못 피함, 예고 동안 원 밖으로)",
        "달을 삼키는 자 강화: 체력 650 → 900 · 공격 사이 짧게 · 새 패턴 초승달 낫(부채꼴 세 번) · 새 패턴 월광 낙하(선 자리에 달빛이 연달아 떨어짐 · 대시 무적으로도 못 피함, 계속 움직여야 함)",
      ],
      en: [
        "Hellgate Keeper: fixed it being stunned and kneeling the moment you entered, and its gates duplicating · imps now come two per gate (up to 10 in the room)",
        "Blood-bound twins buffed: HP Lu 300 → 420 · Re 260 → 360 · leaps 3 → 4 · shorter rests · new Cross Rush (they blink to either side of you and pierce toward each other; a second, crossing rush below half HP) · new Vein Cage (the vein spins inside a ring; dash invincibility won't save you, so leave the ring during the warning)",
        "Moon Devourer buffed: HP 650 → 900 · shorter rests · new Crescent Reap (three sweeping cones) · new Moonfall (moonlight keeps falling where you stand; dash invincibility won't save you, so keep moving)",
      ],
      ja: [
        "地獄門の門番：部屋に入った瞬間に気絶・膝つきして門が複製される問題を修正 · インプは門ごとに2体ずつ（部屋に最大10体）",
        "血で繋がった双子を強化：体力 ルー300 → 420 · レー260 → 360 · 飛びかかり3 → 4回 · 攻撃間隔を短く · 新パターン交差突進（あなたの両側に瞬間移動して互いに向かって貫く、体力半分以下では十字に2回）· 新パターン血の檻（円の中で血の筋が回る · ダッシュ無敵でも避けられない、予告中に円の外へ）",
        "月を呑む者を強化：体力650 → 900 · 攻撃間隔を短く · 新パターン三日月の鎌（扇形3回）· 新パターン月光落下（立っている場所に月光が次々と落ちる · ダッシュ無敵でも避けられない、動き続ける必要あり）",
      ],
    },
  },
  {
    version: "0.50.37",
    date: "2026-11-09",
    items: {
      ko: [
        "시즌 3 새 단계별 보스 셋 (단계마다 하나씩 섞여 나옴): 1단계 지옥문 수문장 · 2단계 피로 이어진 쌍둥이 루·레 · 3단계 달을 삼키는 자",
        "지옥문 수문장: 방 곳곳에 지옥문을 열고 그 사이를 넘나들며 내려찍음 · 열린 문에서 임프 · 쇠문짝 돌진 · 사슬로 끌어당기기 · 문을 부술 때마다 경직하고 받는 피해 증가, 다 부수면 무릎 꿇음 (체력 절반 아래: 문 넷·불붙은 임프)",
        "피로 이어진 쌍둥이: 둘 사이 핏줄을 지나가면 출혈 · 루는 세 번 뛰어들며 할퀴기 · 레는 쫓아오는 피 구슬(루에게 닿으면 회복) · 가끔 자리 바꾸기 · 한쪽만 쓰러뜨리면 6초 뒤 다시 일어남 (협동은 4초) → 둘을 함께",
        "달을 삼키는 자: 방이 어둡고 천장의 달이 차오름 · 달 조각을 깨면 달빛 기둥 · 보름달 월식은 기둥 안에서만 피함 · 그림자 손(속박) · 기둥 삼키기 · 새벽의 성흔은 이 방에서 성흔이 줄고 달 조각을 깨면 참",
        "관리자 페이지: 새 보스 수치 모두 (보스 탭 · 지옥문·임프·달 조각은 적 탭) · 연습장 단계 보스 목록에도",
      ],
      en: [
        "Three new Season 3 stage bosses (one mixed into each tier): Tier 1 Hellgate Keeper · Tier 2 the blood-bound twins Lu and Re · Tier 3 Moon Devourer",
        "Hellgate Keeper: opens hell gates around the room and leaps between them to slam down · imps pour from open gates · iron-door charge · chain pull · every broken gate staggers it and raises the damage it takes; break them all and it kneels (below half HP: four gates, burning imps)",
        "Blood-bound twins: crossing the blood vein between them makes you bleed · Lu leaps and claws three times · Re sends homing blood orbs (they heal Lu) · they sometimes swap places · fell only one and it rises after 6s (4s in co-op), so take them down together",
        "Moon Devourer: the room goes dark as the moon waxes overhead · break moon shards to raise pillars of moonlight · only the pillars shelter you from the full-moon eclipse · shadow hands (root) · it devours pillars · Stigma of Dawn characters lose Stigma here and regain it by breaking shards",
        "Admin page: every number of the new bosses (boss tab · gates, imps and moon shards in the enemy tab) · also in the practice stage-boss list",
      ],
      ja: [
        "シーズン3の新しい段階ボス3体（段階ごとに1体ずつ混ざって登場）：1段階 地獄門の門番 · 2段階 血で繋がった双子ルー・レー · 3段階 月を呑む者",
        "地獄門の門番：部屋のあちこちに地獄門を開き、その間を行き来して叩きつける · 開いた門からインプ · 鉄扉の突進 · 鎖で引き寄せ · 門を壊すたびによろめき被ダメージ増加、全部壊すと膝をつく（体力半分以下：門4つ・燃えるインプ）",
        "血で繋がった双子：二人の間の血の筋を通ると出血 · ルーは3回飛びかかって引っかく · レーは追ってくる血の玉（ルーに触れると回復）· 時々位置を入れ替える · 片方だけ倒すと6秒後に起き上がる（協力は4秒）→ 二人一緒に",
        "月を呑む者：部屋が暗くなり天井の月が満ちていく · 月の欠片を壊すと月光の柱 · 満月の月食は柱の中でだけ避けられる · 影の手（拘束）· 柱を呑む · 夜明けの聖痕はこの部屋で聖痕が減り、欠片を壊すと溜まる",
        "管理者ページ：新ボスの数値すべて（ボスタブ · 門・インプ・月の欠片は敵タブ）· 練習場の段階ボス一覧にも",
      ],
    },
  },
  {
    version: "0.50.36",
    date: "2026-11-08",
    items: {
      ko: [
        "설명 글 정리: 캐릭터·스킬·아이템 설명의 중요 낱말(상태이상·치명타·약점 공격·성흔·각성·대시·'이름' 등)은 노란 굵은 글씨 · 수치(30%·×1.35·2.5초 등)는 Shift를 누르는 동안만 보임 (안 누르면 늘어남 ↑ · 줄어듦 ↓ · ◇로 짧게) · 단련의 방·능력치 창은 늘 수치 · 터치 기기는 늘 수치",
        "순례자의 월계선 동료: 이제 진짜 그 히든 캐릭터로 싸움 (그 캐릭터의 기본 공격·연계·패시브 기술·스킬 키·대시를 그대로 씀, 예전엔 휘두르기·탄만)",
        "능력치 창: 새벽의 성흔(헬피스트 빼고)에 약점 공격 확률·달빛 스택 확률·약점 추가 피해 줄",
      ],
      en: [
        "Cleaner descriptions: key words in character, skill and item descriptions (status effects, crit, weak-point, Stigma, Awakening, dash, 'names', etc.) are bold yellow · numbers (30%, ×1.35, 2.5s, etc.) show only while holding Shift (otherwise shortened to ↑ / ↓ / ◇) · the Training Room and stat panel always show numbers · touch devices always show numbers",
        "Pilgrim's Laurel Ship ally: now fights as the real hidden character (its own basic attacks, combos, passive techniques, skill keys and dash, instead of just a swing or shot)",
        "Stat panel: Stigma of Dawn characters (except Hellfist) show weak-point chance, Moonlight stack chance and weak-point bonus damage",
      ],
      ja: [
        "説明文の整理：キャラクター・スキル・アイテム説明の重要語（状態異常・クリティカル・弱点攻撃・聖痕・覚醒・ダッシュ・「名前」など）は黄色の太字 · 数値（30%・×1.35・2.5秒など）はShiftを押している間だけ表示（押さないと ↑ ・ ↓ ・ ◇ で短く）· 鍛錬の部屋・能力値画面は常に数値 · タッチ端末は常に数値",
        "巡礼者の月桂船の仲間：本物のそのヒドゥンキャラクターとして戦うように（そのキャラクターの通常攻撃・連携・パッシブ技・スキルキー・ダッシュをそのまま使用、以前は振り・弾のみ）",
        "能力値画面：夜明けの聖痕（ヘルフィスト以外）に弱点攻撃確率・月光スタック確率・弱点追加ダメージを表示",
      ],
    },
  },
];
