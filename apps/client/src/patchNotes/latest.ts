import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.61",
    date: "2026-11-13",
    items: {
      ko: ["루주: 재생 가속이 잘못 붙어 있던 것을 뺌 (재생 가속은 느아르만)"],
      en: ["Rouge: removed the Regen Boost that was wrongly applied (Regen Boost is Noir only)"],
      ja: ["ルージュ：誤って付いていた再生加速を削除（再生加速はノワールのみ）"],
    },
  },
  {
    version: "0.52.60",
    date: "2026-11-13",
    items: {
      ko: ["느아르: 재생 가속을 절반으로 (재생력 회복 2.5배 → 1.25배)"],
      en: ["Noir: Regen Boost halved (regeneration 2.5× → 1.25×)"],
      ja: ["ノワール：再生加速を半分に（再生力の回復 2.5倍 → 1.25倍）"],
    },
  },
  {
    version: "0.52.59",
    date: "2026-11-13",
    items: {
      ko: [
        "아슈바르(느아르·루주): 성좌의 방에서 다음 방으로 못 나가던 문제 고침 · 단련의 방도 못 씀(레이드 단련 포인트도 없음)",
        "아슈바르 적응력: 레벨마다 흑 필요량 2배 · 승격은 실패해도 확률이 오르지 않음 · 레벨업·승격에서 방어력이 오르지 않음 · 사거리 증가가 공격 범위·이펙트 크기에 들어가지 않음",
        "느아르: 결계 붕괴 이펙트를 반으로 줄임",
      ],
      en: [
        "Ashvar (Noir · Rouge): fixed being stuck in the constellation room · training rooms can no longer be used either (no raid training points)",
        "Ashvar Adaptation: each level needs twice as much Black · promotion chance no longer rises on failure · level-ups and promotion no longer give defense · range bonuses no longer enlarge attacks or effects",
        "Noir: Barrier Collapse effect is half as big",
      ],
      ja: [
        "アシュヴァル（ノワール・ルージュ）：星座の部屋から次の部屋へ出られなかった問題を修正・鍛錬の部屋も使えない（レイドの鍛錬ポイントもなし）",
        "アシュヴァルの適応力：各レベルの黒の必要量が2倍・昇格は失敗しても確率が上がらない・レベルアップ・昇格で防御力が上がらない・射程増加が攻撃範囲・エフェクトの大きさに入らない",
        "ノワール：結界崩壊のエフェクトを半分に",
      ],
    },
  },
  {
    version: "0.52.58",
    date: "2026-11-13",
    items: {
      ko: [
        "새 캐릭터 루주 (아슈바르의 빨강, 로비 칩 45만): 장미쌍검 하나 · 패시브 없음 · 적응력(흑 게이지·레벨업·강화·승격)과 제약은 느아르와 같음",
        "루주 혈장미: 공격할 때 확률로 바닥에 작은 장미 → 닿은 적은 고정 피해 1 + 출혈 · 루주의 출혈은 2배 빠르고 5스택까지",
        "루주 공격: 적장미 쌍검격 · 혈염 난무 · 광란의 회전참 · 장미 가시 찌르기 · 추가 공격 혈화 개화 · 장미꽃잎 폭풍 · 선혈 가시숲 · 업화의 장미 · 스킬 혈영 돌진/혈화 만개 · 장미 낙인/광란의 혈검무 · 쌍검 혈월참/붉은 장미의 장례 · 진홍의 폭우/종언의 혈장미(방의 장미를 모아 터뜨림)",
      ],
      en: [
        "New character Rouge (the Red of Ashvar, 450,000 lobby chips): one pair of Twin Rose Blades · no passives · Adaptation (Black gauge, level-ups, upgrades, promotion) and the restriction work like Noir's",
        "Rouge's Blood Rose: attacks sometimes bloom small roses on the floor → foes touching them take 1 fixed damage + Bleed · Rouge's Bleed ticks twice as fast and stacks up to 5",
        "Rouge attacks: Crimson Rose Cross · Blood Flame Frenzy · Frenzied Spin Slash · Rose Thorn Thrust · extra attacks Blood Blossom · Rose Petal Storm · Crimson Thorn Forest · Hellfire Rose · skills Blood Shadow Rush/Full Blood Bloom · Rose Brand/Frenzied Blood Dance · Twin Blood Moon/Funeral of Red Roses · Crimson Downpour/Final Blood Rose (gathers every rose in the room)",
      ],
      ja: [
        "新キャラ ルージュ（アシュヴァルの赤、ロビーチップ45万）：薔薇の双剣ひとつ・パッシブなし・適応力（黒ゲージ・レベルアップ・強化・昇格）と制約はノワールと同じ",
        "ルージュの血薔薇：攻撃時に確率で床に小さな薔薇 → 触れた敵に固定ダメージ1＋出血・ルージュの出血は2倍速く、5スタックまで",
        "ルージュの攻撃：赤薔薇双剣撃・血炎乱舞・狂乱の回転斬・薔薇の棘突き・追加攻撃 血花開花・薔薇の花びらの嵐・鮮血の棘森・業火の薔薇・スキル 血影突進/血花満開・薔薇の烙印/狂乱の血剣舞・双剣血月斬/赤薔薇の葬礼・真紅の豪雨/終焉の血薔薇（部屋の薔薇を集めて弾けさせる）",
      ],
    },
  },
];
