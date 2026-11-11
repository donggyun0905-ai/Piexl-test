import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.26",
    date: "2026-11-11",
    items: {
      ko: [
        "빛 효과: 조커·쉐도잉·인형술사·래빗·백령·빙설·아수라의 기술에도 빛 층이 붙음 (캐릭터 색으로 빛·고리·불티 · 큰 기술은 더 크게 · 필살기는 빛기둥과 살짝 번쩍) · 날아가는 카드·영혼·검기·땅울림·빙설창도 은은하게 빛남",
        "아수라 효과 다듬기: 파동은 두 겹 초승달 물결 · 악귀는 붉은 충격 고리와 가시 불티 · 3타·4타는 바닥 충격 고리 · 귀진은 둘레를 도는 귀신 손 빛 6개 · 각성은 시작할 때 빛기둥, 그동안 등 뒤에 은은한 빛",
      ],
      en: [
        "Glow effects: Joker, Shadowing, Puppeteer, Rabbit, Baekryeong, Bingseol and Asura skills now light up on the glow layer (glow, rings and sparks in each character's color · bigger for big skills · ultimates get a light pillar and a soft flash) · flying cards, spirits, sword waves, quakes and the Frostsnow Lance glow softly too",
        "Asura effects polished: Shockwave is a double crescent ripple · Fiend bursts with a red shock ring and spiky sparks · strikes 3 and 4 leave ground shock rings · Spirit Domain has six glowing spirit hands circling its edge · awakening starts with a light pillar and keeps a soft glow at her back",
      ],
      ja: [
        "光の演出：ジョーカー・シャドウイング・人形使い・ラビット・白霊・氷雪・阿修羅の技にも光の層が付く（キャラクターの色で光・輪・火花・大技はより大きく・必殺技は光の柱と軽い閃光）・飛ぶカード・魂・剣気・地響き・氷雪槍もほのかに光る",
        "阿修羅の演出を調整：波動は二重の三日月の波・悪鬼は赤い衝撃の輪とトゲの火花・3打・4打は床に衝撃の輪・鬼陣は縁を回る鬼神の手の光6つ・覚醒は始まりに光の柱、その間は背中にほのかな光",
      ],
    },
  },
  {
    version: "0.52.25",
    date: "2026-11-11",
    items: {
      ko: [
        "새 캐릭터 아수라 (실베르): 등 뒤 귀신 주먹 6개와 자기 주먹으로 싸우는 싸움꾼 · 무기는 맨손 하나 (앞을 넓게 치지만 피해는 약함)",
        "아수라 전용 패시브 20: 분쇄(주먹 피해를 6번으로 나눠 한 틱에 한 대씩) · 귀진(남색 영역 · 안의 적 다이아 표식 · 방어력 -5) · 파동(모든 공격 끝에 부채꼴) · 아수라(필살기: 3% 각성 10초 · 1·2타 → 1·2타 → 3타 바닥 연속 강타 → 4타 1.5초 기절) · 연발(연속 펀치 15연타) · 악귀(때릴 때마다 붉게 터지며 추가 피해) · 철권 · 귀수 확장 · 수라장 · 귀문 개방 · 육도 · 천근추 · 귀압 · 업화 · 분노의 팔 · 귀갑 · 마수 연타 · 육비 난무 · 혼백 흡수 · 귀신 걸음",
      ],
      en: [
        "New character Asura (Silber): a brawler who fights with six spectral fists at her back and her own · one weapon, bare hands (wide but weak punches ahead)",
        "20 Asura passives: Pulverize (each punch split into 6 hits, one per tick) · Spirit Domain (navy domain · diamond mark on foes inside · -5 defense) · Shockwave (a fan wave after every attack) · Asura (ultimate: 3% to awaken for 10s · strike 1-2 → 1-2 → 3 ground pounding → 4 with 1.5s stun) · Flurry (15-hit flurry) · Fiend (red bursts of extra damage on hits) · Iron Fist · Spirit Reach · Carnage · Open Spirit Gate · Six Paths · Thousand-Weight · Spirit Pressure · Hellfire · Arms of Wrath · Spirit Shell · Demon Barrage · Six-Arm Frenzy · Soul Drain · Ghost Step",
      ],
      ja: [
        "新キャラクター阿修羅（シルベル）：背中の鬼神の拳6本と自分の拳で戦う格闘家・武器は素手ひとつ（前を広く打つがダメージは弱い）",
        "阿修羅専用パッシブ20：粉砕（拳のダメージを6回に分け1ティックに1発ずつ）・鬼陣（紺色の領域・中の敵にダイヤの印・防御力-5）・波動（すべての攻撃の終わりに扇形）・阿修羅（必殺技：3%で覚醒10秒・1・2打→1・2打→3打床連続強打→4打1.5秒気絶）・連発（連続パンチ15連打）・悪鬼（打つたびに赤く弾けて追加ダメージ）・鉄拳・鬼手拡張・修羅場・鬼門開放・六道・千斤墜・鬼圧・業火・憤怒の腕・鬼甲・魔手連打・六臂乱舞・魂魄吸収・鬼神歩",
      ],
    },
  },
  {
    version: "0.52.24",
    date: "2026-11-11",
    items: {
      ko: ["모든 보스(일반·레이드·최종보스): 기절·속박·공포·느려짐이 한 번 걸리면 1분 동안 다시 걸리지 않음 (걸린 동안 더 늘어나지도 않음)"],
      en: ["All bosses (regular, raid and final): once stunned, rooted, feared or slowed, they can't be hit by those effects again for 1 minute (and the current one can't be extended)"],
      ja: ["すべてのボス（通常・レイド・最終ボス）：気絶・拘束・恐怖・鈍化に一度かかると1分間は再びかからない（かかっている間に延長もされない）"],
    },
  },
  {
    version: "0.52.23",
    date: "2026-11-11",
    items: {
      ko: [
        "빙설 빙설무장-창: 머리 위 창 사이를 넓게 벌리고, 한꺼번에가 아니라 한 개씩 연발로 날아감 (0.1초 간격)",
        "빙설 얼음가루(속): 쉬는 시간 3초 → 1.5초 · 얼음가루(강): 5초 → 3초",
        "빙설 빙격: 빙산처럼 크기 3배 (반지름 22 → 66) · 몸에 겹치지 않게 조금 더 앞에서 솟음 (40 → 70)",
      ],
      en: [
        "Bingseol Frost Arms: Spears: the spears above your head are spread wider apart and fire one at a time in a volley instead of all at once (every 0.1s)",
        "Bingseol Ice Dust: Swift cooldown 3s → 1.5s · Ice Dust: Strong 5s → 3s",
        "Bingseol Ice Strike: three times bigger, like an iceberg (radius 22 → 66) · rises a bit farther ahead so it doesn't cover you (40 → 70)",
      ],
      ja: [
        "氷雪・氷雪武装・槍：頭上の槍の間隔を広げ、まとめてではなく1本ずつ連発で飛ぶ（0.1秒間隔）",
        "氷雪・氷の粉（速）：休む時間3秒→1.5秒・氷の粉（強）：5秒→3秒",
        "氷雪・氷撃：氷山のように大きさ3倍（半径22→66）・体に重ならないよう少し前でそびえる（40→70）",
      ],
    },
  },
  {
    version: "0.52.22",
    date: "2026-11-11",
    items: {
      ko: ["래빗 슈퍼 럭키: 초거대 망치 60연타 피해 숫자가 합쳐지지 않고 한 대마다 따로 떠오름"],
      en: ["Rabbit Super Lucky: the colossal hammer's 60-hit combo now shows a separate damage number for every hit"],
      ja: ["ラビット・スーパーラッキー：超巨大ハンマーの60連打のダメージ数字が一発ごとに表示される"],
    },
  },
  {
    version: "0.52.21",
    date: "2026-11-11",
    items: {
      ko: ["빙설 궁극기 빙설창: 60연타 피해 숫자가 합쳐지지 않고 한 대마다 따로 떠오름 · 적마다 멈추는 슬로우 모션을 0.5초 → 1초로 (한 틱에 한 번씩 60번)"],
      en: ["Bingseol Frostsnow Lance: its 60-hit combo now shows a separate damage number for every hit instead of merging them · slow-motion stop at each foe lengthened from 0.5s to 1s (one hit per tick, 60 hits)"],
      ja: ["氷雪・奥義氷雪槍：60連打のダメージ数字がまとめられず一発ごとに表示される・敵ごとに止まるスローモーションを0.5秒→1秒に（1ティックに1回ずつ60回）"],
    },
  },
  {
    version: "0.52.20",
    date: "2026-11-11",
    items: {
      ko: [
        "새 캐릭터 빙설 (실베르): 얼음을 다루는 자유분방한 해군 소녀 · 늘 몸 둘레에 눈 내리는 얼음 영역(가까이 온 적은 움직임·공격이 느려짐) · 무기 10개 모두 얼음 칼날 (얼음칼·얼음 낫·서리 단검·빙하 대검·고드름 창·빙인 투척·눈꽃 부채·서리 채찍·빙륜·눈보라 지팡이, 무기마다 베기·찌르기·던지기 모양이 다름)",
        "빙설 전용 패시브 10: 궁극기-빙설창(공격마다 3% · 3초 기를 모아 마우스 쪽으로 · 적마다 슬로우 모션 60연타 · 맵 끝까지 관통) · 빙설무장-활(좌우에 큰 얼음 활, 2개까지) · 빙설무장-창(머리 위 얼음 창 4~7개가 차례로 생겨 발사) · 얼음가루(공격마다 3~5개, 닿으면 고정 피해 2, 30개까지) · 얼음가루(속)(5개가 모여 유도 얼음) · 얼음가루(강)(10개가 모여 관통 급속 얼음) · 빙격(앞에 얼음 빙각, 구속) · 영역강화(눈 결정 벽 5개·방어력 +10·적 탄 막음) · 눈보라 확장 · 쇄빙",
        "빙설 그림 시트·효과 그림(art/캐릭터/빙설)·아이콘·효과음·글자(한·영·일)·업적·스토리·티어·패왕전 스킬",
      ],
      en: [
        "New character Bingseol (Silber): a free-spirited navy girl of ice · a snowy frost field always surrounds her (nearby foes move and attack more slowly) · all 10 weapons are ice blades (Ice Blade, Ice Scythe, Frost Dagger, Glacier Greatsword, Icicle Pike, Ice Edge Throw, Snowflake Fan, Frost Whip, Ice Wheel, Blizzard Staff, each with its own slash, thrust or throw)",
        "Bingseol's 10 exclusive passives: Ultimate Frostsnow Lance (3% per attack · charges 3s, flies toward your mouse · 60 slow-motion hits on every foe · pierces to the map edge) · Frost Arms: Bow (giant ice bows at your sides, up to 2) · Frost Arms: Spears (4-7 ice spears form above you one by one, then launch) · Ice Dust (3-5 per attack, 2 fixed damage on touch, up to 30) · Ice Dust: Swift (5 gather into homing ice) · Ice Dust: Strong (10 gather into piercing rapid ice) · Ice Strike (ice spike ahead, binds) · Field Fortify (5 snow-crystal walls, +10 defense, block shots) · Spreading Blizzard · Icebreaker",
        "Bingseol sprite sheet, effect art, icons, sound effects, text (KO/EN/JA), achievement, story, tier and Paewang skills",
      ],
      ja: [
        "新キャラ氷雪（シルベル）：氷を操る自由奔放な海軍少女・いつも体の周りに雪の降る氷の領域（近づいた敵は動きと攻撃が遅くなる）・武器10個はすべて氷の刃（氷の剣・氷の鎌・霜の短剣・氷河の大剣・つららの槍・氷刃投げ・雪花の扇・霜の鞭・氷輪・吹雪の杖、武器ごとに斬る・突く・投げる形が違う）",
        "氷雪の専用パッシブ10：奥義・氷雪槍（攻撃ごとに3%・3秒力をためマウスの方向へ・敵ごとにスローモーション60連打・マップの端まで貫通）・氷雪武装・弓（左右に大きな氷の弓、2個まで）・氷雪武装・槍（頭上に氷の槍4～7本が順に現れて発射）・氷の粉（攻撃ごとに3～5個、触れると固定ダメージ2、30個まで）・氷の粉（速）（5個が集まって誘導氷）・氷の粉（強）（10個が集まって貫通する急速氷）・氷撃（前に氷の棘、拘束）・領域強化（雪の結晶の壁5個・防御力+10・敵の弾を防ぐ）・吹雪拡張・砕氷",
        "氷雪のスプライトシート・エフェクト絵・アイコン・効果音・文字（日・英・韓）・実績・ストーリー・ティア・覇王戦スキル",
      ],
    },
  },
];
