import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.43",
    date: "2026-11-09",
    items: {
      ko: ["켈베로스 강화: 화염볼·검기가 다른 라스트 보스의 큰 탄처럼 커지고(화염볼 반지름 4→9 · 검기는 거대 붉은 검기) 피해도 큰 공격 기준으로 오름 · 검귀의 부채꼴 검기·내려찍기 검기, 용암 분출 탄도 커지고 세짐"],
      en: ["Cerberus buffed: fireballs and sword waves are now as large as other final bosses' big shots (fireball radius 4→9, giant red sword waves) and deal big-attack damage · Blade Fiend's fan and slam waves and lava-eruption shots are also larger and stronger"],
      ja: ["ケルベロス強化：火炎弾と剣気が他のラストボスの大きな弾と同じく大きくなり（火炎弾の半径4→9 · 剣気は巨大な赤い剣気）、ダメージも大技基準に上昇 · 剣鬼の扇形剣気・叩きつけの剣気、溶岩噴出の弾も大きく強く"],
    },
  },
  {
    version: "0.50.42",
    date: "2026-11-09",
    items: {
      ko: [
        "시즌 3 라스트 보스 첫째 '켈베로스' (6층 클리어 뒤 도전 · 연습장): 기둥 6개와 용암 지대가 깔린 지옥불 방",
        "페이즈 1: 네 사슬에 묶인 세 머리 지옥견, 흰 쉴드부터 깎음 · 왼쪽 머리 땅 가르기·용암 바위 · 가운데 머리 화염볼 5연발·지옥불 브레스(머리 빛이 세 번 깜박이면 기둥 뒤로, 대시로 못 피함) · 오른쪽 머리 검기·붉은 전역 검기 3연(대시로 넘기) · 세 머리 동시 공격 · 쉴드 66%·33%에서 용암 분출",
        "페이즈 2: 쉴드가 깨지면 사슬이 끊기고 권귀(주먹)·염희(불)·검귀(대검)로 갈라짐, 체력은 각각 · 하나가 쓰러질 때마다 남은 사람이 빨라짐 · 무너지는 바닥(한 구역만 남음, 떨어지면 피해 20) · 바위 비(기절·화상) · 염희 빨아들이기 10초(기둥에 붙어 버티기, 닿으면 피해 50)",
      ],
      en: [
        "Season 3's first final boss 'Cerberus' (challenge after clearing floor 6 · practice): a hellfire room with six pillars and lava pools",
        "Phase 1: a three-headed hellhound bound by four chains; break its white shield first · left head ground splitter and lava boulders · middle head 5-fireball volley and Hellfire Breath (hide behind a pillar when the light above its head flashes three times; dashing won't save you) · right head sword waves and three red room-wide sword sweeps (dash through them) · all three heads at once · lava eruptions at 66% and 33% shield",
        "Phase 2: the shield shatters, the chains snap, and it splits into the Fist Fiend, Flame Maiden and Blade Fiend, each with its own health · each fall enrages the rest · collapsing floor (only one section survives; falling deals 20) · boulder rain (stun and burn) · Flame Maiden's 10-second pull (cling to a pillar; touching her deals 50)",
      ],
      ja: [
        "シーズン3最初のラストボス「ケルベロス」（6階クリア後に挑戦 · 練習場）：柱6本と溶岩地帯の地獄の炎の部屋",
        "フェーズ1：四本の鎖に繋がれた三つ首の地獄犬、白いシールドから削る · 左の頭の地割り・溶岩の岩 · 中央の頭の火炎弾5連発・地獄の炎ブレス（頭上の光が3回点滅したら柱の陰へ、ダッシュでは避けられない） · 右の頭の剣気・赤い全域剣気3連（ダッシュで越える） · 三つの頭の同時攻撃 · シールド66%・33%で溶岩噴出",
        "フェーズ2：シールドが砕けると鎖が切れ、拳鬼（拳）・炎姫（炎）・剣鬼（大剣）に分かれる、体力はそれぞれ · 一人倒れるたびに残りが速くなる · 崩れる床（一区画だけ残る、落ちると20ダメージ） · 岩の雨（気絶・火傷） · 炎姫の10秒吸い込み（柱にしがみついて耐える、触れると50ダメージ）",
      ],
    },
  },
  {
    version: "0.50.41",
    date: "2026-11-09",
    items: {
      ko: ["스토리 최종 보스 '갓이터' 설명을 7장에 맞게 고침 (천의 사도를 물들인 것은 아스모데우스, 갓이터는 악의 사도가 떠받드는 주인)"],
      en: ["Story final boss 'God Eater' description updated to match Chapter 7 (Asmodeus stained the Apostle of Heaven; the God Eater is the master the Apostle of Malice reveres)"],
      ja: ["ストーリーの最終ボス「ゴッドイーター」の説明を第7章に合わせて修正（天の使徒を染めたのはアスモデウス、ゴッドイーターは悪の使徒が仰ぐ主）"],
    },
  },
  {
    version: "0.50.40",
    date: "2026-11-09",
    items: {
      ko: [
        "스토리 시즌 3: 아카식 레코드 7장 「시작」·8장 「심연」·9장 「교류」 추가 (새벽의 성흔·아스모데우스의 화신체·천의 사도 · 성국과 악에 물든 이클립스 · 탈라시아의 합류와 깨어나는 신수들)",
      ],
      en: [
        "Story Season 3: Akashic Records Chapter 7 \"Beginning\", Chapter 8 \"The Abyss\" and Chapter 9 \"Exchange\" added (the Dawn Stigmata, the Avatar of Asmodeus and the Apostle of Heaven · the Holy Kingdom and a malice-stained Eclipse · Thalassia joins and the divine beasts awaken)",
      ],
      ja: [
        "ストーリー シーズン3：アカシックレコード第7章「始まり」・第8章「深淵」・第9章「交流」を追加（暁の聖痕・アスモデウスの化身・天の使徒 · 聖国と悪に染まったエクリプス · タラシアの合流と目覚める神獣たち）",
      ],
    },
  },
];
