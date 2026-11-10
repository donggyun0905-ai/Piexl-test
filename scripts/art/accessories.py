# 레이드 장신구 아이콘 (원본 art/장신구/) → apps/client/public/raid/acc/acc.png
# (python3 scripts/art/accessories.py)
# 96칸 시트: 1줄 반지 10 · 2줄 목걸이 10 · 3줄 귀걸이 10 · 4줄 브로치 10 (세트 순서 = 그림 순서) · 5줄 전설 5 (반지 둘 · 귀걸이 · 목걸이 · 브로치)
# 검은 바탕은 테두리에서 이어진 것만 지움 (import_v2.pieces flood)
import os

from PIL import Image

from import_sheet import shrink
from import_v2 import pieces
from s2_common import SPRITES

ROOT = os.path.join(os.path.dirname(__file__), "../../art/장신구")
OUT = os.path.join(SPRITES, "..", "raid", "acc")
CELL = 96
ROWS = [
    "판타지 픽셀 아트 링 컬렉션.png",
    "판타지 픽셀 아트 목걸이 10종 세트.png",
    "판타지 픽셀 아트 귀걸이 아이콘 10종.png",
    "화려한 픽셀 아트 브로치 컬렉션.png",
]
# 전설 시트 (1774×887): 칸마다 잘라 낼 네모 (반지 · 반지 · 귀걸이 한 쌍 · 목걸이 · 브로치)
LEGEND_BOXES = [(400, 0, 860, 360), (880, 0, 1340, 360), (170, 370, 580, 830), (600, 360, 1130, 870), (1140, 350, 1660, 830)]


def fit(p):
    k = min((CELL - 6) / p.width, (CELL - 6) / p.height)
    return shrink(p, k)


def put(sheet, p, col, row):
    p = fit(p)
    sheet.alpha_composite(p, (col * CELL + (CELL - p.width) // 2, row * CELL + (CELL - p.height) // 2))


def main():
    os.makedirs(OUT, exist_ok=True)
    sheet = Image.new("RGBA", (CELL * 10, CELL * 5), (0, 0, 0, 0))
    for r, name in enumerate(ROWS):
        img = Image.open(os.path.join(ROOT, name)).convert("RGBA")
        for row_i, line in enumerate(pieces(img, 5, 2, flood=True)):
            for c, part in enumerate(line):
                put(sheet, part, row_i * 5 + c, r)
    leg = Image.open(os.path.join(ROOT, "전설장신구.png")).convert("RGBA")
    for i, box in enumerate(LEGEND_BOXES):
        put(sheet, pieces(leg.crop(box), 1, 1, flood=True)[0][0], i, 4)
    sheet.save(os.path.join(OUT, "acc.png"), optimize=True)
    print("acc.png", sheet.size)


if __name__ == "__main__":
    main()
