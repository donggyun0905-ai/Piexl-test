// 스토리 글자 (한·영·일): 진영 이름·설명 · 최종 보스 이야기 · 장 제목 · 말하는 사람 이름
import type { Lang } from "../index";
import type { ChapterId, FactionId, OtherSpeaker, StoryBossId } from "../../story/storyData";
import { S2_BOSS_STORY, S2_SPEAKERS, S2_SUMMARY, S2_TITLE } from "./world2";
import { S3_SPEAKERS, S3_SUMMARY, S3_TITLE } from "./world3";

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
  seongguk: {
    name: c("성국", "Holy Kingdom", "聖国"),
    tag: c("성스러운 나라", "Holy Nation", "聖なる国"),
    desc: c(
      "꺼지지 않는 성화를 지키는 기사와 성직자의 나라. 성국의 전사들은 저절로 휘두르는 힘 대신 갈고닦은 기술(스킬)로 싸운다.",
      "A nation of knights and clergy guarding an undying sacred flame. Its warriors fight not with reflexive strikes but with honed techniques (skills).",
      "消えない聖火を守る騎士と聖職者の国。聖国の戦士たちは反射的な打撃ではなく、磨き上げた技（スキル）で戦う。",
    ),
  },
  dawn: {
    name: c("새벽의 성흔", "Dawn Stigmata", "暁の聖痕"),
    tag: c("악마 사냥꾼", "Demon Hunters", "悪魔狩り"),
    desc: c(
      "밤마다 기어 나오는 악마를 사냥하는 사냥꾼들. 몸에 새긴 성흔(달빛의 힘)이 싸울수록 차오르고, 가득 차면 달빛으로 깨어난다.",
      "Hunters who stalk the demons that crawl out each night. The stigmata carved into their bodies — the power of moonlight — fills as they fight and, when full, awakens them in moonlight.",
      "夜ごと這い出る悪魔を狩る狩人たち。身に刻んだ聖痕（月光の力）は戦うほど満ち、満ちれば月光に目覚める。",
    ),
  },
  thalassia: {
    name: c("탈라시아", "Thalassia", "タラシア"),
    tag: c("바다의 나라", "Sea Nation", "海の国"),
    desc: c(
      "끝없는 바다와 해안을 품은 자유와 해방의 나라. 누구의 깃발 아래에도 묶이지 않는 뱃사람들이 파도와 폭풍을 벗 삼아 산다.",
      "A nation of freedom and liberation embracing the endless sea and its shores. Sailors bound to no one's banner live with the waves and storms as friends.",
      "果てしない海と海岸を抱く自由と解放の国。誰の旗の下にも縛られない船乗りたちが、波と嵐を友に生きる。",
    ),
  },
  ashvar: {
    name: c("아슈바르", "Ashvar", "アシュヴァル"),
    tag: c("태초의 색채 악마 7원색 군단", "Primordial Chromatic Demon Legion of Seven Colors", "太初の色彩悪魔七原色軍団"),
    desc: c(
      "세상에 색이 생기기 전부터 있던 일곱 악마의 군단. 그중 검정은 빛과 색을 삼키는 공허. 처음엔 아무것도 받지 못하지만 싸울수록 스스로를 고쳐 쓰며 계급을 오른다.",
      "A legion of seven demons that existed before the world had color. Their Black is the void that swallows light and hue. It is given nothing at first, but rewrites itself with every fight and climbs the ranks.",
      "世界に色が生まれる前から存在した七悪魔の軍団。その黒は光と色を呑む虚無。最初は何も与えられないが、戦うほど自らを書き換え、位階を上っていく。",
    ),
  },
  silber: {
    name: c("실베르", "Silber", "シルベル"),
    tag: c("북부 수호국", "Warden of the North", "北部守護国"),
    desc: c(
      "몬스터들이 강해지기 이전부터 강대한 몬스터들이 살던 북부를 지켜 온 나라. 처음엔 약해 보여도 싸울수록 하나씩 배우며 강해진다.",
      "A nation that has guarded the North, home of mighty monsters long before monsters grew strong. They may look weak at first, but they grow stronger with every lesson of battle.",
      "魔物が強くなる以前から強大な魔物が棲む北部を守り続けてきた国。最初は弱く見えても、戦うほどに一つずつ学び強くなる。",
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
  outsider: {
    name: c("이방인", "Outsiders", "異邦人"),
    tag: c("세계의 틀을 벗어난 자들", "Those beyond the world's frame", "世界の枠を外れた者たち"),
    desc: c(
      "어느 나라에도, 어느 기록에도 묶이지 않는 자들. 차원을 떠도는 순례자와 스러진 왕국의 왕이 이 세계를 스쳐 간다.",
      "Bound to no nation and no record. A pilgrim who wanders between dimensions and the king of a fallen realm pass through this world.",
      "どの国にも、どの記録にも縛られない者たち。次元をさまよう巡礼者と滅びた王国の王がこの世界を通り過ぎる。",
    ),
  },
  archive: {
    name: c("서고의 감시자", "Wardens of the Archive", "書庫の監視者"),
    tag: c("한정 캐릭터", "Limited characters", "限定キャラクター"),
    desc: c(
      "아카식 레코드의 서고를 지키는 자들. 떨어진 신의 힘을 찬탈한 존재를 쫓아 모였다. (뽑기로 만날 수 있는 한정 캐릭터)",
      "Guardians of the Akashic Records' archive, gathered to hunt whoever stole the fallen god's power. (Limited characters from the gacha)",
      "アカシックレコードの書庫を守る者たち。堕ちた神の力を奪った存在を追って集った。（ガチャで出会える限定キャラクター）",
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
      "헬리오스에서 태어난, 신을 먹는 존재. 아스모데우스의 보랏빛 악에 물들어 '천의 사도'에서 '악의 사도'가 된 이가 떠받드는 주인이다.",
      "A god-devouring being born in Helios. It is the master revered by the one who, stained by Asmodeus's violet evil, fell from 'Apostle of Heaven' to 'Apostle of Malice'.",
      "ヘリオスで生まれた、神を喰らう存在。アスモデウスの紫の悪に染まり「天の使徒」から「悪の使徒」となった者が仰ぐ主。",
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
  ...S3_TITLE,
};

/** 장 목록에 보이는 한 줄 줄거리 */
export const CHAPTER_SUMMARY: Record<ChapterId, L> = {
  ...S2_SUMMARY,
  ...S3_SUMMARY,
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
  ...S3_SPEAKERS,
  raven: c("레이븐", "Raven", "レイヴン"),
  cain: c("카인", "Cain", "カイン"),
  jade: c("제이드", "Jade", "ジェイド"),
  kids: c("아이들", "The kids", "子どもたち"),
  primeval: c("태초의 빛과 어둠", "Primeval Light and Dark", "太初の光と闇"),
  unknown: c("???", "???", "???"),
  all: c("모두", "Everyone", "全員"),
};
