import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.312",
    date: "2026-11-01",
    items: {
      ko: ["땅 물고기: 밀리거나 기절해도 예고 표시는 남아 있고, 물고기가 실제로 솟구치거나 땅에 닿는 순간 그 자리에서 터짐 (때가 어긋나지 않음)", "패왕전 등 화면을 줄여 볼 때 캐릭터·몬스터를 더 또렷하게: 화면 크기에 딱 맞춰 미리 줄이고 살짝 선명하게 다듬은 그림을 화면 픽셀에 맞춰 그림"],
      en: ["Land Fish: even when knocked back or stunned, the warning stays and it only explodes where the fish actually bursts out or lands (no more mismatched timing)", "Characters and monsters look sharper when zoomed out (e.g. Champion Clash): pre-shrunk to the exact on-screen size, lightly sharpened and aligned to screen pixels"],
      ja: ["土ザカナ: 押されたり気絶しても予告は残り、魚が実際に飛び出す・着地した瞬間にその場所で爆発（タイミングがずれない）", "覇王戦など縮小表示でキャラ・モンスターをよりくっきり: 画面サイズにぴったり合わせて事前に縮小し、軽く鮮明化して画面ピクセルに合わせて描画"],
    },
  },
  {
    version: "0.48.311",
    date: "2026-11-01",
    items: {
      ko: ["차원의 순례자가 너무 작아진 것 고침: 소녀 키를 일반 캐릭터에 맞추고 큰 가방은 그만큼 같이 커짐 · 빛의 사도도 키를 일반 캐릭터에 맞춤 (성장 모습은 단계마다 커짐)"],
      en: ["Fixed the Dimension Pilgrim being too small: the girl now matches regular character height and her big backpack scales with her · Lux also matches regular height (growth forms still grow each stage)"],
      ja: ["次元の巡礼者が小さくなりすぎたのを修正: 少女の背を通常キャラに合わせ、大きなかばんも一緒に大きく · 光の使徒も背を通常キャラに合わせる（成長した姿は段階ごとに大きく）"],
    },
  },
  {
    version: "0.48.310",
    date: "2026-10-31",
    items: {
      ko: [
        "폭탄 범위 44 → 64 (에테르 폭탄 70 → 92)",
        "히든 동료(거짓된 용사·월계선 동료)가 더 똑똑하게: 적 몸에 닿지 않을 거리에서 공격 · 터질 위험 표시와 날아오는 적 탄을 피함 · 체력이 낮으면 내 뒤로 물러남 · 벽·기둥·구덩이에 막히고 길을 찾아 감 · 용암·가시·독가스·감전된 물에 피해, 진흙·물에서 느려짐",
        "거짓된 용사가 쓰러져도 다음 층에 쓰러지기 전 레벨·능력치 그대로 다시 옴",
        "위험한 곳에 들어가면 화면 테두리 안쪽으로 색이 번지며 깜박임: 독가스 연두 · 용암 주황 · 솟은 가시 붉은빛 · 감전된 물 노랑 · 패왕전 자기장 밖 보라 · 진흙·물은 옅게",
        "히든 캐릭터(에테르 광부·운명의 여행자·제우스·차원의 순례자·몰락한 왕·빛의 사도)를 일반 캐릭터와 같은 크기로 (빛의 사도 성장 모습은 단계마다 조금씩 커짐)",
        "관리자 상태이상 탭: 치유감소에 독가스 회복 감소 수치가 뜸",
      ],
      en: [
        "Bomb radius 44 → 64 (Aether Bomb 70 → 92)",
        "Hidden allies (False Hero, Laurel Ship ally) are smarter: attack from outside enemy touch range · dodge danger markers and incoming shots · fall back behind you at low HP · blocked by walls, pillars and pits and path around them · take damage from lava, spikes, poison gas and shocked water, slowed by mud and water",
        "When the False Hero falls, it returns next floor at the same level and stats",
        "Entering a dangerous area tints and pulses the screen edges: poison gas lime · lava orange · raised spikes red · shocked water yellow · outside the Champion Clash zone purple · mud and water faintly",
        "Hidden characters (Aether Miner, Voyager of Fate, Zeus, Pilgrim, Fallen King, Lux) are now the same size as regular characters (Lux's growth forms still grow a little each stage)",
        "Admin status tab: Healing Cut now lists the poison gas healing reduction values",
      ],
      ja: [
        "爆弾の範囲 44 → 64（エーテル爆弾 70 → 92）",
        "ヒドゥン仲間（偽りの勇者・月桂船の仲間）がより賢く: 敵の体に触れない距離から攻撃 · 爆発予告と飛んでくる敵弾を避ける · 体力が低いと自分の後ろへ下がる · 壁・柱・穴に阻まれ道を探して進む · 溶岩・トゲ・毒ガス・感電した水でダメージ、泥・水で遅くなる",
        "偽りの勇者が倒れても次の階で倒れる前のレベル・能力値のまま戻ってくる",
        "危険な場所に入ると画面の縁の内側に色がにじんで点滅: 毒ガス 黄緑 · 溶岩 オレンジ · 出たトゲ 赤 · 感電した水 黄 · 覇王戦の安全地帯の外 紫 · 泥・水は薄く",
        "ヒドゥンキャラ（エーテル鉱夫・運命の旅人・ゼウス・巡礼者・堕ちた王・光の使徒）を通常キャラと同じ大きさに（光の使徒の成長した姿は段階ごとに少しずつ大きく）",
        "管理者の状態異常タブ: 回復減少に毒ガスの回復減少の値を表示",
      ],
    },
  },
  {
    version: "0.48.309",
    date: "2026-10-31",
    items: {
      ko: ["보스 말고 일반 몬스터 20종 그림을 2배 촘촘하게: 생김새·색은 그대로, 윤곽의 계단을 매끈하게 · 테두리 안쪽에 빛과 그림자로 도톰하게", "기본 효과음을 더 웅장하고 또렷하게: 맞힘·처치·맞음·휘두르기·쏘기·돈·줍기·사기·사용·계단·보스 등장·보스 쓰러짐·업적·쓰러짐·클리어 (낮은 울림·메아리·화음, 겹쳐도 깨지지 않게)"],
      en: ["20 regular (non-boss) monsters now at 2× detail: same look and colors, smoother outlines, inner light and shadow for a rounder feel", "Core sound effects are fuller and clearer: hit, kill, hurt, swing, shot, coin, pickup, buy, use, stairs, boss intro, boss down, achievement, fall, clear (low body, echo, chords; no clipping when layered)"],
      ja: ["ボス以外の通常モンスター20種の絵を2倍の細かさに: 見た目・色はそのまま、輪郭の段差をなめらかに・縁の内側に光と影で立体感", "基本効果音をより重厚で明瞭に: ヒット・撃破・被弾・振り・射撃・お金・拾う・購入・使用・階段・ボス登場・ボス撃破・実績・ダウン・クリア（低い響き・残響・和音、重なっても割れない）"],
    },
  },
  {
    version: "0.48.308",
    date: "2026-10-31",
    items: {
      ko: ["패왕전: 화면을 줄여 볼 때 캐릭터·몬스터 그림이 흐릿하던 것 고침 (미리 줄인 선명한 그림으로) · 결과 창을 넓어진 화면에 맞게 크게 (글자·점수판·장비 그림) · 대시 대기 감소 아이템(회피 망토 등 5개) 40% → 10%, 합계 한도 40% → 20%"],
      en: ["Champion Clash: characters and monsters no longer look blurry when zoomed out (uses pre-shrunk crisp images) · the result window is bigger to match the wider view (text, scoreboard, item icons) · dash-cooldown items (Dodge Cloak and 4 more) 40% → 10%, total cap 40% → 20%"],
      ja: ["覇王戦: 画面を縮小したときキャラ・モンスターの絵がぼやけていたのを修正（あらかじめ縮小した鮮明な絵を使用） · 結果ウィンドウを広くなった画面に合わせて大きく（文字・スコア表・装備アイコン） · ダッシュ待機短縮アイテム（回避のマントなど5種）40% → 10%、合計上限40% → 20%"],
    },
  },
  {
    version: "0.48.307",
    date: "2026-10-31",
    items: {
      ko: [
        "로그 적이 상태이상을 걺: 땅 물고기 출혈 · 슬라임 부식(받는 피해 +20%) · 도플갱어 저주(4초 뒤 터짐) · 그림자 공포(1초 공격 못 함) · 방패 가디언 기절 · 성기사 속박 · 돌진 멧돼지 느림 · 베놈 독가스는 독 + 치유감소(새 이름)",
        "왼쪽 버프 창에 걸린 상태이상이 빨간 줄로 뜸 · 맞으면 머리 위에 빨간 −숫자(상태이상 피해도 같은 빨강) · 새로 걸린 상태이상 이름이 머리 위에",
        "돈: 처음 자금 50 · 적을 잡아도 돈 없음 · 방 정리 1~2층 3 · 3~4층 5 · 5층부터 7 (주황 강한 적 방 5 · 7 · 10) · 돈주머니 25",
        "한 방 몬스터 수 증가(층마다 1마리씩 더) · 층이 오를수록 몬스터 체력 +20%씩 · 몸 피해 +8%씩 · 한 층 칸 수는 최대 10칸",
      ],
      en: [
        "Roguelike foes now inflict debuffs: Land Fish Bleed · Slime Corrosion (+20% damage taken) · Doppelganger Curse (bursts after 4s) · Shadow Fear (can't attack for 1s) · Shield Guardian Stun · Paladin Root · Charger Slow · Venom gas gives Poison + Healing Cut (renamed)",
        "Active debuffs show as red rows in the left buff panel · Taking damage shows a red −number overhead (debuff damage too, same red) · Newly applied debuff names pop overhead",
        "Gold: start with 50 · no gold from kills · clearing a room gives 3 on floors 1–2, 5 on 3–4, 7 from 5 (orange elite rooms 5 · 7 · 10) · Money Pouch 25",
        "More monsters per room (one more each floor) · monsters gain +20% HP and +8% contact damage per floor · at most 10 rows per floor",
      ],
      ja: [
        "ローグの敵が状態異常をかける: 土ザカナ 出血 · スライム 腐食（被ダメージ+20%） · ドッペルゲンガー 呪い（4秒後に爆発） · 影 恐怖（1秒攻撃不可） · 盾のガーディアン 気絶 · 聖騎士 拘束 · 突進イノシシ 鈍足 · ヴェノムの毒ガスは毒 + 回復減少（新しい名前）",
        "左のバフ欄にかかった状態異常が赤い行で表示 · 被弾すると頭上に赤い−数字（状態異常ダメージも同じ赤） · 新しくかかった状態異常の名前が頭上に",
        "お金: 最初の資金50 · 敵を倒してもお金なし · 部屋クリアで1〜2階3 · 3〜4階5 · 5階から7（オレンジの強敵部屋5 · 7 · 10） · 銭袋25",
        "1部屋のモンスター数が増加（階ごとに1体ずつ追加） · 階が上がるほどモンスターの体力+20%ずつ · 接触ダメージ+8%ずつ · 1階層のマスは最大10",
      ],
    },
  },
  {
    version: "0.48.306",
    date: "2026-10-31",
    items: {
      ko: ["좌우가 반대로 나오던 그림 고침: 대시 — 라이더·묵인·방랑객·붐버·아티팩터·오토마타·이터·장로·제우스·학살자(피의 학살 포함) · 공격 — 묵인·잔영"],
      en: ["Fixed mirrored poses: dash — Rider, Mukin, Wanderer, Bomber, Artifacter, Automata, Eater, Elder, Zeus, Slayer (incl. Blood Frenzy) · attack — Mukin, Remnant"],
      ja: ["左右が逆になっていた絵を修正: ダッシュ — ライダー・黙人・放浪者・ボマー・アーティファクター・オートマタ・イーター・長老・ゼウス・殺戮者（血の殺戮を含む）· 攻撃 — 黙人・残影"],
    },
  },
  {
    version: "0.48.305",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림 23개: 장로·렌·정령사·플라이 · 역병의사·학살자(피의 학살 모습 포함)·이터·묵인·사멸 · 오토마타·라이더·붐버·아티팩터·펑크 · 추적자·잊혀진 자·잔영·방랑객·영사 · 에테르 광부·운명의 여행자·제우스 · 앞·뒤·왼·오 모습과 공격·걷기·맞음·쓰러짐·대시 자세"],
      en: ["23 new character sheets: Elder, Ren, Spiritist, Fly · Plague Doctor, Slayer (including Blood Frenzy), Eater, Mukin, Samyeol · Automata, Rider, Bomber, Artifacter, Punk · Tracker, The Forgotten, Remnant, Wanderer, Silk · Aether Miner, Voyager of Fate, Zeus · front/back/left/right with attack, walk, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵23種: 長老・レン・精霊使い・フライ · 疫病医・殺戮者（血の殺戮の姿を含む）・イーター・黙人・死滅 · オートマタ・ライダー・ボマー・アーティファクター・パンク · 追跡者・忘れられし者・残影・放浪者・影糸 · エーテル鉱夫・運命の旅人・ゼウス · 前・後ろ・左・右と攻撃・歩き・ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.304",
    date: "2026-10-31",
    items: {
      ko: ["로그 방이 옆·아래로 넓어짐: 옆·아래 벽은 얇게 맨 끝으로 가고 그 자리까지 걸어 다닐 수 있음 (출구가 있는 위쪽 벽은 그대로)"],
      en: ["Roguelike rooms are wider: the side and bottom walls are thin and sit at the very edge, and you can walk right up to them (the top wall with the exits is unchanged)"],
      ja: ["ローグの部屋が横・下に広く: 横・下の壁は薄く端に移り、そこまで歩ける（出口のある上の壁はそのまま）"],
    },
  },
  {
    version: "0.48.303",
    date: "2026-10-31",
    items: {
      ko: ["방 테두리 벽: 출구가 있는 위쪽 벽만 두껍게, 옆·아래 벽은 얇게 (움직일 수 있는 범위는 그대로)"],
      en: ["Room border walls: only the top wall with the exits stays thick; side and bottom walls are now thin (the walkable area is unchanged)"],
      ja: ["部屋の外壁: 出口のある上の壁だけ厚く、横・下の壁は薄く（動ける範囲はそのまま）"],
    },
  },
];
