// 스토리 글자 (한·영·일): 진영 이름·설명 · 최종 보스 이야기 · 장 제목 · 말하는 사람 이름
import type { Lang } from "../index";
import type { ChapterId, FactionId, OtherSpeaker, StoryBossId } from "../../story/storyData";
import { S2_BOSS_STORY, S2_SPEAKERS, S2_SUMMARY, S2_TITLE } from "./world2";

type L = Record<Lang, string>;
const c = (ko: string, en: string, ja: string): L => ({ ko, en, ja });

export const FACTION_TEXT: Record<FactionId, { name: L; tag: L; desc: L }> = {
  ascalon: {
    name: c("아스칼론", "Ascalon", "アスカロン"),
    tag: c("왕국", "Kingdom", "王国"),
    desc: c(
      "역사 깊은 왕국. 파멸의 용에게 깊은 흉터를 입은 뒤, 오해로 비르디아와 적이 되었다.",
      "An old and proud kingdom. Scarred deeply by the Dragon of Ruin, it became Virdia's enemy through a misunderstanding.",
      "歴史ある王国。破滅の竜に深い傷を負わされ、誤解からヴィルディアと敵対している。",
    ),
  },
  terracore: {
    name: c("테라코어", "Terracore", "テラコア"),
    tag: c("기계국", "Machine Nation", "機械国"),
    desc: c(
      "막강한 기계와 기술의 나라. 아스칼론과 비르디아의 전쟁에는 중립이며 오히려 싸우지 말라는 입장이다. 헬리오스를 견제하며 주의 깊게 지켜본다.",
      "A nation of mighty machines and technology. Neutral in the war between Ascalon and Virdia, it urges both to stop fighting, and keeps a watchful eye on Helios.",
      "強大な機械と技術の国。アスカロンとヴィルディアの戦争には中立で、むしろ争うなという立場。ヘリオスを警戒し注意深く見張っている。",
    ),
  },
  helios: {
    name: c("헬리오스", "Helios", "ヘリオス"),
    tag: c("제국", "Empire", "帝国"),
    desc: c(
      "악마와 사악한 힘을 탐하는 제국. 그곳에 모인 이들은 대부분 막강한 힘을 지녔다.",
      "An empire that craves demons and wicked power. Most who gather there wield overwhelming strength.",
      "悪魔と邪悪な力を求める帝国。そこに集う者の多くは強大な力を持つ。",
    ),
  },
  virdia: {
    name: c("비르디아", "Virdia", "ヴィルディア"),
    tag: c("수인국", "Beastfolk Nation", "獣人国"),
    desc: c(
      "수인과 엘프 등 자연과 함께 사는 이들의 나라. 오해로 아스칼론과 적이 되었다.",
      "A land of beastfolk, elves and others who live alongside nature. A misunderstanding made it Ascalon's enemy.",
      "獣人やエルフなど、自然と共に生きる者たちの国。誤解からアスカロンと敵対している。",
    ),
  },
  akashic: {
    name: c("아카식 레코드", "Akashic Records", "アカシックレコード"),
    tag: c("기록자", "Chroniclers", "記録者"),
    desc: c(
      "세계의 흐름을 기록하는 집단과 미지의 존재들. 전쟁과 흉수들을 그저 지켜볼 뿐이다.",
      "A circle that records the flow of the world, and beings no one understands. They only watch the wars and the great beasts.",
      "世界の流れを記録する集団と未知の存在たち。戦争や凶獣をただ見守るだけ。",
    ),
  },
};

export const BOSS_STORY: Record<StoryBossId, { name: L; desc: L }> = {
  ...S2_BOSS_STORY,
  dragon: {
    name: c("파멸의 용", "Dragon of Ruin", "破滅の竜"),
    desc: c(
      "파수꾼·마법사·떠돌이 세 사람을 하나로 묶고, 비르디아와의 오해로 두 나라를 적으로 만든 존재.",
      "The one that bound the Warden, the Mage and the Drifter together, and turned two nations into enemies through a misunderstanding with Virdia.",
      "番人・魔法使い・流れ者の三人を結びつけ、ヴィルディアとの誤解で二つの国を敵対させた存在。",
    ),
  },
  godeater: {
    name: c("갓이터", "God Eater", "ゴッドイーター"),
    desc: c(
      "헬리오스에서 태어난 존재. 하늘의 사도였던 이를 악으로 물들여 악의 사도로 만들었다.",
      "A being born in Helios. It stained a former apostle of heaven with evil, making them the Apostle of Malice.",
      "ヘリオスで生まれた存在。天の使徒だった者を悪に染め、悪の使徒にした。",
    ),
  },
  primeval: {
    name: c("태초의 빛과 어둠", "Primeval Light and Dark", "太初の光と闇"),
    desc: c(
      "테라코어가 처음 확인한 미지의 존재. 헬리오스 역시 그 존재를 알아채고 어둠으로 물들이려 한다.",
      "Unknown beings first confirmed by Terracore. Helios has noticed them too, and seeks to drown them in darkness.",
      "テラコアが初めて確認した未知の存在。ヘリオスもその存在に気づき、闇に染めようとしている。",
    ),
  },
};

export const CHAPTER_TITLE: Record<ChapterId, L> = {
  ch1: c("오해", "Misunderstanding", "誤解"),
  ch2: c("슬며시 차오르는 악", "The Slowly Rising Evil", "忍び寄る悪"),
  ch3: c("버려진 자들", "The Abandoned", "捨てられた者たち"),
  ...S2_TITLE,
};

/** 장 목록에 보이는 한 줄 줄거리 */
export const CHAPTER_SUMMARY: Record<ChapterId, L> = {
  ...S2_SUMMARY,
  ch1: c(
    "한 사냥꾼의 화살이 부른 용의 분노. 아스칼론과 비르디아가 서로 등을 돌리게 된 날, 그 뒤에는 검은 약 한 방울이 있었다.",
    "A hunter's arrow wakes a dragon's wrath. On the day Ascalon and Virdia turned their backs on each other, a single drop of black potion lay behind it all.",
    "ひとりの狩人の矢が呼んだ竜の怒り。アスカロンとヴィルディアが背を向け合った日、その裏には一滴の黒い薬があった。",
  ),
  ch2: c(
    "제국을 확인하러 간 아스칼론의 장수들. 달빛 아래 나타난 갓이터와, 웃는 얼굴 뒤에 숨은 악의 사도.",
    "Ascalon's generals go to see the Empire for themselves. Under the moonlight appear the Godeater — and the Apostle of Evil hiding behind a smile.",
    "帝国を確かめに行ったアスカロンの将たち。月明かりの下に現れたゴッドイーターと、笑顔の裏に潜む悪の使徒。",
  ),
  ch3: c(
    "테라코어 뒷골목의 세 아이와 그들을 꾀어낸 닌자. 사막의 신전에서 깨어난 태초의 빛과 어둠, 그리고 '광야의 새벽'.",
    "Three children of Terracore's back alleys and the Ninja who lured them away. The Primeval Light and Dark awaken in a desert temple — the 'Dawn of the Wilds'.",
    "テラコアの裏路地の三人の子どもと、彼らを誘い出した忍者。砂漠の神殿で目覚めた太初の光と闇、そして「荒野の夜明け」。",
  ),
};

/** 캐릭터가 아닌 말하는 사람 이름 */
export const SPEAKER_NAME: Record<OtherSpeaker, L> = {
  ...S2_SPEAKERS,
  raven: c("레이븐", "Raven", "レイヴン"),
  cain: c("카인", "Cain", "カイン"),
  jade: c("제이드", "Jade", "ジェイド"),
  kids: c("아이들", "The kids", "子どもたち"),
  primeval: c("태초의 빛과 어둠", "Primeval Light and Dark", "太初の光と闇"),
  unknown: c("???", "???", "???"),
  all: c("모두", "Everyone", "全員"),
};
