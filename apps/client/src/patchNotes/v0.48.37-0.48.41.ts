import type { PatchNote } from "./types";

// 지난 기록 (0.48.37~0.48.41)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.41",
    date: "2026-10-22",
    items: {
      ko: [
        "베두인: 바지를 통바지로 다시 그림 · 차크람을 1.5배 크고 두꺼운 금빛 톱니 고리로 (맞는 범위도 커짐) · 떨어진 차크람은 닿기만 하면 주움 (대시하지 않아도 됨)",
        "캐릭터 선택창: '무작위 캐릭터로 시작' 버튼 · '스킨 바꾸기'를 누르면 스킨이 큰 창에 떠서 골라 입음",
        "연습장 허수아비가 방 한가운데에 가만히 있음 (맞아서 밀려도 제자리)",
        "도트 그리기 도구 추가: 붓·지우개 굵기, 직선·네모·채운 네모·동그라미, 같은 색 바꾸기, 좌우 대칭, 확대·축소, 모든 색 고르기·색 코드·팔레트·최근 색",
      ],
      en: [
        "Bedouin: redrawn with wide harem pants · the chakram is now 1.5x bigger, thicker and golden with teeth (bigger hit area too) · a landed chakram is picked up just by touching it (no dash needed)",
        "Character select: a 'Start with a random character' button · 'Change skin' opens a large window to pick a skin",
        "The practice scarecrow now stays put in the middle of the room (it snaps back when knocked away)",
        "More pixel tools: brush/eraser size, line, box, filled box, circle, swap color, mirror, zoom, and any-color picker with hex input, palette and recent colors",
      ],
      ja: [
        "ベドウィン：ズボンをワイドパンツに描き直し · チャクラムを1.5倍大きく太い金色のギザギザの輪に（当たり範囲も拡大）· 落ちたチャクラムは触れるだけで拾える（ダッシュ不要）",
        "キャラ選択：「ランダムなキャラで開始」ボタン · 「スキン変更」を押すと大きな画面でスキンを選べる",
        "練習場のかかしが部屋の真ん中から動かなくなりました（押されても元の場所に戻る）",
        "ドット描きの道具を追加：ペン・消しゴムの太さ、直線・四角・塗り四角・円、同じ色を置換、左右対称、拡大縮小、全色の色選び・色コード・パレット・最近の色",
      ],
    },
  },
  {
    version: "0.48.40",
    date: "2026-10-22",
    items: {
      ko: ["범 풍류 대기 장면 다듬기: 백호에 음영·바닥 그림자를 넣고 머리를 크게 해 더 또렷하게, 나타날 때 살며시 내려앉음. 악기는 작고 은은한 금빛으로 천천히 둥실거리고, 음표는 ♪ 모양으로"],
      en: ["Polished the Tiger Revelry idle scene: the tiger gets shading, a ground shadow and a larger head, and settles in gently. Instruments are smaller with a soft golden glow and drift slowly, and the notes now look like ♪"],
      ja: ["虎の風流の待機シーンを調整：白虎に陰影と床の影を付け、頭を大きくしてくっきりと、現れる時はふわりと座り込みます。楽器は小さく柔らかな金色でゆっくり漂い、音符は♪の形に"],
    },
  },
  {
    version: "0.48.39",
    date: "2026-10-22",
    items: {
      ko: ["범 풍류 대기 장면을 다시 꾸밈: 큰 백호가 몸을 둥글게 말고 자고, 내 캐릭터는 백호 배에 기대어 앉아 잡니다. 꼬리가 앞으로 감싸 주고, 둘레에는 장구·꽹과리·북·소고·태평소·청사초롱이 둥실둥실 돌며 음표와 오방색 꽃가루가 날립니다"],
      en: ["Redid the Tiger Revelry idle scene: a big white tiger curls up to sleep while your character dozes leaning on its belly, wrapped in its tail. Janggu drums, gongs, a barrel drum, a hand drum, a horn and a blue-red lantern float around you, with music notes and five-color confetti"],
      ja: ["虎の風流の待機シーンを作り直し：大きな白虎が丸くなって眠り、自分のキャラはそのお腹にもたれて座って眠ります。尻尾が前を包み、周りではチャング・ケンガリ・太鼓・小鼓・テピョンソ・青紗提灯がふわふわ回り、音符と五方色の紙吹雪が舞います"],
    },
  },
  {
    version: "0.48.38",
    date: "2026-10-22",
    items: {
      ko: ["범 풍류를 입고 가만히 있으면 큰 백호가 바닥에 누워 자고 내 캐릭터가 그 위에 눕습니다. 뒤로는 풍악 놀이패(장구·꽹과리·북·부채춤)가 반투명하게 보이고, 까치는 그대로 벚꽃을 뿌립니다"],
      en: ["While idle in Tiger Revelry, a big white tiger lies down to sleep with your character resting on its back. A translucent folk band (drums, gong and fan dance) plays behind, and the magpie still scatters cherry blossoms"],
      ja: ["虎の風流を着てじっとしていると、大きな白虎が床に寝そべって眠り、自分のキャラがその上に横たわります。後ろには楽隊（チャング・ケンガリ・太鼓・扇の舞）が半透明に見え、カササギは変わらず桜を撒きます"],
    },
  },
  {
    version: "0.48.37",
    date: "2026-10-22",
    items: {
      ko: ["범 풍류(한정 스킨) 효과를 도트 그림으로 바꿈: 발톱 자국 · 치명타 발톱 · 보스 K.O 도장 · 파동 고리 · 금빛 기둥 · 가만히 있을 때 발밑 기운"],
      en: ["Tiger Revelry (limited skin) effects are now pixel art: claw marks, critical claw slashes, the boss K.O stamp, shockwave rings, golden pillars and the idle aura at your feet"],
      ja: ["虎の風流（限定スキン）のエフェクトをドット絵に：爪痕 · クリティカルの爪 · ボスK.Oのはんこ · 波動の輪 · 金色の柱 · 待機中の足元のオーラ"],
    },
  },
];
