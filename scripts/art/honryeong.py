# 혼령 그림 (python3 scripts/art/honryeong.py) — 원본 art/캐릭터/혼령
# · honryeongFx.png (256칸 4×4, 투명 바탕): 0줄 기본 공격 연기용(탄생과 소멸) 4칸 · 1줄 혼-룡 질주 4칸 · 2·3줄 연기 구름 8개
# · honryeongPets.png (128칸 4×10, 칸 순서 앞·뒤·왼·오): 0·1줄 늑대 걷기 · 2줄 늑대 공격 · 3·4줄 범 걷기 · 5줄 범 공격
#   6줄 부엉이 앉음 · 7줄 부엉이 낙하 공격 · 8·9줄 부엉이 날기
#   검은 바탕만 지움 (연기 테두리 어두운 보라는 남김) · 칸 번호는 화면 render/honryeongArt와 같게
# 캐릭터 몸 시트는 import_v2.py honryeong (src/honryeong-1~3.png: 서기·공격 · 걷기 · 맞음·쓰러짐·대시)
import os

import numpy as np
from PIL import Image

from puppeteer import trim
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/혼령")


def key(name):
    """검은 바탕을 투명하게: 밝기가 낮을수록 투명 (어두운 보라 테두리부터는 다 보임)"""
    rgb = np.asarray(Image.open(os.path.join(CHAR, name)).convert("RGB")).astype(np.float32)
    a = np.clip((rgb.max(axis=2) - 14) * 9, 0, 255)
    return Image.fromarray(np.concatenate([rgb, a[..., None]], axis=2).astype(np.uint8), "RGBA")


def grid(im, cols, rows):
    w, h = im.width // cols, im.height // rows
    return [[trim(im.crop((c * w, r * h, (c + 1) * w, (r + 1) * h))) for c in range(cols)] for r in range(rows)]


def sheet(name, cell, rows, same):
    """rows: 줄마다 그림 목록 · same(줄 번호)이면 그 줄은 같은 배율"""
    out = Image.new("RGBA", (cell * 4, cell * len(rows)), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        big = max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row):
            k = (cell - 4) / (big if same(r) else max(p.width, p.height))
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            out.alpha_composite(q, (c * cell + (cell - q.width) // 2, r * cell + (cell - q.height) // 2))
    out.save(os.path.join(SPRITES, name), optimize=True)
    print(name, out.size)


def main():
    clouds = grid(key("보라빛 픽셀 구름 스프라이트 시트.png"), 4, 2)
    sheet("honryeongFx.png", 256, [grid(key("보랏빛 연기용의 탄생과 소멸.png"), 4, 1)[0], grid(key("라벤더 구름 용의 질주 스프라이트.png"), 4, 1)[0], *clouds], lambda r: r < 2)
    wolf = grid(key("보랏빛 연기 늑대 걷기 스프라이트.png"), 4, 2) + [grid(key("보라빛 연무 늑대 스프라이트 시트.png"), 4, 2)[1]]
    tiger = grid(key("연기 호랑이 걷기 애니메이션 시트.png"), 4, 2) + [grid(key("보랏빛 연무 호랑이 스프라이트 시트.png"), 4, 2)[1]]
    owl = grid(key("보랏빛 연무 올빼미 스프라이트 시트.png"), 4, 2) + grid(key("보랏빛 연무 올빼미 비행 스프라이트 시트.png"), 4, 2)
    # 같은 동물은 모든 칸 같은 배율 (걷다가 공격해도 크기가 안 바뀌게)
    rows = wolf + tiger + owl
    group = [0, 0, 0, 1, 1, 1, 2, 2, 2, 2]
    big = [max(max(p.width, p.height) for i, row in enumerate(rows) if group[i] == g for p in row) for g in range(3)]
    out = Image.new("RGBA", (128 * 4, 128 * len(rows)), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        for c, p in enumerate(row):
            k = 124 / big[group[r]]
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            out.alpha_composite(q, (c * 128 + (128 - q.width) // 2, r * 128 + (128 - q.height) // 2))
    out.save(os.path.join(SPRITES, "honryeongPets.png"), optimize=True)
    print("honryeongPets.png", out.size)


if __name__ == "__main__":
    main()
