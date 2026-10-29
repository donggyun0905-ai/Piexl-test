import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
  {
    version: "0.48.220",
    date: "2026-10-29",
    items: {
      ko: ["무한 모드: 20층부터 나오던 AI 대결을 없애고, 17층부터 끝까지 라스트 보스 3종과 싸움 (층마다 계속 세짐)"],
      en: ["Endless Mode: the AI duels from floor 20 are gone; from floor 17 on you keep fighting three last bosses (they keep getting stronger each floor)"],
      ja: ["エンドレスモード: 20階からのAI対戦をなくし、17階から最後までラストボス3体と戦う (階ごとに強くなり続ける)"],
    },
  },
  {
    version: "0.48.219",
    date: "2026-10-28",
    items: {
      ko: [
        "떠돌이 기습 효과: 준비되면 발밑에 바람이 감돌고 쇠뇌 끝이 반짝임 · 쏘면 쇠뇌 끝 섬광과 바람 부채 · 기습 화살은 바람빛 꼬리를 길게 끌고, 맞으면 바람 고리와 엇갈린 베임 (기습 패시브면 붉은 금빛 두 갈래 띠·붉게 찢기는 자국과 파편)",
        "파수꾼 반격 효과: 준비되면 몸 앞 금빛 방패가 숨 쉬듯 빛나고 빛 알갱이가 올라감 · 반격 베기는 금빛 충격파와 여덟 갈래 빛살, 가운데 방패 섬광 (반격의 방패면 강철빛 고리가 한 겹 더)",
      ],
      en: [
        "Drifter ambush effects: when ready, wind swirls at your feet and the crossbow tip glints · firing gives a muzzle flash and a fan of wind · ambush bolts trail long wind-colored streaks and burst into a wind ring with crossed slashes (with the Ambush passive: twin red-gold ribbons and red tearing marks with shards)",
        "Warden counter effects: when ready, a golden shield glows in front of you like breathing and motes of light rise · the counter spin releases a golden shockwave, eight rays and a shield flash (with Counter Shield: an extra steel-blue ring)",
      ],
      ja: [
        "流れ者の奇襲エフェクト: 準備中は足元に風が渦巻きクロスボウの先がきらめく · 撃つと先端の閃光と風の扇 · 奇襲の矢は風色の尾を長く引き、当たると風の輪と交差する斬り跡 (奇襲パッシブなら赤金の二筋の帯・赤く裂ける跡と破片)",
        "番人の反撃エフェクト: 準備中は体の前の金色の盾が呼吸するように光り、光の粒が昇る · 反撃の全周斬りは金色の衝撃波と八方の光、中央に盾の閃光 (反撃の盾なら鋼色の輪がもう一重)",
      ],
    },
  },
  {
    version: "0.48.218",
    date: "2026-10-28",
    items: {
      ko: [
        "떠돌이 특징 '기습': 대시 직후 1.5초 안의 첫 공격이 늘 2배 피해 · 전용 패시브 '기습'은 이것을 키움: 2.5배 + 맞힌 적 최대 체력의 6% 피해 (보스는 그 25%만, 공격력의 4배까지)",
        "파수꾼 특징 '반격': 맞은 뒤 1.5초 안의 첫 휘두르기가 한 바퀴 베기 + 1.5배 피해 · 전용 패시브 '반격의 방패'는 맞을 때 충격파에 더해 반격 베기를 2배·범위 +30%로 키움",
      ],
      en: [
        "Drifter trait 'Ambush': the first attack within 1.5s after a dash always deals 2x damage · the Drifter's 'Ambush' passive now empowers it: 2.5x plus 6% of the target's max HP (only 25% of that on bosses, up to 4x your damage)",
        "Warden trait 'Counter': the first swing within 1.5s after taking a hit becomes a full spin with 1.5x damage · the Warden's 'Counter Shield' passive keeps its shockwave and raises the counter spin to 2x with +30% reach",
      ],
      ja: [
        "流れ者の特徴「奇襲」: ダッシュ後1.5秒以内の最初の攻撃が常に2倍ダメージ · 専用パッシブ「奇襲」はこれを強化: 2.5倍 + 当てた敵の最大体力の6%ダメージ (ボスはその25%、攻撃力の4倍まで)",
        "番人の特徴「反撃」: 被弾後1.5秒以内の最初の攻撃が全周斬り + 1.5倍ダメージ · 専用パッシブ「反撃の盾」は被弾時の衝撃波に加え、反撃の斬りを2倍・範囲+30%に強化",
      ],
    },
  },
  {
    version: "0.48.217",
    date: "2026-10-28",
    items: {
      ko: ["일일 도전·레이드 명예의 전당·레이드 아레나 1~3위 기록 확인: 서버가 그 판을 처음부터 다시 돌려 보고, 결과가 다르면 순위표에서 빠짐 (확인하는 동안 일일 도전 순위표에 ⏳ 표시)"],
      en: ["Daily Challenge, Raid Hall of Fame and Raid Arena top-3 records are now checked: the server replays the run from the start, and records that don't match are removed from the board (a ⏳ shows on the Daily board while checking)"],
      ja: ["デイリーチャレンジ・レイド殿堂・レイドアリーナの1~3位の記録を確認: サーバーがそのプレイを最初から再現し、結果が違えばランキングから外れる (確認中はデイリーのランキングに⏳)"],
    },
  },
  {
    version: "0.48.216",
    date: "2026-10-28",
    items: {
      ko: ["쿠폰·스킨·이벤트 코인·효과·펫·로비 칩·일일 미션을 서버에도 저장: 브라우저 저장소를 지워도 다시 받아지고, 기기 연동하면 두 기기의 것이 합쳐짐 (가진 스킨은 모두 남고 쿠폰·코인은 두 기기에서 쓰고 받은 만큼 반영)"],
      en: ["Coupons, skins, event coins, effects, pets, lobby chips and daily missions are now also saved on the server: they come back even if you clear browser storage, and linking devices merges both (all owned skins stay, and coupons and coins reflect what you earned and spent on each device)"],
      ja: ["クーポン・スキン・イベントコイン・エフェクト・ペット・ロビーチップ・デイリーミッションをサーバーにも保存: ブラウザのデータを消しても戻り、端末連携すると両方の端末の分がまとまる (持っているスキンはすべて残り、クーポン・コインは各端末で得た分と使った分を反映)"],
    },
  },
];
