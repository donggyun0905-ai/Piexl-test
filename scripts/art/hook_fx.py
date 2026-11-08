# 훅 산탄총 발사 그림: art/캐릭터/훅의 푸른 폭발 시트 → apps/client/public/sprites/hook_fx.png
# 줄 0: 큰 발사 4칸 (번쩍 → 연기 → 초승달 충격 → 흩어짐) · 줄 1: 둘째 총열 4칸 (줄기 → 연기)
# 검은 배경은 밝기로 투명하게 바꿈 (빛이라 겹쳐 그리면 자연스러움). 칸마다 왼쪽 가운데 = 총구
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "..")
SRC = os.path.join(ROOT, "art", "캐릭터", "훅", "차가운 푸른빛 픽셀 폭발 스프라이트 시트.png")
OUT = os.path.join(ROOT, "apps", "client", "public", "sprites", "hook_fx.png")
CELL = 128
# 원본에서 잘라 낼 칸 (x0, x1) · 줄 (y0, y1): 잘라 보고 정함
ROWS = [((34, 367), [(71, 238), (262, 464), (507, 707), (729, 962)]), ((1129, 1293), [(41, 248), (295, 527), (563, 769), (832, 1000)])]


def key(img):
    """밝기 → 투명도 (검정은 투명, 밝을수록 진하게)"""
    out = Image.new("RGBA", img.size)
    src, dst = img.load(), out.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b = src[x, y]
            m = max(r, g, b)
            if m < 30:
                continue
            a = min(255, int((m - 30) * 1.7))
            k = 255 / max(1, m)
            dst[x, y] = (min(255, int(r * k)), min(255, int(g * k)), min(255, int(b * k)), a)
    return out


def main():
    img = Image.open(SRC).convert("RGB")
    sheet = Image.new("RGBA", (CELL * 4, CELL * len(ROWS)), (0, 0, 0, 0))
    for row, ((y0, y1), cols) in enumerate(ROWS):
        parts = [key(img.crop((x0, y0, x1, y1))) for x0, x1 in cols]
        parts = [p.crop(p.getbbox()) for p in parts]
        k = min(min((CELL - 2) / p.width, (CELL - 2) / p.height) for p in parts)
        for col, p in enumerate(parts):
            s = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            sheet.alpha_composite(s, (col * CELL + 1, row * CELL + (CELL - s.height) // 2))
    sheet.save(OUT)
    print("hook_fx ok", sheet.size)


if __name__ == "__main__":
    main()
