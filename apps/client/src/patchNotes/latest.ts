import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.10",
    date: "2026-11-07",
    items: {
      ko: [
        "새벽의 성흔 새 캐릭터 네일러 '못 박는 심판관' (스킬형): 눈을 붕대로 가린 채 거대한 못과 망치로 악마를 대지에 고정하는 사냥꾼 · 체력 120 · 공격력 15 · 해금: 최대 체력 220 달성",
        "기본 공격: 망치 내려치기 · 박힌 못은 적 체력 줄 위에 못 ×개수 (한도 없음) · 맞힐수록 성흔이 차고 가득 차면 달빛 각성 (피해 1.3배)",
        "1 못 던지기: 세 번까지 눌러 점점 빠른 못 (3번째는 셋 연달아) → 0.8초 대기 · 2 붉은 실: 바닥에 못을 박고 적에게 무적 돌진해 못 다섯·고정 → 한 번 더 누르면 망치 원(출혈) 뒤 실을 따라 돌아감",
        "3 저주의 도화선: 못이 박힌 모든 적에게 붉은 도화선 → 못 하나마다 공격력 33%를 한 번에 · 4 심판의 못비: 제자리에서 한 적에게 나와 양옆에서 못 셋씩 10번 (표적이 죽으면 끝)",
        "전용 아이템 20 · 효과음·이펙트·그림 시트·패왕전 스킬",
      ],
      en: [
        "New Dawn Stigmata character Nailer 'The Nailing Judge' (skill-based): a hunter with bandaged eyes who pins demons to the earth with giant nails and a hammer · HP 120 · ATK 15 · unlock: reach 220 max HP",
        "Basic attack: hammer slam · stuck nails show above a foe's health bar as nail ×count (no limit) · hits fill your Stigma; when full you awaken in moonlight (1.3x damage)",
        "1 Nail Throw: press up to three times for faster nails (the 3rd throws three) → 0.8s cooldown · 2 Red Thread: drive a nail into the floor and dash invulnerably at a foe, pinning it with five nails → press again for a hammer ring (bleed), then fly back along the thread",
        "3 Cursed Fuse: red fuses run to every nailed foe → 33% attack per nail in one hit · 4 Nail Judgment: stand still while you and both flanks hammer three nails at a time into one foe, 10 times (ends if it dies)",
        "20 exclusive items · sounds, effects, sprite sheet and Paewang skills",
      ],
      ja: [
        "暁の聖痕の新キャラ ネイラー「釘打つ審判官」（スキル型）：目を包帯で覆い、巨大な釘と槌で悪魔を大地に縫い止める狩人 · 体力120 · 攻撃力15 · 解放：最大体力220達成",
        "通常攻撃：槌の叩きつけ · 刺さった釘は敵の体力バーの上に釘×数（上限なし）· 当てるほど聖痕が満ち、満ちると月光覚醒（ダメージ1.3倍）",
        "1 釘投げ：3回まで押すとだんだん速い釘（3回目は3本連続）→ 待機0.8秒 · 2 赤い糸：床に釘を打ち敵へ無敵突進して釘5本で固定 → もう一度押すと槌の円（出血）のあと糸をたどって戻る",
        "3 呪いの導火線：釘が刺さった全ての敵へ赤い導火線 → 釘1本ごとに攻撃力33%を一度に · 4 釘の審判：その場から1体の敵へ自分と左右から釘3本ずつ10回（標的が倒れると終了）",
        "専用アイテム20 · 効果音・エフェクト・スプライトシート・覇王戦スキル",
      ],
    },
  },
];
