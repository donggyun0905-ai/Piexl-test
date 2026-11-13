import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.70",
    date: "2026-11-13",
    items: {
      ko: [
        "새 캐릭터 존 (아슈바르의 노랑, 로비 칩 45만): 금빛 손아귀 하나 · 패시브 없음 · 공격력은 매우 낮지만 타수가 아주 많음 · 적응력(흑 게이지·레벨업·강화·승격)과 제약은 느아르와 같음",
        "존 황금 번개: 모든 공격이 번개(감전) 피해 · 번개가 맞을 때마다 같은 적에게 추가 타격 3번 (100% · 70% · 30%)",
        "존 공격: 황뢰 할퀴기 · 벽력일섬 · 뇌광 연속격 · 황금 번개 주먹 · 추가 공격 지그재그 뇌격 · 황뢰 낙하 · 번개 분신 · 뇌전 구속 · 스킬 황금 뇌구/광란의 천뢰 · 혼돈의 낙뢰/초월 벽력일섬 · 뇌신의 손아귀/황뢰 천수 · 궁극기 천둥의 발자취/종언의 황천뢰",
      ],
      en: [
        "New character Jaune (Ashvar's Yellow, 450,000 lobby chips): one Golden Grip · no passives · very low damage but a huge number of hits · Adaptation (Black gauge, level-ups, upgrades, promotion) and restriction work like Noir's",
        "Jaune's Golden Lightning: every attack deals Lightning (Shock) damage · each Lightning hit is followed by 3 extra strikes on the same foe (100% · 70% · 30%)",
        "Jaune's attacks: Golden Thunder Claw · Thunderclap Flash · Lightning Flurry · Golden Lightning Fist · extra attacks Zigzag Bolt · Golden Thunderfall · Lightning Doppelgangers · Thunder Bind · skills Golden Thunder Orb/Frenzied Heaven Thunder · Chaos Thunderfall/Transcendent Thunderclap Flash · Grasp of the Thunder God/Thousand Golden Thunder Hands · ultimate Footsteps of Thunder/Golden Heaven Thunder of the End",
      ],
      ja: [
        "新キャラクター ジョーヌ（アシュヴァルの黄、ロビーチップ45万）：金色の掌握ひとつ・パッシブなし・攻撃力はとても低いがヒット数が非常に多い・適応力（黒ゲージ・レベルアップ・強化・昇格）と制約はノワールと同じ",
        "ジョーヌの黄金の雷：すべての攻撃が雷（感電）ダメージ・雷が当たるたびに同じ敵へ追加打撃3回（100%・70%・30%）",
        "ジョーヌの攻撃：黄雷の引っ掻き・霹靂一閃・雷光連続撃・黄金雷拳・追加攻撃 ジグザグ雷撃・黄雷落下・雷の分身・雷電拘束・スキル 黄金雷球/狂乱の天雷・混沌の落雷/超越霹靂一閃・雷神の掌握/黄雷千手・必殺技 雷鳴の足跡/終焉の黄天雷",
      ],
    },
  },
  {
    version: "0.52.69",
    date: "2026-11-13",
    items: {
      ko: ["연습장·로그 던전 등에서 나가면 화면이 검은색으로 멈추던 것 고침 (메뉴 소리를 불러오는 순서 문제)", "루주: 혈장미 고정 피해가 가디언 방패를 무시하던 것 고침 (한 칸씩 깨지고 다 깨져야 피해)"],
      en: ["Fixed the screen freezing black when leaving Practice, the log dungeon and other modes (menu sound loading order)", "Rouge: Blood Rose fixed damage no longer ignores Guardian shields (each touch breaks one layer)"],
      ja: ["練習場・ログダンジョンなどから出ると画面が黒いまま止まっていたのを修正（メニュー音の読み込み順の問題）", "ルージュ：血薔薇の固定ダメージがガーディアンの盾を無視していたのを修正（1枚ずつ割れ、全部割れてからダメージ）"],
    },
  },
  {
    version: "0.52.68",
    date: "2026-11-13",
    items: {
      ko: ["블뢰: 빙결 피해가 가디언 방패를 무시하던 것 고침 (맞을 때마다 한 칸씩 깨지고 다 깨져야 피해) · 결과 창 피해 출처를 '서리' 하나가 아니라 기본 공격·추가 공격·스킬마다 나눠 보여 줌"],
      en: ["Bleu: Freeze damage no longer ignores Guardian shields (each hit breaks one layer; damage only after all break) · the result screen now splits damage sources by basic attack, extra attack and skill instead of a single 'Frost'"],
      ja: ["ブルー：凍結ダメージがガーディアンの盾を無視していたのを修正（当たるたびに1枚ずつ割れ、全部割れてからダメージ）・結果画面のダメージ出所を「霜」ひとつではなく基本攻撃・追加攻撃・スキルごとに分けて表示"],
    },
  },
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
