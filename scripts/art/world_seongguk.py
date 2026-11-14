"""성국 필드 256×160 (docs/WORLD_MAP.md 4장: 세레스티아 아래 서쪽 · 거대한 대성당의 나라 · 대사막 서남쪽 순례길, 8장)
있는 칸을 쓰고 그림은 Region.skin으로: 풀 = 성당 정원 잔디 · 길 = 순례길 · 바닥 = 흰 성당 돌바닥 · 성벽 위 = 흰 돌 · 집 = 수도원 · 성채 = 대성당
- 동쪽 끝: 대사막에서 오는 순례길 → 흰 성벽 성도(네 문) · 가운데 대성당(안 지도) · 수도원 · 종탑·성화
- 북서 지하 묘지 던전 · 남서 성스러운 호수 · 꽃 정원
"""
from world_lands import check as check_places, edge_noise, houses, write_layout as write_ts
from world_lands import pave
from world_map import Grid

W, H = 256, 160
CITY = (64, 40, 140, 120)
CATHEDRAL = (95, 50, 109, 63)
HOUSES = [(x, y) for y in (74, 82, 90, 98, 106) for x in (72, 78, 84)] + [(x, y) for y in (74, 82, 90, 98, 106) for x in (118, 124, 130)]
DOORS = [(x + 1, y + 2) for (x, y) in HOUSES]
DECOS = [("bellTower", x, y) for (x, y) in [(88, 60), (116, 60)]] \
    + [("holyBrazier", x, y) for (x, y) in [(96, 68), (108, 68), (102, 116), (146, 76), (146, 84)]] \
    + [("angel", x, y) for (x, y) in [(92, 76), (112, 76), (92, 100), (112, 100)]] \
    + [("candles", x, y) for (x, y) in [(98, 86), (106, 86), (40, 34), (52, 34)]] \
    + [("whiteBanner", x, y) for (x, y) in [(68, 44), (136, 44), (68, 116), (136, 116), (170, 78), (210, 78)]]
SOFT = ("grass", "flower", "tree", "rock")


def seongguk():
    m = Grid(W, H, "grass", seed=777)
    edge_noise(m, "tree")
    m.scatter(8, 8, W - 8, H - 8, "tree", 24, (3, 7))
    m.scatter(8, 8, W - 8, H - 8, "flower", 30, (3, 7))
    # 남서 성스러운 호수
    m.blob(36, 128, 10, "water")
    m.blob(36, 128, 5, "deep")
    city(m)
    # 순례길: 동쪽 끝(대사막) → 동문 · 북서 지하 묘지 · 남문 → 호수
    m.road([(253, 80), (200, 82), (141, 80)], only=SOFT)
    m.road([(64, 80), (40, 60), (46, 30)], only=SOFT)
    m.road([(102, 120), (80, 132), (52, 128)], only=SOFT)
    m.blob(46, 28, 3.2, "floor", only=SOFT)
    # 성도 안은 흰 대리석 (snowStone 칸 + skin marble) · 수도원 앞뜰 둘만 풀밭과 꽃
    pave(m, (65, 41, 139, 119), "snowStone", gardens=[(66, 42, 86, 58), (118, 42, 138, 58)])
    return m.g


def city(m):
    """흰 성벽 성도: 돌바닥 · 네 문 · 대성당 · 가운데 큰길 · 수도원"""
    x0, y0, x1, y1 = CITY
    m.rect(x0, y0, x1, y1, "grass")
    m.ring(x0, y0, x1, y1, "wall")
    m.rect(x0 + 1, 76, x1 - 1, 84, "floor")
    m.rect(96, y0 + 1, 108, y1 - 1, "floor")
    m.rect(86, 64, 118, 72, "floor")
    for y in (74, 82, 90, 98, 106):
        m.rect(x0 + 1, y + 2, 92, y + 2, "path")
        m.rect(112, y + 2, x1 - 1, y + 2, "path")
    for (gx, gy) in [(x0, 80), (x1, 80)]:
        m.rect(gx, gy - 2, gx, gy + 2, "floor")
    m.rect(100, y1, 104, y1, "floor")
    m.rect(*CATHEDRAL, "keep")
    houses(m, HOUSES)


def write_layout():
    write_ts("seongguk", "HOLY", DOORS, DECOS)


def check(g):
    check_places(g, "seonggukField", DECOS, DOORS + [(102, CATHEDRAL[3] + 1)], "성국")
