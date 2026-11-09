# 시즌 3 라스트 보스 레비아탄 그림 (GPT 원본 art/최종보스/레비아탄/, 가로 5칸) → enemies/{이름}.png 가로 5칸, 칸 = 게임 크기 × 4
# (python3 scripts/art/leviathan.py) 칸: 용 0 서기 · 1 휩쓸기 · 2 포효 · 3 소용돌이 · 4 날개+빛 고리 / 고래 0 떠오름 · 1 머리 · 2 입 · 3 잠김 · 4 빛 고리
# 해왕 0 서기 · 1 물 채찍 · 2 소용돌이 구슬 · 3 물의 용 · 4 해일 승천 (모두 같은 배율, 발을 같은 줄에) · render/leviathan이 sim의 lhPose로 고름
import os

from PIL import Image

from import_sheet import finish, shrink
from import_v2 import pieces
from s2_common import SPRITES

HD = 4
ROOT = os.path.join(os.path.dirname(__file__), "../../art/최종보스/레비아탄")
SHEETS = {
    # 이름: (원본, 게임 칸 크기)
    "leviathan": ("5단계 블루 드래곤 변신 스프라이트.png", 110),
    "levwhale": ("우주 고래의 다섯 가지 상승 변주.png", 100),
    "levking": ("다섯 모습의 해왕, 파도와 용의 소환.png", 62),
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
