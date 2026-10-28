import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.189",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 스킬 이펙트: 캐릭터마다 느낌을 얹음 (불꽃·얼음·번개·독 거품·그림자 연기·빛 반짝이·피·잎·부적과 혼불·기계 불똥·바람·시계 바늘·충격 파편·칼날·발톱 자국) · 줄 모양 스킬은 줄을 따라 빛 띠가 달려감 · 궁극기는 알갱이 두 배와 바깥 빛 고리",
        "역병의사 쥐떼 스킬: 쥐떼가 줄을 따라 달려가는 모습이 보임",
        "버프를 받으면 모두에게 보이게: 발밑 빛과 몸 둘레로 피어오르는 기운 (공격력 빨강·막기 파랑 방패 막·빠름 노랑 바람·재생 초록), 끝나 가면 깜빡임",
        "플라이: 패왕전에서는 하늘 습격(맵을 가로지르는 무적 연속 공격)이 없어지고, 대신 20% 확률로 급습이 붉은 줄이 되며 피해 2배",
        "연습장 칸을 왼쪽 세로로 옮겨 궁극기 알림을 가리지 않음 · 패왕전 풋내기는 레벨 줄이 안 보임",
      ],
      en: [
        "Champion Clash skill effects: each character now adds its own flavor (flames, ice, lightning, poison bubbles, shadow smoke, holy sparkles, blood, leaves, talismans and wisps, machine sparks, wind, clock hands, impact debris, blades, claw marks) · line skills send a light band along the line · ultimates get twice the particles and an outer glow ring",
        "Plague Doctor's rat skill now shows a pack of rats running along the line",
        "Buffs are visible to everyone: a glow underfoot and energy rising around the body (attack red, guard blue shield, haste yellow wind, regen green), blinking as they run out",
        "Fly: in Champion Clash the sky raid (invincible attacks across the map) is gone; instead there is a 20% chance the swoop turns red and deals double damage",
        "The Training Ground panel moved to a left column so it no longer covers ultimate alerts · the Novice level bar is hidden in Champion Clash",
      ],
      ja: [
        "覇王戦スキルエフェクト: キャラごとの雰囲気を追加 (炎・氷・雷・毒の泡・影の煙・光のきらめき・血・葉・札と鬼火・機械の火花・風・時計の針・衝撃の破片・刃・爪痕) · 線のスキルは線に沿って光の帯が走る · 奥義は粒子2倍と外側の光の輪",
        "ペスト医師のネズミのスキル: ネズミの群れが線に沿って走る姿が見える",
        "バフを受けると全員に見える: 足元の光と体の周りに立ち上る気 (攻撃力 赤・防御 青い盾・速さ 黄色い風・再生 緑)、切れかけると点滅",
        "フライ: 覇王戦では空襲(マップを横切る無敵連続攻撃)がなくなり、代わりに20%で急襲が赤い線になりダメージ2倍",
        "練習場の欄を左の縦に移し奥義の通知を隠さない · 覇王戦の見習いはレベルバーを表示しない",
      ],
    },
  },
  {
    version: "0.48.188",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 역할군: 전사·원딜·마법사·암살자·서포터 (밴픽 탭·캐릭터 옆, 마우스를 올리면 설명)",
        "소환한 것(포탑·드론·고양이·해골·새끼 용·정령·인형 등)에 체력이 생겨 상대가 부술 수 있음 · 수풀·투명으로 숨은 상대는 소환물·펫·대정령·쥐떼도 못 노림",
        "1대1 밴픽은 상대가 고른 캐릭터가 안 보임 (같은 캐릭터도 고를 수 있음)",
        "연습장: 시작 준비(3·2·1) 없음 · 쓰러져도 바로 다시 참 · 허수아비 셋을 직접 고르기·초기화 · 가만히·움직이기일 때 허수아비의 소환물·펫도 안 때림",
        "사용 아이템 키(Q·E) 바꾸기 (설정) · 스킬 칸 왼쪽에 패시브 칸 (올리면 설명)",
        "거너 궁극기 더 빨리 발사 · 풋내기 3번 응급처치는 던져서 범위 회복, 패시브는 '마지막 버팀'(한 번 체력 1로 3초) · 베두인 기본 공격은 둘레 한 번 베기 · 버려진 자들 궁극기는 순식간에 3번 베기(곁의 두 아이는 안 나옴) · 라이더 패시브 범위는 내 공격 범위, 나도 피해 · 학살자 기본 공격에서 맵 가르기·검기 빠짐 · 잔영 기본 공격은 뒤로 물러나 그림자에서 찌르고 5초 쉼",
        "악의 사도·장로·영사 기본 공격은 마우스 위치 (자동 조준 없음)",
      ],
      en: [
        "Champion Clash roles: Warrior, Marksman, Mage, Assassin, Support (draft tabs and next to each character, hover for details)",
        "Summons (turrets, drones, cats, skeletons, dragonlings, spirits, dolls and more) now have HP and can be destroyed · summons, pets, great spirits and rats can't target rivals hidden in bushes or invisible",
        "In the 1v1 draft you can't see the rival's pick (picking the same character is allowed)",
        "Training Ground: no 3-2-1 start · you get right back up · choose and reset the three dummies · standing or moving dummies' summons and pets don't hit you",
        "Item keys (Q, E) can be changed in Settings · a passive slot left of the skill bar (hover for details)",
        "Gunner ultimate fires faster · Novice skill 3 is a thrown area heal, passive is now Last Stand (once, 3 seconds at 1 HP) · Bedouin basic attack is one slash all around · Abandoned ultimate is three instant slashes (the other two kids no longer fight) · Rider passive blast uses your attack range and hurts you too · Slayer basic attack loses the map-splitting cut and blade waves · Remnant basic attack steps back into shadow, strikes, then rests 5 seconds",
        "Apostle, Elder and Silk basic attacks go where your mouse is (no auto-aim)",
      ],
      ja: [
        "覇王戦の役割: 戦士・射手・魔法使い・暗殺者・サポーター (バンピックのタブ・キャラの横、マウスを乗せると説明)",
        "召喚物(砲台・ドローン・猫・骸骨・子竜・精霊・人形など)に体力がつき相手が壊せる · 草むら・透明で隠れた相手は召喚物・ペット・大精霊・ネズミも狙えない",
        "1対1のバンピックは相手の選んだキャラが見えない (同じキャラも選べる)",
        "練習場: 開始準備(3・2・1)なし · 倒れてもすぐ全回復 · かかし3体を選ぶ・リセット · 静止・移動のかかしの召喚物・ペットも攻撃しない",
        "使用アイテムキー(Q・E)を変更可能 (設定) · スキル欄の左にパッシブ欄 (乗せると説明)",
        "ガンナー奥義の発射を速く · 見習いスキル3は投げて範囲回復、パッシブは「最後の踏ん張り」(一度だけ体力1で3秒) · ベドウィン通常攻撃は周囲を一回斬る · 捨てられた子たち奥義は一瞬で3回斬り(横の二人は出ない) · ライダーのパッシブ範囲は自分の攻撃範囲、自分もダメージ · 虐殺者の通常攻撃からマップを裂く斬撃・剣気を削除 · 残影の通常攻撃は後ろに下がり影から突き、5秒休む",
        "悪の使徒・長老・影糸使いの通常攻撃はマウスの位置 (自動照準なし)",
      ],
    },
  },
  {
    version: "0.48.187",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 밴픽 화면: 혼자 하기·친구 방·랭크전 모두 같은 전체 화면 · 위쪽 탭을 전체·원거리·근거리·힐러·탱커로 · 캐릭터마다 역할(원딜·근딜·힐러·탱커) 노란 글씨 · 세로 가운데 정렬 · 밴하기·밴 넘기기 버튼 같은 크기 · 밴픽 화면의 스킬 설명은 빼고 다음 화면에서",
        "스킬 보기 화면 오른쪽에 작은 연습장: 고른 캐릭터로 허수아비에게 스킬을 바로 써 볼 수 있음 (모든 대결, 친구 방은 밴픽이 끝난 뒤 준비방에서)",
        "패왕전 밸런스: 사람처럼 스킬을 자주 쓰는 AI끼리 1대1을 많이 돌려 센 캐릭터(야수·소환술사·풋내기·격투가·학살자·정령사 등)는 받는 피해를 늘리고 약한 캐릭터는 줄임",
        "고침: 관전할 때 내 한정 스킨 효과가 보고 있는 사람에게 보이던 것 · 데스매치에서 처치하고 레벨이 오르면 누르던 방향키가 멈추던 것",
      ],
      en: [
        "Champion Clash draft: solo, friend rooms and ranked all use the same full screen · tabs are now All / Ranged / Melee / Healer / Tank · each character shows its role in yellow · centered layout · Ban and Skip ban buttons are the same size · skill details moved to the next screen",
        "A small training ground now sits to the right of the skill screen so you can try your character's skills on dummies right away (all battles; in friend rooms, from the preparation room after the draft)",
        "Champion Clash balance: after many AI 1v1s with frequent skill use (closer to real play), strong characters (Beastkin, Summoner, Novice, Brawler, Slayer, Spiritist and others) take more damage and weak ones take less",
        "Fixed: your limited skin effects showing on the player you spectate · in Deathmatch, the held direction key stopping after a kill levels you up",
      ],
      ja: [
        "覇王戦バンピック画面: ソロ・フレンド部屋・ランク戦すべて同じ全画面 · 上のタブを すべて・遠距離・近距離・ヒーラー・タンク に · キャラごとに役割(遠距離・近距離・ヒーラー・タンク)を黄色で表示 · 縦中央揃え · バン・バンしないボタンを同じ大きさに · スキル説明は次の画面へ",
        "スキル確認画面の右に小さな練習場: 選んだキャラでかかしにすぐスキルを試せる (全対決、フレンド部屋はバンピック後の準備部屋で)",
        "覇王戦バランス: スキルをよく使うAI同士の1対1を多数回し(実際のプレイに近く)、強いキャラ(獣人・召喚術師・見習い・格闘家・虐殺者・精霊使いなど)は受けるダメージを増やし、弱いキャラは減らした",
        "修正: 観戦中に自分の限定スキン効果が見ている相手に表示されていた · デスマッチで倒してレベルが上がると押していた方向キーが止まっていた",
      ],
    },
  },
];
