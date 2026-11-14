"""지옥 필드 256×160 (docs/WORLD_MAP.md 4장 추후: 지옥불이 퍼진 땅 · 실베르 악마의 문 너머, 9장)
있는 칸을 쓰고 그림은 Region.skin으로: 풀 = 재 덮인 땅 · 길 = 그을린 현무암 · 바닥 = 흑요석 · 모래 = 갈라진 붉은 땅 · 물 = 용암 · 나무 = 뼈 나무 · 성채 = 악마의 문
- 북쪽 끝: 실베르 악마의 문에서 넘어오는 곳 · 가운데: 흑요석 성채(성벽·네 문) 안 악마의 문 = 지옥 던전
- 용암 강 둘(현무암 둑길로 건넘) · 용암 호수 · 서쪽·동쪽 해골 기둥 초소 · 남쪽 불 구덩이 벌판
장소 좌표는 apps/client/src/world/places/hellField.ts · 장식 자리는 hellLayout.ts로
"""
from world_lands import check as check_places, edge_noise, write_layout as write_ts
from world_map import Grid

W, H = 256, 160
LAVA = [[(0, 40), (50, 36), (100, 44), (160, 40), (210, 46), (255, 38)], [(0, 124), (60, 118), (120, 126), (180, 120), (255, 128)]]
LAKES = [(40, 64, 7), (210, 104, 8), (60, 146, 5), (196, 18, 6)]
CITADEL = (100, 54, 156, 106)
KEEP = (122, 60, 134, 71)
SOFT = ("grass", "sand", "tree", "rock", "water", "deep")
DECOS = [("skullPillar", x, y) for y in (12, 24, 50) for x in (124, 132)] \
    + [("twistedTower", x, y) for (x, y) in [(94, 50), (162, 50), (94, 110), (162, 110)]] \
    + [("firePit", x, y) for (x, y) in [(114, 64), (142, 64), (114, 96), (142, 96), (120, 140), (136, 140), (28, 76), (228, 76)]] \
    + [("chainPost", x, y) for (x, y) in [(124, 108), (132, 108), (96, 78), (96, 84), (160, 78), (160, 84)]] \
    + [("skullPillar", x, y) for (x, y) in [(22, 74), (34, 74), (222, 74), (234, 74)]] \
    + [("spikyRock", x, y) for (x, y) in [(70, 100), (186, 64), (150, 140), (80, 20)]]


def hell():
    m = Grid(W, H, "grass", seed=666)
    rnd = m.rnd
    edge_noise(m, "rock")
    # 바깥쪽 갈라진 붉은 땅 · 뼈 나무 · 가시 바위
    for _ in range(34):
        x, y = rnd.randrange(8, W - 8), rnd.randrange(8, H - 8)
        if abs(x - 128) > 40 or abs(y - 80) > 34:
            m.blob(x, y, rnd.uniform(4, 9), "sand", only=("grass",))
    m.scatter(8, 8, W - 8, H - 8, "tree", 30, (2, 6), only=("grass", "sand"))
    m.scatter(8, 8, W - 8, H - 8, "rock", 16, (2, 5), only=("grass", "sand"))
    # 용암 강 · 호수
    for river in LAVA:
        m.line(river, lambda x, y: m.blob(x, y, 2.6, "water"))
        m.line(river, lambda x, y: m.blob(x, y, 1.1, "deep"))
    for (cx, cy, r) in LAKES:
        m.blob(cx, cy, r, "water")
        m.blob(cx, cy, r * 0.55, "deep")
    citadel(m)
    # 현무암 길 (용암은 둑길로 건넘)
    m.road([(128, 1), (128, 30), (128, 54)], only=SOFT)
    m.road([(128, 106), (124, 130), (128, 152)], only=SOFT)
    m.road([(100, 81), (60, 84), (8, 80)], only=SOFT)
    m.road([(156, 81), (200, 78), (248, 80)], only=SOFT)
    m.blob(128, 4, 3.0, "path", only=SOFT)
    # 초소 (흑요석 마당) · 남쪽 불 구덩이 벌판
    for (cx, cy) in [(28, 80), (228, 80), (128, 142)]:
        m.rect(cx - 7, cy - 5, cx + 7, cy + 5, "floor")
    return m.g


def citadel(m):
    """흑요석 성채: 성벽 · 네 문 · 안 마당 · 악마의 문(성채 그림)"""
    x0, y0, x1, y1 = CITADEL
    m.rect(x0, y0, x1, y1, "floor")
    m.ring(x0, y0, x1, y1, "wall")
    m.rect(126, y0, 130, y0, "floor")
    m.rect(126, y1, 130, y1, "floor")
    m.rect(x0, 78, x0, 83, "floor")
    m.rect(x1, 78, x1, 83, "floor")
    m.rect(*KEEP, "keep")


def write_layout():
    write_ts("hell", "HELL", [], DECOS)


def check(g):
    check_places(g, "hellField", DECOS, [(128, KEEP[3] + 1)], "지옥")
