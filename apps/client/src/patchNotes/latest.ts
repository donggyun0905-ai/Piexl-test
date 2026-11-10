import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.0",
    date: "2026-11-10",
    items: {
      ko: [
        "레이드 장신구: 레이드 창의 '장비창'에서 반지 3·목걸이·귀걸이·브로치를 낌 (점선 칸마다 끼는 종류 표시 · 같은 장신구는 하나만) · 레이드에서만 효과",
        "장신구 45개: 세트 10개(제국의 보물·영광의 달빛·어둠의 인장·승리의 축복·불굴의 의지·자유의 날개·악마의 서약·응축된 대자연·예리한 달빛·꽃의 화답) × 반지·목걸이·귀걸이·브로치 + 전설 5개(창공의 약속·혼돈의 결정체, 장착한 세트 중 골라 그 세트로 셈) · 같은 세트 2·3·4개 세트 효과",
        "레이드 보상: 루시퍼를 쓰러뜨리고 보상 상자를 열면 카드 10장 (눌러서 한 장씩 뒤집기 · 1성 63%·2성 32%·3성 5% · 아주 드물게 5성 전설)",
        "승급(3성→4성: 같은 종류 3성 4개 · 4성→5성: 같은 장신구 4성 3개) · 강화(5성만, 로비 칩 1만·5만·10만부터 5만씩 · 확률 100·85·70·55·40·25·20% · 실패하면 한 단계 내려감 · 최대 10강) · 재설정(추가 능력치 3줄 모두 다시, 1만 칩)",
        "레이드: 2페이즈 바닥이 꺼질 때 쓰러져 다시 살아나길 기다리던 사람(나·AI)도 끝나 버려 관전 대신 바로 결과 창이 뜨던 문제 고침 (살아나면 날개를 달고 나옴)",
        "레이드: 내 위치 표시(초록 삼각형·발밑 원)를 절반 크기로 · 숨는 돌기둥을 새 석조 기둥 그림으로",
      ],
      en: [
        "Raid accessories: equip 3 rings, a necklace, earrings and a brooch from 'Gear' in the raid menu (each dashed slot shows its type · only one of the same accessory) · raid only",
        "45 accessories: 10 sets (Imperial Treasure, Glorious Moonlight, Seal of Darkness, Blessing of Victory, Indomitable Will, Wings of Freedom, Demon's Oath, Condensed Nature, Keen Moonlight, Flower's Reply) × ring / necklace / earrings / brooch + 5 legendaries (Promise of the Sky, Crystal of Chaos — count as any equipped set you choose) · 2/3/4-piece set bonuses",
        "Raid rewards: defeat Lucifer and open the reward chest for 10 cards (tap to flip one by one · 1★ 63% · 2★ 32% · 3★ 5% · very rarely a 5★ legendary)",
        "Promote (3★→4★: four 3★ of the same type · 4★→5★: three 4★ of the same accessory) · Enhance (5★ only, lobby chips 10k, 50k, 100k then +50k · 100/85/70/55/40/25/20% · failure drops a level · max +10) · Reroll (all 3 bonus lines, 10k chips)",
        "Raid: fixed players (you or AI) who were down waiting to respawn when the phase-2 floor collapsed being knocked out for good, so the result window showed instead of spectating (they now respawn with wings)",
        "Raid: your position marker (green triangle and ring) is half the size · hiding stone columns use the new stone pillar art",
      ],
      ja: [
        "レイドアクセサリー: レイド画面の「装備」で指輪3・ネックレス・イヤリング・ブローチを装備（点線の枠ごとに種類を表示 · 同じアクセサリーは1つだけ）· レイドのみ効果",
        "アクセサリー45種: セット10種（帝国の秘宝・栄光の月光・闇の刻印・勝利の祝福・不屈の意志・自由の翼・悪魔の誓約・凝縮された大自然・鋭き月光・花の返歌）× 指輪・ネックレス・イヤリング・ブローチ + 伝説5種（蒼穹の約束・混沌の結晶、装備中のセットから選んで数える）· 同じセット2・3・4個でセット効果",
        "レイド報酬: ルシファーを倒して報酬箱を開けるとカード10枚（タップで1枚ずつめくる · 1★63%・2★32%・3★5% · ごくまれに5★伝説）",
        "昇級（3★→4★: 同じ種類の3★を4つ · 4★→5★: 同じアクセサリーの4★を3つ）· 強化（5★のみ、ロビーチップ1万・5万・10万から5万ずつ · 確率100・85・70・55・40・25・20% · 失敗で1段階下がる · 最大+10）· 再設定（追加能力3行をすべて、1万チップ）",
        "レイド: フェーズ2の床が崩れる時、倒れて復活待ちだった人（自分・AI）まで脱落し、観戦の代わりにすぐ結果画面が出ていた問題を修正（復活すると翼をつけて出る）",
        "レイド: 自分の位置表示（緑の三角・足元の円）を半分の大きさに · 隠れる石柱を新しい石柱の絵に",
      ],
    },
  },
  {
    version: "0.51.6",
    date: "2026-11-10",
    items: {
      ko: [
        "레이드: 기절·공포·느려짐을 거는 캐릭터가 있으면 루시퍼가 계속 묶여 공격도 변신(2페이즈)도 하지 않던 문제 고침 (루시퍼는 이제 묶이지 않음)",
        "레이드: '적 최대 체력의 %' 피해(출혈·역병·이무기 독·악의 사도 가면 등)는 레이드 적에게 던전 라스트 보스 체력(9,600)까지만 셈 — 혼자 루시퍼 체력을 다 깎던 문제 고침",
        "레이드: 캐릭터마다 레이드 피해 배율 (AI 레이드 측정으로 너무 센 캐릭터는 내리고 약한 지원 캐릭터는 조금 올림, 관리자에서 조정 가능)",
        "레이드 AI 동료: 루시퍼 몸에 닿지 않게 사거리 안쪽에 섬 · 원·부채꼴·선·X자 위험 표시를 피함 · 큰 불기둥은 일찍 대시 · 검기 빈칸으로 대시 · 다가오는 루시퍼·검·불길에서 물러남",
        "패왕전: 전체 72명 AI 1대1 리그전(2,556대결)을 두 번 돌려 모든 캐릭터 공격력·받는 피해를 다시 맞춤 (승률 15~83% → 42~65%)",
      ],
      en: [
        "Raid: fixed Lucifer being locked by stun / fear / slow from some characters, so he never attacked or transformed into phase 2 (Lucifer can no longer be locked)",
        "Raid: '% of max HP' damage (bleed, plague, Imugi venom, Apostle mask, etc.) now counts raid enemies' HP only up to the dungeon last boss (9,600) — no more one character melting Lucifer alone",
        "Raid: per-character raid damage multipliers (from AI raid runs: the strongest are lowered, weak supports raised a little; tunable in admin)",
        "Raid AI allies: stay inside range without touching Lucifer · dodge circle / cone / line / X warnings · dash early out of the big fire pillars · dash to sword-slash safe spots · back off approaching Lucifer / swords / flames",
        "Paewang: re-tuned every character's damage and damage taken from two full AI 1v1 round-robins of all 72 characters (2,556 matchups) (win rates 15–83% → 42–65%)",
      ],
      ja: [
        "レイド: スタン・恐怖・鈍足をかけるキャラがいるとルシファーがずっと止まり、攻撃も変身(フェーズ2)もしなかった問題を修正 (ルシファーは止まらなくなった)",
        "レイド: 「敵の最大体力の%」ダメージ (出血・疫病・イムギの毒・悪の使徒の仮面など) はレイドの敵にはダンジョンのラストボス体力(9,600)までで計算 — 1人でルシファーを削り切っていた問題を修正",
        "レイド: キャラごとのレイドダメージ倍率 (AIレイド測定で強すぎるキャラは下げ、弱いサポートは少し上げ、管理者で調整可能)",
        "レイドAIの仲間: ルシファーの体に触れないよう射程の内側に立つ · 円・扇形・線・X字の危険表示を避ける · 大きな火柱は早めにダッシュ · 剣気の空き地へダッシュ · 近づくルシファー・剣・炎から離れる",
        "覇王戦: 全72キャラのAI 1対1総当たり(2,556対戦)を2回回し、全キャラの攻撃力・被ダメージを再調整 (勝率 15〜83% → 42〜65%)",
      ],
    },
  },
];
