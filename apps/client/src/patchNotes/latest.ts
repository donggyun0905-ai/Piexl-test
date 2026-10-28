import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.206",
    date: "2026-10-28",
    items: {
      ko: ["효과 다듬기 5: 캐릭터와 적 발밑에 그림자 · 가만히 서 있으면 숨 쉬듯 살짝 오르내림 · 맞은 적이 순간 살짝 부풀었다 돌아옴"],
      en: ["Effects polish 5: shadows under characters and enemies · characters gently breathe while standing still · enemies swell slightly for an instant when hit"],
      ja: ["エフェクト調整5: キャラと敵の足元に影 · 立ち止まると呼吸するように少し上下 · 当たった敵が一瞬少し膨らんで戻る"],
    },
  },
  {
    version: "0.48.205",
    date: "2026-10-28",
    items: {
      ko: [
        "효과 다듬기 4: 기계공학자 레이저(일렁이는 빛줄기·맞은 곳 불똥)·번개(갈라지는 줄기)·화염(흰빛→주황→붉은 불)·충격파·낙하 조준선 · 원소술사 회전체 빛·전깃줄·풀 범위·내려찍기·빛 터짐·빅뱅 · 격투가 파동탄 꼬리·기 모으기·버티기 기운 · 의사 효과마다 빛",
        "모든 캐릭터 효과에 그 캐릭터 느낌의 색으로 빛과 충격파를 더하고, 내 탄에도 캐릭터 색 빛",
      ],
      en: [
        "Effects polish 4: Engineer lasers (shimmering beams, impact sparks), lightning (forking bolts), flames (white → orange → red), shockwaves and strike reticles · Elementalist orb glow, wires, grass field, slam, light burst, Big Bang · Brawler ki-shot trail, charging and guard aura · glow for every Doctor effect",
        "Every character's effects gain light and shockwaves in that character's colors, and your shots glow in your character's color",
      ],
      ja: [
        "エフェクト調整4: 機械工学者のレーザー(揺らぐ光線・着弾の火花)・稲妻(枝分かれ)・火炎(白→橙→赤)・衝撃波・落下照準 · 元素術師の回転体の光・電線・草の範囲・叩きつけ・光の爆発・ビッグバン · 格闘家の波動弾の尾・気溜め・踏ん張りのオーラ · 医者の全エフェクトに光",
        "全キャラのエフェクトにそのキャラらしい色の光と衝撃波を追加、自分の弾もキャラ色に光る",
      ],
    },
  },
  {
    version: "0.48.204",
    date: "2026-10-28",
    items: {
      ko: ["효과 다듬기 3: 적·보스 — 적 탄(화살·창·거대 구슬·바위·검기·불덩이·빛 구슬·그물·씨앗·영혼)에 빛과 꼬리, 보스 베기·찌르기·덩굴·검기·받아 넘김·그림자 대검·바늘·대낫·불기둥·메테오·빛기둥을 새로 그림 · 위험 표시가 안쪽부터 차오르고 터지기 직전 번쩍임"],
      en: ["Effects polish 3: enemies and bosses — enemy shots (arrows, spears, giant orbs, rocks, sword waves, fireballs, light orbs, nets, seeds, souls) glow with trails; boss slashes, stabs, vines, blade waves, parries, shadow greatswords, spikes, scythes, fire pillars, meteors and light pillars redrawn · warning zones fill from the inside and flash right before they go off"],
      ja: ["エフェクト調整3: 敵・ボス — 敵弾(矢・槍・巨大な玉・岩・剣気・火の玉・光の玉・網・種・魂)に光と尾、ボスの斬撃・突き・蔓・剣気・受け流し・影の大剣・針・大鎌・火柱・メテオ・光の柱を描き直し · 危険表示が内側から満ち、発動直前に光る"],
    },
  },
  {
    version: "0.48.203",
    date: "2026-10-28",
    items: {
      ko: ["효과 다듬기 2: 공용 효과 — 휘두르기가 빛 초승달로 쓸고 지나감, 맞으면 섬광·빛살·불똥, 마법 폭발은 충격파·별빛, 그 밖의 터짐은 빛 고리 · 기본 탄은 빛나는 구슬과 꼬리 (적 탄은 어두운 테두리로 잘 보이게)"],
      en: ["Effects polish 2: shared effects — swings sweep as glowing crescents, hits flash with rays and sparks, magic blasts send shockwaves and starlight, other bursts glow as rings · default shots are glowing orbs with trails (enemy shots get a dark rim to stand out)"],
      ja: ["エフェクト調整2: 共通エフェクト — 振りは光る三日月で薙ぐ、ヒットで閃光・光条・火花、魔法の爆発は衝撃波と星の光、その他の爆発は光の輪 · 基本弾は光る玉と尾 (敵弾は暗い縁で見やすく)"],
    },
  },
  {
    version: "0.48.202",
    date: "2026-10-28",
    items: {
      ko: ["효과 다듬기 1: 이벤트 상점 테마 효과·범 풍류·여름 파도 — 맞힐 때 섬광·빛 베기, 처치 때 큰 빛, 대기 때 발밑 문양이 돌고 조각이 내 둘레를 돎, 걸음 자국이 은은히 빛남, 탄 꼬리가 빛줄기로 · 피해 숫자가 튀어나오며 좌우로 비껴 뜨고 큰 피해는 금빛, 테마 데미지 스킨은 빛 번짐"],
      en: ["Effects polish 1: event shop theme effects, Tiger and Summer — flashes and light slashes on hit, big bursts on kills, a spinning sigil and orbiting bits while idle, softly glowing footprints, light-streak shot trails · damage numbers pop out and drift sideways, big hits turn gold, theme damage skins glow"],
      ja: ["エフェクト調整1: イベントショップのテーマ効果・虎・夏 — ヒット時の閃光と光の斬撃、撃破時の大きな光、待機時に足元の紋様が回り周りを欠片が回る、足跡がほのかに光る、弾の尾が光の筋に · ダメージ数字が弾けて左右にずれ、大ダメージは金色、テーマのダメージスキンは光がにじむ"],
    },
  },
  {
    version: "0.48.201",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 전용 패시브: 대부분의 캐릭터 패시브를 대결에 맞게 바꿈 (예: 파수꾼 수호 보호막 · 장수 기세 기절 · 사멸 5번째 3배 · 역병의사 회복 감소 · 악의 사도 오라 · 변희·이드라 스킬 순환 버프) · 스킬 보기 패시브 칸에 설명",
        "패왕전 밸런스: 역할 상성(전사 > 암살자·마법사, 원딜 > 전사, 암살자·마법사·원딜은 서로 비슷)에 맞게 AI 대결을 많이 돌려 캐릭터 받는 피해·역할 상성 수치를 다시 맞춤",
      ],
      en: [
        "Champion Clash passives: most character passives reworked for duels (e.g. Warden guardian shield · General momentum stun · Samyeol 3x every 5th hit · Plague Doctor healing cut · Apostle aura · Byeonhui/Idra skill-cycle buffs) · shown in the passive slot",
        "Champion Clash balance: retuned damage taken per character and role matchup values from many AI duels toward the role matchups (Warrior > Assassin/Mage, Marksman > Warrior, Assassin/Mage/Marksman close to even)",
      ],
      ja: [
        "覇王戦専用パッシブ: ほとんどのキャラのパッシブを対戦向けに変更 (例: 守護者のシールド · 将軍の気勢気絶 · 四滅の5回目3倍 · 疫病医の回復減少 · 悪の使徒のオーラ · 変姫・イドラのスキル循環バフ) · パッシブ欄に説明",
        "覇王戦バランス: 役割相性(戦士 > 暗殺者・魔法使い、遠距離 > 戦士、暗殺者・魔法使い・遠距離はほぼ互角)に合わせ、AI対戦を多数回してキャラの被ダメと相性数値を再調整",
      ],
    },
  },
];
