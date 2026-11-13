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
    "field": (216, 192, 72),
}
OUT = Path(__file__).resolve().parents[2] / "apps/client/public/world"


def ascalon():
    """아스칼론 필드 64×40: 서쪽 성(문은 아래) · 북쪽 바위산과 던전 입구 · 동쪽 강과 다리 · 동쪽 끝 비르디아 숲 · 남서 밭"""
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

    # 가장자리 숲 (동쪽은 두껍게: 비르디아 국경)
    for y in range(H):
        for x in range(W):
            edge = min(x, y, H - 1 - y)
            if edge < 2 or x >= W - 4 or (edge < 4 and rnd.random() < 0.35):
                g[y][x] = "tree"
    # 꽃·흩어진 나무
    for _ in range(90):
        put(rnd.randrange(4, W - 6), rnd.randrange(4, H - 4), "flower")
    for _ in range(40):
        put(rnd.randrange(4, W - 6), rnd.randrange(4, H - 4), "tree")
    # 남서 밭
    rect(4, 32, 14, 36, "field")
    # 북쪽 바위산
    for y in range(2, 9):
        for x in range(28, 46):
            if rnd.random() < 0.85 - (y - 2) * 0.08:
                g[y][x] = "rock"
    # 강 (x 44~46, 구불구불) · 물가 모래
    for y in range(H):
        cx = 45 + (1 if (y // 6) % 2 else 0)
        for x in range(cx - 3, cx + 4):
            put(x, y, "sand" if abs(x - cx) == 3 else ("deep" if x == cx else "water"))
    # 성: 벽 x 8~26, y 12~28 · 안은 바닥 · 아래 가운데 문
    rect(8, 12, 26, 28, "wall")
    rect(9, 13, 25, 27, "floor")
    rect(16, 28, 18, 28, "floor")
    # 길: 성문 → 남쪽 → 동쪽 갈림길 → 북쪽 던전 · 동쪽 다리 → 국경
    rect(16, 29, 18, 31, "path")
    rect(18, 30, 38, 31, "path")
    rect(36, 9, 37, 31, "path")
    rect(37, 19, 60, 20, "path")
    for x in range(41, 50):
        if g[19][x] in ("water", "deep", "sand"):
            put(x, 19, "bridge")
            put(x, 20, "bridge")
    rect(34, 8, 39, 9, "path")
    # 국경 표지판 앞까지 길, 그 뒤는 숲으로 막힘
    rect(60, 17, 63, 22, "tree")
    # 장소 자리는 비워 둠 (worldPlaces.ts 좌표)
    for (x, y) in [(17, 21), (36, 9), (38, 30), (58, 19), (17, 30)]:
        if g[y][x] in ("tree", "rock", "flower"):
            put(x, y, "path")
    return g


def save(name, g):
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (len(g[0]), len(g)))
    img.putdata([KEY[k] for row in g for k in row])
    img.save(OUT / f"{name}.png", optimize=True)
    print(OUT / f"{name}.png", img.size)


if __name__ == "__main__":
    save("ascalon", ascalon())
