# 시즌 3 단계별 보스 그림 (GPT 원본 art/일반보스/) → 게임 그림 (python3 scripts/art/s3_bosses.py)
# 보스 4장(2×2: 걷기 1·2 · 공격 준비 · 공격) → enemies/{이름}.png 가로 4칸, 칸 = 게임 크기 × 4 (enemySprites ENEMY_SRC 4)
# 소품(가로로 늘어선 모습들) → enemies/{이름}.png 가로 N칸 · 빛나는 소품(달·그림자 손·달 조각/기둥)은 검은 배경을 밝기로 투명하게 (부드러운 빛)
import os
import sys

from PIL import Image

from import_sheet import finish, shrink
from import_v2 import pieces
from s2_common import SPRITES

HD = 4
ROOT = os.path.join(os.path.dirname(__file__), "../../art/일반보스")
BOSSES = {
    # 이름: (원본, 게임 칸 크기)
    "gatekeeper": ("1,2단계/지옥문 수문장의 강철 방패 기술 모음.png", 52),
    "twinlu": ("3,4단계/붉은 리본의 광대 악마 포즈 시트.png", 40),
    "twinre": ("3,4단계/쌍둥이 악마 레의 혈액 마법 포즈 시트.png", 40),
    "mooneater": ("5,6단계/달빛 심장을 품은 날개 마도사 pose sequence.png", 60),
}
# 이름: (원본, 모습 수, 게임 칸 크기, 빛나는 그림인지)
PROPS = {
    "hellgate": ("1,2단계/세 가지 상태의 악마의 문 픽셀 아트.png", 3, 40, False),
    "imp": ("1,2단계/픽셀 아트 꼬마 악마 임프 스프라이트 시트.png", 4, 22, False),
    "moonphase": ("5,6단계/픽셀 아트 달의 위상과 붉은 월식.png", 5, 40, True),
    "shadowhand": ("5,6단계/픽셀 아트 망령의 손 애니메이션.png", 3, 30, True),
    "moonaltar": ("5,6단계/수정 초승달과 빛의 제단.png", 2, 48, True),
}


def glow(img):
    """검은 배경 → 투명 (밝기를 투명도로, 색은 그만큼 밝혀 원래 색 유지)"""
    img = img.convert("RGB")
    out = Image.new("RGBA", img.size)
    src, dst = img.load(), out.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b = src[x, y]
            a = max(r, g, b)
            if a < 14:
                dst[x, y] = (0, 0, 0, 0)
                continue
            k = 255 / a
            dst[x, y] = (min(255, int(r * k)), min(255, int(g * k)), min(255, int(b * k)), a)
    return out


def boss(name, path, size):
    cell = size * HD
    img = Image.open(os.path.join(ROOT, path)).convert("RGBA")
    grid = pieces(img, 2, 2, flood=True)
    parts = [grid[0][0], grid[0][1], grid[1][0], grid[1][1]]
    # 걷기 1 모습 키 = 칸의 90% (import_boss와 같음) · 공격 효과가 넓어 넘치는 칸만 더 줄임 · 발을 같은 줄에
    base = cell * 0.9 / parts[0].height
    sheet = Image.new("RGBA", (cell * 4, cell), (0, 0, 0, 0))
    for i, p in enumerate(parts):
        p = shrink(p, min(base, (cell - 4) / p.width, (cell - 4) / p.height))
        sheet.alpha_composite(p, (i * cell + (cell - p.width) // 2, cell - 2 - p.height))
    finish(sheet).save(os.path.join(SPRITES, "enemies", f"{name}.png"), optimize=True)
    print(name, sheet.size)


def prop(name, path, n, size, soft):
    cell = size * HD
    img = Image.open(os.path.join(ROOT, path)).convert("RGBA")
    w = img.width / n
    sheet = Image.new("RGBA", (cell * n, cell), (0, 0, 0, 0))
    if soft:
        # 빛나는 그림: 칸을 그대로 잘라 (흩날리는 빛 조각까지) 같은 배율로 줄임
        parts = [glow(img.crop((int(i * w), 0, int((i + 1) * w), img.height))) for i in range(n)]
        boxes = [p.getbbox() or (0, 0, 1, 1) for p in parts]
        parts = [p.crop(b) for p, b in zip(parts, boxes)]
        k = min(min((cell - 2) / p.width, (cell - 2) / p.height) for p in parts)
        for i, p in enumerate(parts):
            p = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            sheet.alpha_composite(p, (i * cell + (cell - p.width) // 2, cell - 1 - p.height))
        sheet.save(os.path.join(SPRITES, "enemies", f"{name}.png"), optimize=True)
    else:
        grid = pieces(img, n, 1, flood=True)
        parts = [grid[0][i] for i in range(n)]
        k = min(min((cell - 4) / p.width, (cell - 4) / p.height) for p in parts)
        for i, p in enumerate(parts):
            p = shrink(p, k)
            sheet.alpha_composite(p, (i * cell + (cell - p.width) // 2, cell - 2 - p.height))
        finish(sheet).save(os.path.join(SPRITES, "enemies", f"{name}.png"), optimize=True)
    print(name, sheet.size)


if __name__ == "__main__":
    for name, (path, size) in BOSSES.items():
        boss(name, path, size)
    for name, (path, n, size, soft) in PROPS.items() if len(sys.argv) < 2 else []:
        prop(name, path, n, size, soft)
