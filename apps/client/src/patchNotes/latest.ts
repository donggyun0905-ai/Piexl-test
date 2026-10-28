import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.181",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 스킬 추가: 캐릭터 42명마다 평타 · 패시브(캐릭터 고유 능력) · 스킬 1~4 (4번은 궁극기)",
        "숫자 키 1~4를 누르면 조준 미리보기(범위·모양)가 뜨고 클릭하면 사용 · 설정에서 스킬마다 '바로 사용'과 키 바꾸기 · 모바일은 스킬 칸을 누르면 바라보는 쪽으로 바로 사용",
        "아래쪽 스킬 칸 넷: 남은 대기 시간 · 조준 중 빛남 · 침묵이면 잠김 · 올리면 설명",
        "스킬 효과: 기절(도는 별) · 둔화 · 속박 · 침묵 · 밀치기·끌어오기 · 지속 피해 · 버프 오라 · 소환(포탑·드론·고양이·해골·새끼 용·정령·인형)",
        "패왕전에서는 무기·패시브를 고르지 않음 (시작 무기로 싸우고, 사용 아이템은 경기장에서 주움) · 준비방은 스킬 보기로 바뀜",
        "AI도 스킬을 씀 · 스킬에 맞춰 받는 피해를 조정 (서로 피하지 않고 싸우면 약 10초 안에 끝남)",
      ],
      en: [
        "Champion Clash skills: every one of the 42 characters now has a basic attack, a passive (their own ability) and skills 1-4 (4 is the ultimate)",
        "Press 1-4 to show an aim preview (range and shape), then click to cast · Settings let you turn on quick cast per skill and rebind keys · On mobile, tapping a skill slot casts it toward where you face",
        "Four skill slots at the bottom: cooldown left · glow while aiming · locked when silenced · hover for details",
        "Skill effects: stun (spinning stars) · slow · root · silence · knockback and pull · damage over time · buff auras · summons (turret, drone, cat, skeleton, baby dragon, spirit, doll)",
        "No more weapon or passive picks in Champion Clash (fight with your starting weapon, pick up usable items in the arena) · the prep room now shows your skills",
        "AI uses skills too · damage taken retuned for skills (two players trading without dodging finish in about 10 seconds)",
      ],
      ja: [
        "覇王戦にスキル追加: キャラクター42人それぞれに通常攻撃 · パッシブ (固有能力) · スキル1~4 (4は奥義)",
        "数字キー1~4で照準プレビュー (範囲・形) が出てクリックで使用 · 設定でスキルごとの「すぐ使う」とキー変更 · モバイルはスキル枠をタップすると向いている方向へすぐ使用",
        "下のスキル枠4つ: 残りクールタイム · 照準中は光る · 沈黙中はロック · カーソルを合わせると説明",
        "スキル効果: 気絶 (回る星) · 鈍化 · 拘束 · 沈黙 · ノックバック・引き寄せ · 継続ダメージ · バフオーラ · 召喚 (砲台・ドローン・猫・骸骨・子竜・精霊・人形)",
        "覇王戦では武器・パッシブを選ばない (初期武器で戦い、使用アイテムは闘技場で拾う) · 準備部屋はスキル表示に",
        "AIもスキルを使う · スキルに合わせて受けるダメージを調整 (お互い避けずに戦うと約10秒で決着)",
      ],
    },
  },
];
