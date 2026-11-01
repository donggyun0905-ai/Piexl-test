import type { PatchNote } from "./types";

export const NOTES: PatchNote[] = [
  {
    version: "0.48.313",
    date: "2026-11-01",
    items: {
      ko: ["화면 오류 고침: 패왕전 대결 시간이 '31.666…분'처럼 나오던 것(반올림) · 도감에 영어 코드 이름(그림만 있는 검은 모습·근두운)이 섞이던 것 · 낮은 화면에서 혼자 하기 창 아래가 넘치던 것 · 설정 창 버튼 글자가 세로로 끊기고 아래 줄이 잘리던 것 · 휴대폰 메인에서 로비 버튼이 상점 버튼에 겹치던 것(위쪽 가운데로) · 휴대폰 세로 게임에서 능력치 칸이 맵을 가리던 것과 '가로로 돌리면' 안내가 버튼에 겹치던 것"],
      en: ["UI fixes: Champion Clash round time showing '31.666… min' (now rounded) · English code names (sprite-only dark forms, cloud) in the Codex · Play Solo window overflowing on short screens · Settings buttons wrapping letter by letter and the last row being cut off · Lobby button overlapping the Shop button on phones (moved to top center) · stats panel covering the map and the 'rotate your phone' tip overlapping buttons in portrait"],
      ja: ["画面の不具合を修正: 覇王戦の対戦時間が「31.666…分」と出ていたのを四捨五入 · 図鑑に英語のコード名（絵だけの黒い姿・觔斗雲）が混ざっていたのを除外 · 低い画面でひとりで遊ぶウィンドウの下がはみ出していたのを修正 · 設定のボタン文字が縦に途切れ下の行が切れていたのを修正 · スマホのメインでロビーボタンがショップボタンに重なっていたのを上中央へ · スマホ縦のゲームで能力値欄がマップを隠し「横にすると」案内がボタンに重なっていたのを修正"],
    },
  },
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
];
