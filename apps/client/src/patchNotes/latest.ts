import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
  {
    version: "0.50.13",
    date: "2026-11-08",
    items: {
      ko: [
        "새벽의 성흔 새 캐릭터 시저스 '단죄의 가위' (스킬 없음, 성흔 게이지): 악마의 목과 운명의 실을 거대한 쌍가위로 잘라 버리는 냉혹한 도살자 · 체력 105 · 공격력 16 · 해금: 이동 속도 1.8 달성",
        "가위질 두 박자: 열기(앞을 넓게) → 닫기(두 날이 맞물리는 X자 절단, 맞힌 적에게 운명의 실) · 운명의 실(최대 6, 8초): 대시하면 모두 끊겨 묶인 적을 벰 (멀어서 팽팽할수록 최대 250%) · 끊기는 실이 지나는 적도 벰",
        "단죄: 체력 20% 이하인 보통 적은 목을 잘라 바로 처치 (머리 위 가위 표시) · 체력 30% 이하인 보스에게 1.4배 · 달빛 각성: 피해 1.3배·가위가 커짐·열기도 실을 묶음·1.5초마다 실을 저절로 끊음",
        "전용 아이템 20 · 이펙트·효과음·그림 시트·패왕전 스킬",
      ],
      en: [
        "New Dawn Stigmata character Scissors 'The Shears of Condemnation' (no skills, Stigma gauge): a ruthless butcher who snips demons' necks and the threads of fate with giant twin shears · HP 105 · ATK 16 · unlock: reach 1.8 move speed",
        "Two-beat snipping: Open (wide front sweep) → Close (blades meet in an X cut, tying a thread of fate to each foe hit) · threads of fate (up to 6, 8s): dashing snaps them all, cutting the tied foes (up to 250% the farther and tauter) · foes along a snapping thread are cut too",
        "Condemnation: normal foes at 20% HP or less are beheaded on the spot (shears mark overhead) · 1.4x to bosses at 30% HP or less · Moonlight Awakening: 1.3x damage, bigger shears, Open ties threads too, threads snap by themselves every 1.5s",
        "20 exclusive items · effects, sounds, sprite sheet and Paewang skills",
      ],
      ja: [
        "暁の聖痕の新キャラ シザーズ「断罪の鋏」（スキルなし、聖痕ゲージ）：悪魔の首と運命の糸を巨大な双鋏で断ち切る冷酷な屠殺者 · 体力105 · 攻撃力16 · 解放：移動速度1.8達成",
        "二拍子の鋏さばき：開き（前方を広く）→ 閉じ（刃が噛み合うX字切断、当たった敵に運命の糸）· 運命の糸（最大6本、8秒）：ダッシュで全て断ち切り結んだ敵を斬る（離れて張るほど最大250%）· 断たれる糸が通る敵も斬る",
        "断罪：体力20%以下の通常の敵は首を落として即撃破（頭上に鋏の印）· 体力30%以下のボスに1.4倍 · 月光覚醒：ダメージ1.3倍・鋏が大きく・開きでも糸を結ぶ・1.5秒ごとに糸が自動で切れる",
        "専用アイテム20 · エフェクト・効果音・スプライトシート・覇王戦スキル",
      ],
    },
  },
  {
    version: "0.50.12",
    date: "2026-11-08",
    items: {
      ko: [
        "네일러: 4 심판의 못비 분신을 검은 그림자로 (발밑 검은 웅덩이·피어오르는 검은 기운) · 못 모양 다듬기 (가는 몸통이 끝으로 갈수록 뾰족 · 얇은 머리 · 한 덩어리 윤곽) · 3 저주의 도화선에 피 폭발 그림 (튐 → 퍼짐 → 크게 터짐 → 웅덩이) · 튀어 나간 못이 떨어진 자리마다 작은 피 폭발 · 못이 박힐 때·2 붉은 실 망치 원에도 피 폭발",
      ],
      en: [
        "Nailer: 4 Nail Judgment clones are now black shadows (black pool underfoot, rising dark wisps) · refined nail shape (slim shaft tapering to a sharp tip, thin head, single outline) · 3 Cursed Fuse uses a blood burst sprite (spray → spread → big burst → pool) · each flung nail splashes a small blood burst where it lands · blood bursts also when nails stick and on 2 Red Thread's hammer ring",
      ],
      ja: [
        "ネイラー：4 釘の審判の分身を黒い影に（足元の黒い溜まり・立ちのぼる黒い気配）· 釘の形を調整（細い胴が先へ行くほど尖る・薄い頭・ひとかたまりの輪郭）· 3 呪いの導火線に血の爆発の絵（飛び散り→広がり→大きく弾ける→血だまり）· 飛び出した釘の落ちた場所ごとに小さな血の爆発 · 釘が刺さる時・2 赤い糸の槌の円にも血の爆発",
      ],
    },
  },
  {
    version: "0.50.11",
    date: "2026-11-08",
    items: {
      ko: [
        "네일러 이펙트 다듬기: 기본 공격은 망치 그림 대신 앞으로 뻗는 네모 검격 · 못은 온통 검게 · 끝은 뾰족하게, 머리는 양끝이 뾰족하게 · 3 저주의 도화선은 박힌 못이 피와 함께 폭발(핏방울·피 안개·튀어 나가는 못·피 웅덩이) · 2 붉은 실 망치 원에 갈라진 땅·핏방울",
        "4 심판의 못비: 양옆 망치 대신 붉은 그림자 분신이 양옆에 나타나 같이 못을 던짐",
      ],
      en: [
        "Nailer effects polished: the basic attack is now a square slash surging forward instead of a hammer image · nails are all black with pointed tips and heads pointed at both ends · 3 Cursed Fuse makes the stuck nails burst in blood (droplets, blood mist, flying nails, a blood pool) · 2 Red Thread's hammer ring cracks the ground and splatters blood",
        "4 Nail Judgment: instead of hammers at your sides, two red shadow clones appear and throw nails with you",
      ],
      ja: [
        "ネイラーのエフェクト調整：通常攻撃は槌の絵の代わりに前へ伸びる四角い斬撃 · 釘は全体を黒く · 先は尖り、頭は両端が尖った形に · 3 呪いの導火線は刺さった釘が血とともに爆発（血しぶき・血の霧・飛び散る釘・血だまり）· 2 赤い糸の槌の円に地割れ・血しぶき",
        "4 釘の審判：左右の槌の代わりに赤い影の分身が左右に現れ一緒に釘を投げる",
      ],
    },
  },
  {
    version: "0.50.10",
    date: "2026-11-07",
    items: {
      ko: [
        "새벽의 성흔 새 캐릭터 네일러 '못 박는 심판관' (스킬형): 눈을 붕대로 가린 채 거대한 못과 망치로 악마를 대지에 고정하는 사냥꾼 · 체력 120 · 공격력 15 · 해금: 최대 체력 220 달성",
        "기본 공격: 망치 내려치기 · 박힌 못은 적 체력 줄 위에 못 ×개수 (한도 없음) · 맞힐수록 성흔이 차고 가득 차면 달빛 각성 (피해 1.3배)",
        "1 못 던지기: 세 번까지 눌러 점점 빠른 못 (3번째는 셋 연달아) → 0.8초 대기 · 2 붉은 실: 바닥에 못을 박고 적에게 무적 돌진해 못 다섯·고정 → 한 번 더 누르면 망치 원(출혈) 뒤 실을 따라 돌아감",
        "3 저주의 도화선: 못이 박힌 모든 적에게 붉은 도화선 → 못 하나마다 공격력 33%를 한 번에 · 4 심판의 못비: 제자리에서 한 적에게 나와 양옆 분신이 못 셋씩 10번 (표적이 죽으면 끝)",
        "전용 아이템 20 · 효과음·이펙트·그림 시트·패왕전 스킬",
      ],
      en: [
        "New Dawn Stigmata character Nailer 'The Nailing Judge' (skill-based): a hunter with bandaged eyes who pins demons to the earth with giant nails and a hammer · HP 120 · ATK 15 · unlock: reach 220 max HP",
        "Basic attack: hammer slam · stuck nails show above a foe's health bar as nail ×count (no limit) · hits fill your Stigma; when full you awaken in moonlight (1.3x damage)",
        "1 Nail Throw: press up to three times for faster nails (the 3rd throws three) → 0.8s cooldown · 2 Red Thread: drive a nail into the floor and dash invulnerably at a foe, pinning it with five nails → press again for a hammer ring (bleed), then fly back along the thread",
        "3 Cursed Fuse: red fuses run to every nailed foe → 33% attack per nail in one hit · 4 Nail Judgment: stand still while you and two shadow clones at your sides throw three nails at a time into one foe, 10 times (ends if it dies)",
        "20 exclusive items · sounds, effects, sprite sheet and Paewang skills",
      ],
      ja: [
        "暁の聖痕の新キャラ ネイラー「釘打つ審判官」（スキル型）：目を包帯で覆い、巨大な釘と槌で悪魔を大地に縫い止める狩人 · 体力120 · 攻撃力15 · 解放：最大体力220達成",
        "通常攻撃：槌の叩きつけ · 刺さった釘は敵の体力バーの上に釘×数（上限なし）· 当てるほど聖痕が満ち、満ちると月光覚醒（ダメージ1.3倍）",
        "1 釘投げ：3回まで押すとだんだん速い釘（3回目は3本連続）→ 待機0.8秒 · 2 赤い糸：床に釘を打ち敵へ無敵突進して釘5本で固定 → もう一度押すと槌の円（出血）のあと糸をたどって戻る",
        "3 呪いの導火線：釘が刺さった全ての敵へ赤い導火線 → 釘1本ごとに攻撃力33%を一度に · 4 釘の審判：その場から1体の敵へ自分と左右の分身が釘3本ずつ10回（標的が倒れると終了）",
        "専用アイテム20 · 効果音・エフェクト・スプライトシート・覇王戦スキル",
      ],
    },
  },
];
