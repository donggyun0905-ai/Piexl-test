"""나라마다 길가·집 앞 소품 (있는 물건 그림으로 나라다운 거리 만들기) → apps/client/src/world/places/propsLayout.ts
- 길가: 큰길 칸 옆 걸을 수 있는 칸에 가로등류 (서로 8칸 넘게 떨어지게)
- 집 앞: 문 양옆 두 칸 떨어진 자리에 통·상자·화분 등 (문마다 반쯤)
- 장소(문·주민·표지판 등) 둘레 두 칸·길 칸·막힌 칸에는 안 놓음 · 랜덤은 시드로 (지도를 다시 만들어도 같은 자리)
실행은 world_map.py (지도를 다 만든 뒤)
"""
import random
import re

from world_lands import PLACES, SOLID

# 지도 이름 → (필드 파일, 도시 범위 또는 None(전체), 길 칸, 가로등, 집 앞 소품)
NATIONS = {
    "ascalon": ("ascalonField", (49, 19, 151, 87), {"floor"}, "lamp", ["barrel", "crates", "plant", "flowerBush"]),
    "helios": ("heliosField", (61, 23, 195, 111), {"redBrick"}, "holyBrazier", ["plant", "flowerBush", "barrel"]),
    "thalassia": ("thalassiaField", (72, 44, 168, 122), {"wetStone"}, "lamp", ["barrel", "crates", "net", "anchor", "cargo"]),
    "silber": ("silberField", (89, 58, 167, 111), {"snowStone"}, "brazier", ["barrel", "crates", "spears"]),
    "terracore": ("terraField", (71, 23, 185, 93), {"floor"}, "lamp", ["crates", "barrel", "pipes"]),
    "virdia": ("virdiaField", (99, 25, 157, 83), {"woodFloor"}, "lantern", ["mushroom", "fern", "flowerBush"]),
    "seongguk": ("seonggukField", (65, 41, 139, 119), {"floor", "path"}, "candles", ["plant", "flowerBush"]),
    "windtown": ("windtownField", None, {"path"}, None, ["jars", "plant", "pinwheel"]),
    "undersea": ("underseaField", None, {"path"}, None, ["coral", "clam", "kelp"]),
    "cyber": ("cyberField", None, {"path"}, "streetLamp", ["trashBin", "vending"]),
}
WATER = {"water", "deep", "sea", "ocean", "lava"}


def places_of(field):
    """장소 표의 칸 + Layout 파일의 문·장식 자리"""
    src = (PLACES / f"{field}.ts").read_text(encoding="utf-8").split("_INSIDE")[0]
    pts = [(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)]
    lay = PLACES / f"{field.replace('Field', 'Layout')}.ts"
    doors = []
    if lay.exists():
        for line in lay.read_text(encoding="utf-8").splitlines():
            pairs = [(int(a), int(b)) for a, b in re.findall(r"(\d+), (\d+)\]", line)]
            pts += pairs
            if "DOOR" in line:
                doors += pairs
    doors += [(int(a), int(b)) for a, b in re.findall(r'kind: "door", tx: (\d+), ty: (\d+)', src)]
    return pts, doors


def props(name, g):
    field, rect, road, lamp, near = NATIONS[name]
    rnd = random.Random(name)
    H, W = len(g), len(g[0])
    x0, y0, x1, y1 = rect or (2, 2, W - 3, H - 3)
    taken, doors = places_of(field)
    doorset = set(doors)
    used = []

    def free(x, y, gap):
        if not (0 < x < W - 1 and 0 < y < H - 1):
            return False
        k = g[y][x]
        if k in SOLID or k in WATER or k in road or k in {"bridge", "rail", "dockPlank"}:
            return False
        if any(abs(x - a) <= 2 and abs(y - b) <= 2 for (a, b) in taken if (a, b) not in doorset):
            return False
        if any(abs(x - a) <= 1 and abs(y - b) <= 1 for (a, b) in doorset):
            return False
        # 건물 문 줄(건물 바로 아래)과 그 아래 칸은 비움 (드나드는 길)
        if g[y - 1][x] in {"house", "keep", "villa", "palace", "chapel", "warehouse"}:
            return False
        return all(abs(x - a) + abs(y - b) > gap for (_, a, b) in used)

    if lamp:
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if g[y][x] not in road or (x * 7 + y * 3) % 5:
                    continue
                for (dx, dy) in ((0, -1), (0, 1), (-1, 0), (1, 0)):
                    if free(x + dx, y + dy, 8 if rect else 12):
                        used.append((lamp, x + dx, y + dy))
                        break
    for (dx, dy) in doors:
        if not (x0 <= dx <= x1 and y0 <= dy <= y1) or rnd.random() < 0.45:
            continue
        for sx in rnd.sample([-2, 2], 2):
            if free(dx + sx, dy, 1):
                used.append((near[rnd.randrange(len(near))], dx + sx, dy))
                break
    return used


def write(grids):
    rows = []
    total = 0
    for name in NATIONS:
        if name not in grids:
            continue
        p = props(name, grids[name])
        total += len(p)
        rows.append(f"  {name}: [" + ", ".join(f'["{a}", {x}, {y}]' for a, x, y in p) + "],")
    lines = [
        "// 생성됨: scripts/art/world_props.py (손으로 고치지 않음) · 나라마다 길가 가로등·집 앞 소품 (장식, 칸)",
        'import type { DecoArt } from "../worldDeco";',
        "",
        "export const PROPS: Record<string, readonly (readonly [DecoArt, number, number])[]> = {",
        *rows,
        "};",
        "",
    ]
    (PLACES / "propsLayout.ts").write_text("\n".join(lines), encoding="utf-8")
    print("소품", total, "개")
