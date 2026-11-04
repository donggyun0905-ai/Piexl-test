import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.49.19",
    date: "2026-11-05",
    items: {
      ko: ["이클립스 태양: 검격 모양을 사용자 그림대로 (몸 양옆에서 앞쪽 꼭짓점으로 모이는 날 · 1 낮고 넓게 → 2 길게 → 3 작게 기울여 → 4 가늘고 길게 → 5 더 길게 깊게) · 태양 모습 그림 새로"],
      en: ["Eclipse Sun: slash shapes now follow the user's sketches (a blade from both sides of her body to a point ahead · 1 low and wide → 2 long → 3 small and tilted → 4 thin and long → 5 even longer and deeper) · new Sun-form sprites"],
      ja: ["エクリプス太陽：斬撃の形をユーザーの絵どおりに（体の両脇から前方の頂点へ集まる刃 · 1 低く広く → 2 長く → 3 小さく傾けて → 4 細く長く → 5 さらに長く深く）· 太陽の姿の絵を新しく"],
    },
  },
  {
    version: "0.49.18",
    date: "2026-11-05",
    items: {
      ko: [
        "이클립스·펜리르: 한 번 누르면 콤보가 다 나가지 않고, 누를 때마다 한 동작씩 이어짐 (누르고 있으면 계속 이어지고, 1초 동안 안 누르면 처음 동작으로)",
        "이클립스 태양: 검격을 새로 그림 · 몸 양옆에서 앞쪽 꼭짓점으로 모이는 날 하나(바깥 노랑·안쪽 빨강·은은한 빛) · 1 낮고 넓게 → 2 앞으로 길게 → 3 작게 기울여 → 4 가늘고 길게 찌름 → 5 더 길게 깊게 찌름 (떨어진 적에게도 닿음) · 태양 모습 그림 새로 · 맞는 범위도 그려진 날 모양대로",
        "이클립스 일식·영역·블랙홀·변신 이펙트를 깔끔하게 새로 그림 (분홍 보라 겉·검보라 속) · 게이지가 더 빨리 참",
        "펜리르: 몸을 키우고 모든 검기·베기 범위를 크게 (대검답게 넓게) · 천랑 낙인 착지 검기는 방 끝까지 날아감",
      ],
      en: [
        "Eclipse & Fenrir: one press no longer runs the whole combo; each press performs the next move (hold to keep going; after 1s without pressing it starts over)",
        "Eclipse Sun: slashes redrawn · one blade sweeping from both sides of her body to a point ahead (gold outside, red inside, soft glow) · 1 low and wide → 2 long → 3 small and tilted → 4 a thin long stab → 5 an even longer deep stab (reaches distant foes) · new Sun-form sprites · hit areas follow the drawn blade",
        "Eclipse's Eclipse-form, zone, black hole and transformation effects redrawn cleanly (pink-violet outside, dark violet inside) · the gauge fills faster",
        "Fenrir: bigger body and much wider sword waves and slashes (a true greatsword) · Sirius Brand's landing waves now fly to the edge of the room",
      ],
      ja: [
        "エクリプス・フェンリル：一度押すとコンボが全部出るのではなく、押すたびに1動作ずつ続く（押し続けると続き、1秒押さないと最初の動作に戻る）",
        "エクリプス太陽：斬撃を描き直し · 体の両脇から前方の頂点へ集まる刃ひとつ（外は金・内は赤・柔らかな光）· 1 低く広く → 2 前へ長く → 3 小さく傾けて → 4 細く長く突く → 5 さらに長く深く突く（離れた敵にも届く）· 太陽の姿の絵を新しく · 当たり範囲も描かれた刃の形どおり",
        "エクリプスの日食・領域・ブラックホール・変身エフェクトをすっきり描き直し（外はピンク紫・内は黒紫）· ゲージが早くたまる",
        "フェンリル：体を大きくし、すべての剣気・斬撃の範囲を広く（大剣らしく）· 天狼の烙印の着地の剣気は部屋の端まで飛ぶ",
      ],
    },
  },
  {
    version: "0.49.17",
    date: "2026-11-05",
    items: {
      ko: [
        "새 캐릭터 이클립스 (헬리오스): 제국의 태양인 그녀와, 그 거대한 뒷면 일식의 밤의 주인인 그 · 맞힐 때마다 게이지가 차고 다 차면 모습이 바뀜 (태양 → 일식 → 태양) · 체력 115 · 공격력 11 · 이동 1.3",
        "태양(여자): 작은 불의 도끼로 아주 빠른 5연격 · 모든 공격이 붉은 속·노란 겉의 직각 검격을 날림 (5타는 3갈래) · 치명타 35% · 이글거리는 영역 + 치유의 빛",
        "일식(남자): 거대한 도끼로 느리지만 강한 6연 콤보 · 마지막 일식 낙하는 뛰어올라(무적) 아주 넓게 내려찍고 가운데에 적을 끌어당기는 블랙홀 · 치명타 없음 · 죽음의 영역(피해 + 둔화)",
        "바뀔 때 무적: 보라 오라에 감싸여 보라 빛이 아래로 꺼지면 일식, 노란 오라에 감싸여 노란 빛이 위로 꺼지면 태양 · 전용 아이템 10 · 여는 조건: 헬리오스 캐릭터를 모두 열고, 저마다 금기의 서 45점 이상으로 라스트 보스 클리어",
      ],
      en: [
        "New character Eclipse (Helios): she is the Sun of the empire, he is its vast far side, lord of the eclipsed night · every hit fills a gauge; when full, the form changes (Sun → Eclipse → Sun) · 115 HP · 11 Attack · 1.3 move",
        "Sun (her): a very fast 5-hit string with a small fire axe · every attack flings a right-angle slash, red inside and gold outside (the 5th splits into 3) · 35% crit · Blazing zone + healing light",
        "Eclipse (him): a slow but heavy 6-hit combo with a giant axe · the final Eclipse Fall leaps up (invincible), slams a huge area and leaves a black hole that drags foes in · no crits · Death zone (damage + slow)",
        "Invincible while changing: wrapped in a purple aura that sinks into the ground he appears, wrapped in a golden aura that rises away she returns · 10 exclusive items · Unlock: unlock every Helios character and clear a last boss with each at 45+ Taboo points",
      ],
      ja: [
        "新キャラ エクリプス（ヘリオス）：帝国の太陽である彼女と、その巨大な裏側、日食の夜の主である彼 · 当てるたびにゲージがたまり、満タンで姿が変わる（太陽 → 日食 → 太陽）· 体力115 · 攻撃力11 · 移動1.3",
        "太陽（女）：小さな炎の斧でとても速い5連撃 · すべての攻撃が赤い芯・金色の縁の直角の斬撃を飛ばす（5撃目は3本）· 会心35% · 灼熱の領域 + 癒しの光",
        "日食（男）：巨大な斧で遅いが強い6連コンボ · 最後の日食落下は跳び上がり（無敵）とても広く叩きつけ、中央に敵を引き寄せるブラックホール · 会心なし · 死の領域（ダメージ + 鈍化）",
        "変わる間は無敵：紫のオーラに包まれ紫の光が下へ消えると日食、金色のオーラに包まれ金色の光が上へ消えると太陽 · 専用アイテム10 · 解放条件：ヘリオスのキャラをすべて解放し、それぞれ禁忌の書45点以上でラストボスをクリア",
      ],
    },
  },
];
