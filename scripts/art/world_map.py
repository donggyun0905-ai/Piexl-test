"""세계 지도 나라 필드 그림 생성기 (docs/WORLD_MAP.md W2): 한 픽셀 = 한 칸, 색 = 땅 종류
색표는 apps/client/src/world/worldTiles.ts TILE_DEFS key와 같아야 함 · 장소 좌표는 world/worldPlaces.ts
실행: python3 scripts/art/world_map.py → apps/client/public/world/ascalon.png
"""
import random
from pathlib import Path
from PIL import Image

KEY = {
    "grass": (80, 168, 72), "path": (200, 168, 112), "water": (56, 120, 216), "deep": (24, 56, 144),
    "sand": (232, 216, 152), "tree": (24, 96, 40), "wall": (120, 112, 128), "floor": (176, 160, 144),
    "rock": (104, 88, 72), "bridge": (152, 104, 56), "snow": (240, 244, 252), "flower": (232, 120, 168),
    "field": (216, 192, 72), "fence": (168, 72, 40), "house": (200, 64, 120),
}
OUT = Path(__file__).resolve().parents[2] / "apps/client/public/world"


def ascalon():
    """아스칼론 필드 64×40: 서쪽 성(문은 아래·집 넷·꽃밭 분수) · 북쪽 바위산과 던전 입구 · 동쪽 강과 다리 · 동쪽 끝 비르디아 숲 · 남서 울타리 밭 · 남쪽 연못
    길은 구불구불(점마다 굵기·좌우 흔들림), 꽃·나무는 무리 지어"""
    W, H = 64, 40
    rnd = random.Random(7)
    g = [["grass"] * W for _ in range(H)]

    def put(x, y, k):
        if 0 <= x < W and 0 <= y < H:
            g[y][x] = k

    def rect(x0, y0, x1, y1, k):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                put(x, y, k)

    def blob(cx, cy, r, k, only=None):
        for y in range(int(cy - r) - 1, int(cy + r) + 2):
            for x in range(int(cx - r) - 1, int(cx + r) + 2):
                if (x - cx) ** 2 + (y - cy) ** 2 <= r * r and (only is None or (0 <= x < W and 0 <= y < H and g[y][x] in only)):
                    put(x, y, k)

    def road(pts, k="path"):
        """꺾은선을 따라 굵기 2~3칸 · 좌우로 살짝 흔들림"""
        wob = 0.0
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            n = max(abs(x1 - x0), abs(y1 - y0)) * 2
            for i in range(n + 1):
                x = x0 + (x1 - x0) * i / n
                y = y0 + (y1 - y0) * i / n
                wob = max(-0.8, min(0.8, wob + rnd.uniform(-0.25, 0.25)))
                ox, oy = (wob, 0) if x0 == x1 else (0, wob)
                blob(x + ox, y + oy, 1.1 + rnd.random() * 0.5, k, only=("grass", "flower", "tree", "rock"))

    # 가장자리 숲 (동쪽은 두껍게: 비르디아 국경) · 안쪽 가장자리는 들쭉날쭉
    for y in range(H):
        for x in range(W):
            edge = min(x, y, H - 1 - y)
            if edge < 2 or x >= W - 4 or (edge < 4 and rnd.random() < 0.45) or (x >= W - 7 and rnd.random() < 0.5):
                g[y][x] = "tree"
    # 북쪽 바위산 (아래로 갈수록 듬성) · 산자락 바위 몇 개
    for y in range(2, 9):
        for x in range(27, 47):
            if rnd.random() < 0.9 - (y - 2) * 0.09 - abs(x - 37) * 0.012:
                g[y][x] = "rock"
    for _ in range(8):
        put(rnd.randrange(26, 48), rnd.randrange(9, 12), "rock")
    # 작은 숲 무리 · 꽃 무리
    for (cx, cy) in [(6, 7), (22, 6), (52, 8), (54, 30), (31, 15), (8, 30), (40, 36)]:
        for _ in range(rnd.randrange(3, 7)):
            put(cx + rnd.randrange(-2, 3), cy + rnd.randrange(-1, 2), "tree")
    for _ in range(16):
        cx, cy = rnd.randrange(4, W - 8), rnd.randrange(4, H - 4)
        for _ in range(rnd.randrange(4, 11)):
            x, y = cx + rnd.randrange(-2, 3), cy + rnd.randrange(-2, 3)
            if 0 <= x < W and 0 <= y < H and g[y][x] == "grass":
                g[y][x] = "flower"
    # 남서 밭 · 울타리 (위 오른쪽 열림)
    rect(4, 32, 14, 36, "field")
    for x in range(3, 16):
        put(x, 37, "fence")
        if x < 12:
            put(x, 31, "fence")
    for y in range(31, 38):
        put(3, y, "fence")
        put(15, y, "fence")
    put(15, 32, "grass")
    put(15, 33, "grass")
    # 남쪽 연못 (가운데 깊음) · 물가 꽃
    for (px, py, r) in [(26, 35, 2.4), (28.5, 35.5, 2.0), (24, 35.5, 1.6)]:
        blob(px, py, r, "water", only=("grass", "flower", "tree"))
    blob(26.5, 35.3, 1.0, "deep")
    # 강 (구불구불) · 물가 모래
    for y in range(H):
        cx = 45 + round(1.3 * __import__("math").sin(y / 4.5))
        for x in range(cx - 3, cx + 4):
            put(x, y, "sand" if abs(x - cx) == 3 else ("deep" if abs(x - cx) == 0 else "water"))
    # 성: 벽 x 8~26, y 12~28 · 안은 바닥 · 아래 가운데 문
    rect(8, 12, 26, 28, "wall")
    rect(9, 13, 25, 27, "floor")
    rect(16, 28, 18, 28, "floor")
    # 성 안 마을: 집 넷 · 꽃밭에 둘러싸인 분수 · 위쪽 장군 자리
    for (hx, hy) in [(10, 14), (22, 14), (10, 24), (22, 24)]:
        rect(hx, hy, hx + 2, hy + 1, "house")
    rect(15, 17, 19, 20, "flower")
    rect(16, 18, 18, 19, "water")
    # 길: 성문 → 남쪽 → 동쪽 → 북쪽 던전 앞 마당 · 갈림길에서 동쪽 다리 → 국경
    road([(17, 29), (17, 30), (24, 31), (33, 30), (37, 29), (37, 20), (36, 13), (36, 9)])
    road([(37, 20), (60, 20)])
    blob(36.5, 9.5, 2.2, "path", only=("grass", "flower", "tree", "rock"))
    for x in range(38, 52):
        for y in range(18, 22):
            if g[y][x] in ("water", "deep", "sand") and 19 <= y <= 20:
                put(x, y, "bridge")
    # 국경 표지판 앞까지 길, 그 뒤는 숲으로 막힘
    rect(61, 16, 63, 23, "tree")
    # 장소 자리는 비워 둠 (worldPlaces.ts 좌표)
    for (x, y) in [(14, 22), (36, 9), (38, 30), (58, 19), (17, 30), (17, 14), (11, 18), (23, 21), (20, 26)]:
        if g[y][x] not in ("path", "floor", "grass"):
            put(x, y, "path" if g[y][x] != "flower" else "grass")
    return g


def save(name, g):
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (len(g[0]), len(g)))
    img.putdata([KEY[k] for row in g for k in row])
    img.save(OUT / f"{name}.png", optimize=True)
    print(OUT / f"{name}.png", img.size)


if __name__ == "__main__":
    save("ascalon", ascalon())
