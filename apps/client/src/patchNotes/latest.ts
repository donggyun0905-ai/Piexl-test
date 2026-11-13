import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.67",
    date: "2026-11-13",
    items: {
      ko: ["블뢰: 효과 그림이 칸마다 뚝뚝 끊기지 않고 부드럽게 넘어가고, 짧으면 마지막 그림에서 잠시 머묾 · 스킬 1~3번(강화판 포함) 범위·이펙트 크기 절반 (궁극기는 그대로)"],
      en: ["Bleu: effect frames now blend smoothly instead of snapping, holding on the last frame · skills 1–3 (and empowered versions) have half the range and effect size (ultimate unchanged)"],
      ja: ["ブルー：エフェクトのコマがカクカクせず滑らかにつながり、最後のコマで少し止まる・スキル1〜3（強化版も）の範囲・エフェクトの大きさが半分（必殺技はそのまま）"],
    },
  },
  {
    version: "0.52.66",
    date: "2026-11-13",
    items: {
      ko: [
        "새 캐릭터 블뢰 (아슈바르의 파랑, 로비 칩 45만): 하얀 마도서 하나 · 패시브 없음 · 적응력(흑 게이지·레벨업·강화·승격)과 제약은 느아르와 같음",
        "블뢰 얼음마녀: 서리·빙결 피해 1.5배 · 빙결은 적을 잠깐 얼림(보스 빼고) · 공격할 때 확률로 방 아무 곳에 눈결정 → 닿은 적은 느려짐",
        "블뢰 공격: 서리 결정탄 · 빙결의 파동 · 빙정 폭발 · 영구빙벽(2~4단계는 공격 범위 안 마우스 자리) · 추가 공격 월광의 영혼 늑대·매·사슴(보호막 15)·군단 · 스킬 빙시계의 태엽/영원의 설원 · 절대 영도/월광 백랑의 포효 · 시간 동결(얼음 시계)/영겁의 시간감옥 · 빙창의 폭우/종언의 영구동토(얼음 시계가 끝나면 눈결정 수만큼)",
      ],
      en: [
        "New character Bleu (the Blue of Ashvar, 450,000 lobby chips): one White Grimoire · no passives · Adaptation (Black gauge, level-ups, upgrades, promotion) and the restriction work like Noir's",
        "Bleu's Ice Witch: Frost and Freeze damage ×1.5 · Freeze briefly freezes foes (not bosses) · attacks sometimes form snowflakes anywhere in the room → foes touching them are slowed",
        "Bleu attacks: Frost Crystal Shot · Freezing Wave · Ice Crystal Burst · Eternal Ice Wall (stages 2–4 land at the cursor within range) · extra attacks Moonlit Spirit Wolf, Hawk, Stag (15 shield) and Legion · skills Frost Clock Spring/Eternal Snowfield · Absolute Zero/Roar of the Moonlit White Wolf · Time Freeze (ice clock)/Prison of Eternal Time · Ice Lance Downpour/Permafrost of the End (one hit per snowflake when the clock ends)",
      ],
      ja: [
        "新キャラ ブルー（アシュヴァルの青、ロビーチップ45万）：白の魔導書ひとつ・パッシブなし・適応力（黒ゲージ・レベルアップ・強化・昇格）と制約はノワールと同じ",
        "ブルーの氷の魔女：霜・凍結ダメージ1.5倍・凍結は敵を少しの間凍らせる（ボス以外）・攻撃時に確率で部屋のどこかに雪の結晶 → 触れた敵は遅くなる",
        "ブルーの攻撃：霜結晶弾・氷結の波動・氷晶爆発・永久氷壁（2〜4段階は攻撃範囲内のマウス位置）・追加攻撃 月光の霊狼・霊鷹・霊鹿（シールド15）・霊軍団・スキル 氷時計のゼンマイ/永遠の雪原・絶対零度/月光白狼の咆哮・時間凍結（氷時計）/永劫の時間牢獄・氷槍の豪雨/終焉の永久凍土（氷時計が終わると雪の結晶の数だけ）",
      ],
    },
  },
];
