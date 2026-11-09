// 시즌 3 단계별 보스·소품 한 줄 설명 (한·영·일, enemyDesc가 커서 나눔 · DESC에 펼쳐 넣음)
import type { Lang } from "./index";

type Names = Record<Lang, string>;
const n = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const DESC_S3: Record<string, Names> = {
  gatekeeper: n("지옥문 셋을 열고 그 사이를 넘나듦. 문을 부술수록 약해지고, 다 부수면 무릎 꿇음", "Opens three hell gates and leaps between them. Each broken gate weakens it; break them all and it kneels", "地獄の門を三つ開き、その間を行き来する。門を壊すほど弱り、全部壊すと膝をつく"),
  twinlu: n("핏줄로 이어진 쌍둥이 중 흰 가면. 뛰어들며 할퀴기. 한쪽만 쓰러뜨리면 다시 일어남", "The white-masked twin bound by a blood vein. Leaping claws. Fell only one and it rises again", "血の筋で繋がった双子の白い仮面。飛びかかって引っかく。片方だけ倒すと起き上がる"),
  twinre: n("핏줄로 이어진 쌍둥이 중 검은 가면. 쫓아오는 피 구슬(루에게 닿으면 회복). 둘을 함께 쓰러뜨려야 함", "The black-masked twin. Homing blood orbs that heal Lu. Both must fall together", "双子の黒い仮面。追ってくる血の玉（ルーに触れると回復）。二人一緒に倒す必要がある"),
  mooneater: n("방을 어둠으로 덮고 달을 차오르게 함. 달 조각을 깨 달빛 기둥 안에서 월식을 피함", "Shrouds the room in darkness as the moon waxes. Break moon shards and shelter in their pillars from the eclipse", "部屋を闇で覆い月を満たす。月の欠片を壊し、月光の柱の中で月食を避ける"),
  cerberus: n("시즌 3 라스트 보스. 네 사슬에 묶인 세 머리 지옥견. 브레스는 기둥 뒤에서만 피함. 흰 쉴드를 깨면 세 사람으로 갈라짐", "Season 3 final boss. A three-headed hellhound bound by four chains. Only pillars shelter you from its breath. Break the white shield and it splits into three", "シーズン3ラストボス。四本の鎖に繋がれた三つ首の地獄犬。ブレスは柱の陰でしか避けられない。白いシールドを破ると三人に分かれる"),
  cerbfist: n("켈베로스의 왼쪽 머리. 주먹으로 바닥을 내려치고 넓게 쓸고 바위를 떨굼", "Cerberus's left head. Slams the ground, sweeps wide, and drops boulders", "ケルベロスの左の頭。拳で床を叩き、広く薙ぎ払い、岩を落とす"),
  cerbflame: n("켈베로스의 가운데 머리. 불기둥·지옥불새를 부르고 10초 동안 빨아들임 (기둥을 붙잡고 버티기)", "Cerberus's middle head. Calls fire pillars and hellbirds, and draws you in for 10 seconds (hold onto a pillar)", "ケルベロスの中央の頭。火柱と地獄の火の鳥を呼び、10秒間吸い込む（柱にしがみついて耐える）"),
  cerbblade: n("켈베로스의 오른쪽 머리. 연속 돌진 베기·부채꼴 검기·무적 점프 내려찍기", "Cerberus's right head. Dash slashes, fan sword waves, and an invulnerable leaping slam", "ケルベロスの右の頭。連続突進斬り・扇形の剣気・無敵のジャンプ叩きつけ"),
  leviathan: n("시즌 3 라스트 보스. 물속에서 숨(산소)을 지키며 싸우는 심해룡 → 수면 아래 심연고래 → 해왕. 몬스터를 잡으면 비눗방울(숨)", "Season 3 final boss. A deep-sea dragon fought underwater while minding your air, then an abyssal whale beneath the surface, then the Sea King. Kill monsters for air bubbles", "シーズン3ラストボス。水中で息（酸素）を保ちながら戦う深海竜 → 水面下の深淵鯨 → 海王。モンスターを倒すと泡（息）"),
  levwhale: n("수면 아래를 헤엄치다 떠올라 공격. 잠수 중엔 무적. 물 탄환·푸른 지진·사슬 팔", "Swims beneath the surface and breaches to attack. Invulnerable while submerged. Water bullets, blue quakes, chain arms", "水面下を泳ぎ、浮上して攻撃。潜水中は無敵。水弾・青い地震・鎖の腕"),
  levking: n("물이 빠진 바닥의 해왕. 물 채찍·소용돌이·물의 용·썰물과 밀물. 마지막엔 해일 승천", "The Sea King on drained ground. Water whips, vortexes, water dragons, ebb and flood. Finally, the Tidal Ascension", "水の引いた床の海王。水の鞭・渦・水の竜・潮の満ち引き。最後に津波昇天"),
  levprison: n("레비아탄의 물감옥. 갇히면 못 움직이고 숨이 두 배로 닳음. 때려서 깨기", "Leviathan's water prison. Trapped, you can't move and lose air twice as fast. Break it", "リヴァイアサンの水牢。閉じ込められると動けず息が倍速で減る。叩いて壊す"),
  hellgate: n("지옥문 수문장이 여는 문. 열려 있는 동안 임프가 나옴", "A gate opened by the Gatekeeper. Imps pour out while it stands", "地獄門の門番が開く門。開いている間インプが出てくる"),
  imp: n("지옥문에서 나오는 작은 악마. 불붙은 임프는 붙으면 터짐", "A small demon from the hell gates. Burning imps explode up close", "地獄門から出る小悪魔。燃えるインプは近づくと爆発"),
  moonshard: n("깨면 그 자리에 달빛 기둥이 섬 (기둥 안은 월식에도 안전)", "Break it to raise a pillar of moonlight (safe from the eclipse)", "壊すとその場に月光の柱が立つ（柱の中は月食でも安全）"),
};
