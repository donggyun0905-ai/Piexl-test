# 새 방 소품 그림 (사용자 GPT 원본 art/…) → apps/client/public/sprites/props/{이름}.webp  (python3 scripts/art/room_props.py)
# 검은 배경 지우기(key) 또는 그대로 두기(glow: 게임에서 더하기로 그려 검정이 사라짐) · 가로로 나란한 여러 모습을 칸으로 나눔(같은 높이·바닥선)
# · 게임에서 그릴 크기의 4배로 줄임. 게임 쪽 이름·칸 수는 render/propArt.ts의 PROPS와 같아야 함
import os

from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
ART = os.path.join(ROOT, "art")
OUT = os.path.join(ROOT, "apps", "client", "public", "sprites", "props")
SCALE = 4

# 이름: (원본, 칸 수, 방식, 게임 크기 ("h" 높이 또는 "w" 너비, 게임 픽셀))
PROPS = {
    "trialStone": ("시련의방/붉은 룬의 고대 석상 한 쌍.png", 2, "key", ("h", 64)),
    "trialChest": ("시련의방/붉은 보물상자와 황금빛 상자.png", 2, "key", ("h", 16)),
    "crack": ("비밀의 방/픽셀 아트 마법 균열 3종세트.png", 3, "glow", ("h", 34)),
    "devilStatue": ("악마의 방/지옥의 석상 수호자.png", 1, "key", ("h", 76)),
    "devilAltar": ("악마의 방/붉은 마법진의 제단과 소용돌이 에너지.png", 1, "key", ("h", 34)),
    "gambleTable": ("도박꾼의 방/빅토리아풍 녹색 펠트 게임 테이블.png", 1, "key", ("w", 128)),
    "cups": ("도박꾼의 방/픽셀 아트 컵 셸 게임 스프라이트 시트.png", 3, "key", ("h", 26)),
    "gambler": ("도박꾼의 방/네 가지 표정의 픽셀 아트 캐릭터 초상화.png", 4, "key", ("h", 30)),
    "auctioneer": ("암흑가(경매장)/경매사의 네 가지 역동적인 포즈.png", 4, "key", ("h", 44)),
    "throne": ("암흑가(경매장)/나란히 놓인 황금빛 픽셀 왕좌들.png", 2, "key", ("h", 26)),
    "guestChair": ("암흑가(경매장)/빈티지 붉은 의자 뒷모습.png", 1, "key", ("h", 18)),
    "lotStand": ("암흑가(경매장)/세 가지 신비한 보물 받침대.png", 3, "key", ("h", 18)),
    "stage": ("암흑가(경매장)/화려한 금빛 아치와 붉은 벨벳 무대.png", 1, "key", ("w", 196)),
    "paddle": ("암흑가(경매장)/황금 장식 경매 패들.png", 1, "key", ("h", 26)),
    "altarStand": ("제단의 방/별빛 마법 제단과 궤도 구체.png", 1, "key", ("h", 40)),
    "starWhale": ("제단의 방/빛나는 픽셀 고래자리.png", 1, "glow", ("w", 300)),
    "starTurtle": ("제단의 방/용암 화산 거북이 별자리.png", 1, "glow", ("w", 300)),
    "starHawk": ("제단의 방/황금빛 별자리 전기 독수리.png", 1, "glow", ("w", 300)),
    "starWind": ("제단의 방/별빛을 휘감은 바람의 여신.png", 1, "glow", ("w", 300)),
    "starSion": ("제단의 방/빛과 어둠의 성기사 별자리.png", 1, "glow", ("w", 300)),
    "starSylvester": ("제단의 방/빛나는 잎과 별자리의 숲의 사슴 정령.png", 1, "glow", ("w", 300)),
    "starWitch": ("제단의 방/별빛을 품은 일곱 뿔 마녀.png", 1, "glow", ("w", 300)),
    "starUnknown": ("제단의 방/네온 성운과 별자리 소용돌이.png", 1, "glow", ("w", 300)),
}


def key_black(img):
    """검은 배경 → 투명 (아주 어두운 곳은 밝기만큼 반투명, 테두리가 부드럽게)"""
    img = img.convert("RGBA")
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, _ = px[x, y]
            m = max(r, g, b)
            if m < 14:
                px[x, y] = (r, g, b, 0)
            elif m < 40:
                px[x, y] = (r, g, b, int(255 * (m - 14) / 26))
    return img


def occupied(img, glow):
    """칸 나누기·자르기에 쓸 '그림이 있는' 표 (glow는 밝기로)"""
    g = img.convert("L") if glow else img.getchannel("A")
    return g.point(lambda v: 255 if v > (40 if glow else 60) else 0)


def split(mask, n):
    """가로로 나란한 n개: 빈 세로줄이 가장 넓은 n-1곳에서 나눔 → [(왼, 오)]"""
    w, h = mask.size
    col = [mask.crop((x, 0, x + 1, h)).getbbox() is not None for x in range(w)]
    xs = [x for x in range(w) if col[x]]
    left, right = xs[0], xs[-1] + 1
    gaps, x = [], left
    while x < right:
        if not col[x]:
            s = x
            while x < right and not col[x]: x += 1
            gaps.append((x - s, s, x))
        else: x += 1
    cuts = sorted(sorted(gaps, reverse=True)[: n - 1], key=lambda g: g[1])
    edges, prev = [], left
    for _, s, e in cuts:
        edges.append((prev, s))
        prev = e
    edges.append((prev, right))
    return edges


def build(name, src, n, mode, size):
    img = Image.open(os.path.join(ART, src)).convert("RGB")
    glow = mode == "glow"
    if not glow: img = key_black(img)
    mask = occupied(img, glow)
    parts = split(mask, n) if n > 1 else [mask.getbbox()[0::2]]
    # 모든 칸이 같은 위·아래 (바닥선이 같게)
    tops, bots = [], []
    for l, r in parts:
        bb = mask.crop((l, 0, r, img.height)).getbbox()
        tops.append(bb[1])
        bots.append(bb[3])
    top, bot = min(tops), max(bots)
    cw = max(r - l for l, r in parts) + 8
    ch = bot - top + 8
    sheet = Image.new(img.mode, (cw * n, ch), (0, 0, 0) if glow else (0, 0, 0, 0))
    for i, (l, r) in enumerate(parts):
        sheet.paste(img.crop((l, top, r, bot)), (i * cw + (cw - (r - l)) // 2, 4))
    kind, game = size
    k = game * SCALE / (ch if kind == "h" else cw)
    out = sheet.resize((max(1, round(cw * k)) * n, max(1, round(ch * k))), Image.LANCZOS)
    path = os.path.join(OUT, f"{name}.webp")
    if glow: out.save(path, "WEBP", quality=88, method=6)
    else: out.save(path, "WEBP", lossless=True, method=6)
    print(name, out.size, f"{os.path.getsize(path) // 1024}KB")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, (src, n, mode, size) in PROPS.items():
        build(name, src, n, mode, size)
