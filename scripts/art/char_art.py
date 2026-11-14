"""캐릭터 선택 일러스트 넣기: art/선택일러스트/{이름}.png → apps/client/public/sprites/charArt/{id}.webp
- 위아래 검은 띠가 있으면 잘라 냄 · 가로 1376px(원본 절반, 선택 창 640px의 2배 화면에서도 선명)로 줄임
- 선택 창 카드용으로 가운데를 정사각형으로 잘라 400px로 줄인 그림도 만듦 (charArt/card/{id}.webp)
- 스토리 대화 초상화용으로 위쪽 가운데(머리·가슴)를 정사각형으로 잘라 256px (charArt/face/{id}.webp)
- 이름 → id 표는 i18n/text의 ko 이름에서 찾음 · 목록은 apps/client/src/select/charArtList.ts로 씀
실행: python3 scripts/art/char_art.py
"""
import os, re, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "art", "선택일러스트")
OUT = os.path.join(ROOT, "apps", "client", "public", "sprites", "charArt")
LIST = os.path.join(ROOT, "apps", "client", "src", "select", "charArtList.ts")
W = 1376
CARD = 400
FACE = 256
# 인물이 가운데가 아닌 그림: 카드 가운데 x (0~1) · 얼굴 (가운데 x, 위 y)
CARD_X = {"bedouin": 0.33}
FACE_AT = {"bedouin": (0.31, 0.03), "fenrir": (0.37, 0.24)}

names = {}
for f in glob.glob(os.path.join(ROOT, "apps", "client", "src", "i18n", "text", "*.ts")):
    for m in re.finditer(r'^\s+(\w+): \{ ko: "([^"]+)"', open(f, encoding="utf8").read(), re.M):
        if not re.search(r"Desc|Name|Title|_|^pw", m.group(1)):
            names.setdefault(m.group(2), m.group(1))

def crop_bars(im):
    g = im.convert("L")
    w, h = g.size
    dark = lambda y: max(g.crop((0, y, w, y + 1)).getextrema()) < 24
    top, bot = 0, h
    while top < h // 4 and dark(top): top += 1
    while bot > h * 3 // 4 and dark(bot - 1): bot -= 1
    return im.crop((0, top, w, bot)) if top or bot < h else im

os.makedirs(os.path.join(OUT, "card"), exist_ok=True)
os.makedirs(os.path.join(OUT, "face"), exist_ok=True)
ids = []
for p in sorted(glob.glob(os.path.join(SRC, "*.png"))):
    n = os.path.splitext(os.path.basename(p))[0]
    cid = names.get(n)
    if not cid:
        print("이름 못 찾음:", n); continue
    im = crop_bars(Image.open(p).convert("RGB"))
    h = round(im.height * W / im.width)
    im.resize((W, h), Image.LANCZOS).save(os.path.join(OUT, cid + ".webp"), "WEBP", quality=86, method=6)
    x = min(max(0, round(im.width * CARD_X.get(cid, 0.5) - im.height / 2)), im.width - im.height)
    sq = im.crop((x, 0, x + im.height, im.height)).resize((CARD, CARD), Image.LANCZOS)
    sq.save(os.path.join(OUT, "card", cid + ".webp"), "WEBP", quality=88, method=6)
    fs = round(im.height * 0.4)
    cx, top = FACE_AT.get(cid, (0.5, 0.05))
    fx = round(im.width * cx - fs / 2)
    fy = round(im.height * top)
    face = im.crop((fx, fy, fx + fs, fy + fs)).resize((FACE, FACE), Image.LANCZOS)
    face.save(os.path.join(OUT, "face", cid + ".webp"), "WEBP", quality=88, method=6)
    ids.append(cid)

ids.sort()
with open(LIST, "w", encoding="utf8") as f:
    f.write("// 캐릭터 선택 일러스트가 있는 캐릭터 (scripts/art/char_art.py가 만듦, 손으로 고치지 않음)\n")
    f.write("export const CHAR_ART: ReadonlySet<string> = new Set([\n")
    for i in range(0, len(ids), 8):
        f.write("  " + ", ".join(f'"{x}"' for x in ids[i:i + 8]) + ",\n")
    f.write("]);\n")
print(len(ids), "장")
