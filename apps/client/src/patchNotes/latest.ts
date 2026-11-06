import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.68",
    date: "2026-11-07",
    items: {
      ko: [
        "세레나 환혹의 무도: 사슬 비수 여섯이 발밑 꽃의 테두리 모양대로 돎 (반경은 그대로 넓게, 꽃잎 끝에서 멀고 꽃잎 사이에서 안쪽으로)",
        "세레나 환혹의 스텝: 세 번 연달아 돌진 (한 번 55%) · 돌진마다 몸 둘레를 사슬이 기울어진 고리로 휘돎 (1번 / 연한 회색 · 2번 - 연한 노랑 · 3번 \\ 연한 분홍, 40%) · 대기 8 → 10초",
        "세레나 매혹 이펙트 다듬기: 크게 퍼지는 하트 테두리 · 소용돌이치는 장미 꽃잎 · 떠오르는 하트 · 매혹된 적과 이어진 분홍 사슬",
      ],
      en: [
        "Serena's Dance of Bewitchment: the six chain daggers now trace the outline of the flower at her feet (same wide radius — far at the petal tips, inward between petals)",
        "Serena's Bewitching Step: three dashes in a row (55% each) · each dash whirls a chain around her on a tilted ring (1st / pale gray · 2nd - pale yellow · 3rd \\ pale pink, 40%) · cooldown 8 → 10s",
        "Serena's Allure effect polished: a big expanding heart outline · swirling rose petals · rising hearts · pink chains linking her to charmed foes",
      ],
      ja: [
        "セレナの幻惑の舞：6本の鎖の短剣が足元の花の縁の形に沿って回る（半径はそのまま広く、花びらの先で遠く花びらの間で内側へ）",
        "セレナの幻惑のステップ：3回続けて突進（1回55%）· 突進ごとに体の周りを鎖が傾いた輪で回る（1回目 / 淡い灰色 · 2回目 - 淡い黄色 · 3回目 \\ 淡いピンク、40%）· 待機 8 → 10秒",
        "セレナの魅惑のエフェクトを調整：大きく広がるハートの縁 · 渦巻くバラの花びら · 浮かぶハート · 魅了した敵とつながるピンクの鎖",
      ],
    },
  },
  {
    version: "0.49.67",
    date: "2026-11-07",
    items: {
      ko: [
        "세레나 기본 사슬 채찍: 몸과 이어지지 않고 비수가 화살처럼 둘레를 자유롭게 날아다니며 뒤로 사슬이 따라옴 · 사슬이 가운데가 뚫린 고리가 이어진 진짜 사슬 모양 (가시 없앰)",
        "세레나 환혹의 회오리: 기울어진 세 회전 고리 (/ \\ -)를 따라 비수 사슬이 휘돎",
        "세레나 환혹의 무도: 발밑에 꽃이 피어 무희처럼 돌고, 아주 작은 분홍 눈가루가 흩날림",
        "세레나 2번 스킬 가시 정원 → 매혹: 둘레 적을 홀려 2초 동안 멈춘 채 나에게 천천히 끌려옴 (보스는 느려지기만) · 받는 피해 +25% · 가시 +2 · 아이템 가시덤불 → 매혹의 향수 (매혹 반지름·시간 증가)",
      ],
      en: [
        "Serena's base chain whips: no longer tied to her body — the daggers fly freely around her like arrows with the chain trailing behind · the chain now looks like a real chain of hollow links (thorns removed)",
        "Serena's Bewitching Whirl: dagger chains sweep along three tilted spinning rings (/ \\ -)",
        "Serena's Dance of Bewitchment: a flower blooms at her feet and turns like a dancer, with tiny pink snow-like sparkles drifting around",
        "Serena's skill 2 Thorn Garden → Allure: bewitches nearby foes, who stand entranced for 2s and are slowly drawn to her (bosses are only slowed) · +25% damage taken · +2 thorns · item Briar Patch → Alluring Perfume (bigger, longer Allure)",
      ],
      ja: [
        "セレナの基本の鎖鞭：体とつながらず、短剣が矢のように周りを自由に飛び回り後ろに鎖がついてくる · 鎖は中が空いた輪がつながる本物の鎖の形に（棘をなくした）",
        "セレナの幻惑の旋風：傾いた3つの回転の輪（/ \\ -）に沿って短剣の鎖が回る",
        "セレナの幻惑の舞：足元に花が咲いて舞姫のように回り、ごく小さなピンクの粉雪が舞う",
        "セレナのスキル2 棘の庭 → 魅惑：周りの敵を魅了し、2秒間立ち止まったまま自分へゆっくり引き寄せる（ボスは遅くなるだけ）· 受けるダメージ+25% · 棘+2 · アイテム 茨の茂み → 魅惑の香水（魅惑の半径・時間アップ）",
      ],
    },
  },
  {
    version: "0.49.66",
    date: "2026-11-07",
    items: {
      ko: ["가브리엘: 공격 속도가 느려도 누르고 있으면 3타 대지 강타까지 이어짐 (전엔 1타로 계속 돌아감) · 세레나도 같게"],
      en: ["Gabriel: holding attack now carries through to the 3rd-hit Earth Slam even at low attack speed (it kept resetting to the 1st hit) · same for Serena"],
      ja: ["ガブリエル：攻撃速度が遅くても押し続ければ3撃目の大地強打までつながる（以前は1撃目に戻り続けた）· セレナも同様"],
    },
  },
  {
    version: "0.49.65",
    date: "2026-11-07",
    items: {
      ko: [
        "성국 새 캐릭터 세레나 '환혹의 무희' (스킬형): 비수 달린 사슬 채찍 둘이 늘 몸 둘레를 크게 돌며 적 사이를 휘저음 (35%) · 기본 치명타 25% · 맞힐 때마다 빛 피해 추가 · 해금: 이동 속도 1.8 달성",
        "세레나 3연격: 채찍 휘두르기 둘 → 환혹의 회오리 (여러 사슬 채찍이 둘레를 세 번 연달아 휘저음) · 맞힌 적에 가시 (가득 차면 마비: 느려짐·받는 피해 +15%)",
        "세레나 숫자 키 스킬 넷: 1 환혹의 스텝 (무적 회전 미끄러짐) · 2 가시 정원 (빛의 강철 가시 장판 일곱) · 3 맹독 비수 (부채꼴 비수·독) · 4 환혹의 무도 (8초 동안 사슬 채찍 여섯·피해 2배)",
        "세레나 무기 1 (강철 가시 채찍 & 맹독성 에테르 비수) · 전용 아이템 20 · 그림 시트 · 사슬 채찍·회오리 이펙트 · 패왕전 스킬",
      ],
      en: [
        "New Holy Kingdom character Serena 'The Bewitching Dancer' (skill-based): two dagger-tipped chain whips always circle wide around her, lashing between foes (35%) · 25% base crit · bonus light damage on every hit · unlock: reach 1.8 move speed",
        "Serena's 3-hit chain: two whip lashes → Bewitching Whirl (many chain whips sweep around her three times in a row) · hits plant thorns (a full set Numbs: slowed, +15% damage taken)",
        "Serena's four number-key skills: 1 Bewitching Step (invulnerable spinning glide) · 2 Thorn Garden (seven fields of steel-and-light thorns) · 3 Venom Daggers (dagger cone, poison) · 4 Dance of Bewitchment (six chain whips, 2x damage for 8s)",
        "Serena: 1 weapon (Steel Thorn Whip & Venom Ether Daggers) · 20 exclusive items · sprite sheet · chain whip and whirl effects · Paewang skills",
      ],
      ja: [
        "聖国の新キャラクター、セレナ「幻惑の舞姫」（スキル型）：短剣付きの鎖鞭2本がいつも体の周りを大きく回り敵の間を薙ぐ（35%）· 基本会心25% · 当てるたびに光ダメージ追加 · 解放：移動速度1.8達成",
        "セレナの3連撃：鞭の振り2回 → 幻惑の旋風（多くの鎖鞭が周りを3回続けて薙ぐ）· 当てた敵に棘（満タンで麻痺：遅くなる・受けるダメージ+15%）",
        "セレナの数字キーのスキル4つ：1 幻惑のステップ（無敵の回転スライド）· 2 棘の庭（光の鋼の棘の床7つ）· 3 猛毒の短剣（扇形の短剣・毒）· 4 幻惑の舞（8秒間鎖鞭6本・ダメージ2倍）",
        "セレナ：武器1（鋼の棘の鞭＆猛毒のエーテル短剣）· 専用アイテム20 · スプライトシート · 鎖鞭・旋風のエフェクト · 覇王戦スキル",
      ],
    },
  },
];
