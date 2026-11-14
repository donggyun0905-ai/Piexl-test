"""사이버펑크 도시 필드 256×160 (docs/WORLD_MAP.md 4장 추후: 현대 도시와 맞물린 네온 거리 · 테라코어 역에서 해저 열차로 5분, 9장)
있는 칸을 쓰고 그림은 Region.skin으로: 풀 = 보도블록 · 길 = 아스팔트 · 바닥 = 광장 타일 · 모래 = 젖은 길 · 밭 = 네온 줄 바닥
제국 집(villa) = 빌딩 · 궁전(palace) = 네온 빌딩 · 집 = 편의점 · 성벽 = 네온 담
- 서쪽 끝: 해저 열차 역 (승강장·철길) · 서쪽 반: 낮은 현대 도시(빌딩·광장) · 동쪽 반: 젖은 네온 거리(네온 빌딩·홀로그램)
"""
from world_lands import check as check_places, edge_noise, houses, write_layout as write_ts
from world_map import Grid

W, H = 256, 160
RX = [40, 90, 140, 190, 230]
RY = [30, 60, 90, 120]
COLS = [(6, 38), (42, 88), (92, 138), (142, 188), (192, 228), (232, 249)]
ROWS = [(5, 28), (32, 58), (62, 88), (92, 118), (122, 154)]
PLAZA = (92, 62, 138, 88)
NEON = (142, 92, 188, 118)
STORE_SPOTS = []
for (x0, x1) in COLS[1:]:
    for (y0, y1) in ROWS:
        STORE_SPOTS.append((x1 - 4, y1 - 2))
STORE_SPOTS = [s for s in STORE_SPOTS if not (PLAZA[0] <= s[0] <= PLAZA[2] and PLAZA[1] <= s[1] <= PLAZA[3]) and not (NEON[0] <= s[0] <= NEON[2] and NEON[1] <= s[1] <= NEON[3])]
DOORS = [(x + 1, y + 2) for (x, y) in STORE_SPOTS]
DECOS = [("streetLamp", x, y) for x in (44, 86, 94, 136, 144, 186, 194, 226) for y in (34, 64, 94)] \
    + [("hologram", x, y) for (x, y) in [(104, 70), (126, 70), (104, 82), (126, 82), (156, 100), (174, 100), (156, 112), (174, 112)]] \
    + [("vending", x, y) for (x, y) in [(46, 66), (96, 34), (198, 66), (146, 36), (236, 96)]] \
    + [("neonSign", x, y) for (x, y) in [(150, 96), (180, 96), (200, 124), (236, 34)]] \
    + [("car", x, y) for (x, y) in [(60, 29), (116, 59), (170, 89), (210, 119), (90, 140)]] \
    + [("trashBin", x, y) for (x, y) in [(52, 54), (100, 116), (160, 54), (214, 86), (246, 148)]] \
    + [("airVent", x, y) for (x, y) in [(70, 8), (170, 8), (220, 150)]] \
    + [("utilityPole", x, y) for (x, y) in [(20, 36), (20, 116), (60, 150), (110, 8)]]


def cyber():
    m = Grid(W, H, "grass", seed=2077)
    edge_noise(m, "wall", 2, 2)
    # 동쪽 젖은 네온 거리
    m.rect(142, 4, 252, 156, "sand", only=("grass",))
    # 큰길 (아스팔트 3칸)
    for x in RX:
        m.rect(x - 1, 2, x + 1, H - 3, "path")
    for y in RY:
        m.rect(18, y - 1, W - 3, y + 1, "path")
    m.rect(*PLAZA, "floor")
    m.rect(*NEON, "field")
    buildings(m)
    station(m)
    return m.g


def buildings(m):
    """덩어리마다 빌딩 하나 (서쪽 villa = 빌딩, 동쪽 palace = 네온 빌딩) · 오른쪽 아래 편의점"""
    for (x0, x1) in COLS[1:]:
        for (y0, y1) in ROWS:
            if PLAZA[0] <= x0 <= PLAZA[2] and PLAZA[1] <= y0 <= PLAZA[3] or NEON[0] <= x0 <= NEON[2] and NEON[1] <= y0 <= NEON[3]:
                continue
            k = "palace" if x0 >= 142 else "villa"
            w = 7 if k == "palace" else 6
            # 덩어리 폭을 따라 빌딩 여럿 (높이는 번갈아)
            for i, bx in enumerate(range(x0 + 3, x1 - 9, w + 3)):
                by = y0 + (6 if y1 - y0 >= 20 else 2) + (i % 2) * 2
                m.rect(bx, by, bx + w - 1, min(by + 6, y1 - 5), k)
    houses(m, STORE_SPOTS)


def station(m):
    """서쪽 끝 해저 열차 역: 철길 두 줄 · 승강장 (광장 타일) · 역 앞 길"""
    m.rect(3, 56, 4, 96, "rail")
    m.rect(5, 64, 17, 86, "floor")
    m.rect(18, 74, 40, 76, "path")


def write_layout():
    write_ts("cyber", "CYBER", DOORS, DECOS)


def check(g):
    check_places(g, "cyberField", DECOS, DOORS, "사이버펑크")
