import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.107",
    date: "2026-11-14",
    items: {
      ko: ["스토리 8장 컷 5 다시 그림: 배경을 지하 통로로"],
      en: ["Redrew Story Chapter 8 cut 5: the background is now the underground tunnel"],
      ja: ["ストーリー第8章カット5を描き直し：背景を地下通路に"],
    },
  },
  {
    version: "0.52.106",
    date: "2026-11-14",
    items: {
      ko: ["스토리 8장 「심연」 컷 1~7 일러스트 추가 (성화의 대성당 · 지하 통로의 이클립스 · 학살자의 난입 · 광장 아래 열리는 심연)"],
      en: ["Added illustrations for Story Chapter 8 \"The Abyss\" cuts 1–7 (the Cathedral of the Sacred Flame, Eclipse in the underground tunnel, the Slayer's arrival, the abyss opening beneath the plaza)"],
      ja: ["ストーリー第8章「深淵」カット1〜7のイラストを追加（聖火の大聖堂・地下通路のエクリプス・虐殺者の乱入・広場の下に開く深淵）"],
    },
  },
  {
    version: "0.52.105",
    date: "2026-11-14",
    items: {
      ko: ["스토리 7장 컷 6~8 다시 그림: 천의 사도를 악의 사도와 같은 모습(은발·꽃 두건·십자가 지팡이)에 흰·금 사제복으로"],
      en: ["Redrew Story Chapter 7 cuts 6–8: the Apostle of Heaven now matches the Apostle of Malice (silver hair, flowered hood, cross staff) in white and gold robes"],
      ja: ["ストーリー第7章カット6〜8を描き直し：天の使徒を悪の使徒と同じ姿（銀髪・花のフード・十字架の杖）に白と金の法衣で"],
    },
  },
  {
    version: "0.52.104",
    date: "2026-11-14",
    items: {
      ko: [
        "스토리 7장 「시작」 컷 1~8 일러스트 추가 (지하 감옥의 악마 · 새벽의 성흔 · 황금 결계와 천의 사도)",
      ],
      en: [
        "Added illustrations for Story Chapter 7 \"Beginning\" cuts 1–8 (the demon in the underground prison, the Dawn Stigmata, the golden barrier and the Apostle of Heaven)",
      ],
      ja: [
        "ストーリー第7章「始まり」カット1〜8のイラストを追加（地下牢の悪魔・暁の聖痕・黄金の結界と天の使徒）",
      ],
    },
  },
  {
    version: "0.52.103",
    date: "2026-11-14",
    items: {
      ko: [
        "스토리 6장 「황혼의 종언」 컷 1~12 일러스트 추가 (사막의 결전 · 태초의 빛과 어둠 · 파멸의 용 · 대성의 마지막 버팀)",
      ],
      en: [
        "Added illustrations for Story Chapter 6 \"End of Twilight\" cuts 1–12 (the desert showdown, the Primeval Light and Darkness, the Dragon of Ruin, the Great Sage's last stand)",
      ],
      ja: [
        "ストーリー第6章「黄昏の終焉」カット1〜12のイラストを追加（砂漠の決戦・始原の光と闇・破滅の竜・大聖の最後の踏ん張り）",
      ],
    },
  },
  {
    version: "0.52.102",
    date: "2026-11-14",
    items: {
      ko: [
        "패왕전 밸런스 조정 (5대5·쟁탈전 AI 대결 1,500여 판의 딜량·받은 피해·승률 기준, 공격력과 받는 피해를 함께 조정)",
        "약하게: 오닉스·마젠타·유리엘 크게, 라파엘·매드퀸·악의 사도·아리아·베르·인형술사·실버불렛·블뢰 등 31명",
        "강하게: 래빗·아수라·백인장·라이더·풋내기·펑크·묵인·혼령·시저스·격투가 크게, 그 밖 28명",
        "패왕전에서 아슈바르 진영 캐릭터가 있을 때 바닥 아이템이 떨어지는 순간 게임이 멈출 수 있던 문제 고침",
      ],
      en: [
        "Champion Clash balance pass (based on damage dealt, damage taken and win rate across ~1,500 AI 5v5 and Contest matches; attack and damage taken adjusted together)",
        "Weaker: Onyx, Magenta and Yuriel significantly; Rafael, Mad Queen, Apostle of Malice, Aria, Vert, Puppeteer, Silver Bullet, Bleu and others (31 total)",
        "Stronger: Rabbit, Asura, Baekinjang, Rider, Novice, Punk, Mukin, Honryeong, Scissors and Brawler significantly, plus 28 others",
        "Fixed a Champion Clash freeze that could happen when an item dropped while an Ashvar character was in the match",
      ],
      ja: [
        "覇王戦バランス調整（5対5・争奪戦のAI対戦約1,500試合の与ダメージ・被ダメージ・勝率をもとに、攻撃力と被ダメージを合わせて調整）",
        "弱体化：オニキス・マゼンタ・ユリエルを大きく、ラファエル・マッドクイーン・悪の使徒・アリア・ヴェール・人形使い・シルバーバレット・ブルーなど計31人",
        "強化：ラビット・阿修羅・百人長・ライダー・見習い・パンク・黙忍・魂霊・シザーズ・格闘家を大きく、ほか28人",
        "覇王戦でアシュヴァル陣営のキャラがいるとき、床にアイテムが落ちる瞬間にゲームが止まることがあった問題を修正",
      ],
    },
  },
];
