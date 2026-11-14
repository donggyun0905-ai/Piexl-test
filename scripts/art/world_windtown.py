"""바람골 필드 256×160 (docs/WORLD_MAP.md 4장 추후: 바람이 시원한 옛 기와 도시 · 비르디아 동쪽 해안에서 나룻배, 9장)
있는 칸을 쓰고 그림은 Region.skin으로: 길 = 기와 도시 돌길 · 바닥 = 흙 마당 · 모래 = 꽃잎 길 · 밭 = 대나무숲 땅 · 물 = 맑은 개울
집 = 기와집 · 성채 = 큰 기와집 · 나무 = 꽃나무·대나무
- 서쪽 끝: 나루 (비르디아로) → 꽃잎 길 → 개울 건너 기와 마을(흙 마당·큰 기와집) · 북서 풍차 언덕 · 남동 대나무숲 · 북동 바람 골짜기 던전
"""
from world_lands import check as check_places, edge_noise, houses, write_layout as write_ts
from world_map import Grid

W, H = 256, 160
STREAM = [(96, 0), (104, 30), (94, 60), (106, 90), (98, 120), (104, 159)]
MANOR = (146, 30, 154, 36)
HOUSES = [(x, y) for y in (50, 58, 66, 74, 82) for x in (126, 132, 138)] + [(x, y) for y in (50, 58, 66, 74, 82) for x in (160, 166, 172)]
DOORS = [(x + 1, y + 2) for (x, y) in HOUSES]
DECOS = [("windmill", x, y) for (x, y) in [(40, 24), (56, 18), (70, 30)]] \
    + [("pinwheel", x, y) for (x, y) in [(46, 34), (62, 36), (34, 40), (144, 46), (156, 46), (120, 70), (178, 70), (150, 92)]] \
    + [("clothBanner", x, y) for (x, y) in [(142, 40), (158, 40), (124, 90), (176, 90), (112, 80), (24, 76)]] \
    + [("pavilion", x, y) for (x, y) in [(116, 104), (84, 52)]] \
    + [("jars", x, y) for (x, y) in [(130, 56), (168, 56), (130, 72), (168, 72), (148, 62)]] \
    + [("stoneWall", x, y) for (x, y) in [(122, 46), (178, 46), (122, 94), (178, 94)]] \
    + [("blossom", x, y) for x in (20, 34, 48, 62, 76) for y in (74, 86)]
SOFT = ("grass", "flower", "tree", "rock", "field")


def windtown():
    m = Grid(W, H, "grass", seed=1004)
    rnd = m.rnd
    edge_noise(m, "tree")
    m.scatter(8, 8, W - 8, H - 8, "flower", 20, (3, 6))
    m.scatter(8, 8, W - 8, H - 8, "tree", 22, (3, 7))
    # 남동 대나무숲 (대나무 땅 + 대나무)
    m.rect(170, 104, 248, 152, "field", only=("grass", "flower", "tree"))
    m.scatter(172, 106, 246, 150, "tree", 26, (4, 8), only=("field",))
    # 맑은 개울
    m.line(STREAM, lambda x, y: m.blob(x, y, 2.2, "water"))
    town(m)
    # 꽃잎 길: 나루 → 개울(다리) → 마을 · 풍차 언덕 · 대나무숲 · 골짜기 던전
    m.road([(2, 80), (60, 80), (124, 80)], k="sand", only=SOFT + ("water",))
    m.rect(98, 78, 108, 82, "bridge", only=("water",))
    m.road([(150, 92), (160, 110), (200, 128)], only=SOFT)
    m.road([(124, 50), (80, 40), (56, 28)], only=SOFT + ("water",))
    m.rect(98, 38, 108, 44, "bridge", only=("water",))
    m.road([(154, 28), (190, 18), (210, 10)], only=SOFT)
    m.blob(4, 80, 3.0, "floor", only=SOFT + ("sand",))
    m.blob(210, 10, 2.6, "path", only=SOFT)
    return m.g


def town(m):
    """기와 마을: 흙 마당 · 돌길 · 큰 기와집 · 기와집"""
    m.rect(120, 26, 182, 96, "floor")
    for y in (48, 56, 64, 72, 80, 88):
        m.rect(122, y + 4, 180, y + 4, "path")
    m.rect(148, 37, 152, 96, "path")
    m.rect(*MANOR, "keep")
    houses(m, HOUSES)


def write_layout():
    write_ts("windtown", "WIND", DOORS, DECOS)


def check(g):
    check_places(g, "windtownField", DECOS, DOORS + [(150, MANOR[3] + 1)], "바람골")
