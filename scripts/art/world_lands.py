"""0.53.0 새 지역 지도 공용 도구 (world_hell·world_undersea·world_cyber·world_windtown·world_seongguk가 씀)
새 지역은 땅 종류를 새로 만들지 않고 있는 칸(풀·길·물·집·성채 등)을 쓰고, 그림은 장소 표의 Region.skin으로 바꿔 끼움
- check: 장소 표(places/{이름}Field.ts, `_INSIDE` 앞)·장식 자리가 걸을 수 있는 칸인지 · 문 바로 위가 건물인지
- write_layout: 집 문·장식 자리를 places/{이름}Layout.ts로 (손으로 고치지 않음)
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PLACES = ROOT / "apps/client/src/world/places"
SOLID = {"water", "deep", "tree", "wall", "rock", "fence", "house", "keep", "innerWall", "factory", "pipe", "arena", "bigTree", "hedge",
         "palace", "villa", "oasis", "temple", "thickWall", "snowPine", "sea", "ocean", "warehouse", "chapel"}
BUILDING = {"house", "keep", "palace", "villa", "warehouse", "chapel"}


def check(g, field, decos, doors, label):
    """field = places 파일 이름(확장자 빼고) · decos = [(장식, x, y)] · doors = [(x, y)] (문 위는 건물)"""
    src = (PLACES / f"{field}.ts").read_text(encoding="utf-8").split("_INSIDE")[0]
    pts = [(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)] + [(x, y) for (_, x, y) in decos]
    bad = [p for p in pts if g[p[1]][p[0]] in SOLID]
    bad += [(x, y) for (x, y) in doors if g[y][x] in SOLID or g[y - 1][x] not in BUILDING]
    assert not bad, f"{label}: 걸을 수 없는 장소 자리: {bad}"
    print(label, "장소", len(pts), "곳 OK")


def write_layout(name, const, doors, decos, extra=()):
    """const = 이름 앞머리 (HELL → HELL_HOUSE_DOORS · HELL_DECO_SPOTS) · extra = 더 쓸 줄"""
    lines = [
        f"// 생성됨: scripts/art/world_{name}.py (손으로 고치지 않음) · 집 문·장식 자리 (칸)",
        'import type { DecoArt } from "../worldDeco";',
        "",
        f"export const {const}_HOUSE_DOORS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x}, {y}]" for x, y in doors) + "];",
        f"export const {const}_DECO_SPOTS: readonly (readonly [DecoArt, number, number])[] = [" + ", ".join(f'["{a}", {x}, {y}]' for a, x, y in decos) + "];",
        *extra,
        "",
    ]
    (PLACES / f"{name}Layout.ts").write_text("\n".join(lines), encoding="utf-8")


def edge_noise(m, k, depth=2, more=4, p=0.4):
    """지도 가장자리 막기 (깊이 depth는 다 · more까지는 확률 p)"""
    for y in range(m.H):
        for x in range(m.W):
            e = min(x, y, m.W - 1 - x, m.H - 1 - y)
            if e < depth or (e < more and m.rnd.random() < p):
                m.put(x, y, k)


def houses(m, spots, w=3, h=2, k="house"):
    """집 덩어리들 (왼쪽 위 칸) → 문 자리 (아래 가운데 한 칸 밑)"""
    for (x, y) in spots:
        m.rect(x, y, x + w - 1, y + h - 1, k)
    return [(x + w // 2, y + h) for (x, y) in spots]


def check_doors(grids):
    """모든 나라 필드: 문은 건물 앞 아래 가운데 (덩어리 폭이 짝수면 가운데 두 칸 중 하나) · grids = {지도 이름: 칸}
    문 자리 = places/*Field.ts의 문(door) 숫자 좌표 + *Layout.ts의 *DOORS 표"""
    bad = []
    for f in sorted(PLACES.glob("*Field.ts")):
        src = f.read_text(encoding="utf-8").split("_INSIDE")[0]
        name = re.search(r'map: "world/(\w+)\.png"', src).group(1)
        g = grids.get(name)
        if g is None:
            continue
        pts = [(int(a), int(b)) for a, b in re.findall(r'kind: "door", tx: (\d+), ty: (\d+)', src)]
        lay = PLACES / f.name.replace("Field", "Layout")
        if lay.exists():
            for line in lay.read_text(encoding="utf-8").splitlines():
                if "DOORS" in line:
                    pts += [(int(a), int(b)) for a, b in re.findall(r"\[(\d+), (\d+)\]", line)]
        for (x, y) in pts:
            k = g[y - 1][x]
            if k not in BUILDING:
                continue
            x0, x1 = x, x
            while g[y - 1][x0 - 1] == k:
                x0 -= 1
            while g[y - 1][x1 + 1] == k:
                x1 += 1
            if x not in ((x0 + x1) // 2, (x0 + x1 + 1) // 2):
                bad.append((name, x, y, x0, x1))
    assert not bad, f"건물 가운데가 아닌 문: {bad}"
    print("문 가운데 검사 OK")
