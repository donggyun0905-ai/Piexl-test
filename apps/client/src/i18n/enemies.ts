// 적·보스 이름과 한 줄 설명 (한·영·일). 도감·한 판 요약·관리자·도트 편집이 같이 씀. 보스 이름은 game 글자의 boss* 키
import type { Lang } from "./index";
import { TEXT } from "./text";

type Names = Record<Lang, string>;
const n = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

/** 보스 이름 (게임 글자 키) */
export const BOSS_TEXT: Record<string, string> = {
  hulk: "bossHulk", brood: "bossBrood", seer: "bossSeer", knight: "bossKnight", archer: "bossArcher", siren: "bossSiren", centaur: "bossCentaur",
  plant: "bossPlant", reaper: "bossReaper", swordgod: "bossSwordGod", archangel: "bossAngel", dragon: "bossDragon", godeater: "bossGodEater", plight: "bossLight", pdark: "bossDark",
  umbra: "bossUmbra", sandworm: "bossSandworm", scorpion: "bossScorpion", roc: "bossRoc", demigod: "bossDemigod", sage: "bossSage",
  toad: "bossToad", salamander: "bossSalamander", jelly: "bossJelly", captain: "bossCaptain",
};

/** 보스가 아닌 적 이름 */
const NAMES: Record<string, Names> = {
  dummy: n("허수아비", "Scarecrow", "かかし"),
  fighter: n("패왕전 도전자", "Champion Rival", "覇王戦の挑戦者"),
  crawler: n("기어 오는 벌레", "Crawler", "這い寄る虫"),
  spitter: n("침 뱉는 벌레", "Spitter", "唾吐き虫"),
  mortar: n("포격 버섯", "Mortar Shroom", "砲撃キノコ"),
  charger: n("돌진 멧돼지", "Charger", "突進イノシシ"),
  gnat: n("날벌레", "Gnat", "羽虫"),
  guardian: n("방패 가디언", "Shield Guardian", "盾のガーディアン"),
  paladin: n("성기사", "Paladin", "聖騎士"),
  tower: n("천사장의 탑", "Archangel's Tower", "大天使の塔"),
  soul: n("풀려난 영혼", "Freed Soul", "解き放たれた魂"),
  ghost: n("어둠의 유령", "Shadow Ghost", "闇の亡霊"),
  slime: n("슬라임", "Slime", "スライム"),
  runner: n("도마뱀", "Lizard", "トカゲ"),
  bat: n("박쥐", "Bat", "コウモリ"),
  beetle: n("딱정벌레", "Beetle", "カブトムシ"),
  golem: n("바위 골렘", "Rock Golem", "岩ゴーレム"),
  shaman: n("주술사", "Shaman", "呪術師"),
  eggsac: n("알주머니", "Egg Sac", "卵嚢"),
  wisp: n("도깨비불", "Wisp", "鬼火"),
  incubus: n("인큐버스", "Incubus", "インキュバス"),
  ruinblade: n("파괴의 검", "Blade of Ruin", "破壊の剣"),
  chaosblade: n("혼돈의 검", "Blade of Chaos", "混沌の剣"),
};

/** 한 줄 설명 */
const DESC: Record<string, Names> = {
  dummy: n("연습장에서 마음껏 때려 보는 허수아비", "A scarecrow to hit freely in practice", "練習場で思いきり叩けるかかし"),
  fighter: n("패왕전에서 겨루는 AI 캐릭터", "An AI character you face in the Champion Clash", "覇王戦で戦うAIキャラクター"),
  crawler: n("다가와서 몸으로 부딪힘", "Crawls close and rams you", "近づいて体当たりする"),
  spitter: n("거리를 두고 탄을 쏨", "Keeps its distance and shoots", "距離を取って弾を撃つ"),
  mortar: n("내 자리에 붉은 표시를 남기고 잠시 뒤 터뜨림", "Marks your spot in red, then it explodes", "足元に赤い印を残し、少し後に爆発させる"),
  charger: n("잠깐 멈췄다가 빠르게 돌진", "Pauses, then charges fast", "一瞬止まってから突進する"),
  gnat: n("떼로 몰려다니는 약하고 빠른 벌레", "Weak, fast bugs that swarm", "群れで飛ぶ弱くて速い虫"),
  guardian: n("방패 3번을 깨야 피해가 들어감, 돌진 뒤 크게 휘두름", "Break its shield 3 times first; charges then swings wide", "盾を3回割らないとダメージが通らない。突進後に大振り"),
  paladin: n("천사장이 부르는 단단한 기사", "A sturdy knight called by the Archangel", "大天使が呼ぶ頑丈な騎士"),
  tower: n("네 모서리에 서 있고 차례가 된 탑만 맞음", "Stands in the corners; only the active one can be hit", "四隅に立ち、順番の塔だけ攻撃できる"),
  soul: n("혼돈의 검이 풀어놓는 영혼", "A soul released by the Blade of Chaos", "混沌の剣が放つ魂"),
  ghost: n("맞지 않고, 닿으면 어둠이 짙어짐", "Can't be hit; touching it deepens the darkness", "攻撃が当たらず、触れると闇が濃くなる"),
  slime: n("가장 흔한 적", "The most common foe", "いちばんよく出る敵"),
  runner: n("빠르고 약함", "Fast and frail", "速くて弱い"),
  bat: n("떼로 날아오는 아주 약한 적", "Very weak foes that come in flocks", "群れで飛んでくるとても弱い敵"),
  beetle: n("등껍질을 몇 번 깨야 피해가 들어감", "Crack its shell a few times before it takes damage", "甲羅を何回か割らないとダメージが通らない"),
  golem: n("아주 단단하고 느림", "Very tough and slow", "とても硬くて遅い"),
  shaman: n("가끔 주변 적의 체력을 채워 줌", "Sometimes heals nearby foes", "ときどき周りの敵を回復する"),
  eggsac: n("터지면 작은 슬라임 셋이 나옴", "Bursts into three small slimes", "割れると小さいスライムが3匹出る"),
  wisp: n("가끔 앞으로 순간이동", "Sometimes teleports forward", "ときどき前に瞬間移動する"),
  incubus: n("무리 여왕이 부르는 졸개", "A minion called by the Brood Queen", "群れの女王が呼ぶ手下"),
  ruinblade: n("갓이터의 대검. 먼저 부숴야 본체가 맞음", "The God Eater's greatsword; break it to hurt the body", "ゴッドイーターの大剣。先に壊さないと本体に当たらない"),
  chaosblade: n("갓이터의 대검. 영혼을 풀어놓음", "The God Eater's greatsword; releases souls", "ゴッドイーターの大剣。魂を放つ"),
  hulk: n("다가오다 돌진하고, 멈출 때 사방으로 탄", "Charges in and sprays bullets when it stops", "近づいて突進し、止まると全方向に弾"),
  brood: n("거리를 두고 졸개를 부르고 부채꼴로 탄", "Summons minions from afar and fires fans of shots", "距離を取って手下を呼び、扇状に弾"),
  seer: n("순간이동하며 도는 고리 모양 탄", "Teleports and fires spinning rings", "瞬間移動しながら回る輪の弾"),
  knight: n("검으로 3연속 베기와 찌르며 돌진", "Three-hit sword combos and a lunging charge", "剣の3連斬りと突きの突進"),
  archer: n("벽에 튕기는 화살, 가까이 가면 뒤로 뜀", "Ricochet arrows; leaps back when you get close", "壁で跳ねる矢。近づくと後ろに跳ぶ"),
  siren: n("벽에 튕기는 음표, 맞으면 끌려감", "Bouncing notes that pull you in", "壁で跳ねる音符。当たると引き寄せられる"),
  centaur: n("3연속 돌진 찌르기와 사방 창 던지기", "Triple charging thrusts and spears in all directions", "3連突進突きと全方向の槍投げ"),
  plant: n("움직이지 않고 바닥과 덩굴로 공격", "Stays rooted and attacks with the floor and vines", "動かず床とツタで攻撃する"),
  reaper: n("큰 낫 휘두르기, 등 뒤로 순간이동해 한 바퀴 베기", "Huge scythe swings; teleports behind you to spin", "大鎌の振り回し。背後に瞬間移動して一回転斬り"),
  swordgod: n("방 전체 검기 격자, 빛나지 않는 칸으로 피함", "Sword-light grids across the room; dodge to the dark cells", "部屋全体の剣気の格子。光らないマスへ避ける"),
  archangel: n("성기사를 부르고 빛기둥을 내림", "Calls paladins and drops pillars of light", "聖騎士を呼び、光の柱を落とす"),
  dragon: n("라스트 보스. 불바다와 화염 궁극기", "Final boss. Seas of fire and a burning ultimate", "ラストボス。火の海と炎の究極技"),
  godeater: n("라스트 보스. 대검 두 자루를 먼저 부숴야 함", "Final boss. Break its two greatswords first", "ラストボス。2本の大剣を先に壊す必要がある"),
  plight: n("라스트 보스. 태초의 어둠과 체력을 나눠 가짐", "Final boss. Shares its health with Primeval Dark", "ラストボス。太初の闇と体力を分け合う"),
  pdark: n("라스트 보스. 태초의 빛과 체력을 나눠 가짐", "Final boss. Shares its health with Primeval Light", "ラストボス。太初の光と体力を分け合う"),
  umbra: n("시즌 2 라스트 보스. 거대한 짐승 셋을 차례로 부르고 지켜봄", "Season 2 final boss. Summons three colossal beasts in turn and watches", "シーズン2ラストボス。巨大な獣を三体順に呼び、見届ける"),
  demigod: n("시즌 2 라스트 보스. 아르테의 태산에서 내려온 반신, 맨주먹으로 1대1", "Season 2 final boss. A demigod down from Mount Arte, fighting one-on-one with bare fists", "シーズン2ラストボス。アルテの泰山から降りてきた半神、素手で一対一"),
  toad: n("늪을 뛰어다니며 내려찍고(떨어진 자리는 진흙), 혀로 끌어당기고, 진흙 덩이를 뱉음", "Leaps and slams through the bog (leaving mud), pulls you in with its tongue and spits mud", "沼を跳ねて叩きつけ（落ちた所は泥）、舌で引き寄せ、泥の塊を吐く"),
  salamander: n("불길을 남기며 돌진하고, 용암 웅덩이로 잠수했다가 발밑에서 솟구침", "Charges leaving fire, dives into lava pools and erupts beneath you", "炎を残して突進し、溶岩だまりに潜って足元から噴き出す"),
  jelly: n("물을 감전시키고(물 위면 데미지), 떠도는 전기 방울과 번개 줄을 쏨", "Electrifies the water (it hurts to stand in), sends drifting sparks and lightning lines", "水を感電させ（水の上だとダメージ）、漂う電気玉と雷の線を放つ"),
  captain: n("대포 포격 · 닻으로 끌어당기기 · 방 절반을 쓰는 밀물 · 물에 빠진 선원 부르기", "Cannon barrages, an anchor that drags you in, a tide that sweeps half the room, and drowned crew", "大砲の砲撃・錨で引き寄せ・部屋の半分を流す潮・溺れた船員を呼ぶ"),
  sage: n("시즌 2 마지막 라스트 보스. 세레스티아를 지켜 온 반신, 여의봉과 근두운으로 따로 공격", "Season 2's last final boss. The demigod guarding Celestia, attacking separately with his staff and his cloud", "シーズン2最後のラストボス。セレスティアを守ってきた半神、如意棒と觔斗雲で別々に攻撃"),
  sandworm: n("땅속에서 예고 없이 솟아오름. 위에 있을 때 때리기", "Bursts up from underground without warning. Strike while it is up", "地中から予告なく飛び出す。地上にいる間に攻撃"),
  scorpion: n("꼬리 독 찌르기·앞으로만 밀고 오는 돌진. 옆으로 피한 뒤 때리기", "Venom sting and a straight-line charge. Sidestep, then strike", "尾の毒突きと直進の突進。横に避けてから攻撃"),
  roc: n("하늘에서 내려찍기·세 줄 활강. 피하면 떨어져 경직", "Dives and triple swoops from the sky. Dodge and it falls dazed", "空からの急降下と三本の滑空。避けると落ちて硬直"),
};

export function enemyName(kind: string, lang: Lang): string {
  const key = BOSS_TEXT[kind];
  if (key) return (TEXT as Record<string, Names>)[key]?.[lang] ?? kind;
  return NAMES[kind]?.[lang] ?? kind;
}

export const enemyDesc = (kind: string, lang: Lang): string => DESC[kind]?.[lang] ?? "";
