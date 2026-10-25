import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.41.0",
    date: "2026-10-20",
    items: {
      ko: [
        "세 번째 라스트 보스 태초의 빛과 어둠: 둘이 체력을 반씩 나눠 가지고, 상자 벽 6개가 놓인 방에서 싸웁니다. 체력 합이 절반이 되면 더 많은 쪽만 남아 체력이 다 차고 패턴이 늘어납니다",
        "빛: 무작위 레이저 · 떨어지는 빛의 화살 · 벽에 튕기는 화살 / 혼자 남으면 그물(방향키 5개를 맞게 눌러야 풀림, 틀리면 3초 못 움직임) · 천천히 도는 네 방향 빔 · 빛의 십자 · 프리즘 산개",
        "어둠: 따라오는 거대한 두 손의 내려찍기 · 바닥 바늘 · 박쥐 5연발 / 혼자 남으면 어둠(공격 범위 밖이 깜깜, 유령에 5번 닿으면 쓰러짐) · 다크 오라(대시로 넘어가는 선) · 손아귀 연타 · 블랙홀",
      ],
      en: [
        "Third final boss, Primeval Light & Dark: the two share the health pool half and half and fight in a room with 6 box walls. When their combined health drops to half, only the healthier one remains, fully healed and with more patterns",
        "Light: random lasers, falling arrows of light, wall-bouncing arrows / alone: a net (press the 5 shown directions correctly to escape; a mistake roots you for 3s), four slowly rotating beams, a cross of light, prism bursts",
        "Dark: two giant hands that slowly follow and slam, floor spikes, a 5-bat volley / alone: darkness (everything outside your attack range goes black; touching ghosts 5 times is fatal), dark aura lines you must dash through, rapid hand slams, a black hole",
      ],
      ja: [
        "3体目のラストボス 太初の光と闇：2体が体力を半分ずつ持ち、箱の壁が6つ置かれた部屋で戦います。体力の合計が半分になると多い方だけが残り、体力が全快してパターンが増えます",
        "光：ランダムなレーザー · 降ってくる光の矢 · 壁で跳ね返る矢 / 単独になると網（表示された方向キー5つを正しく押すと解ける、間違えると3秒動けない） · ゆっくり回る四方向ビーム · 光の十字 · プリズム散開",
        "闇：ゆっくり追ってくる巨大な両手の叩きつけ · 床の針 · コウモリ5連射 / 単独になると闇（攻撃範囲の外が真っ暗、幽霊に5回触れると倒れる） · ダークオーラ（ダッシュで越える線） · 連続の手の叩きつけ · ブラックホール",
      ],
    },
  },
  {
    version: "0.40.0",
    date: "2026-10-20",
    items: {
      ko: [
        "두 번째 라스트 보스 갓이터: 떠 있는 대검 두 자루를 먼저 부숴야 본체를 때릴 수 있습니다. 방 전체가 검게 물들면 가만히, 붉게 물들면 움직여야 피합니다",
        "파괴의 검: 사방 검기 · 아주 빠른 돌진 · 연속 그림자 대검 찍기 / 혼돈의 검: 플레이어 순간이동 · 영혼 4개(다 부숴야 혼돈의 검이 맞고, 그동안 내 몸이 거의 안 보임) · 보라색 거짓 공격",
        "두 자루를 다 부수면 거대한 파괴·혼돈 구슬 · 솟아오르는 대낫 · 벽에서 날아오는 검기 · 대낫 한 바퀴 · 망령 소환이 더해집니다",
      ],
      en: [
        "Second final boss, God Eater: destroy the two floating greatswords before you can hit it. When the whole room turns black, stand still; when it turns red, keep moving",
        "Sword of Ruin: sword waves in all directions, a lightning-fast lunge, chained shadow-sword slams / Sword of Chaos: teleports you, releases 4 souls (destroy them all to hit the sword; meanwhile you can barely see yourself), purple fake attacks",
        "With both swords gone it adds giant orbs of ruin and chaos, scythes rising from the floor, sword waves from the walls, a full scythe spin and summoned wraiths",
      ],
      ja: [
        "2体目のラストボス ゴッドイーター：浮かぶ大剣2本を先に壊さないと本体を攻撃できません。部屋全体が黒くなったら動かず、赤くなったら動いて避けます",
        "破壊の剣：全方位の剣気 · とても速い突進 · 連続の影の大剣叩きつけ / 混沌の剣：プレイヤーを瞬間移動 · 魂4つ（全部壊すと混沌の剣に当たり、その間自分の体がほとんど見えない） · 紫の偽の攻撃",
        "2本とも壊すと巨大な破壊・混沌の玉 · 地面から伸びる大鎌 · 壁から飛んでくる剣気 · 大鎌の一回転 · 亡霊召喚が加わります",
      ],
    },
  },
  {
    version: "0.39.0",
    date: "2026-10-20",
    items: {
      ko: [
        "라스트 보스: 혼자 하기에서 6층을 깨면 \"최강자에게 도전하시겠습니까?\"가 뜹니다 (클리어 기록은 먼저 저장). 보스를 고르면 7층으로 이어집니다",
        "7층: 황금방(돈 300 + 공짜 아이템 9개 중 3개 고르기) → 상점(새로고침하면 산 자리도 다시 채워짐) → 화면이 따라다니는 아주 큰 보스방",
        "첫 라스트 보스 멸망의 용: 불 숨결 · 벽 곳곳 불기둥 · 무적 불꽃 방벽, 체력 절반 아래면 메테오 · 하늘로 날아올라 내려찍고 할퀴기 · 꼬리 휘두르기 · 불꽃 고리 (갓이터 · 태초의 빛과 어둠은 준비 중)",
      ],
      en: [
        "Final bosses: clear floor 6 in Play Solo and you'll be asked \"Will you challenge the strongest?\" (your clear is recorded first). Pick a boss to continue to floor 7",
        "Floor 7: golden room (300 gold + pick 3 of 9 free items) → shop (rerolling also refills sold slots) → a huge boss room where the view follows you",
        "First final boss, Dragon of Ruin: fire breath, fire pillars along the walls, an invulnerable fire barrier; below half health, meteors, a dive from the sky with a claw strike, tail sweeps and fire rings (God Eater and Primeval Light & Dark are coming soon)",
      ],
      ja: [
        "ラストボス：ひとりで遊ぶで6階をクリアすると「最強の者に挑みますか？」が出ます（クリア記録は先に保存）。ボスを選ぶと7階へ続きます",
        "7階：黄金部屋（お金300 + 無料アイテム9個から3個選ぶ）→ ショップ（リロールすると買った場所も補充）→ 画面が追いかけるとても大きなボス部屋",
        "最初のラストボス滅びの竜：炎のブレス · 壁際の火柱 · 無敵の炎の障壁、体力半分以下でメテオ · 空へ舞い上がっての叩きつけと引っかき · 尻尾振り · 炎の輪（ゴッドイーター · 太初の光と闇は準備中）",
      ],
    },
  },
];
