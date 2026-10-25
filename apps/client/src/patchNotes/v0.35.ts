import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.35.7",
    date: "2026-10-20",
    items: {
      ko: ["원소술사 일렉트로닉: 전깃줄에 닿아 있는 동안 0.15초마다 계속 피해가 들어가고, 대신 피해를 낮췄습니다 (초당 공격력의 100% → 30%)"],
      en: ["Elementalist Electronic: wires now damage touching enemies every 0.15s, with lower damage (100% → 30% of your damage per second)"],
      ja: ["元素術師エレクトロニック：電線に触れている間0.15秒ごとにダメージが入り続け、代わりにダメージを下げました（毎秒攻撃力の100% → 30%）"],
    },
  },
  {
    version: "0.35.6",
    date: "2026-10-20",
    items: {
      ko: [
        "원소술사: 도는 회전체(구슬·행성·별 등)와 은하수 장판에 닿아 있는 동안 0.15초마다 계속 피해가 들어갑니다 (초당 피해 = 공격력 × 공격 속도). 원소·행성 효과(불·물·밀침·경직 등)는 지금처럼 공격 속도 간격마다 한 번씩 걸립니다",
        "격투가: 근접으로 싸우는 만큼 모든 무기의 피해를 1.4배로 올렸습니다",
      ],
      en: [
        "Elementalist: while enemies touch your orbiting orbs (orbs, planets, stars, etc.) or the Milky Way field, they take damage every 0.15s (damage per second = damage × attack speed). Element and planet effects (burn, slow, push, stun, etc.) still apply once per attack interval",
        "Brawler: all weapons now deal 1.4x damage to make up for fighting up close",
      ],
      ja: [
        "元素術師：回る回転体（珠・惑星・星など）や天の川の場に触れている間、0.15秒ごとにダメージが入り続けます（毎秒ダメージ = 攻撃力 × 攻撃速度）。元素・惑星の効果（炎・水・押し出し・硬直など）はこれまで通り攻撃速度の間隔ごとに1回です",
        "格闘家：近接で戦う分、全武器のダメージを1.4倍にしました",
      ],
    },
  },
  {
    version: "0.35.5",
    date: "2026-10-20",
    items: {
      ko: ["거너 공격이 강한 만큼 최대 체력을 90에서 70으로 낮췄습니다"],
      en: ["The Gunner hits hard, so their max health is now 70 (was 90)"],
      ja: ["ガンナーは攻撃が強いため、最大体力を90から70に下げました"],
    },
  },
  {
    version: "0.35.4",
    date: "2026-10-20",
    items: {
      ko: ["거너 건 마스터: 다른 총이 같이 쏘는 확률을 50%에서 30%로 낮췄습니다"],
      en: ["Gunner Gun Master: the chance for another gun to fire alongside is now 30% (was 50%)"],
      ja: ["ガンナーのガンマスター：別の銃が一緒に撃つ確率を50%から30%に下げました"],
    },
  },
  {
    version: "0.35.3",
    date: "2026-10-20",
    items: {
      ko: ["거너 지원사격이 드론 무기와도 같이 됩니다: 드론이 쏠 때마다 30% 확률로 지원 드론이 3초 동안 붙습니다"],
      en: ["Gunner Support Fire now works with the Drones weapon: each drone shot has a 30% chance to call a support drone for 3s"],
      ja: ["ガンナーの支援射撃がドローン武器でも効くようになりました：ドローンが撃つたびに30%の確率で支援ドローンが3秒間加わります"],
    },
  },
  {
    version: "0.35.2",
    date: "2026-10-20",
    items: {
      ko: ["날벌레 빠르기를 플레이어 이동 속도의 절반으로 낮췄습니다"],
      en: ["Gnats now move at half your speed"],
      ja: ["羽虫の速さをプレイヤーの移動速度の半分にしました"],
    },
  },
  {
    version: "0.35.1",
    date: "2026-10-20",
    items: {
      ko: ["날벌레가 아직 빨라서 플레이어 이동 속도보다 20% 느리게 낮췄습니다"],
      en: ["Gnats were still too fast; they now move 20% slower than you"],
      ja: ["羽虫がまだ速かったため、プレイヤーの移動速度より20%遅くしました"],
    },
  },
  {
    version: "0.35.0",
    date: "2026-10-20",
    items: {
      ko: [
        "새 캐릭터 '거너': 탄창을 다 쓰면 장전하는 총 (발 아래 막대가 남은 탄, 주황은 장전 중). 1초 쏘지 않으면 남은 탄도 채웁니다. 기본 치명타 확률 5%(1.5배, 치명타 탄은 주황). 시작 무기는 권총(8발)",
        "거너 전용 무기 10개: 권총 · 스나이퍼(4발, 5명 관통) · 샷건(5발 부채꼴, 쏘면서 한 발씩 장전) · 총검(쏠 때 찌르기, 대시하면 둘레 피해) · 쌍발총(두 발씩) · 특수용병(쏘며 돌진 → 찌르기 → 샷건 반동으로 물러남 → 수류탄) · 기관단총(35발, 쏘는 동안 느려짐) · 미니건(100발, 2초 예열, 느려짐) · 수류탄(던져서 큰 폭발) · 드론(드론이 대신 쏨, 10마리 처치마다 +1). 거너는 전용 무기만 얻습니다",
        "거너 전용 아이템 10개: 건 마스터 · 군기 · 화력 집중 · 전투식량 · 총 공격 · 특급 · 폐급? · 지원사격 · 출혈 · 연발",
        "업적 '사격 종료'(거너로 클리어) 추가",
      ],
      en: [
        "New character: the Gunner. Guns reload when the magazine runs dry (the bar under your feet shows ammo, orange while reloading); 1s without firing tops the magazine up. 5% base crit chance (1.5x, crit shots are orange). Starts with the Pistol (8 rounds)",
        "10 Gunner weapons: Pistol · Sniper Rifle (4 rounds, pierces 5) · Shotgun (5-pellet spread, reloads shell by shell while firing) · Bayonet Gun (stabs with each shot, dashing damages around you) · Dual Pistols (two shots at once) · Special Merc (dash firing → stab → shotgun recoil back → grenade) · SMG (35 rounds, slower while firing) · Minigun (100 rounds, 2s spin-up, slower) · Grenades (thrown, big blast) · Drones (drones fire for you, +1 per 10 kills). The Gunner only finds their own weapons",
        "10 Gunner items: Gun Master · Discipline · Focused Fire · Field Ration · All-Out Attack · Elite · Scrap Gun? · Support Fire · Bleed · Rapid Fire",
        "New achievement: Cease Fire (clear as the Gunner)",
      ],
      ja: [
        "新キャラクター「ガンナー」：弾倉を撃ち切るとリロードする銃（足元のバーが残弾、オレンジはリロード中）。1秒撃たないと残りの弾も補充します。基本クリティカル率5%（1.5倍、クリティカル弾はオレンジ）。初期武器は拳銃（8発）",
        "ガンナー専用武器10種：拳銃 · スナイパー（4発、5体貫通） · ショットガン（5発の扇状、撃ちながら1発ずつ装填） · 銃剣（撃つたびに突き、ダッシュで周りにダメージ） · 二丁拳銃（2発ずつ） · 特殊傭兵（撃ちながら突進 → 突き → ショットガンの反動で下がる → 手榴弾） · 短機関銃（35発、撃つ間遅くなる） · ミニガン（100発、2秒予熱、遅くなる） · 手榴弾（投げて大爆発） · ドローン（ドローンが代わりに撃つ、10体倒すごとに+1）。ガンナーは専用武器だけを手に入れます",
        "ガンナー専用アイテム10種：ガンマスター · 軍紀 · 火力集中 · 戦闘糧食 · 総攻撃 · 特級 · ポンコツ？ · 支援射撃 · 出血 · 連射",
        "実績「撃ち方やめ」（ガンナーでクリア）を追加",
      ],
    },
  },
];
