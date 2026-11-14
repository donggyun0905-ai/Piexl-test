"""해저 도시 필드 256×160 (docs/WORLD_MAP.md 4장 추후: 바닷속 도시 · 탈라시아 잔교 끝 잠수 종으로 내려옴, 9장)
있는 칸을 쓰고 그림은 Region.skin으로: 풀 = 해저 모래 · 길·바닥 = 진주 돌길 · 모래 = 산호 바닥 · 밭 = 해초밭 · 물 = 깊은 해구
집 = 조개 집·공기 방울 돔 · 성채 = 해저 신전 · 나무 = 키 큰 해초·큰 산호
- 북쪽 가운데: 잠수 종이 내려오는 곳 · 가운데: 진주 돌길 광장과 조개 집 마을 · 그 위 해저 신전
- 남쪽: 동서로 갈라진 깊은 해구(심연 던전) · 곳곳 해초밭·산호초
"""
from world_lands import check as check_places, edge_noise, houses, write_layout as write_ts
from world_map import Grid

W, H = 256, 160
TEMPLE = (122, 34, 134, 45)
HOUSES = [(x, y) for y in (54, 62, 70, 78) for x in (96, 102, 108)] + [(x, y) for y in (54, 62, 70, 78) for x in (146, 152, 158)]
DOORS = [(x + 1, y + 2) for (x, y) in HOUSES]
TRENCH = [(4, 134), (50, 128), (100, 136), (150, 128), (200, 134), (252, 128)]
DECOS = [("clam", x, y) for (x, y) in [(118, 60), (138, 60), (60, 40), (200, 44), (40, 100), (220, 100)]] \
    + [("chest", x, y) for (x, y) in [(84, 112), (176, 110), (30, 30)]] \
    + [("coral", x, y) for (x, y) in [(118, 84), (138, 84), (70, 70), (186, 70), (110, 24), (146, 24)]] \
    + [("kelp", x, y) for (x, y) in [(90, 50), (166, 50), (90, 90), (166, 90)]]
SOFT = ("grass", "field", "sand", "tree", "rock")


def undersea():
    m = Grid(W, H, "grass", seed=211)
    rnd = m.rnd
    edge_noise(m, "rock")
    # 해초밭 · 산호초 · 해초 숲(나무 칸)
    for _ in range(26):
        m.blob(rnd.randrange(10, W - 10), rnd.randrange(10, H - 30), rnd.uniform(4, 8), "field", only=("grass",))
    for _ in range(18):
        m.blob(rnd.randrange(10, W - 10), rnd.randrange(10, H - 30), rnd.uniform(3, 6), "sand", only=("grass", "field"))
    m.scatter(8, 8, W - 8, H - 30, "tree", 34, (3, 7), only=("grass", "field"))
    m.scatter(8, 8, W - 8, H - 8, "rock", 10, (2, 4), only=("grass",))
    # 남쪽 깊은 해구
    m.line(TRENCH, lambda x, y: m.blob(x, y, 7.0, "water"))
    m.line(TRENCH, lambda x, y: m.blob(x, y, 3.6, "deep"))
    city(m)
    # 진주 돌길: 잠수 종 → 광장 → 해구 가장자리 · 동서 큰길
    m.road([(128, 1), (128, 20), (128, 34)], only=SOFT)
    m.road([(128, 88), (126, 106), (128, 118)], only=SOFT)
    m.road([(90, 66), (50, 70), (10, 64)], only=SOFT)
    m.road([(166, 66), (210, 62), (246, 68)], only=SOFT)
    m.blob(128, 4, 3.2, "path", only=SOFT)
    m.blob(128, 119, 3.0, "path", only=SOFT)
    return m.g


def city(m):
    """광장 · 집 둘레 길 · 해저 신전"""
    m.rect(92, 48, 164, 88, "grass")
    m.rect(116, 48, 140, 88, "floor")
    for y in (52, 60, 68, 76, 84):
        m.rect(92, y + 4, 164, y + 4, "path")
    m.rect(*TEMPLE, "keep")
    m.rect(126, 46, 130, 48, "floor")
    houses(m, HOUSES)


def write_layout():
    write_ts("undersea", "SEA", DOORS, DECOS)


def check(g):
    check_places(g, "underseaField", DECOS, DOORS + [(128, TEMPLE[3] + 1)], "해저 도시")
