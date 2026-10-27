# 렌 대지의 추가 공격 그림 (python3 scripts/art/ren_earth.py) → apps/client/public/sprites/ren-*.png
# 흙·나무·돌로 된 동양 용(옆모습, 오른쪽을 봄): 머리 3장면(입 닫음 → 반쯤 → 크게 벌림) · 몸 마디 · 꼬리
# 네모난 토목 기둥(돌 판·나무 띠·이끼·빛나는 무늬) · 돌덩이 4가지 · 머리 위 거대 바위
import math
import os
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites")

BARK = (122, 84, 50)
BARK_D = (78, 52, 30)
BARK_L = (168, 122, 74)
STONE = (138, 132, 122)
STONE_D = (92, 86, 80)
STONE_L = (190, 184, 170)
MOSS = (82, 170, 64)
MOSS_D = (44, 112, 44)
MOSS_L = (150, 220, 100)
AMBER = (255, 196, 64)
EMBER = (255, 120, 40)
MOUTH = (60, 22, 18)
TOOTH = (238, 230, 210)
LINE = (40, 28, 20)


def canvas(w, h):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))


def poly(d, pts, c):
    d.polygon([(round(x), round(y)) for x, y in pts], fill=c + (255,))


def finish(img, light=True):
    """입체감: 위·왼쪽 가장자리는 밝게, 아래·오른쪽은 어둡게, 바깥은 짙은 테두리"""
    w, h = img.size
    px = img.load()
    src = img.copy().load()
    solid = lambda x, y: 0 <= x < w and 0 <= y < h and src[x, y][3] > 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            if a == 0:
                continue
            if light and not solid(x, y - 1):
                px[x, y] = (min(255, r + 40), min(255, g + 36), min(255, b + 30), 255)
            elif not solid(x, y + 1) or not solid(x + 1, y):
                px[x, y] = (int(r * 0.7), int(g * 0.7), int(b * 0.7), 255)
    out = img.copy()
    op = out.load()
    for y in range(h):
        for x in range(w):
            if src[x, y][3] == 0 and any(solid(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                op[x, y] = LINE + (255,)
    return out


def bark_lines(d, x0, y0, x1, y1, step=4, c=BARK_D):
    """나무껍질 결: 비스듬한 짧은 선"""
    for y in range(y0, y1, step):
        for x in range(x0 + (y // step % 2) * 3, x1, 7):
            d.line([(x, y), (x + 3, y + 1)], fill=c + (255,))


def head(frame):
    """용머리 64×48, 입 벌림 0·1·2 (오른쪽을 봄)"""
    img = canvas(64, 48)
    d = ImageDraw.Draw(img)
    open_a = [0, 16, 34][frame]
    # 목 (아래 왼쪽으로)
    poly(d, [(6, 48), (4, 34), (12, 24), (24, 26), (22, 40), (16, 48)], BARK)
    bark_lines(d, 6, 30, 20, 47)
    # 아래턱: 경첩(24, 30)을 중심으로 벌어짐
    a = math.radians(open_a)
    def rot(x, y):
        dx, dy = x - 24, y - 30
        return 24 + dx * math.cos(a) - dy * math.sin(a), 30 + dx * math.sin(a) + dy * math.cos(a)
    jaw = [rot(*p) for p in [(22, 28), (54, 30), (56, 33), (50, 37), (26, 38)]]
    if open_a:
        # 입 안 (어둡고 안쪽에 호박빛)
        poly(d, [(24, 29), (58, 25), rot(56, 31), (24, 33)], MOUTH)
        poly(d, [(26, 30), (40, 28), rot(40, 31), (27, 32)], EMBER)
    poly(d, jaw, BARK)
    # 아래 이빨
    for i in range(5):
        x = 30 + i * 5
        tx, ty = rot(x, 30)
        bx, by = rot(x + 2, 30)
        cx, cy = rot(x + 1, 27)
        if open_a:
            poly(d, [(tx, ty), (bx, by), (cx, cy)], TOOTH)
    # 위턱·주둥이
    poly(d, [(14, 12), (30, 10), (48, 15), (60, 20), (61, 26), (54, 28), (24, 30), (14, 26)], BARK)
    # 돌 판: 이마·콧등
    poly(d, [(24, 11), (40, 13), (44, 17), (30, 17)], STONE)
    poly(d, [(46, 16), (58, 20), (56, 23), (47, 20)], STONE)
    # 위 이빨
    for i in range(6):
        x = 28 + i * 5
        poly(d, [(x, 28), (x + 3, 28), (x + 1, 31 + (1 if open_a else 0))], TOOTH)
    # 콧구멍·눈 (호박빛, 가운데 검은 눈동자)
    d.rectangle([56, 20, 57, 21], fill=LINE + (255,))
    poly(d, [(30, 17), (38, 16), (37, 20), (31, 20)], AMBER)
    d.rectangle([34, 17, 35, 19], fill=LINE + (255,))
    d.line([(29, 15), (39, 14)], fill=BARK_D + (255,))
    # 뿔: 뒤로 뻗은 나뭇가지 (잔가지 + 잎)
    d.line([(20, 12), (4, 2)], fill=BARK_D + (255,), width=3)
    d.line([(12, 7), (8, 12)], fill=BARK_D + (255,), width=2)
    d.line([(24, 11), (14, 0)], fill=BARK + (255,), width=2)
    for x, y in ((3, 1), (8, 12), (14, 0), (6, 4)):
        d.ellipse([x - 2, y - 2, x + 1, y + 1], fill=MOSS + (255,))
    # 갈기: 머리 뒤 이끼·잎 다발
    for i in range(6):
        y = 14 + i * 4
        x = 12 - (i % 2) * 3
        poly(d, [(x + 4, y), (x - 6, y + 2 + (i % 3)), (x + 2, y + 5)], MOSS if i % 2 else MOSS_D)
    # 수염: 콧등에서 늘어진 덩굴
    d.line([(52, 26), (58, 34), (62, 33)], fill=MOSS_D + (255,), width=1)
    d.line([(48, 27), (50, 38), (46, 44)], fill=MOSS_D + (255,), width=1)
    bark_lines(d, 16, 18, 26, 28)
    img = finish(img)
    # 테두리 뒤에 빛나는 눈·이끼 하이라이트
    p = img.load()
    p[32, 17] = (255, 240, 180, 255)
    for x, y in ((10, 16), (8, 24), (11, 31)):
        p[x, y] = MOSS_L + (255,)
    return img


def body(frame):
    """몸 마디 32×32 옆모습 (오른쪽으로 이어짐): 굵은 나무 몸통 · 위는 이끼 지느러미 · 아래는 돌 배판 · 겹친 돌 비늘. 두 장면 (지느러미가 살랑)"""
    img = canvas(32, 32)
    d = ImageDraw.Draw(img)
    # 등 지느러미 (이끼 잎, 뒤로 누움)
    for i in range(4):
        x = 2 + i * 8
        poly(d, [(x, 10), (x + 3, 2 + (i + frame) % 2 * 2), (x + 8, 10)], MOSS if (i + frame) % 2 else MOSS_D)
    # 몸통 (가로로 꽉 차서 마디끼리 이어짐)
    d.rectangle([0, 9, 31, 25], fill=BARK + (255,))
    # 배판: 아래쪽 밝은 돌 칸
    d.rectangle([0, 21, 31, 26], fill=STONE + (255,))
    for x in range(1 + frame * 2, 32, 5):
        d.line([(x, 21), (x, 26)], fill=STONE_D + (255,))
    # 돌 비늘: 비스듬히 겹친 반달 두 줄
    for row, y in enumerate((11, 16)):
        for x in range(-2 + row * 3 + frame * 2, 32, 7):
            d.arc([x, y, x + 7, y + 6], 200, 340, fill=STONE_L + (255,), width=1)
            d.arc([x, y + 1, x + 7, y + 7], 200, 340, fill=BARK_D + (255,), width=1)
    img = finish(img)
    # 이음새 쪽(왼·오른쪽 끝)은 테두리 없이 (마디가 이어 보이게)
    p = img.load()
    for y in range(32):
        for x in (0, 31):
            if p[x, y][:3] == LINE:
                p[x, y] = (0, 0, 0, 0)
    return img


def tail():
    """꼬리 끝 32×32: 가늘어지며 잎 다발로 끝남"""
    img = canvas(32, 32)
    d = ImageDraw.Draw(img)
    poly(d, [(0, 12), (18, 14), (26, 17), (18, 20), (0, 24)], BARK)
    d.line([(2, 21), (16, 19)], fill=STONE + (255,), width=2)
    for i, (x, y) in enumerate(((24, 12), (28, 16), (24, 21), (30, 13))):
        poly(d, [(x - 4, y), (x + 2, y - 4), (x + 3, y + 3)], MOSS if i % 2 else MOSS_D)
    return finish(img)


def block():
    """네모난 토목 기둥 24×40: 돌 판 몸 + 위아래 나무 띠 + 갈라진 틈 + 이끼 + 호박빛 새김 무늬"""
    img = canvas(24, 40)
    d = ImageDraw.Draw(img)
    d.rectangle([1, 2, 22, 38], fill=STONE + (255,))
    # 돌 판 이음새
    for y in (12, 22, 31):
        d.line([(2, y), (21, y)], fill=STONE_D + (255,))
    d.line([(9, 12), (9, 22)], fill=STONE_D + (255,))
    d.line([(15, 22), (15, 31)], fill=STONE_D + (255,))
    # 나무 띠 (위·아래) + 결
    d.rectangle([0, 0, 23, 5], fill=BARK + (255,))
    d.rectangle([0, 34, 23, 39], fill=BARK + (255,))
    bark_lines(d, 0, 1, 23, 5, step=2)
    bark_lines(d, 0, 35, 23, 39, step=2)
    # 갈라진 틈
    d.line([(17, 7), (14, 11), (16, 14)], fill=LINE + (255,))
    # 새김 무늬 (빛나는 호박빛 마름모)
    poly(d, [(12, 15), (16, 19), (12, 23), (8, 19)], AMBER)
    poly(d, [(12, 17), (14, 19), (12, 21), (10, 19)], (255, 240, 170))
    # 이끼가 흘러내림
    for x, l in ((2, 5), (5, 3), (19, 6), (21, 2)):
        d.line([(x, 5), (x, 5 + l)], fill=MOSS + (255,), width=2)
    img = finish(img)
    return img


def rocks():
    """돌덩이 4가지 16×16 (흙·돌·나무 조각)"""
    img = canvas(64, 16)
    d = ImageDraw.Draw(img)
    shapes = [
        [(2, 9), (5, 3), (11, 2), (14, 7), (12, 13), (5, 14)],
        [(1, 7), (6, 2), (13, 4), (14, 11), (8, 14), (2, 12)],
        [(3, 4), (12, 3), (14, 10), (9, 14), (2, 11)],
        [(2, 8), (7, 2), (14, 5), (13, 12), (6, 14)],
    ]
    for i, s in enumerate(shapes):
        ox = i * 16
        poly(d, [(x + ox, y) for x, y in s], STONE if i % 2 == 0 else BARK)
        d.line([(ox + 5, 6), (ox + 9, 8)], fill=(STONE_D if i % 2 == 0 else BARK_D) + (255,))
        if i == 1:
            d.rectangle([ox + 4, 3, ox + 6, 4], fill=MOSS + (255,))
    return finish(img)


def boulder():
    """머리 위 거대 바위 40×36: 둥근 바위 + 뿌리가 감싼 띠 + 이끼 + 빛나는 금"""
    img = canvas(40, 36)
    d = ImageDraw.Draw(img)
    poly(d, [(4, 18), (8, 6), (20, 2), (32, 5), (38, 16), (34, 30), (20, 34), (7, 30)], STONE)
    poly(d, [(10, 10), (20, 6), (28, 8), (22, 12)], STONE_L)
    # 뿌리 띠
    d.line([(5, 20), (14, 16), (26, 19), (37, 15)], fill=BARK + (255,), width=3)
    d.line([(16, 33), (19, 24), (17, 17)], fill=BARK_D + (255,), width=2)
    # 빛나는 금 (갈라진 틈)
    d.line([(24, 22), (28, 27), (26, 31)], fill=AMBER + (255,))
    for x, y in ((9, 7), (24, 3), (33, 7)):
        d.ellipse([x - 2, y - 1, x + 2, y + 2], fill=MOSS + (255,))
    return finish(img)


def save(img, name):
    path = os.path.join(OUT, f"{name}.png")
    img.save(path, optimize=True)
    print(name, "ok")


if __name__ == "__main__":
    sheet = canvas(64 * 3, 48)
    for f in range(3):
        sheet.paste(head(f), (64 * f, 0))
    save(sheet, "ren-dragon-head")
    b = canvas(96, 32)
    b.paste(body(0), (0, 0))
    b.paste(body(1), (32, 0))
    b.paste(tail(), (64, 0))
    save(b, "ren-dragon-body")
    save(block(), "ren-block")
    save(rocks(), "ren-rocks")
    save(boulder(), "ren-boulder")
