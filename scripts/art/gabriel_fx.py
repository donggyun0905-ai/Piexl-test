# 가브리엘 빛의 망치 그림: art/가브리엘의 황금빛 해머 충격파 → apps/client/public/sprites/gabriel_fx.png (256×256 한 장)
# 검은 배경은 밝기로 투명하게 바꿈 (빛이라 겹쳐 그리면 자연스러움). 아래쪽 가운데 = 망치가 땅을 치는 자리
import os

from PIL import Image

from hook_fx import key

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "..")
SRC = os.path.join(ROOT, "art", "가브리엘", "황금빛 천상의 해머 충격파.png")
OUT = os.path.join(ROOT, "apps", "client", "public", "sprites", "gabriel_fx.png")
SIZE = 256


def main():
    img = key(Image.open(SRC).convert("RGB"))
    img = img.crop(img.getbbox())
    k = min(SIZE / img.width, SIZE / img.height)
    s = img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
    out = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    out.alpha_composite(s, ((SIZE - s.width) // 2, SIZE - s.height))
    out.save(OUT, optimize=True)
    print("gabriel_fx ok", out.size)


if __name__ == "__main__":
    main()
