# 그림 생성 AI 등으로 만든 큰 도트 그림을 게임 시트로 바꿈 (python3 scripts/art/import_sheet.py mage)
# 원본 조각은 scripts/art/src/{이름}.png (검은 배경, 조각을 가로로 이어 붙임) · 조각 자리는 아래 SOURCES
# 처리: 테두리에서 이어진 검은 배경만 투명하게(안쪽 어두운 테두리는 남김) → 몸 크기를 맞춰 줄임 → 반투명 가장자리 정리 →
# 시트 전체를 같은 색 96개로 묶음(도트 느낌) → 128칸 4×4 시트(앞·뒤·옆 걷기, 공격)로 발 위치를 맞춰 배치
import os
import sys
from collections import deque

from PIL import Image, ImageEnhance, ImageFilter

from s2_common import SPRITES

HERE = os.path.dirname(__file__)
# 한 칸 128 (게임 32칸의 4배): 확대해서 볼 때도 세부가 남게 · 발 여백 8 (= 게임 2)
CELL = 128
FOOT = 122
# 조각: 이름 → (x, 너비) · 높이는 원본 그림 높이 · rows: 시트 4줄(각 4칸)에 넣을 조각 이름
SOURCES = {
    "mage": dict(
        parts={"front": (0, 108), "back": (108, 95), "left": (203, 88), "right": (291, 97), "idle": (388, 158)},
        rows=[["front"] * 4, ["back"] * 4, ["right"] * 4, ["idle", "idle", "idle", "right"]],
        body=116,
    ),
}


def cut_background(img, dark=42):
    """테두리에서 이어진 어두운 칸만 배경으로 지움"""
    w, h = img.size
    px = img.load()
    seen = set()
    q = deque()
    for x in range(w):
        q.append((x, 0)); q.append((x, h - 1))
    for y in range(h):
        q.append((0, y)); q.append((w - 1, y))
    while q:
        x, y = q.popleft()
        if (x, y) in seen or not (0 <= x < w and 0 <= y < h): continue
        r, g, b, a = px[x, y]
        if max(r, g, b) > dark: continue
        seen.add((x, y))
        px[x, y] = (0, 0, 0, 0)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return img


def shrink(img, scale):
    """줄이기: 색은 부드럽게 평균, 투명도는 반 넘으면 채움"""
    w, h = img.size
    nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
    # 흐린 원본(압축 사진)은 먼저 또렷하게 · 색을 조금 진하게
    rgb = img.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.5, percent=120, threshold=3))
    rgb = ImageEnhance.Color(ImageEnhance.Contrast(rgb).enhance(1.15)).enhance(1.15)
    sharp = rgb.convert("RGBA")
    sharp.putalpha(img.getchannel("A"))
    out = sharp.resize((nw, nh), Image.BOX)
    px = out.load()
    for y in range(nh):
        for x in range(nw):
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 255) if a >= 128 else (0, 0, 0, 0)
    return out


def build(name):
    cfg = SOURCES[name]
    src = Image.open(os.path.join(HERE, "src", f"{name}.png")).convert("RGBA")
    parts = {}
    for key, (x, w) in cfg["parts"].items():
        p = cut_background(src.crop((x, 0, x + w, src.height)))
        parts[key] = p.crop(p.getbbox())
    # 크기: 앞모습 키를 body 칸으로 → 같은 배율을 모든 조각에 (들어가지 않으면 그 조각만 더 줄임)
    base = cfg["body"] / parts["front"].height
    small = {}
    for key, p in parts.items():
        s = min(base, (CELL - 2) / p.width, (FOOT - 1) / p.height)
        small[key] = shrink(p, s)
    sheet = Image.new("RGBA", (CELL * 4, CELL * 4), (0, 0, 0, 0))
    for r, row in enumerate(cfg["rows"]):
        for c, key in enumerate(row):
            p = small[key]
            bob = 2 if r < 3 and c in (1, 3) else 0
            sheet.alpha_composite(p, (c * CELL + (CELL - p.width) // 2, r * CELL + FOOT - p.height - bob))
    # 시트 전체를 같은 색 묶음으로 (투명은 그대로)
    alpha = sheet.getchannel("A")
    q = sheet.convert("RGB").quantize(colors=96, method=Image.Quantize.MEDIANCUT).convert("RGBA")
    q.putalpha(alpha)
    # 바깥 테두리 두 칸 (어두운 밤색, 게임 반 칸) · 줄여도 몸이 바닥과 구분되게
    px = q.load()
    edge = []
    for y in range(q.height):
        for x in range(q.width):
            if px[x, y][3]: continue
            if any(0 <= x + dx < q.width and 0 <= y + dy < q.height and px[x + dx, y + dy][3] and (x + dx) // CELL == x // CELL for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): edge.append((x, y))
    for x, y in edge: px[x, y] = (46, 30, 34, 255)
    edge2 = [(x, y) for y in range(q.height) for x in range(q.width) if not px[x, y][3] and any(0 <= x + dx < q.width and 0 <= y + dy < q.height and px[x + dx, y + dy] == (46, 30, 34, 255) and (x + dx) // CELL == x // CELL for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
    for x, y in edge2: px[x, y] = (46, 30, 34, 200)
    q.save(os.path.join(SPRITES, f"{name}.png"), optimize=True)
    print(name, "ok")


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "mage")
