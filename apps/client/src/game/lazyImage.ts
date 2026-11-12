// 그림을 처음 쓸 때 받기: 파일 맨 위에서 만들어 두어도 그때는 내려받지 않음 (첫 로딩 줄이기)
// lazyImg: 그리기 전에 다 받았는지(complete·naturalWidth·width 등) 처음 물어볼 때 받기 시작
// imageLoader: 이름마다 처음 찾을 때 받기 시작, 다 받기 전에는 undefined (도형·기본 그림으로 그림)

const PROPS = ["complete", "naturalWidth", "naturalHeight", "width", "height"] as const;

/** 처음 물어볼 때 받기 시작하는 그림 (src는 그때 정함) */
export function lazyImg(src: string | (() => string)): HTMLImageElement {
  const i = new Image();
  let started = false;
  const proto = HTMLImageElement.prototype;
  for (const key of PROPS) {
    const get = Object.getOwnPropertyDescriptor(proto, key)?.get;
    if (!get) continue;
    Object.defineProperty(i, key, {
      configurable: true,
      get() {
        if (!started) {
          started = true;
          i.src = typeof src === "string" ? src : src();
        }
        return get.call(i);
      },
    });
  }
  return i;
}

/** public/sprites/{name}.png를 처음 물어볼 때 받기 */
export const spriteImg = (name: string, ext = "png") => lazyImg(`${import.meta.env.BASE_URL}sprites/${name}.${ext}`);

/** 이름마다 처음 찾을 때 받기 시작 · 다 받은 그림만 돌려줌 (받는 중·실패는 undefined) */
export function imageLoader(srcOf: (name: string) => string | null | undefined): (name: string) => HTMLImageElement | undefined {
  const images = new Map<string, HTMLImageElement | null>();
  return (name) => {
    if (!images.has(name)) {
      images.set(name, null);
      const src = srcOf(name);
      if (src) {
        const img = new Image();
        img.onload = () => images.set(name, img);
        img.src = src;
      }
    }
    return images.get(name) ?? undefined;
  };
}
