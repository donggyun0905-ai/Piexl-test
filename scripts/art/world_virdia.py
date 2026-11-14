"""비르디아 필드 256×160 (docs/WORLD_MAP.md 4장: 북동, 수인·엘프의 울창한 숲 · 숲속 성 · 강)
- 가운데: 생울타리 성벽의 숲속 성 (북쪽 성채 · 가운데 나무 바닥 광장과 세계수 · 정령의 샘 · 약초 가게 나무 집 · 서·동·남 성문)
- 서쪽: 테라코어 국경 길 · 나무 집 마을 (거대 나무 집) / 남쪽: 동쪽 바다로 흐르는 강(다리 둘) · 정령의 숲터 · 남서 늪
- 북동: 바위 언덕과 깊은 숲 던전 · 동쪽: 해안과 바다
장소 좌표는 apps/client/src/world/places/virdiaField.ts · 집 문은 생성기가 virdiaLayout.ts로 씀
"""
import math
import re
from pathlib import Path

from world_map import Grid

W, H = 256, 160
ROOT = Path(__file__).resolve().parents[2]
PLACES = ROOT / "apps/client/src/world/places"
SOFT = ("moss", "grass", "flower", "tree", "rock")
SOLID = {"water", "deep", "tree", "wall", "rock", "fence", "house", "keep", "innerWall", "bigTree", "hedge"}

# 나무 집 (3×3: 위 두 줄 잎 지붕 · 아래 줄 줄기, 문은 그 아래 칸)
VILLAGE = [(x, y) for y in (66, 76, 86) for x in (30, 38, 46, 54, 62, 70, 78)]
TOWN = [(104, 66), (110, 66), (104, 74), (144, 66), (150, 66), (150, 74)]
HERB = (144, 74)  # 약초 가게 (성 안 남동 나무 집)
CASTLE = (98, 24, 158, 84)
RIVER = [(4, 132), (40, 128), (80, 122), (118, 112), (160, 106), (200, 112), (240, 106)]


def virdia():
    m = Grid(W, H, "moss", seed=31)
    rnd = m.rnd
    # 가장자리 · 빽빽한 숲 (풀밭 빈터 몇 곳)
    for y in range(H):
        for x in range(W):
            edge = min(x, y, W - 1 - x, H - 1 - y)
            if edge < 2 or (edge < 6 and rnd.random() < 0.5):
                m.put(x, y, "tree")
    m.scatter(4, 4, 250, 156, "tree", 260, (4, 10), only=("moss",))
    for (cx, cy, r) in [(60, 40, 9), (200, 80, 8), (180, 140, 7), (30, 100, 6), (90, 145, 6)]:
        m.blob(cx, cy, r, "grass", only=SOFT)
    m.scatter(10, 10, 246, 150, "flower", 30, (2, 6), only=("grass", "moss"))
    # 북동 바위 언덕
    for y in range(1, 22):
        for x in range(160, 238):
            if rnd.random() < 0.95 - y * 0.045 - abs(x - 205) * 0.004:
                m.put(x, y, "rock")
    coast(m)
    river(m)
    castle(m)
    village(m)
    # 길: 서쪽 국경 → 서문 · 동문 → 해안 · 남문 → 다리 → 정령의 숲터 · 던전 갈림 · 마을 둑길
    m.road([(1, 56), (40, 57), (97, 56)], only=SOFT)
    m.road([(159, 56), (200, 58), (230, 60)], only=SOFT)
    m.road([(128, 85), (128, 104)], only=SOFT)
    m.road([(128, 118), (128, 134)], only=SOFT)
    m.road([(205, 57), (210, 30), (210, 18)], only=SOFT)
    m.road([(58, 57), (58, 96), (66, 100)], only=SOFT)
    # 다리 (남문 길 · 마을 남쪽)
    m.rect(127, 103, 129, 119, "bridge", only=("water", "deep", "sand"))
    # 정령의 숲터 (풀밭·꽃 · 가운데 샘)
    m.blob(128, 140, 9, "grass", only=SOFT)
    m.scatter(118, 132, 140, 150, "flower", 8, (3, 6), only=("grass",))
    m.blob(128, 142, 2.6, "water")
    # 남서 늪 (얕은 물웅덩이 여럿)
    for (cx, cy, r) in [(30, 146, 3.2), (40, 150, 2.5), (22, 140, 2.2), (48, 144, 2.0)]:
        m.blob(cx, cy, r, "water", only=SOFT)
    for (cx, cy, r) in [(210, 16, 2.6), (128, 134, 2.2), (8, 57, 2.4), (232, 60, 2.4)]:
        m.blob(cx, cy, r, "path", only=SOFT)
    # 국경 뒤는 숲으로 막힘 (길 끝만 남김)
    m.rect(0, 50, 0, 62, "tree")
    return m.g


def coast(m):
    """동쪽 해안: 모래 → 얕은 물 → 깊은 물 (물결 모양)"""
    for y in range(18, H):
        b = 236 + round(2 * math.sin(y / 9) + math.sin(y / 3.7))
        for x in range(b, W):
            m.put(x, y, "sand" if x < b + 3 else "water" if x < b + 7 else "deep")


def river(m):
    """서쪽 숲에서 동쪽 바다로 흐르는 강 (가운데 깊은 물)"""
    m.line(RIVER, lambda x, y: m.blob(x, y, 2.6, "water", only=SOFT + ("sand", "path")))
    m.line(RIVER, lambda x, y: m.blob(x, y, 1.0, "deep"))
    m.line(RIVER, lambda x, y: m.blob(x, y - 3.4, 0.8, "sand", only=("moss", "grass", "tree")))


def castle(m):
    """숲속 성: 생울타리 성벽 · 나무 바닥 길·광장 · 세계수 · 성채 · 정령의 샘 · 나무 집"""
    x0, y0, x1, y1 = CASTLE
    m.rect(x0, y0, x1, y1, "grass")
    m.scatter(x0 + 2, y0 + 2, x1 - 2, y1 - 2, "flower", 10, (2, 5), only=("grass",))
    m.ring(x0, y0, x1, y1, "hedge")
    m.rect(x0 + 1, y0 + 2, x1 - 1, y0 + 9, "moss")
    m.rect(123, 26, 133, 33, "keep")
    m.rect(127, 34, 129, 40, "woodFloor")
    m.rect(120, 40, 136, 53, "woodFloor")
    m.blob(128, 47, 7.6, "moss")
    m.rect(123, 43, 133, 50, "bigTree")
    m.rect(x0, 55, x1, 57, "woodFloor")
    m.rect(127, 62, 129, y1, "woodFloor")
    # 정령의 샘 (남서) · 성 안 나무
    m.blob(110, 78, 3.4, "water")
    m.blob(110, 78, 1.4, "deep")
    for (x, y) in [(102, 30), (154, 30), (102, 46), (154, 46), (120, 80), (136, 80)]:
        m.put(x, y, "tree")
    for (x, y) in TOWN + [HERB]:
        m.rect(x, y, x + 2, y + 2, "bigTree")
        m.put(x + 1, y + 3, "woodFloor")


def village(m):
    """서쪽 나무 집 마을 (나무 바닥 길로 이어짐)"""
    for y in (70, 80, 90):
        m.rect(28, y, 82, y, "woodFloor")
    m.rect(57, 60, 59, 90, "woodFloor")
    for (x, y) in VILLAGE:
        m.rect(x - 1, y - 1, x + 3, y + 3, "moss")
        m.rect(x, y, x + 2, y + 2, "bigTree")
        m.put(x + 1, y + 3, "woodFloor")


def write_layout():
    lines = [
        "// 생성됨: scripts/art/world_virdia.py (손으로 고치지 않음) · 비르디아 필드 나무 집 문 자리 (칸)",
        "export const VIRDIA_HOUSE_DOORS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x + 1}, {y + 3}]" for x, y in VILLAGE + TOWN) + "];",
        f"export const VIRDIA_HERB_DOOR = [{HERB[0] + 1}, {HERB[1] + 3}] as const;",
        "",
    ]
    (PLACES / "virdiaLayout.ts").write_text("\n".join(lines), encoding="utf-8")


def check(g):
    """장소 표(virdiaField.ts)·문 자리가 걸을 수 있는 칸인지 · 문 바로 위는 나무 집·성채인지"""
    src = (PLACES / "virdiaField.ts").read_text(encoding="utf-8").split("VIRDIA_INSIDE")[0]
    pts = [(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)]
    bad = [p for p in pts if g[p[1]][p[0]] in SOLID]
    for (x, y) in [(x + 1, y + 3) for (x, y) in VILLAGE + TOWN + [HERB]] + [(128, 34)]:
        if g[y][x] in SOLID or g[y - 1][x] not in ("bigTree", "keep"):
            bad.append((x, y))
    assert not bad, f"걸을 수 없는 장소 자리: {bad}"
    print("비르디아 장소", len(pts), "곳 OK")
