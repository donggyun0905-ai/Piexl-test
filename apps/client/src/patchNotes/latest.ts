import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.19",
    date: "2026-11-08",
    items: {
      ko: ["헬피스트 캐릭터 그림: 흰 머리·검은 코트·붉은 악마 팔 (서기·공격·걷기·맞음·쓰러짐·대시) · 적혈 각성 중에는 뿔이 돋고 온몸이 붉은 악마화 모습으로 바뀜", "블래스트·네일러·시저스가 가만히 서 있을 때 왼쪽·오른쪽 모습이 반대로 보이던 것 고침"],
      en: ["Hellfist character art: white hair, black coat and a red demon arm (stand, attack, walk, hit, down, dash) · during Crimson Awakening he turns into a horned, crimson demonized form", "Fixed Blast, Nailer and Scissors facing the wrong way when standing still left or right"],
      ja: ["ヘルフィストのキャラ絵：白い髪・黒いコート・赤い悪魔の腕（立ち・攻撃・歩き・被弾・ダウン・ダッシュ）· 赤血覚醒中は角が生え全身が赤い悪魔化の姿に変わる", "ブラスト・ネイラー・シザーズが立ち止まった時に左右の向きが逆だったのを修正"],
    },
  },
  {
    version: "0.50.18",
    date: "2026-11-08",
    items: {
      ko: [
        "새벽의 성흔 새 캐릭터 헬피스트 (적혈의 주먹, 게이지형): 주먹 세 박자 — 오른 주먹 찌르기 → 악마 왼팔 내려찍기 → 허공 긁기 (커다란 왼손 검지로 먼 적을 가리키고 공중을 긁으면 그 적 자리에 검격 여러 줄)",
        "악마화: 맞힐 때마다 쌓여 모든 공격이 더 멀리 닿음 (사거리 증가) · 2.5초 안 맞히면 하나씩 빠짐 · 버프 창에 표시",
        "적혈 각성: 달빛 각성과 달리 공격 속도 1.5배 · 맞힐 때 회복 · 악마화 가득 · 허공 긁기 셋 동시 · 화면에 붉은 빛과 붉은 깃털 · 성흔 게이지는 흰 테두리 검은 글자 · 검은 막대에 흰색이 차오름",
        "무기 1 · 전용 아이템 20 · 이펙트 · 효과음 · 패왕전 스킬 · 업적 (캐릭터 그림은 그림이 올라오면 넣음)",
      ],
      en: [
        "New Dawn Stigmata character Hellfist (Crimson Blood Fist, gauge type): a three-beat combo — right Jab → demon left-arm Slam → Air Claw (point a far-off foe with the huge left index finger and scratch the air: several slashes land where that foe stands)",
        "Demonization: stacks on every hit so every attack reaches farther (range bonus) · drops one at a time after 2.5s without hitting · shown in the buff list",
        "Crimson Awakening: unlike Moonlight Awakening, 1.5x attack speed · heal on hit · full Demonization · Air Claw on three foes at once · red light and red feathers on screen · the Stigma gauge has black text with a white outline and a black bar that fills with white",
        "1 weapon · 20 exclusive items · effects · sounds · Paewang skills · achievement (character art comes once the drawings are uploaded)",
      ],
      ja: [
        "夜明けの聖痕の新キャラ ヘルフィスト（赤血の拳、ゲージ型）：拳の三拍子 — 右拳の突き → 悪魔の左腕叩きつけ → 虚空掻き（大きな左手の人差し指で遠くの敵を指し宙を掻くと、その敵の位置に斬撃が何本も）",
        "悪魔化：当てるたび溜まり全攻撃がより遠くに届く（射程増加）· 2.5秒当てないと一つずつ減る · バフ欄に表示",
        "赤血覚醒：月光覚醒と違い攻撃速度1.5倍 · 当てると回復 · 悪魔化最大 · 虚空掻き三体同時 · 画面に赤い光と赤い羽根 · 聖痕ゲージは白縁の黒い文字・黒いバーに白が満ちる",
        "武器1 · 専用アイテム20 · エフェクト · 効果音 · 覇王戦スキル · 実績（キャラ絵は絵がアップロードされ次第追加）",
      ],
    },
  },
  {
    version: "0.50.17",
    date: "2026-11-08",
    items: {
      ko: ["시저스 이펙트 다듬기: 가위 날을 가늘고 끝이 뾰족한 칼날 모양으로 · 열기는 두 날이 벌어지며 휘두른 자리에 옅은 결·가장자리 빛줄 · 닫기는 두 날이 X자로 맞물린 자리에 네 갈래 '싹둑' 빛과 잘린 붉은 실 조각 · 실 끊김·단죄도 네 갈래 빛 · 실 묶임 매듭"],
      en: ["Scissors effects polished: slim, sharp-tipped blades · Open spreads both blades with a faint swept arc and a thin edge line · Close meets in an X with a four-point 'snip' gleam and cut red thread bits · thread snaps and Condemnation get the gleam too · knot on tied threads"],
      ja: ["シザーズのエフェクト調整：鋏の刃を細く先の尖った刃の形に · 開きは二枚の刃が開いて振った跡に淡い筋・縁の細い光 · 閉じは刃がX字に噛み合った所に四方の「チョキン」光と切れた赤い糸のかけら · 糸断ち・断罪にも四方の光 · 糸を結ぶ結び目"],
    },
  },
  {
    version: "0.50.16",
    date: "2026-11-08",
    items: {
      ko: [
        "사거리 증가가 실제 공격에 닿도록 고침 (공격 범위·이펙트가 같이 늘어남): 리바이어 (창·고래 공격 전부) · 테일 (발밑 바다 영역, 꼬리 공격은 그대로) · 훅 (갈고리 던지는 거리, 산탄총은 그대로) · 미류 (평타 휩쓸기·회오리·일섬) · 베아트리스 (칼선·X자) · 세레나 (채찍·회오리·도는 사슬) · 미카엘라 (무기 기술 전부) · 유리엘 (철퇴·사슬 한 바퀴) · 네일러 (망치·던지는 못·붉은 원·도화선) · 시저스 (열기·닫기)",
        "캐릭터 설명 끝에 '사거리 증가' 한 줄: 늘어남 · 늘어나지 않음 · 일부만 (무엇이 느는지)",
      ],
      en: [
        "Range bonuses now actually reach (attack reach and effects grow together): Levia (all spear and whale attacks) · Tail (sea zone underfoot; tail strikes unchanged) · Hook (hook throw distance; shotgun unchanged) · Miryu (basic sweeps, whirl, flash) · Beatrice (slashes and X) · Serena (whips, whirl, orbiting chains) · Michaela (all weapon techniques) · Yuriel (flail and chain spin) · Nailer (hammer, thrown nails, red ring, fuse) · Scissors (Open and Close)",
        "Each character description now ends with a 'Range bonus' line: grows · no effect · partly (what grows)",
      ],
      ja: [
        "射程増加が実際の攻撃に届くよう修正（攻撃範囲とエフェクトが一緒に広がる）：リヴァイア（槍・クジラの攻撃すべて）· テイル（足元の海の領域、尾の攻撃はそのまま）· フック（鉤を投げる距離、散弾銃はそのまま）· ミリュウ（通常の薙ぎ・渦・一閃）· ベアトリス（斬撃線・X字）· セレナ（鞭・渦・回る鎖）· ミカエラ（武器の技すべて）· ユリエル（鉄槌・鎖の一回転）· ネイラー（槌・投げ釘・赤い円・導火線）· シザーズ（開き・閉じ）",
        "キャラ説明の最後に「射程増加」の一行：広がる · 伸びない · 一部のみ（何が伸びるか）",
      ],
    },
  },
  {
    version: "0.50.15",
    date: "2026-11-08",
    items: {
      ko: ["설정 키 바꾸기: 스킬 키·사용 아이템 키에 마우스 휠 클릭(M3)·옆 버튼(M4·M5)도 넣을 수 있음 (왼쪽·오른쪽 클릭은 공격·대시라 제외) · 옆 버튼을 키로 쓰면 게임 중 브라우저 뒤로·앞으로 가기가 되지 않음"],
      en: ["Key settings: skill and item keys can now use the mouse wheel click (M3) and side buttons (M4·M5) (left/right click stay attack/dash) · side buttons bound to keys no longer trigger browser back/forward in game"],
      ja: ["キー設定：スキルキー・使用アイテムキーにマウスホイールクリック（M3）・サイドボタン（M4・M5）も設定可能（左・右クリックは攻撃・ダッシュのため除外）· サイドボタンをキーにするとゲーム中にブラウザの戻る・進むが起きない"],
    },
  },
  {
    version: "0.50.14",
    date: "2026-11-08",
    items: {
      ko: ["시저스 단죄: 피 폭발을 빼고 목 높이 흰 일섬 → 라벤더 X 표시 · 빛 조각으로"],
      en: ["Scissors Condemnation: no more blood burst — a white slash at neck height, then a lavender X and shards of light"],
      ja: ["シザーズの断罪：血の爆発をやめ、首の高さの白い一閃 → ラベンダーのX印・光のかけらに"],
    },
  },
];
