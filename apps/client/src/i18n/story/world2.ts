// 스토리 시즌 2 글자: 4~6장 제목·줄거리 · 시즌 2 최종 보스 · 새로 말하는 사람 이름 (world.ts에서 합침)
import type { Lang } from "../index";

type L = Record<Lang, string>;
const c = (ko: string, en: string, ja: string): L => ({ ko, en, ja });

export const S2_TITLE: Record<"ch4" | "ch5" | "ch6", L> = {
  ch4: c("뒷면", "The Other Side", "裏側"),
  ch5: c("원군", "Reinforcements", "援軍"),
  ch6: c("황혼의 종언", "The End of Twilight", "黄昏の終焉"),
};

export const S2_SUMMARY: Record<"ch4" | "ch5" | "ch6", L> = {
  ch4: c(
    "아스칼론의 손님들이 오기 전, 헬리오스의 깊은 곳. 정체 모를 목소리, 세 사도의 임무, 그리고 이터의 몸을 찢고 일어선 검은 잔영.",
    "Deep within Helios, before Ascalon's guests arrive. A voice no one can name, three servants' missions, and the black remnant that tore its way out of the Eater.",
    "アスカロンの客人が来る前、ヘリオスの奥深く。正体不明の声、三人への任務、そしてイーターの体を裂いて立ち上がった黒い残影。",
  ),
  ch5: c(
    "고립된 세 나라가 앞당긴 패왕전. 승부가 시작되기 직전, 하늘에서 떨어진 고대의 신 괴력난신이 '연합'을 선언한다.",
    "Three isolated nations move up the Tournament of Champions. Just before it begins, an ancient god falls from the sky and declares an 'Alliance'.",
    "孤立した三国が前倒しにした覇王戦。勝負の直前、空から落ちてきた古代の神・怪力乱神が「連合」を宣言する。",
  ),
  ch6: c(
    "모래에 묻힌 세레스티아와 그곳을 지켜 온 제천대성. 잊혀진 자의 정체가 드러나는 순간, 적들이 몰려온다.",
    "Celestia buried in sand, and the Great Sage who has guarded it. The moment the Forgotten's true name is revealed, the enemy closes in.",
    "砂に埋もれたセレスティアと、そこを守ってきた斉天大聖。忘れられし者の正体が明かされた瞬間、敵が押し寄せる。",
  ),
};

export const S2_SPEAKERS = {
  demigod: c("괴력난신", "Demigod of Might", "怪力乱神"),
  sage: c("제천대성", "Great Sage", "斉天大聖"),
  godeater: c("갓이터", "God Eater", "ゴッドイーター"),
  dragon: c("파멸의 용", "Dragon of Ruin", "破滅の竜"),
  kingTerra: c("테라코어의 왕", "King of Terracore", "テラコアの王"),
  kingAscalon: c("아스칼론의 왕", "King of Ascalon", "アスカロンの王"),
  kingVirdia: c("비르디아의 왕", "King of Virdia", "ヴィルディアの王"),
  kings: c("세 왕", "The three kings", "三人の王"),
  generals: c("두 장군", "The two generals", "二人の将軍"),
  referee: c("심판", "Referee", "審判"),
  crowd: c("관객", "Spectator", "観客"),
  citizen: c("시민", "Citizen", "市民"),
  watcher1: c("???1", "???1", "???1"),
  watcher2: c("???2", "???2", "???2"),
  watcher3: c("???3", "???3", "???3"),
};

export const S2_BOSS_STORY: Record<"umbra" | "demigod" | "sage", { name: L; desc: L }> = {
  umbra: {
    name: c("검은 잔영", "Black Umbra", "黒い残影"),
    desc: c(
      "떨어진 신의 깃털을 삼킨 이터의 몸을 찢고 일어선 거대한 그림자. 헬리오스가 기다려 온 '현현'의 첫 모습.",
      "A colossal shadow that tore its way out of the Eater after it swallowed a fallen god's feather. The first form of the 'manifestation' Helios awaited.",
      "落ちた神の羽を呑んだイーターの体を裂いて立ち上がった巨大な影。ヘリオスが待ち望んだ「顕現」の最初の姿。",
    ),
  },
  demigod: {
    name: c("괴력난신", "Demigod of Might", "怪力乱神"),
    desc: c(
      "싸움을 무엇보다 좋아하는 고대의 신. 패왕전에 떨어져 내려 세 나라를 하나의 '연합'으로 묶었다.",
      "An ancient god who loves a fight above all else. It crashed into the Tournament of Champions and bound three nations into one 'Alliance'.",
      "何より戦いを好む古代の神。覇王戦に落ちてきて、三国を一つの「連合」にまとめた。",
    ),
  },
  sage: {
    name: c("제천대성", "Great Sage", "斉天大聖"),
    desc: c(
      "모래에 묻힌 세레스티아에서 옛 약속을 지키며 성물 '원초의 진금'을 지켜 온 원숭이 신. 근두운과 여의봉을 다룬다.",
      "The monkey god who kept an old promise in sand-buried Celestia, guarding the relic 'Primordial True Gold'. Rides a cloud and wields an extending staff.",
      "砂に埋もれたセレスティアで古い約束を守り、聖物「原初の真金」を守ってきた猿の神。筋斗雲と如意棒を操る。",
    ),
  },
};
