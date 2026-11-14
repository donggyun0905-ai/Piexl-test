"""테라코어 필드 256×160 (docs/WORLD_MAP.md 4장: 아스칼론 동쪽, 기계 도시)
- 가운데: 쇠 성벽 도시 (철판 바닥 · 북쪽 공장 지대(굴뚝·파이프) · 가운데 광장(톱니 기념물) · 남쪽 주거지 · 서·동·남 성문)
- 남문 밖: 역(승강장)과 동서로 가로지르는 철길 · 그 아래 콜로세움 (패왕전)
- 북동 광산 (바위산·철길·던전 입구) · 서쪽 아스칼론 국경 길 · 동쪽 비르디아 국경 숲 · 남쪽 사막 끝 · 남서 호수
장소 좌표는 apps/client/src/world/places/terraField.ts · 집 문은 생성기가 terraLayout.ts로 씀
"""
import math
import re
from pathlib import Path

from world_map import Grid

W, H = 256, 160
ROOT = Path(__file__).resolve().parents[2]
PLACES = ROOT / "apps/client/src/world/places"
SOFT = ("grass", "flower", "tree", "rock")
SOLID = {"water", "deep", "tree", "wall", "rock", "fence", "house", "keep", "innerWall", "factory", "pipe", "arena", "warehouse"}

# 공장 (왼쪽 위, 7×5) — 첫째는 공방 (문 있음)
FACTORIES = [(x, 25) for x in (76, 86, 96, 106, 148, 158, 168, 178)]
HOUSES = [(x, y) for y in (70, 77, 84) for x in [74, 80, 86, 92, 98, 104, 110, 134, 140, 146, 152, 158, 164, 170, 176]]
COLO = (150, 126, 17, 10)
# 쇠 창고 (왼쪽 위, 5×3, 문 없음 · 창고 칸 warehouse에 테라코어 그림 warehouse_metal) · 배수 격자 자리 (왼쪽 위, 3×2 · gravel 칸에 그림 grate)
WAREHOUSES = [(116, 26), (134, 26), (140, 26), (84, 97)]
GRATES = [(80, 34), (100, 34), (152, 34), (172, 34), (117, 60), (137, 60), (117, 49), (137, 49)]
# 굴뚝 탑 (장식 자리 = 공장 사이 틈)
STACKS = [(84, 29), (104, 29), (156, 29), (176, 29)]  # 가운데 x, y · 반지름 가로·세로


def terra():
    m = Grid(W, H, "grass", seed=23)
    rnd = m.rnd
    # 가장자리 숲 (동쪽은 비르디아 국경이라 두껍게)
    for y in range(H):
        for x in range(W):
            edge = min(x, y, W - 1 - x, H - 1 - y)
            if edge < 2 or (edge < 5 and rnd.random() < 0.45) or (x > W - 10 and rnd.random() < 0.7):
                m.put(x, y, "tree")
    for (cx, cy) in [(30, 30), (40, 80), (230, 90), (220, 130), (60, 135), (20, 110), (110, 140), (240, 30)]:
        m.scatter(cx - 8, cy - 5, cx + 8, cy + 5, "tree", 5, (4, 9))
    m.scatter(10, 10, 250, 148, "flower", 22, (3, 8))
    # 북동 광산 바위산 · 고철 더미(바위)
    for y in range(1, 18):
        for x in range(140, 252):
            if rnd.random() < 0.95 - y * 0.05 - abs(x - 205) * 0.003:
                m.put(x, y, "rock")
    m.scatter(20, 60, 240, 145, "rock", 10, (1, 4))
    # 남서 호수
    m.blob(40, 122, 7.5, "sand", only=SOFT)
    m.blob(40, 122, 6.2, "water")
    m.blob(40, 122, 3.0, "deep")
    # 남쪽 사막 끝
    for x in range(2, W - 2):
        top = 151 + round(2 * math.sin(x / 8) + math.sin(x / 3.3))
        for y in range(top, H - 2):
            m.put(x, y, "sand")
    city(m)
    colosseum(m)
    # 길: 서쪽 국경 → 서문 · 동문 → 비르디아 국경 · 남문 → 역 → 콜로세움 · 광산 갈림
    m.road([(1, 56), (40, 57), (69, 56)])
    m.road([(187, 56), (220, 55), (250, 56)])
    m.road([(128, 95), (128, 118), (136, 140), (150, 141)])
    m.road([(205, 56), (205, 20)])
    m.road([(128, 118), (110, 140), (100, 152)], only=SOFT + ("sand",))
    for (cx, cy, r) in [(205, 14, 2.6), (150, 140, 2.2), (8, 57, 2.4)]:
        m.blob(cx, cy, r, "path", only=SOFT + ("sand",))
    # 역 승강장 · 철길 (동서 두 줄 · 광산으로 남북 한 줄) — 길 위에도 깔림
    m.rect(88, 101, 112, 103, "floor")
    m.rect(96, 97, 104, 100, "factory")
    m.rect(2, 104, W - 3, 105, "rail")
    m.rect(204, 16, 205, 103, "rail")
    m.rect(204, 14, 205, 15, "path")
    # 국경 뒤는 숲으로 막힘 (길 끝만 남김)
    m.rect(252, 50, 255, 62, "tree")
    return m.g


def city(m):
    """쇠 성벽 도시 x 70~186, y 22~94"""
    m.rect(70, 22, 186, 94, "metal")
    m.ring(70, 22, 186, 94, "wall")
    # 큰길 · 공장 앞길 · 성문 셋 · 광장
    m.rect(127, 23, 129, 94, "floor")
    m.rect(70, 55, 186, 57, "floor")
    m.rect(72, 38, 184, 40, "floor")
    m.rect(116, 46, 140, 66, "floor")
    # 공장 · 문 앞 길
    for (x, y) in FACTORIES:
        m.rect(x, y, x + 6, y + 4, "factory")
        m.rect(x + 2, y + 5, x + 4, 37, "floor")
    # 파이프 (공장 지대와 아래 사이, 길·문 앞 길 자리는 비움)
    for x in range(72, 185):
        if m.get(x, 33) == "metal":
            m.put(x, 33, "pipe")
    # 주거지 집
    for (x, y) in HOUSES:
        m.rect(x, y, x + 2, y + 1, "house")
    for (x, y) in WAREHOUSES:
        m.rect(x, y, x + 4, y + 2, "warehouse")
    for (x, y) in GRATES:
        m.rect(x, y, x + 2, y + 1, "gravel")
    # 성 안 작은 화단·나무
    for (x, y) in [(74, 90), (182, 90), (182, 46), (74, 46), (120, 90), (136, 90)]:
        m.put(x, y, "tree")


def colosseum(m):
    """콜로세움: 둥근 돌벽 (두께 약 2칸) · 안은 모래 · 아래 가운데 입구"""
    cx, cy, rx, ry = COLO
    for y in range(cy - ry - 2, cy + ry + 3):
        for x in range(cx - rx - 2, cx + rx + 3):
            d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
            if d <= 1.0:
                m.put(x, y, "sand")
            elif d <= 1.45:
                m.put(x, y, "arena")
    m.rect(cx - 1, cy + ry - 1, cx + 1, cy + ry + 3, "floor")


def write_layout():
    doors = [(x + 1, y + 2) for (x, y) in HOUSES]
    w = FACTORIES[0]
    lines = [
        "// 생성됨: scripts/art/world_terra.py (손으로 고치지 않음) · 테라코어 필드 문·굴뚝 자리 (칸)",
        "export const TERRA_HOUSE_DOORS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x}, {y}]" for x, y in doors) + "];",
        f"export const TERRA_WORKSHOP_DOOR = [{w[0] + 3}, {w[1] + 5}] as const;",
        "export const TERRA_STACKS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x}, {y}]" for x, y in STACKS) + "];",
        "export const TERRA_CHIMNEYS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x + 1}, {y}]" for x, y in FACTORIES + [(96, 97)]) + "];",
        "",
    ]
    (PLACES / "terraLayout.ts").write_text("\n".join(lines), encoding="utf-8")


def check(g):
    """장소 표(terraField.ts)·문 자리가 걸을 수 있는 칸인지 · 문 바로 위는 건물인지"""
    src = (PLACES / "terraField.ts").read_text(encoding="utf-8").split("TERRA_INSIDE")[0]
    pts = [(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)]
    bad = [p for p in pts if g[p[1]][p[0]] in SOLID]
    for (x, y) in [(x + 1, y + 2) for (x, y) in HOUSES] + [(FACTORIES[0][0] + 3, FACTORIES[0][1] + 5)]:
        if g[y][x] in SOLID or g[y - 1][x] not in ("house", "factory"):
            bad.append((x, y))
    assert not bad, f"걸을 수 없는 장소 자리: {bad}"
    print("테라코어 장소", len(pts), "곳 OK")
