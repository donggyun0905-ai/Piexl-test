# GPT 초안 → 진짜 도트 (python3 scripts/art/pixelize.py mage) → apps/client/public/sprites/{이름}.png (64칸 = 게임 1칸에 그림 2칸)
# import_sheet와 같은 원본 조각(scripts/art/src)을 쓰지만: 정확한 64칸 격자로 줄임 · 시트 전체를 같은 색 32개로(점 섞기 없이) ·
# 외톨이 점 지우기·구멍 메우기 · 색에 맞춘 한 칸 테두리 · 얼굴 손질(FACE: 칸 단위로 찍은 눈·입) · 게임은 부드럽게 하지 않고 또렷하게 그림
import os
import sys

from PIL import Image

from import_sheet import HERE, SOURCES, cut_background
from s2_common import SPRITES

CELL = 64
FOOT = 61
COLORS = 32
# 얼굴 손질: 조각 이름 → [(x, y, 색)] (그 조각을 64칸에 놓은 뒤의 칸 좌표, 시트 칸 안 기준)
FACE = {}
# 재질별 색표 (밝음 → 어두움): 줄인 그림의 색을 재질로 나눈 뒤 밝기에 맞는 칸으로 (도트 작가가 쓰는 정해진 색 단계)
H = lambda s_: tuple(int(s_[i:i + 2], 16) for i in (1, 3, 5)) + (255,)
RAMPS = {
    "mage": {
        "skin": [H("#fde6d4"), H("#f4c6aa"), H("#dc9a86")],
        "hair": [H("#fff4cc"), H("#f6dc96"), H("#e2b468"), H("#b8844a")],
        "gold": [H("#ffe27a"), H("#eab040"), H("#b07428"), H("#6a3e1e")],
        "white": [H("#ffffff"), H("#eceaf6"), H("#cac4e0"), H("#9c92c0")],
        "blue": [H("#b8c8ff"), H("#7488e0"), H("#4452b0"), H("#262c6a")],
        "dark": [H("#5a3a4a"), H("#3a2434")],
    },
}


def material(r, g, b):
    import colorsys
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    if l < 0.28: return "dark", l
    if 0.5 < h < 0.8 and s > 0.18: return "blue", l
    if s < 0.2 and l > 0.55: return "white", l
    if h < 0.075 and s > 0.3 and l > 0.62: return "skin", l
    if s > 0.55 and l < 0.62: return "gold", l
    return "hair", l


def paint(img, ramps):
    """재질별 색표로 다시 칠함: 재질 안에서 밝기 순서대로 단계 (줄인 그림 기준 밝기 구간)"""
    px = img.load()
    cuts = {"skin": (0.86, 0.76), "hair": (0.86, 0.76, 0.62), "gold": (0.6, 0.48, 0.36), "white": (0.93, 0.84, 0.72), "blue": (0.68, 0.52, 0.38), "dark": (0.18,)}
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if not a: continue
            m, l = material(r, g, b)
            i = sum(1 for c in cuts[m] if l < c)
            px[x, y] = ramps[m][min(i, len(ramps[m]) - 1)]


def shrink(img, h):
    """정확한 격자로: 넓이 평균(BOX)으로 줄이고 투명도는 반 넘으면 채움"""
    s = h / img.height
    out = img.resize((max(1, round(img.width * s)), h), Image.BOX)
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 255) if a >= 128 else (0, 0, 0, 0)
    return out


def denoise(img, keep=()):
    """도트 정리: 둘레 8칸 중 같은 색이 하나 이하인 튀는 점을 둘레에서 가장 많은 색으로 (keep 색은 그대로: 눈 등)"""
    from collections import Counter
    px = img.load()
    w, h = img.size
    for _ in range(2):
        change = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                c = px[x, y]
                if not c[3] or c in keep: continue
                nb = [px[x + dx, y + dy] for dx in (-1, 0, 1) for dy in (-1, 0, 1) if dx or dy]
                if sum(1 for n in nb if n == c) > 1: continue
                top, k = Counter(n for n in nb if n[3]).most_common(1)[0] if any(n[3] for n in nb) else (c, 0)
                if k >= 4: change.append((x, y, top))
        for x, y, c in change: px[x, y] = c


def tidy(img):
    """외톨이 점(이웃이 하나 이하) 지우기 · 사방이 막힌 구멍 메우기"""
    px = img.load()
    w, h = img.size
    on = lambda x, y: 0 <= x < w and 0 <= y < h and px[x, y][3] > 0
    for _ in range(2):
        kill, fill = [], []
        for y in range(h):
            for x in range(w):
                n = sum(on(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
                if on(x, y) and n <= 1: kill.append((x, y))
                if not on(x, y) and n == 4: fill.append((x, y, px[x - 1, y]))
        for x, y in kill: px[x, y] = (0, 0, 0, 0)
        for x, y, c in fill: px[x, y] = c


def outline(img):
    """바깥 한 칸 테두리: 닿은 색을 아주 어둡게 (검정 한 색보다 자연스러움)"""
    px = img.load()
    w, h = img.size
    add = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3]: continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                q = (x + dx, y + dy)
                if 0 <= q[0] < w and 0 <= q[1] < h and px[q][3] and q[0] // CELL == x // CELL:
                    r, g, b, _ = px[q]
                    add.append((x, y, (round(r * 0.22 + 30 * 0.5), round(g * 0.18 + 18 * 0.5), round(b * 0.22 + 34 * 0.5), 255)))
                    break
    for x, y, c in add: px[x, y] = c


# 손으로 찍는 얼굴 (정면 걷기 칸): 칸 안 왼쪽 위 기준 좌표 · 글자: S 피부 · s 그늘 · k 속눈썹 · I 짙은 눈동자 · i 눈동자 · j 밝은 눈동자 · w 빛 · b 홍조 · m 입 · . 그대로
HAND_FACE = {
    "mage": dict(at=(28, 24), rows=[
        "..........",
        "SkkkSSkkkS",
        "SIwISSIwIS",
        "SiiiSSiiiS",
        "SjjjSSjjjS",
        "bSSSSSSSSb",
        "bbSSmmSSbb",
        "SSSSSSSSSS",
    ], pal=dict(S="#fde6d4", s="#f4c6aa", k="#3a2434", I="#34409a", i="#6a7ee0", j="#b4c8ff", w="#ffffff", b="#f6aab0", m="#d07a72")),
}


def hand_face(img, name):
    """정면 걷기 4칸에 손으로 찍은 얼굴 (걷기 1·3칸은 1칸 올라감)"""
    f = HAND_FACE.get(name)
    if not f: return
    px = img.load()
    for c in range(4):
        ox, oy = c * CELL + f["at"][0], f["at"][1] - (1 if c in (1, 3) else 0)
        for j, row in enumerate(f["rows"]):
            for i, ch in enumerate(row):
                if ch != ".": px[ox + i, oy + j] = H(f["pal"][ch])


def build(name):
    cfg = SOURCES[name]
    src = Image.open(os.path.join(HERE, "src", f"{name}.png")).convert("RGBA")
    parts = {}
    for key, (x, w) in cfg["parts"].items():
        p = cut_background(src.crop((x, 0, x + w, src.height)))
        parts[key] = p.crop(p.getbbox())
    base = (FOOT - 5) / parts["front"].height
    small = {k: shrink(p, min(round(p.height * base), FOOT - 2)) for k, p in parts.items()}
    sheet = Image.new("RGBA", (CELL * 4, CELL * 4), (0, 0, 0, 0))
    for r, row in enumerate(cfg["rows"]):
        for c, key in enumerate(row):
            p = small[key]
            if p.width > CELL - 2: p = shrink(p, round(p.height * (CELL - 2) / p.width))
            bob = 1 if r < 3 and c in (1, 3) else 0
            ox, oy = c * CELL + (CELL - p.width) // 2, r * CELL + FOOT - p.height - bob
            sheet.alpha_composite(p, (ox, oy))
            for fx, fy, col in FACE.get((name, key), []): sheet.putpixel((ox + fx, oy + fy), col)
    q = sheet
    paint(q, RAMPS[name])
    denoise(q, keep=set(RAMPS[name]["blue"][:2]) | set(RAMPS[name]["dark"]))
    tidy(q)
    hand_face(q, name)
    outline(q)
    q.save(os.path.join(SPRITES, f"{name}.png"), optimize=True)
    print(name, "ok (64칸 도트)")


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "mage")
