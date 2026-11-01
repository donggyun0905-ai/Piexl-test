# 새끼 오리 그림 (python3 scripts/art/duckling_sheet.py) → apps/client/public/sprites/custom/fx_duckling.png (render/duck.drawDucklings)
# 원본 scripts/art/src/duckling.png: 4×2 (위 서기 · 아래 꽥) · 칸 순서 앞·뒤·왼·오 · 결과는 48칸 4×2 (발이 칸 아래에 닿게, 모두 같은 배율)
import os

from PIL import Image

from import_sheet import HERE, finish, shrink
from import_v2 import pieces
from s2_common import SPRITES

CELL = 48
# 앞모습 서기 키 = 40칸 (꽥 음파는 칸 폭에 맞게 그 자세만 더 줄임)
BODY = 40

if __name__ == "__main__":
    img = Image.open(os.path.join(HERE, "src", "duckling.png")).convert("RGBA")
    grid = pieces(img, 4, 2, flood=True)
    base = BODY / grid[0][0].height
    sheet = Image.new("RGBA", (CELL * 4, CELL * 2), (0, 0, 0, 0))
    for r, line in enumerate(grid):
        for c, p in enumerate(line):
            p = shrink(p, min(base, (CELL - 2) / p.width, (CELL - 2) / p.height))
            sheet.alpha_composite(p, (c * CELL + (CELL - p.width) // 2, r * CELL + CELL - 1 - p.height))
    out = os.path.join(SPRITES, "custom", "fx_duckling.png")
    finish(sheet).save(out, optimize=True)
    print("duckling ok", sheet.size)
