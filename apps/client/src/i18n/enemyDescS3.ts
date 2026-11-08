// 시즌 3 단계별 보스·소품 한 줄 설명 (한·영·일, enemyDesc가 커서 나눔 · DESC에 펼쳐 넣음)
import type { Lang } from "./index";

type Names = Record<Lang, string>;
const n = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const DESC_S3: Record<string, Names> = {
  gatekeeper: n("지옥문 셋을 열고 그 사이를 넘나듦. 문을 부술수록 약해지고, 다 부수면 무릎 꿇음", "Opens three hell gates and leaps between them. Each broken gate weakens it; break them all and it kneels", "地獄の門を三つ開き、その間を行き来する。門を壊すほど弱り、全部壊すと膝をつく"),
  twinlu: n("핏줄로 이어진 쌍둥이 중 흰 가면. 뛰어들며 할퀴기. 한쪽만 쓰러뜨리면 다시 일어남", "The white-masked twin bound by a blood vein. Leaping claws. Fell only one and it rises again", "血の筋で繋がった双子の白い仮面。飛びかかって引っかく。片方だけ倒すと起き上がる"),
  twinre: n("핏줄로 이어진 쌍둥이 중 검은 가면. 쫓아오는 피 구슬(루에게 닿으면 회복). 둘을 함께 쓰러뜨려야 함", "The black-masked twin. Homing blood orbs that heal Lu. Both must fall together", "双子の黒い仮面。追ってくる血の玉（ルーに触れると回復）。二人一緒に倒す必要がある"),
  mooneater: n("방을 어둠으로 덮고 달을 차오르게 함. 달 조각을 깨 달빛 기둥 안에서 월식을 피함", "Shrouds the room in darkness as the moon waxes. Break moon shards and shelter in their pillars from the eclipse", "部屋を闇で覆い月を満たす。月の欠片を壊し、月光の柱の中で月食を避ける"),
  hellgate: n("지옥문 수문장이 여는 문. 열려 있는 동안 임프가 나옴", "A gate opened by the Gatekeeper. Imps pour out while it stands", "地獄門の門番が開く門。開いている間インプが出てくる"),
  imp: n("지옥문에서 나오는 작은 악마. 불붙은 임프는 붙으면 터짐", "A small demon from the hell gates. Burning imps explode up close", "地獄門から出る小悪魔。燃えるインプは近づくと爆発"),
  moonshard: n("깨면 그 자리에 달빛 기둥이 섬 (기둥 안은 월식에도 안전)", "Break it to raise a pillar of moonlight (safe from the eclipse)", "壊すとその場に月光の柱が立つ（柱の中は月食でも安全）"),
};
