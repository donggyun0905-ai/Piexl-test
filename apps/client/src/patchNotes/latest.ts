import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.29",
    date: "2026-11-11",
    items: {
      ko: ["아수라 피해 숫자: 합쳐지지 않고 한 대마다 따로 뜸 (분쇄 6번·연발·악귀 추가 피해·파동 등 모두)"],
      en: ["Asura damage numbers: every single hit now shows its own number instead of being merged (Pulverize's 6 hits, Flurry, Fiend bonus damage, Shockwave and more)"],
      ja: ["阿修羅のダメージ数字：まとめずに一発ごとに別々に表示（粉砕6回・連発・悪鬼の追加ダメージ・波動など全部）"],
    },
  },
  {
    version: "0.52.28",
    date: "2026-11-11",
    items: {
      ko: ["아수라 분노의 팔: 가지면 귀신 팔과 모든 효과가 붉게 변함 · 때릴 때마다 체력 1을 내줌 (체력 5부터는 안 깎임) · 피해 1.3배 조건 체력 50% → 30% 아래"],
      en: ["Asura Arms of Wrath: her spectral arms and all effects turn red · each attack costs 1 HP (stops at 5 HP) · the x1.3 damage now needs HP below 30% (was 50%)"],
      ja: ["阿修羅・憤怒の腕：取ると鬼神の腕とすべてのエフェクトが赤く変わる・攻撃するたびに体力1を払う（体力5からは減らない）・ダメージ1.3倍の条件が体力50%→30%未満"],
    },
  },
  {
    version: "0.52.27",
    date: "2026-11-11",
    items: {
      ko: ["백령 혼령참: 유령팔 참격마다 늘 나가던 망령이 35% 확률로 나감 (이연참 참격도 따로 굴림)"],
      en: ["Baekryeong Wraith Slash: the wraith that always flew with each ghost arm slash now has a 35% chance per slash (Twin Slash rolls separately)"],
      ja: ["白霊・霊斬：幽霊の腕の斬撃ごとに必ず出ていた亡霊が35%の確率で出る（二連斬の斬撃も別に判定）"],
    },
  },
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
];
