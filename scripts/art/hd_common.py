# 고해상도(2배 촘촘) 그림 공용 도구: 3단 명암(왼쪽 위에서 빛) · 색에 맞춘 테두리 · 큰 눈 · 앞머리 결 · 64칸 사람 몸 뼈대
# 게임에서는 원래 크기(32칸)로 줄여 그림 (apps/client/src/game/sprites.ts의 src) · 시트 규격은 docs/ART.md와 같음 (4줄 × 4칸)
from s2_common import Cell, hx, save_sheet  # noqa: F401  (다른 그림 파일이 여기서 가져다 씀)

S = 64
FOOT = 60
CX = 32
OUT = hx("#1e1a2e")


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3)) + (255,)


def tones(c, lift=0.28, drop=0.62):
    """밝은 · 기본 · 어두운 색 (어두운 쪽은 보랏빛으로 살짝 기울임)"""
    light = mix(c, (255, 250, 235, 255), lift)
    dark = mix(tuple(round(v * drop) for v in c[:3]) + (255,), (40, 20, 70, 255), 0.18)
    return light, c, dark


def light_of(nx, ny):
    """왼쪽 위에서 오는 빛 세기 (-1 ~ 1)"""
    return -0.55 * nx - 0.8 * ny


def sh_oval(c, cx, cy, rx, ry, col, hi=0.45, lo=-0.3):
    """명암 들어간 타원 (밝은 · 기본 · 어두운 3단)"""
    l, b, d = tones(col)
    for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
        for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
            nx, ny = (x - cx) / max(rx, 0.5), (y - cy) / max(ry, 0.5)
            if nx * nx + ny * ny > 1: continue
            k = light_of(nx, ny)
            c.px(x, y, l if k > hi else d if k < lo else b)


def sh_rect(c, x, y, w, h, col, edge=1):
    """명암 들어간 네모: 왼쪽 한 줄 밝게 · 오른쪽·아래 어둡게"""
    l, b, d = tones(col)
    for j in range(int(h)):
        for i in range(int(w)):
            k = l if i < edge and j < h - 1 else d if i >= w - edge - 1 or j >= h - 1 else b
            c.px(x + i, y + j, k)


def sh_poly(c, rows, col):
    """줄마다 (y, x0, x1) 로 채운 모양에 명암 (가로 위치로 밝기)"""
    l, b, d = tones(col)
    for y, x0, x1 in rows:
        w = max(1, x1 - x0)
        for x in range(int(x0), int(x1) + 1):
            t = (x - x0) / w
            c.px(x, y, l if t < 0.18 else d if t > 0.78 else b)


def outline(c, base=OUT, keep=()):
    """색에 맞춘 테두리: 이웃 색을 어둡게 해 바깥에 한 칸 (검정 한 색보다 부드러움)"""
    add = {}
    for (x, y), col in c.p.items():
        if col in keep: continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if q in c.p or not (0 <= q[0] < c.size and 0 <= q[1] < c.size): continue
            add.setdefault(q, mix(tuple(round(v * 0.3) for v in col[:3]) + (255,), base, 0.7))
    c.p.update(add)


def eye(c, x, y, w, h, iris, out=1, lash=hx("#1a1424")):
    """큰 눈 (x·y = 왼쪽 위): 두꺼운 위 속눈썹(바깥 끝 삐침) · 위는 짙고 아래로 밝아지는 눈동자 · 동공 · 빛 두 점 · 흰자 한 줄"""
    il, ib, idk = tones(iris, 0.45, 0.5)
    for j in range(h):
        t = j / max(1, h - 1)
        col = idk if t < 0.35 else ib if t < 0.75 else il
        c.rect(x, y + j, w, 1, col)
    c.rect(x + w // 2 - 1, y + 1, 2, max(1, h // 2), mix(idk, lash, 0.6))
    c.px(x + (w - 1 if out < 0 else 0), y + h // 2, hx("#f4f2fa"))
    c.rect(x - 1, y - 1, w + 2, 1, lash)
    c.rect(x, y - 2, w, 1, lash)
    tip = x + w if out > 0 else x - 2
    c.px(tip, y - 2, lash); c.px(tip + out, y - 3, lash)
    c.rect(x + 1, y + h, w - 2, 1, mix(lash, hx("#e8b8a8"), 0.6))
    hx0 = x + 1 if out > 0 else x + w - 3
    c.rect(hx0, y + 1, 2, 2, hx("#ffffff"))
    c.px(x + (w - 2 if out > 0 else 1), y + h - 2, hx("#f8f4ff"))


def bangs(c, x0, x1, top, bottom, col, seed=0, part=None):
    """앞머리: 3칸 너비 결이 뾰족하게 내려옴 (길이가 조금씩 다름) · 결 사이 어두운 줄 · 가르마"""
    l, b, d = tones(col)
    for x in range(int(x0), int(x1) + 1):
        i = x - int(x0)
        strand = (i + seed) // 3
        k = (i + seed) % 3
        length = bottom - ((strand * 5 + seed) % 3) - (2 if part is not None and abs(x - part) <= 1 else 0)
        tip = length - (1 if k != 1 else 0)
        for y in range(int(top), int(tip) + 1):
            col_ = d if k == 2 and y > top + 2 else l if k == 0 and y < top + 4 else b
            c.px(x, y, col_)


def face_front(c, cx, cy, rx, ry, skin):
    """앞 얼굴: 위는 넓고 짧고 둥근 턱 · 볼 아래·오른쪽 옅은 그늘"""
    l, b, d = tones(skin, 0.2, 0.86)
    for y in range(int(cy - ry), int(cy + ry) + 1):
        t = (y - (cy - ry)) / (2 * ry)
        w = rx * (1 if t < 0.55 else (1 - ((t - 0.55) / 0.45) ** 2 * 0.55))
        for x in range(int(cx - w), int(cx + w) + 1):
            nx = (x - cx) / rx
            c.px(x, y, d if nx > 0.7 or t > 0.93 else b)


def save(name, frame):
    save_sheet(name, frame, size=S)


def save_enemy(name, frame, size, frames=4):
    """몬스터·보스 그림: frame(f) → Cell 을 가로로 이어 sprites/enemies/{name}.png 로 (2배 그림이면 enemySprites.ts ENEMY_SRC에 등록)"""
    import os
    from PIL import Image
    from s2_common import SPRITES
    img = Image.new("RGBA", (size * frames, size), (0, 0, 0, 0))
    for f in range(frames):
        for (x, y), col in frame(f).p.items():
            if 0 <= x < size and 0 <= y < size: img.putpixel((f * size + x, y), col)
    img.save(os.path.join(SPRITES, "enemies", f"{name}.png"), optimize=True)
    print(name, "ok")


def poly(c, pts, col):
    """다각형 채우기 (짝수-홀수 규칙)"""
    ys = [p[1] for p in pts]
    for y in range(int(min(ys)), int(max(ys)) + 1):
        xs = []
        for i in range(len(pts)):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
            if (y0 <= y < y1) or (y1 <= y < y0): xs.append(x0 + (y - y0) * (x1 - x0) / (y1 - y0))
        xs.sort()
        for a, b in zip(xs[::2], xs[1::2]):
            for x in range(int(round(a)), int(round(b)) + 1): c.px(x, y, col)


def thick_line(c, x0, y0, x1, y1, w, col):
    n = int(max(abs(x1 - x0), abs(y1 - y0), 1))
    for i in range(n + 1):
        x, y = x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n
        for dx in range(-(w // 2), w - w // 2):
            for dy in range(-(w // 2), w - w // 2): c.px(x + dx, y + dy, col)
