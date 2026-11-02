# 일반 몬스터 20종 2배 촘촘한 그림 (python3 scripts/art/hd_monsters_2x.py) → sprites/enemies/{종류}.png
# 원래 그림(scripts/art/src/monsters_1x, 0.48.16 코드 그림)의 생김새·색·자세를 그대로 두고 2배로:
#   1) 바깥 윤곽의 계단처럼 꺾인 대각선만 부드럽게 (Scale2x, 안쪽 무늬는 그대로 · 픽셀 느낌·색 수는 그대로)
#   2) 테두리 바로 안쪽에 빛 (위·왼쪽은 밝은 한 줄, 아래·오른쪽은 어두운 한 줄 → 도톰한 입체감)
# 게임에서는 원래 크기로 줄여 그림 (game/enemySprites.ts ENEMY_SRC의 HD2)
import os

from PIL import Image

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, "src", "monsters_1x")
OUT = os.path.join(HERE, "../../apps/client/public/sprites/enemies")
NAMES = "crawler spitter mortar charger gnat guardian paladin slime runner bat beetle golem shaman eggsac wisp venom landfish lurker soul doppel bombbug skelarcher chainward highorc".split()


def scale2x(img):
    """Scale2x (EPX): 각 칸을 2×2로 나누되, 이웃 두 칸이 같은 색이면 그 모서리를 그 색으로 (대각선이 매끈)"""
    w, h = img.size
    p = img.load()
    out = Image.new("RGBA", (w * 2, h * 2))
    q = out.load()
    at = lambda x, y: p[x, y] if 0 <= x < w and 0 <= y < h else (0, 0, 0, 0)
    for y in range(h):
        for x in range(w):
            e = at(x, y)
            b, d, f, hh = at(x, y - 1), at(x - 1, y), at(x + 1, y), at(x, y + 1)
            e0 = d if d == b and b != f and d != hh else e
            e1 = f if b == f and b != d and f != hh else e
            e2 = d if d == hh and d != b and hh != f else e
            e3 = f if hh == f and d != hh and b != f else e
            # 바깥 윤곽(투명과 맞닿은 곳)만 다듬음: 안쪽 무늬(십자·눈 등)는 원래 칸 그대로
            keep = lambda v: v if (v[3] == 0) != (e[3] == 0) else e
            q[x * 2, y * 2], q[x * 2 + 1, y * 2], q[x * 2, y * 2 + 1], q[x * 2 + 1, y * 2 + 1] = keep(e0), keep(e1), keep(e2), keep(e3)
    return out


def lum(c):
    return 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]


def mix(c, to, t):
    return tuple(round(c[i] + (to[i] - c[i]) * t) for i in range(3)) + (c[3],)


def bevel(img):
    """테두리(투명과 맞닿은 칸) 바로 안쪽: 위·왼쪽 밝게 · 아래·오른쪽 어둡게 (어두운 칸·작은 점은 그대로)"""
    w, h = img.size
    p = img.load()
    solid = lambda x, y: 0 <= x < w and 0 <= y < h and p[x, y][3] > 0
    edge = {(x, y) for y in range(h) for x in range(w) if solid(x, y) and any(not solid(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}
    out = img.copy()
    o = out.load()
    for y in range(h):
        for x in range(w):
            c = p[x, y]
            if c[3] == 0 or (x, y) in edge or lum(c) < 40: continue
            up, left = (x, y - 1) in edge, (x - 1, y) in edge
            down, right = (x, y + 1) in edge, (x + 1, y) in edge
            if up or (left and not down): o[x, y] = mix(c, (255, 250, 235), 0.3 if up else 0.18)
            elif down or right: o[x, y] = mix(c, (30, 18, 50), 0.28 if down else 0.18)
    return out


if __name__ == "__main__":
    for n in NAMES:
        img = Image.open(os.path.join(SRC, f"{n}.png")).convert("RGBA")
        bevel(scale2x(img)).save(os.path.join(OUT, f"{n}.png"), optimize=True)
        print(n, "ok")
