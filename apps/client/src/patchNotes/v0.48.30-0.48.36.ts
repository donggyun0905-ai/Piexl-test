import type { PatchNote } from "./types";

// 지난 기록 (0.48.30~0.48.36)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.36",
    date: "2026-10-22",
    items: {
      ko: ["효과·탄을 도트 그림으로 바꿈: 근접 휘두르기는 푸른 칼자국, 맞으면 별 모양 불꽃, 마법 폭발은 빛이 터지며 퍼지는 고리, 기본 탄은 빛나는 구슬(내 탄 노랑 · 마법탄 보라 · 적 탄 빨강)"],
      en: ["Effects and projectiles are now pixel art: melee swings leave a blue slash, hits burst into star sparks, magic blasts flash and spread as rings, and basic shots are glowing orbs (yours yellow, magic purple, enemies red)"],
      ja: ["エフェクトと弾をドット絵に：近接の振りは青い斬撃、命中は星形の火花、魔法の爆発は光がはじけて広がる輪、基本の弾は光る玉（自分は黄 · 魔法は紫 · 敵は赤）"],
    },
  },
  {
    version: "0.48.35",
    date: "2026-10-22",
    items: {
      ko: [
        "층 테마: 그 층 보스에 어울리게 맵이 바뀝니다 (용광로 · 성 · 숲 · 둥지 · 바닷속 · 초원 · 밀림 · 공허 · 묘지 · 도장 · 신전 · 용암 등)",
        "도감 추가 (메인 아래): 적 · 보스 · 무기 · 패시브 · 사용 아이템. 만나거나 가져 본 것이 채워지고, 눌러서 설명을 봅니다",
        "결과 창에 한 판 요약: 마지막 장비 · 준 피해와 종류별 비율 · 가장 센 한 방 · 받은 피해 · 돈 · 층마다 도착 시간·체력 · 쓰러진 곳",
        "도전과제 캐릭터: 파수꾼·떠돌이·마법사 외의 캐릭터는 어울리는 도전과제를 이루면 열립니다 (지금은 테스트 중이라 모두 열려 있고, 스킨도 모두 가진 상태)",
      ],
      en: [
        "Floor themes: each floor's map now matches its boss (foundry, castle, forest, nest, undersea, plains, jungle, void, graveyard, dojo, temple, lava and more)",
        "New Codex (bottom of the main menu): foes, bosses, weapons, passives and consumables. Entries fill in as you meet or obtain them; tap one for details",
        "Run summary on the results screen: final build, damage dealt and its breakdown, biggest hit, damage taken, gold, arrival time and HP for each floor, and where you fell",
        "Achievement characters: characters other than Warden, Drifter and Mage unlock through fitting achievements (everything is open during testing, and all skins are owned)",
      ],
      ja: [
        "階のテーマ：その階のボスに合わせてマップが変わります（溶鉱炉 · 城 · 森 · 巣 · 海中 · 草原 · 密林 · 虚空 · 墓地 · 道場 · 神殿 · 溶岩など）",
        "図鑑を追加（メイン下）：敵 · ボス · 武器 · パッシブ · 使用アイテム。出会ったり手に入れたりすると埋まり、押すと説明が見られます",
        "結果画面に今回のまとめ：最後の装備 · 与えたダメージと種類別の割合 · 最大の一撃 · 受けたダメージ · お金 · 各階の到着時間・体力 · 倒れた場所",
        "実績キャラ：番人・流れ者・魔法使い以外のキャラは、それぞれに合った実績を達成すると解放されます（今はテスト中なので全員解放、スキンもすべて所持）",
      ],
    },
  },
  {
    version: "0.48.34",
    date: "2026-10-22",
    items: {
      ko: ["상점에 '나만의 스킨' 추가 (캐릭터마다 1칸, 만능 쿠폰 30장): 도트를 직접 찍어 스킨을 그리고, 저장하는 즉시 게임에 나옵니다. 기본·가진 스킨을 바탕으로 불러와 고칠 수 있습니다. 그림은 이 기기에만 저장되어 나에게만 보이며, 브라우저 데이터를 지우면 사라지니 그리기 화면에서 PNG로 내려받아 보관하세요"],
      en: ["Added 'My Own Skin' to the Shop (one per character, 30 coupons): draw a skin pixel by pixel and see it in the game as soon as it's saved. You can start from the default look or a skin you own. The drawing is saved only on this device and only you can see it; clearing browser data deletes it, so download a PNG copy from the drawing screen"],
      ja: ["ショップに「マイスキン」を追加（キャラごとに1枠、万能クーポン30枚）：ドットを打ってスキンを描くと、保存してすぐゲームに出ます。基本や持っているスキンを下絵にして直せます。絵はこの端末にだけ保存され自分にしか見えず、ブラウザのデータを消すと消えるので、描く画面からPNGで保存してください"],
    },
  },
  {
    version: "0.48.33",
    date: "2026-10-22",
    items: {
      ko: ["캐릭터 선택창에 색 네모 대신 지금 입은 스킨으로 걷는 캐릭터가 보이고, 카드마다 '스킨 바꾸기' 버튼으로 가진 스킨을 차례로 갈아입을 수 있습니다"],
      en: ["Character select now shows each character walking in their equipped skin instead of a color square, and a 'Change skin' button on each card cycles through the skins you own"],
      ja: ["キャラ選択で色の四角の代わりに今着ているスキンで歩くキャラが見え、カードごとの「スキン変更」ボタンで持っているスキンを順に着替えられます"],
    },
  },
  {
    version: "0.48.32",
    date: "2026-10-22",
    items: {
      ko: ["그림 손보기 준비: 몬스터·보스, 무기·패시브·사용 아이템 아이콘, 공격 효과, 탄 그림도 직접 고친 도트 그림으로 바꿀 수 있게 됨 (아직 바뀐 그림은 없음)"],
      en: ["Art groundwork: monsters, bosses, item icons, attack effects and projectiles can now be swapped for hand-drawn pixel art (nothing replaced yet)"],
      ja: ["絵の手直し準備：モンスター・ボス、アイテムアイコン、攻撃エフェクト、弾の絵も手描きドット絵に差し替えられるように（まだ差し替えはなし）"],
    },
  },
  {
    version: "0.48.31",
    date: "2026-10-22",
    items: {
      ko: ["베두인이 차크람을 던지면 등에 있던 차크람이 사라지고, 다시 주우면 보입니다 (모든 스킨)", "장수 한정 스킨 '범 풍류'를 호랑이 머리 대신 금 투구를 쓴 잘생긴 얼굴로 다시 그림"],
      en: ["The Bedouin's chakram now disappears from her back when thrown and reappears when caught (all skins)", "Redrew the General's 'Tiger Revelry' limited skin with a handsome face under a golden helmet instead of a tiger head"],
      ja: ["ベドウィンがチャクラムを投げると背中のチャクラムが消え、拾うと再び見えます（全スキン）", "武将の限定スキン「虎の風流」を虎の頭ではなく金の兜をかぶった美形の顔に描き直し"],
    },
  },
  {
    version: "0.48.30",
    date: "2026-10-22",
    items: {
      ko: [
        "새 캐릭터 베두인: 몸만 한 차크람(사막의 대륜) 하나로 싸웁니다. 한 번은 둘레를 한 바퀴 베고, 다음은 아주 멀리 던집니다. 던진 차크람은 대시로 지나가며 주워야 다시 공격할 수 있고, 주울 때 모래와 함께 크게 한 바퀴 벱니다. 대시하면 모래바람이 휘날립니다. 전용 아이템 20개 (회귀 바람·신기루 걸음·사막 환영·태양 전사·축적 등), 대시를 모아 쓰면 발밑에 남은 대시 칸이 보입니다",
        "새 캐릭터 장수: 찌르기 3번 → 휘두르기 2번 → 몸을 돌며 돌진해 내리꽂는 범위기(끝에서 폭발)로 끊기지 않고 이어지는 창 콤보 (묶음 사이 잠깐 쉼). 옛 명장들의 무기 10개(방천화극·청룡언월도·장팔사모·의천검·쌍고검·화랑 보검·고려 대도·애각창·쌍룡검·결사의 장검)마다 콤보가 다르고, 전용 아이템 '숨겨진 힘'을 얻으면 콤보 마지막에 그 무기 주인의 필살기를 씁니다. 전용 아이템 12개",
        "두 캐릭터 모두 스킨 테마 10개와 뽑기 한정 '범 풍류' 스킨, 업적(베두인·장수로 클리어)이 있습니다",
      ],
      en: [
        "New character Bedouin: fights with a single body-sized chakram (Great Dune Chakram). One attack spin-slashes around her, the next hurls it far. Dash over the thrown chakram to catch it before attacking again, unleashing a wide sand slash. Dashing kicks up a swirl of sand. 20 exclusive items (Returning Wind, Mirage Step, Desert Mirage, Sun Warrior, Accumulate and more); stored dashes show as boxes under your feet",
        "New character General: an unbroken spear combo of 3 thrusts → 2 swings → a spinning lunge that slams down and explodes (short pause between sets). 10 weapons of legendary generals each change the combo, and the exclusive item 'Hidden Power' adds the weapon owner's signature technique at the end of each combo. 12 exclusive items",
        "Both have 10 skin themes, a 'Tiger Revelry' limited gacha skin, and clear achievements",
      ],
      ja: [
        "新キャラクター ベドウィン：体ほどのチャクラム（砂漠の大輪）ひとつで戦います。一度は周りを一回転斬り、次は遠くへ投げます。投げたチャクラムはダッシュで通って拾うまで攻撃できず、拾う時に砂と共に大きく一回転斬りします。ダッシュすると砂嵐が舞います。専用アイテム20個（回帰の風・蜃気楼の歩み・砂漠の幻影・太陽の戦士・蓄積など）、ダッシュを溜めると足元に残り回数の枠が見えます",
        "新キャラクター 武将：突き3回 → 薙ぎ2回 → 体を回して突進し叩きつける範囲技（最後に爆発）と途切れず続く槍コンボ（区切りの間に少し休む）。昔の名将の武器10個ごとにコンボが異なり、専用アイテム「秘めた力」を得るとコンボの最後にその武器の持ち主の必殺技を使います。専用アイテム12個",
        "二人ともスキンテーマ10個とガチャ限定「虎の風流」スキン、クリア実績があります",
      ],
    },
  },
];
