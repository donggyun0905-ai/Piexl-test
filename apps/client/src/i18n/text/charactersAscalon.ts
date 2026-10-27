// 화면 글자: 시즌 2 아스칼론 캐릭터 이름·설명 · 무기 종류 이름 · 추적자 스킬
export const CHARACTER_TEXT_ASCALON = {
  tracker: { ko: "추적자", en: "Tracker", ja: "追跡者" },
  trackerDesc: {
    ko: "저격 · 아스칼론. 왕국의 그림자 속에서 표적을 쫓는 여자 저격수. 무기는 튜닝한 저격총 하나뿐이고 스킬 셋으로 싸움 (PC 1·2·3 키, 모바일 스킬 버튼): 1 암습 저격 · 2 강력한 한방 · 3 연발사격 · 전용 아이템 10",
    en: "Sniper · Ascalon. A woman who hunts her marks from the kingdom's shadows. Her only weapon is a tuned rifle, and she fights with three skills (keys 1·2·3 on PC, skill buttons on mobile): 1 Ambush Snipe · 2 Power Shot · 3 Rapid Fire · 10 own items",
    ja: "狙撃 · アスカロン。王国の影から標的を追う女狙撃手。武器はチューニングした狙撃銃ただ一つで、スキル3つで戦う（PCは1・2・3キー、モバイルはスキルボタン）：1 暗襲狙撃 · 2 強力な一撃 · 3 連射 · 専用アイテム10",
  },
  snipe: { ko: "저격", en: "Sniper", ja: "狙撃" },
  forgotten: { ko: "잊혀진 자", en: "The Forgotten", ja: "忘れられし者" },
  forgottenDesc: {
    ko: "빛 · 아스칼론. 옛 신의 마지막 후손인 반신. 빛으로 싸움 (무기 10 · 여래신장 등). 적을 쓰러뜨리면 등의 빛의 고리가 차고, 가득 차면 10초 동안 신족: 공격 속도 2배 + 빛기둥이 둘레 적을 침 · 재생력 20 · 빠름 · 회피 20% · 전용 아이템 10",
    en: "Light · Ascalon. A demigod, last descendant of the old gods, who fights with light (10 weapons incl. Tathagata Palm). Kills fill the ring of light on her back; when full she takes divine form for 10s: double attack speed + pillars of light strike nearby foes · Regen 20 · fast · 20% dodge · 10 own items",
    ja: "光 · アスカロン。古き神の最後の末裔である半神。光で戦う（武器10 · 如来神掌など）。敵を倒すと背中の光の輪が満ち、満ちると10秒間神族：攻撃速度2倍＋光柱が周りの敵を撃つ · 再生力20 · 速い · 回避20% · 専用アイテム10",
  },
  light: { ko: "빛", en: "Light", ja: "光" },
  remnant: { ko: "잔영", en: "Remnant", ja: "残影" },
  remnantDesc: {
    ko: "암살 · 아스칼론. 그림자 속에서 움직이는 남자 암살자. 아주 빠른 단검 공격 · 멀리 있는 적 뒤로 순간이동해 등 뒤를 벰 · 떠난 자리에 잔영이 남아 한 번 더 벰 · 모든 상태이상 면역 · 치명타 25% · 치명타 피해 250% · 무기 10 · 전용 아이템 10",
    en: "Assassin · Ascalon. A man who moves through the shadows. Very fast dagger cuts · blinks behind far foes to stab their backs · leaves an afterimage that cuts once more · immune to all status effects · 25% crit · 250% crit damage · 10 weapons · 10 own items",
    ja: "暗殺 · アスカロン。影の中を動く男の暗殺者。とても速い短剣攻撃 · 遠い敵の背後へ瞬間移動して背中を斬る · 去った場所に残影が残りもう一度斬る · すべての状態異常に免疫 · クリティカル25% · クリティカルダメージ250% · 武器10 · 専用アイテム10",
  },
  phantom: { ko: "그림자 단검", en: "Shadow Dagger", ja: "影の短剣" },
  wanderer: { ko: "방랑객", en: "Wanderer", ja: "放浪者" },
  wandererDesc: {
    ko: "검 · 아스칼론. 카타나 한 자루로 떠도는 남자 무사. 기본 예리함 25% (맞히면 확률로 방어 -25% + 출혈) · 카타나 10 (발도 · 무심의 원 · 칼날 폭풍 · 천검란 등) · 전용 아이템 10",
    en: "Sword · Ascalon. A wandering swordsman with a single katana. Base Sharpness 25% (hits may cut defense by 25% and cause bleeding) · 10 katanas (Quick Draw · Circle of No-Mind · Blade Storm · Thousand Swords and more) · 10 own items",
    ja: "剣 · アスカロン。刀一振りで流れ歩く男の剣士。基本の鋭さ25%（当てると確率で防御-25%＋出血）· 刀10（抜刀 · 無心の円 · 刃の嵐 · 千剣乱など）· 専用アイテム10",
  },
  katana: { ko: "카타나", en: "Katana", ja: "刀" },
  silk: { ko: "영사", en: "Silk", ja: "影糸使い" },
  silkDesc: {
    ko: "실 · 아스칼론. 보이지 않는 실을 다루는 매혹적인 여자. 실 100가닥을 장전해 아주 빠르게 쏨 (방 끝에서 끝까지 가는 실선) · 얽힘 5가 쌓인 적은 실이 당겨 찢김 (250% + 출혈) · 30가닥마다 노리는 적을 가로지르는 실 30가닥 연사 · 무기 10 · 전용 아이템 10",
    en: "Thread · Ascalon. An alluring woman who wields unseen threads. Loads 100 threads and fires them very fast (each a line from wall to wall) · foes with 5 tangles are torn apart (250% + bleed) · every 30 threads, a barrage of 30 threads crosses the target · 10 weapons · 10 own items",
    ja: "糸 · アスカロン。見えない糸を操る魅惑的な女性。糸100本を装填しとても速く放つ（部屋の端から端までの糸）· 絡みが5溜まった敵は糸が引かれ引き裂かれる（250%＋出血）· 30本ごとに狙う敵を横切る糸30本の連射 · 武器10 · 専用アイテム10",
  },
  thread: { ko: "실", en: "Thread", ja: "糸" },
  trSkill1: { ko: "암습 저격", en: "Ambush Snipe", ja: "暗襲狙撃" },
  trSkill2: { ko: "강력한 한방", en: "Power Shot", ja: "強力な一撃" },
  trSkill3: { ko: "연발사격", en: "Rapid Fire", ja: "連射" },
  trAmbushLeft: { ko: "남은 발 {n} · {s}초", en: "{n} shots · {s}s", ja: "残り{n}発 · {s}秒" },
};
