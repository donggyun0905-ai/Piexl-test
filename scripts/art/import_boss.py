# GPT 보스 그림 → 4배 촘촘한 보스 시트 (python3 scripts/art/import_boss.py brood 40)
# 원본 scripts/art/src/boss-{이름}.png: 2×2 (왼쪽 위 걷기 1 · 오른쪽 위 걷기 2 · 왼쪽 아래 공격 준비 · 오른쪽 아래 공격), 오른쪽을 봄
# 결과 apps/client/public/sprites/enemies/{이름}.png: 가로 4칸 (칸 = 게임 크기 × 4), game/enemySprites.ts의 ENEMY_SRC에 {이름}: 4
# 옆으로 긴 보스(용 등, WIDE): 앞 세 칸이 들어가는 같은 배율로 넷 다 줄이고 왼쪽 끝(꼬리)을 맞춤 · 몸을 칸 세로 가운데에 (맞는 범위와 맞게) · 공격 칸의 긴 효과(불길)는 칸 밖이면 잘림
import os
import sys

from PIL import Image

from import_sheet import HERE, finish, shrink
from import_v2 import pieces
from s2_common import SPRITES

HD = 4
# 걷기 1 모습 키 = 칸의 이 비율 (공격 효과가 넓으면 그 칸만 더 줄임)
BODY = 0.9
WIDE = {"dragon"}

if __name__ == "__main__":
    name, size = sys.argv[1], int(sys.argv[2])
    cell = size * HD
    img = Image.open(os.path.join(HERE, "src", f"boss-{name}.png")).convert("RGBA")
    grid = pieces(img, 2, 2, flood=True)
    parts = [grid[0][0], grid[0][1], grid[1][0], grid[1][1]]
    base = cell * BODY / parts[0].height
    sheet = Image.new("RGBA", (cell * 4, cell), (0, 0, 0, 0))
    if name in WIDE:
        k = min(min((cell - 4) / p.width, (cell - 4) / p.height) for p in parts[:3])
        left = (cell - parts[0].width * k) // 2
        # 몸이 칸 세로 가운데에 오게 (맞는 범위 = 칸 가운데 원 · 네 칸 모두 같은 발 높이)
        foot = int((cell + parts[0].height * k) / 2)
        for i, p in enumerate(parts):
            p = shrink(p, k)
            frame = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
            frame.alpha_composite(p.crop((0, 0, min(p.width, int(cell - left)), p.height)), (int(left), foot - p.height))
            sheet.alpha_composite(frame, (i * cell, 0))
        parts = []
    for i, p in enumerate(parts):
        p = shrink(p, min(base, (cell - 2) / p.width, (cell - 2) / p.height))
        sheet.alpha_composite(p, (i * cell + (cell - p.width) // 2, cell - 2 - p.height))
    finish(sheet).save(os.path.join(SPRITES, "enemies", f"{name}.png"), optimize=True)
    print(name, "ok", sheet.size)
