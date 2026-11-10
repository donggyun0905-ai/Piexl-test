# 시즌 3 라스트 보스 아스모데우스의 화신체 그림 (GPT 원본 art/최종보스/아스모데우스의 화신체/, 가로 5칸) → enemies/{이름}.png 가로 5칸, 칸 = 게임 크기 × 4
# (python3 scripts/art/asmodeus.py) 욕망(100~76줄) 0 서기 · 1 보라 불꽃 베기 · 2 마창 · 3 머리 위 구슬 · 4 다섯 구슬
# 검은 해(75~51) 0 서기 · 1 휘두르기(빨아들이기) · 2 손 위 블랙홀 · 3 하늘 블랙홀 고리 · 4 결정 별 / 강철 군주(50~0) 0 서기 · 1 붉은 베기 · 2 고리 구슬 · 3 결정 창 · 4 톱니 날
# render/asmodeus가 sim의 amPose로 고름
import os

from PIL import Image

from import_sheet import finish, shrink
from import_v2 import pieces
from s2_common import SPRITES

HD = 4
ROOT = os.path.join(os.path.dirname(__file__), "../../art/최종보스/아스모데우스의 화신체")
SHEETS = {
    # 이름: (원본, 게임 칸 크기)
    "asmodeus": ("보랏빛 화염의 악마 마법사 5연속 컷.png", 64),
    "asmovoid": ("암흑 천사의 다섯 가지 변신술.png", 70),
    "asmolord": ("다섯 포즈의 암흑 군주 보스 스프라이트.png", 76),
}


def sheet(name, path, size):
    cell = size * HD
    img = Image.open(os.path.join(ROOT, path)).convert("RGBA")
    grid = pieces(img, 5, 1, flood=True)
    parts = [grid[0][i] for i in range(5)]
    k = min(min((cell - 4) / p.width, (cell - 4) / p.height) for p in parts)
    out = Image.new("RGBA", (cell * 5, cell), (0, 0, 0, 0))
    for i, p in enumerate(parts):
        p = shrink(p, k)
        out.alpha_composite(p, (i * cell + (cell - p.width) // 2, cell - 2 - p.height))
    finish(out).save(os.path.join(SPRITES, "enemies", f"{name}.png"), optimize=True)
    print(name, out.size)


if __name__ == "__main__":
    for name, (path, size) in SHEETS.items():
        sheet(name, path, size)
