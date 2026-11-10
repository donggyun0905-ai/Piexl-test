# 미카엘라 무기 그림: art/캐릭터/미카엘라의 창 모음(다운로드.jpg)·검 모음(다운로드 (1).jpg) → 무기 하나씩 잘라 apps/client/public/sprites/michaela_weapons.png
# 칸 하나 = 가로 CW × 세로 CH, 날 끝이 칸 맨 위(1px 아래) · 창 21개 다음 검 16개 차례 (python3 scripts/art/michaela_weapons.py)
# 무기마다 그림 색으로 속성(0 성은 · 1 빙결 · 2 홍염 · 3 혈월 · 4 천광 · 5 자전 · 6 비취 · 7 청해)을 골라 packages/shared/src/michaelaWeaponList.ts에 씀
import colorsys
import os

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "..")
SPEARS = os.path.join(ROOT, "art", "캐릭터", "미카엘라", "다운로드.jpg")
SWORDS = os.path.join(ROOT, "art", "캐릭터", "미카엘라", "다운로드 (1).jpg")
OUT = os.path.join(ROOT, "apps", "client", "public", "sprites", "michaela_weapons.png")
LIST = os.path.join(ROOT, "packages", "shared", "src", "michaelaWeaponList.ts")
CW, CH = 24, 72
# 무기마다 속성 (그림을 보고 정함, 차례 = 창 0~20 · 검 21~36): 0 성은 · 1 빙결 · 2 홍염 · 3 혈월 · 4 천광 · 5 자전 · 6 비취 · 7 청해
# 색으로 자동으로 고르면 자루·검은 테두리 때문에 성은으로 쏠려서 손으로 정함 (무기 수가 바뀌면 남는 것만 자동)
FIX = dict(enumerate([0, 7, 3, 1, 2, 0, 4, 5, 0, 0, 0, 5, 3, 6, 6, 1, 4, 1, 2, 4, 0, 0, 3, 1, 4, 2, 4, 7, 7, 5, 3, 4, 2, 1, 7, 0, 4]))


def mask_of(a, bg, th):
    d = np.abs(a.astype(int) - np.array(bg)).sum(axis=2)
    return d, d > th


def runs(v, gap):
    """값이 있는 칸의 이어진 구간 (gap 이하로 끊긴 것은 이어 붙임)"""
    out, start, last = [], None, None
    for i, x in enumerate(v):
        if x:
            if start is None: start = i
            elif i - last > gap + 1:
                out.append((start, last)); start = i
            last = i
    if start is not None: out.append((start, last))
    return out


def label(m):
    """이어진 덩어리 번호 (8방향) · 덩어리마다 [x0, y0, x1, y1, 칸 수]"""
    h, w = m.shape
    lab = np.zeros((h, w), dtype=np.int32)
    boxes = []
    ys, xs = np.nonzero(m)
    for sy, sx in zip(ys.tolist(), xs.tolist()):
        if lab[sy, sx]: continue
        n = len(boxes) + 1
        lab[sy, sx] = n
        st = [(sy, sx)]
        b = [sx, sy, sx, sy, 0]
        while st:
            y, x = st.pop()
            b[4] += 1
            b[0] = min(b[0], x); b[1] = min(b[1], y); b[2] = max(b[2], x); b[3] = max(b[3], y)
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < h and 0 <= xx < w and m[yy, xx] and not lab[yy, xx]:
                        lab[yy, xx] = n
                        st.append((yy, xx))
        boxes.append(b)
    return lab, boxes


def pieces(path, bg, th, min_h):
    """큰(키가 min_h 넘는) 덩어리 하나 = 무기 하나 · 그 상자 안의 작은 조각(장식)은 붙임 · 왼쪽 위부터 줄 차례"""
    a = np.array(Image.open(path).convert("RGB"))
    d, m = mask_of(a, bg, th)
    lab, boxes = label(m)
    big = [i for i, b in enumerate(boxes) if b[3] - b[1] >= min_h]
    out = []
    rows = sorted(big, key=lambda i: boxes[i][1])
    # 줄로 묶기 (위쪽이 비슷한 것끼리) → 줄마다 왼쪽부터
    lines, cur = [], []
    for i in rows:
        if cur and boxes[i][1] - boxes[cur[0]][1] > min_h: lines.append(cur); cur = []
        cur.append(i)
    if cur: lines.append(cur)
    for line in lines:
        for i in sorted(line, key=lambda j: boxes[j][0]):
            x0, y0, x1, y1, _ = boxes[i]
            keep = np.isin(lab[y0:y1 + 1, x0:x1 + 1], [i + 1] + [j + 1 for j, b in enumerate(boxes) if j not in big and b[4] >= 60 and b[0] >= x0 and b[2] <= x1 and b[1] >= y0 and b[3] <= y1])
            # 붙어 버린 무기 여럿: 아래쪽 절반(자루)의 세로 줄 묶음마다 하나로 나눔 (가까운 자루 쪽 칸으로)
            low = keep[keep.shape[0] // 2:].sum(axis=0) > 0
            shafts = [((a0 + a1) / 2) for a0, a1 in runs(low, 3)]
            for n, c in enumerate(shafts):
                cols = np.array([min(range(len(shafts)), key=lambda q: abs(shafts[q] - x)) == n for x in range(keep.shape[1])])
                part = keep & cols[None, :]
                if not part.any(): continue
                ys2, xs2 = np.nonzero(part)
                ya, yb, xa, xb = ys2.min(), ys2.max(), xs2.min(), xs2.max()
                rgb = a[y0 + ya:y0 + yb + 1, x0 + xa:x0 + xb + 1]
                al = np.clip((d[y0 + ya:y0 + yb + 1, x0 + xa:x0 + xb + 1] - 25) * 6, 0, 255) * part[ya:yb + 1, xa:xb + 1]
                out.append(Image.fromarray(np.dstack([rgb, al]).astype(np.uint8), "RGBA"))
    return out


def elem(p):
    """그림 색 → 속성: 채도 높은 칸의 평균 색상으로"""
    a = np.array(p).astype(float) / 255
    hs = []
    for r, g, b, al in a.reshape(-1, 4):
        if al < 0.8: continue
        h, l, s = colorsys.rgb_to_hls(r, g, b)
        if s > 0.35 and 0.2 < l < 0.85: hs.append(h * 360)
    total = (a[..., 3] > 0.8).sum()
    if len(hs) < total * 0.12:
        dark = (a[..., :3][a[..., 3] > 0.8].mean() < 0.35)
        return 3 if dark else 0
    hist = np.histogram(hs, bins=36, range=(0, 360))[0]
    h = (hist.argmax() + 0.5) * 10
    if h < 18 or h >= 340: return 3 if np.mean([x for x in hs if x < 18 or x >= 340] or [0]) else 2
    if h < 40: return 2
    if h < 70: return 4
    if h < 165: return 6
    if h < 195: return 1
    if h < 245: return 7
    return 5


def main():
    spears = pieces(SPEARS, (0, 0, 0), 60, 200)
    swords = pieces(SWORDS, (42, 44, 57), 45, 250)
    allw = spears + swords
    sheet = Image.new("RGBA", (CW * len(allw), CH), (0, 0, 0, 0))
    for i, p in enumerate(allw):
        k = min((CH - 2) / p.height, (CW - 2) / p.width)
        s = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
        sheet.alpha_composite(s, (i * CW + (CW - s.width) // 2, 1))
    sheet.save(OUT, optimize=True)
    elems = [FIX.get(i, elem(p)) for i, p in enumerate(allw)]
    with open(LIST, "w", encoding="utf-8") as f:
        f.write("// 미카엘라 무기 그림 목록 (scripts/art/michaela_weapons.py가 만듦, 손으로 고치지 않음 · 속성은 그 파일의 FIX에서): 그림 sprites/michaela_weapons 칸 차례 = 창 MC_SPEARS개 다음 검. 무기마다 속성 (0 성은 · 1 빙결 · 2 홍염 · 3 혈월 · 4 천광 · 5 자전 · 6 비취 · 7 청해)\n")
        f.write(f"export const MC_SPEARS = {len(spears)};\n")
        f.write(f"export const MC_WEAPON_ELEM: readonly number[] = {elems};\n")
    print("spears", len(spears), "swords", len(swords), "elems", elems)


if __name__ == "__main__":
    main()
