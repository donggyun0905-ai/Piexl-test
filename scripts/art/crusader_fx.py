# 크루세이더 이펙트 픽셀 그림 (코드로 그림, 사용자 캐릭터 그림의 십자가 색: 흰 돌 · 금테 · 붉은 무늬) → apps/client/public/sprites/{이름}.png
#   crusader_cross 심판의 십자가 (31×46, 땅에 꽂히는 거대한 돌 십자가) · crusader_slab 십자 균열에서 솟는 돌판 (4가지 × 14×20)
#   crusader_rock 날아가는 돌 파편 (4가지 × 6×6)
# 실행: python3 scripts/art/crusader_fx.py (같은 결과: 무늬는 정해진 값)
import os

from PIL import Image

from s2_common import SPRITES

OUT_D = (40, 30, 26, 255)  # 바깥 테두리
GOLD_D = (168, 112, 36, 255)
GOLD = (232, 180, 74, 255)
GOLD_L = (255, 226, 140, 255)
STONE_L = (252, 248, 236, 255)
STONE = (236, 226, 206, 255)
STONE_S = (196, 184, 160, 255)
STONE_D = (150, 136, 116, 255)
RED = (176, 28, 44, 255)
RED_L = (228, 64, 80, 255)
CRACK = (110, 96, 80, 255)


def cross():
    w, h = 31, 46
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = img.load()
    cx = 15
    bar_y0, bar_y1 = 9, 18  # 가로대
    # 몸: 세로대 x 10~20 · 가로대 y 9~18 (끝은 조금 넓게 벌어짐)
    def inside(x, y):
        if 10 <= x <= 20 and 0 <= y <= h - 1:
            return True
        if bar_y0 <= y <= bar_y1 and 0 <= x <= w - 1:
            return True
        # 팔 끝 벌어짐 (위·왼·오)
        if y <= 2 and 8 <= x <= 22:
            return True
        if (x <= 2 or x >= w - 3) and bar_y0 - 2 <= y <= bar_y1 + 2:
            return True
        return False
    for y in range(h):
        for x in range(w):
            if not inside(x, y):
                continue
            edge = any(not inside(x + dx, y + dy) or not (0 <= x + dx < w and 0 <= y + dy < h) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            edge2 = any(not inside(x + dx, y + dy) for dx, dy in ((2, 0), (-2, 0), (0, 2), (0, -2)) if 0 <= x + dx < w and 0 <= y + dy < h)
            if edge:
                px[x, y] = OUT_D
            elif edge2:
                # 금테: 왼·위는 밝게, 오·아래는 어둡게
                px[x, y] = GOLD_L if (not inside(x - 2, y) or not inside(x, y - 2)) else GOLD_D if (not inside(x + 2, y) or not inside(x, y + 2)) else GOLD
            else:
                # 돌: 오른쪽·아래쪽 그늘
                shade = STONE_L if (x < cx - 2 and y < bar_y1) else STONE
                if x > cx + 2 or y > 30:
                    shade = STONE_S
                if x > cx + 3 and y > 30:
                    shade = STONE_D
                px[x, y] = shade
    # 붉은 무늬: 세로·가로 가운데 줄
    for y in range(4, h - 5):
        if not (bar_y0 + 1 <= y <= bar_y1 - 1):
            px[cx, y] = RED
            if y % 6 == 0:
                px[cx - 1, y], px[cx + 1, y] = RED, RED
    for x in range(4, w - 4):
        if not (12 <= x <= 18):
            px[x, (bar_y0 + bar_y1) // 2] = RED
    # 가운데 금 마름모 + 붉은 보석
    my = (bar_y0 + bar_y1) // 2
    for dy in range(-4, 5):
        for dx in range(-4, 5):
            d = abs(dx) + abs(dy)
            if d <= 4:
                px[cx + dx, my + dy] = OUT_D if d == 4 else GOLD_L if dx + dy < -1 else GOLD if d >= 2 else RED_L if dx + dy < 0 else RED
    # 금
    for (x, y) in ((13, 26), (14, 27), (14, 28), (17, 33), (18, 34), (12, 38), (13, 39)):
        px[x, y] = CRACK
    return img


def slab(seed):
    w, h = 14, 20
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = img.load()
    # 뾰족한 돌판: 아래 넓고 위로 갈수록 좁아지며 끝이 비스듬히
    tip = [3, 9, 5, 8][seed]
    lean = [1, -1, 0, 2][seed]
    def half(y):
        f = y / (h - 1)  # 0 위 · 1 아래
        return max(0.0, 1.5 + f * 5.2)
    def inside(x, y):
        if y < tip * (0.25 if seed % 2 else 0.4):
            return False
        c = 7 + lean * (1 - y / h)
        return abs(x + 0.5 - c) <= half(y) and y >= (tip if x + 0.5 < c else tip * 0.5)
    for y in range(h):
        for x in range(w):
            if not inside(x, y):
                continue
            edge = any(not (0 <= x + dx < w and 0 <= y + dy < h) or not inside(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            c = 7 + lean * (1 - y / h)
            if edge:
                px[x, y] = OUT_D
            elif x + 0.5 < c - 1:
                px[x, y] = STONE_L if y < h * 0.5 else STONE
            elif x + 0.5 < c + 1:
                px[x, y] = STONE_S
            else:
                px[x, y] = STONE_D
    # 빛나는 금 (성스러운 균열)
    cx = 7 + lean // 2
    for y in range(h - 2, h // 2 - 2, -1):
        x = cx + ((y * 3 + seed) % 3) - 1
        if 0 <= x < w and img.getpixel((x, y))[3] and img.getpixel((x, y)) != OUT_D:
            px[x, y] = GOLD if y % 3 else GOLD_L
    return img


def rock(seed):
    img = Image.new("RGBA", (6, 6), (0, 0, 0, 0))
    px = img.load()
    shapes = [
        ["..##..", ".####.", "######", "#####.", ".###..", "......"],
        ["......", ".###..", "#####.", "######", ".####.", "..##.."],
        ["...#..", "..###.", ".####.", "#####.", "####..", "......"],
        [".##...", "####..", "#####.", ".#####", "..###.", "......"],
    ][seed]
    for y, row in enumerate(shapes):
        for x, ch in enumerate(row):
            if ch != "#":
                continue
            edge = any(not (0 <= x + dx < 6 and 0 <= y + dy < 6) or shapes[y + dy][x + dx] != "#" for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= y + dy < 6 and 0 <= x + dx < 6) or x in (0, 5) or y in (0, 5)
            px[x, y] = OUT_D if edge else (STONE if x + y < 5 else STONE_S)
    return img


def strip(parts):
    w = sum(p.width for p in parts)
    out = Image.new("RGBA", (w, parts[0].height), (0, 0, 0, 0))
    x = 0
    for p in parts:
        out.alpha_composite(p, (x, 0))
        x += p.width
    return out


if __name__ == "__main__":
    cross().save(os.path.join(SPRITES, "crusader_cross.png"), optimize=True)
    strip([slab(i) for i in range(4)]).save(os.path.join(SPRITES, "crusader_slab.png"), optimize=True)
    strip([rock(i) for i in range(4)]).save(os.path.join(SPRITES, "crusader_rock.png"), optimize=True)
    print("crusader fx ok")
