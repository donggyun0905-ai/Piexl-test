import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.144",
    date: "2026-10-27",
    items: {
      ko: [
        "잊혀진 자: 빛의 고리 게이지가 화면 왼쪽 위에 화려한 금빛 테두리(큰 뿔 넷·작은 뿔 넷)로 둘러싸인 원 게이지로 (다섯 빛깔로 차오름, 맵을 가리지 않게 모서리)",
        "등 뒤 빛의 고리는 게이지 없이 지금의 1.5배 크기로 늘 보이는 몸의 일부 · 신족이 되면 흰 금빛으로 타오르며 빛살이 도는 고리로 바뀜",
        "게이지는 적을 맞힌 공격 한 번마다 1씩 참 (40, 잊힌 기억은 28) · 적에게 맞으면 4씩 깎임",
      ],
      en: [
        "The Forgotten: the ring-of-light gauge is now a round gauge at the top-left framed by an ornate gold border (four large and four small spikes), filling in five colors, tucked in the corner so it doesn't cover the map",
        "The halo on her back is now always shown at 1.5× size as part of her look (no gauge) · in divine form it turns into a blazing white-gold halo with turning rays",
        "The gauge fills by 1 for each attack that hits (40; 28 with Forgotten Memory) · taking damage drains 4",
      ],
      ja: [
        "忘れられし者: 光の輪のゲージを画面左上の華やかな金の縁（大きな角4・小さな角4）に囲まれた円ゲージに（5色で満ちる、マップを隠さない隅に）",
        "背中の光の輪はゲージなしで今の1.5倍の大きさで常に見える姿の一部 · 神族になると白金に燃え光条が回る輪に変わる",
        "ゲージは敵に当てた攻撃1回ごとに1溜まる（40、忘れられた記憶は28）· 被弾で4減る",
      ],
    },
  },
  {
    version: "0.48.143",
    date: "2026-10-27",
    items: {
      ko: [
        "방랑객: 발도를 뺀 모든 카타나 공격이 휘두르는 베기 대신, 사거리 안의 적 몸에 바늘처럼 가는 일직선 칼선이 바로 들어감 (\"삥\" 소리)",
        "무심의 원: 하늘색 · 대시해도 끌어당기지 않고, 원 안 적이 모두 멈추고 한 번씩 크게(공격력 400%) 베이며 나는 앞으로 발도 급습",
        "칼날 폭풍: 초승달 검기 여러 겹이 소용돌이치는 검기 폭풍 · 천검란: 방 곳곳에 하얀 초승달 검기 · 달빛 일섬: 앞으로 길게 내달리고 2초 뒤 지나간 줄의 적이 한꺼번에 베임",
      ],
      en: [
        "Wanderer: every katana attack except Quick Draw now lands a needle-thin straight cut right on foes within range instead of a swinging arc (with a sharp 'ping')",
        "Circle of No-Mind: now sky blue · dashing no longer pulls; every foe inside freezes and takes one big cut (400%) while you quick-draw forward",
        "Blade Storm: a swirling storm of layered crescent sword waves · Thousand Swords: white crescent waves all over the room · Moonlit Flash: dash far forward, and 2s later every foe on the line is cut at once",
      ],
      ja: [
        "放浪者: 抜刀以外のすべての刀攻撃が、振り斬りの代わりに射程内の敵の体へ針のように細い一直線の斬撃が即座に入る（「ピン」という音）",
        "無心の円: 水色に · ダッシュで引き寄せず、円の中の敵が全員止まり一度ずつ大きく（攻撃力400%）斬られ、自分は前へ抜刀奇襲",
        "刃の嵐: 三日月の剣気が幾重にも渦巻く剣気の嵐 · 千剣乱: 部屋のあちこちに白い三日月の剣気 · 月光一閃: 前へ長く駆け抜け、2秒後に通った線上の敵がまとめて斬られる",
      ],
    },
  },
  {
    version: "0.48.142",
    date: "2026-10-27",
    items: {
      ko: [
        "잔영: 순간이동하면 떠난 자리에 내 모습 그대로의 분신이 남아 적이 분신을 쫓고 공격·기술도 분신 쪽으로 (1.5초, 끝날 때 한 번 벰)",
        "나는 적 등 뒤 조금 떨어진 곳에서 그림자(어두운 반투명·무적)가 됨 → 다음 공격은 등 뒤로 바짝 붙어 치는 뒤치기 (피해 2배 더, 그림자가 풀림) · '사라짐'은 뒤치기 뒤 0.5초 무적",
      ],
      en: [
        "Remnant: blinking leaves a decoy that looks just like you; enemies chase it and aim attacks and skills at it (1.5s, it slashes once at the end)",
        "You become a shadow (dark, translucent, invulnerable) a bit behind the enemy → your next attack is a close backstab (×2 more damage, ends the shadow) · 'Vanish' now grants 0.5s invulnerability after the backstab",
      ],
      ja: [
        "残影: 瞬間移動すると元の場所に自分そっくりの分身が残り、敵は分身を追い攻撃・技も分身へ（1.5秒、最後に1回斬る）",
        "自分は敵の背後少し離れた所で影（暗い半透明・無敵）になる → 次の攻撃は背後に詰めて斬る背後討ち（ダメージさらに2倍、影が解ける）·「消失」は背後討ち後0.5秒無敵",
      ],
    },
  },
  {
    version: "0.48.141",
    date: "2026-10-27",
    items: {
      ko: [
        "영사: 실 피해 절반 (아이템을 뺀 기본 공격력 기준, 공격력 아이템은 찢기·과다출혈만 세짐) · 실에 맞을 때마다 출혈 스택 (최대 30, 출혈 피해는 그대로) · 30개가 쌓이면 과다출혈 (공격력 500%)",
        "얽힘(찢기) 실은 빨간색 · 핏빛 실은 실 자체가 빨갛고 얽힘 실은 검정 · 적 머리 위에 출혈 스택 막대",
      ],
      en: [
        "Silk: thread damage halved (based on base attack without items; attack items only boost tearing and Hemorrhage) · each thread hit adds a bleed stack (up to 30, bleed damage unchanged) · at 30 stacks, Hemorrhage (500% attack)",
        "Tangle (tear) threads are now red · Crimson Thread has red threads with black tangles · bleed stack bar over enemies",
      ],
      ja: [
        "影糸使い: 糸のダメージ半分（アイテム抜きの基本攻撃力基準、攻撃力アイテムは引き裂き・大量出血だけ強化）· 糸が当たるたび出血スタック（最大30、出血ダメージはそのまま）· 30溜まると大量出血（攻撃力500%）",
        "絡み（引き裂き）の糸は赤 · 血の糸は糸自体が赤く絡みの糸は黒 · 敵の頭上に出血スタックバー",
      ],
    },
  },
  {
    version: "0.48.140",
    date: "2026-10-27",
    items: {
      ko: [
        "렌: 렌 전용 아이템 3개마다 '대지의 추가 공격'이 한 단계씩 열림 (최대 5단계, 평소 공격마다 단계당 10% · 다 열면 50%로 그중 하나)",
        "1 돌 던지기(앞으로 넓게 멀리 날림) · 2 용머리(공격한 자리에서 솟음) · 3 용오름(바닥을 오르내리며 앞으로) · 4 머리 위 거대 토목(5개 쌓이면 큰 돌 5번) · 5 양쪽 토목이 적을 짓뭉갬",
        "렌 공격력 조금 낮춤 (맨손 220% → 200%) · '높이 날리기' 대신 '대지의 힘' (대지의 추가 공격 피해 +30%)",
      ],
      en: [
        "Ren: every 3 Ren items unlock one tier of Earth bonus attacks (up to 5; 10% per tier on each normal attack, 50% for one of them at full)",
        "1 Rock Toss (wide, flings foes far) · 2 Dragon Head (rises where you hit) · 3 Dragon Surge (weaves through the ground forward) · 4 Overhead Boulder (at 5 stacked, 5 big rocks fall) · 5 two blocks crush the foe from both sides",
        "Ren's attack slightly lowered (bare hands 220% → 200%) · 'High Launch' replaced by 'Power of the Earth' (+30% Earth bonus attack damage)",
      ],
      ja: [
        "レン: レン専用アイテム3つごとに「大地の追加攻撃」が1段階開く（最大5段階、通常攻撃ごとに1段階10%・全開で50%でいずれか1つ）",
        "1 石投げ（前に広く遠く吹き飛ばす）· 2 竜頭（攻撃した場所から生える）· 3 竜の昇り（地面を出入りしながら前進）· 4 頭上の巨大土木（5つ溜まると大岩5回）· 5 両側の土木が敵を押し潰す",
        "レンの攻撃力を少し下げた（素手220% → 200%）·「高く飛ばす」の代わりに「大地の力」（大地の追加攻撃ダメージ+30%）",
      ],
    },
  },
  {
    version: "0.48.139",
    date: "2026-10-27",
    items: {
      ko: [
        "상점: 사용 아이템·패시브 팔기 (상점 방 아래 '판매' 줄, 한 번 누르면 확인·한 번 더 누르면 판매, 상점 값의 1/4) · 한 번만 먹는 패시브가 두 자리에 같이 나와도 하나만 먹어짐",
        "보스가 부른 적은 처치 수·쌓이는 힘(빛의 고리·잔영·경험치·먹은 영혼 등)에 들어가지 않음 (악의 사도는 그 영혼으로 회복만 됨)",
        "멸망의 용 염옥(필살기) 중에는 몸에 닿아도 피해 없음 · 게임 화면 전용 커서 (잘 보이는 조준 커서)",
        "추적자: 스킬을 쓰는 동안에도 움직일 수 있음 · 강력한 한방은 한 판에 3번 (라스트 보스방에 들어가면 다시 3번, 버튼에 남은 횟수) · 위장복: 대시 뒤 1초 무적 → 1초 동안 받는 피해 -40%",
        "붐버: 유도 지뢰는 박힌 지 3초가 지나면 저절로 터짐 · 네이팜은 자동 조준을 끄면 누른 곳으로 · 사거리 안의 적에게만 던짐 (폭발 반경만큼 사거리 밖을 맞히지 않게)",
      ],
      en: [
        "Shop: sell use items and passives (the 'Sell' row in shop rooms; tap once to confirm, again to sell, for 1/4 of the shop price) · a one-time passive shown on two shelves can only be taken once",
        "Enemies summoned by bosses no longer count as kills or toward stacking powers (Halo, Remnant, EXP, eaten souls, etc.); the Apostle still heals from their souls",
        "No contact damage from the Dragon of Ruin's body during its Hellfire ultimate · a custom, easy-to-see aiming cursor in game",
        "Tracker: can move while using skills · Power Shot is limited to 3 per run (refilled when entering the last boss room; uses shown on the button) · Ghillie Suit: 1s invulnerable after a dash → 40% less damage for 1s",
        "Bomber: homing mines explode on their own after 3s in place · Napalm goes where you aim when auto-aim is off · bombs only target foes within range (blast radius no longer reaches past it)",
      ],
      ja: [
        "ショップ: 使用アイテム・パッシブを売却（ショップ部屋の「売却」列、1回押して確認・もう1回で売却、ショップ価格の1/4）· 1回だけ取れるパッシブが2か所に並んでも1つしか取れない",
        "ボスが呼んだ敵は撃破数・溜まる力（光の輪・残影・経験値・食べた魂など）に数えない（悪の使徒はその魂で回復のみ）",
        "滅びの竜の炎獄（必殺技）中は体に触れてもダメージなし · ゲーム画面専用の見やすい照準カーソル",
        "追跡者: スキル中も移動できる · 強力な一撃は1プレイ3回（ラストボス部屋に入ると再び3回、ボタンに残り回数）· ギリースーツ: ダッシュ後1秒無敵 → 1秒間受けるダメージ-40%",
        "ボマー: 誘導地雷は設置から3秒で自動で爆発 · ナパームはオートエイムをオフにすると狙った場所へ · 射程内の敵にだけ投げる（爆発範囲で射程外に届かない）",
      ],
    },
  },
];
