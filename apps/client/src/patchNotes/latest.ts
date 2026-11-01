import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.319",
    date: "2026-11-01",
    items: {
      ko: ["돈은 999까지만 쌓임 (패왕전 빼고)", "층마다 오르는 몸 피해(+8%)가 라스트 보스·보스가 부른 졸개에게도 붙던 것 고침 (라스트 보스 층에서 졸개가 약 1.5배 아프던 것)"],
      en: ["Gold now caps at 999 (except Champion Clash)", "Fixed the per-floor contact damage bonus (+8%) also applying to minions summoned by bosses (they hit about 1.5× harder on the last-boss floor)"],
      ja: ["お金は999までしか貯まらない（覇王戦を除く）", "階ごとの接触ダメージ増加（+8%）がボスの呼んだ手下にもかかっていたのを修正（ラストボスの階で手下が約1.5倍痛かった）"],
    },
  },
  {
    version: "0.48.318",
    date: "2026-11-01",
    items: {
      ko: [
        "돈: 몬스터 하나 잡을 때마다 +1 (날벌레·박쥐 무리는 무리를 다 잡아야 +1) · 정예(주황 방의 큰 몬스터)는 +10",
        "정예: 방에 정예만 남으면 정예가 풀려 보통 몬스터로 (남은 체력 비율 그대로) · 층마다 오르는 정예 체력을 낮춤 · 대신 정예는 조금 빠르고 공격 주기가 빠름 · 정예 수치는 관리자 페이지에서",
        "땅 물고기 체력 크게 낮춤 · 땅 물고기 정예는 체력은 조금만, 솟구침·착지 피해는 크게",
        "세이렌 음표의 매혹이 보이게: 왼쪽 버프 칸 · 머리 위 '매혹' 글자 · 분홍 빛과 떠오르는 하트",
      ],
      en: [
        "Gold: +1 per monster killed (gnat and bat swarms give +1 once the whole swarm is down) · elites (big monsters in orange rooms) give +10",
        "Elites: when only elites are left in a room they lose elite status and become normal (keeping their HP ratio) · elite HP grows less per floor · elites now move a bit faster and attack more often · elite values are in the admin page",
        "Land Fish HP greatly lowered · elite Land Fish get only a little more HP but much stronger burst and landing hits",
        "Siren's Charm is now visible: left buff panel · 'Charm' overhead · pink glow and rising hearts",
      ],
      ja: [
        "お金: モンスターを1体倒すごとに+1（羽虫・コウモリの群れは群れを全部倒すと+1）· 精鋭（オレンジ部屋の大きいモンスター）は+10",
        "精鋭: 部屋に精鋭だけが残ると精鋭が解けて普通のモンスターに（残り体力の割合はそのまま）· 階ごとの精鋭の体力の伸びを低く · 代わりに精鋭は少し速く攻撃間隔が短い · 精鋭の数値は管理者ページで",
        "土ザカナの体力を大きく下げる · 精鋭の土ザカナは体力は少しだけ、飛び出し・着地のダメージは大きく",
        "セイレーンの音符の魅了が見えるように: 左のバフ欄 · 頭上の「魅了」· ピンクの光と浮かぶハート",
      ],
    },
  },
  {
    version: "0.48.317",
    date: "2026-11-01",
    items: {
      ko: ["관리자 티어 플레잉: 티어표 '초기화' 버튼 (모든 캐릭터를 '아직 안 놓음'으로 빼고 처음부터 매기기)"],
      en: ["Admin tier play: a 'Reset' button for the tier list (moves every character back to 'not placed' to rank from scratch)"],
      ja: ["管理者ティアプレイ: ティア表の「初期化」ボタン（全キャラを「未配置」に戻して最初から付け直し）"],
    },
  },
  {
    version: "0.48.316",
    date: "2026-11-01",
    items: {
      ko: ["캐릭터 그림에서 검은 머리·옷·몸이 지워져 비어 보이던 것 고침: 이터·학살자(피의 학살 포함)·소환술사·묵인·역병의사·렌·추적자·잔영", "아카이브 티어표가 관리자가 정한 최신 표로 바뀜"],
      en: ["Fixed black hair, clothes and bodies that had been erased from character art: Eater, Slayer (incl. Blood Frenzy), Summoner, Mukin, Plague Doctor, Ren, Tracker, Remnant", "The Archive tier list now shows the latest list set by the admins"],
      ja: ["キャラ絵で黒い髪・服・体が消えて透けていたのを修正: イーター・虐殺者（変身を含む）・召喚術師・黙忍・疫病医・レン・追跡者・残影", "アーカイブのティア表が管理者の決めた最新の表に"],
    },
  },
  {
    version: "0.48.315",
    date: "2026-11-01",
    items: {
      ko: ["방랑객: 공격할 때 검은 머리(상투)가 사라지던 그림 고침 · 달빛 일섬에 베인 적은 몸에 달빛 칼자국과 머리 위 초승달이 차오르고, 베이는 순간 하얗게 번쩍임 (늦게 들어가는 피해가 보이게)", "음양사: 뒷모습 공격 때 두 모습이 겹쳐 나오던 것 고침", "학살자·라이더·방랑객 크기를 파수꾼과 같게 (학살자 피의 학살 변신은 그대로 큼)"],
      en: ["Wanderer: fixed the black hair (topknot) vanishing during attacks · foes hit by Moonlit Flash now show a moonlight slash and a filling crescent overhead, flashing white when the cut lands (so the delayed damage is visible)", "Onmyoji: fixed two figures overlapping in the back-facing attack", "Slayer, Rider and Wanderer are now the same size as the Warden (Slayer's Blood Frenzy form stays large)"],
      ja: ["放浪者: 攻撃時に黒髪（髷）が消えていた絵を修正 · 月光一閃で斬られた敵は体に月光の斬り跡と頭上の三日月が満ちていき、斬られる瞬間に白く光る（遅れて入るダメージが見えるように）", "陰陽師: 後ろ向き攻撃で二つの姿が重なって出ていたのを修正", "虐殺者・ライダー・放浪者の大きさを番人と同じに（虐殺者の変身は大きいまま）"],
    },
  },
  {
    version: "0.48.314",
    date: "2026-11-01",
    items: {
      ko: ["방패 가디언은 돌진·휘두르기에 맞을 때만 기절, 성기사는 빛기둥에 맞을 때만 속박 (몸에 닿기만 해서는 걸리지 않아 계속 묶이지 않음)", "변희: 각성한 동물이 왼쪽 버프 칸에 보랏빛으로 뜸 (다른 동물을 들어도 남음) · 마우스를 올리면 그 각성 능력 설명"],
      en: ["Shield Guardians only Stun with their charge and swing, and Paladins only Root with pillars of light (just touching them no longer chains you in place)", "Byeonhui: awakened animals now show in purple in the left buff panel (kept when you switch animals) · hover to see the awakened ability"],
      ja: ["盾のガーディアンは突進・振りに当たったときだけ気絶、聖騎士は光の柱に当たったときだけ拘束（体に触れただけではかからず、ずっと止められない）", "ビョンヒ: 覚醒した動物が左のバフ欄に紫で表示（他の動物に持ち替えても残る）· マウスを乗せるとその覚醒能力の説明"],
    },
  },
];
