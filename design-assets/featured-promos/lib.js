import * as THREE from "three";
import { RoomEnvironment } from "../../node_modules/three/examples/jsm/environments/RoomEnvironment.js";
export { THREE };
const C = "captures/";
export const load = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(Error(src)); i.src = src; });

export function panels(list) {
  list.forEach(({ bg, fg = "#141419", text }, i) => {
    const d = document.createElement("div");
    d.className = "p"; d.style.cssText = `left:${i * 460}px;background:${bg}`;
    d.innerHTML = `<h2 style="color:${fg}">${text}</h2>`;
    document.body.append(d);
    if (i) { const g = document.createElement("div"); g.className = "gut"; g.style.left = i * 460 - 20 + "px"; document.body.append(g); }
  });
}

// A floating, untouched crop of a product capture. Coordinates x..h are capture pixels.
export async function piece({ src, x = 0, y = 0, w, h, left, top, width, rot = 0, r = 20, pad = 0, bg = "#111", z = 4, dir = C, line }) {
  const im = await load(dir + src);
  w ??= im.width; h ??= im.height;
  const k = (width - pad * 2) / w, d = document.createElement("div");
  d.className = "ui";
  d.style.cssText = `left:${left}px;top:${top}px;width:${width}px;height:${h * k + pad * 2}px;transform:rotate(${rot}deg);border-radius:${r}px;background:${bg};z-index:${z};${line ? `outline:1.5px solid ${line};outline-offset:-1px;` : ""}`;
  d.innerHTML = `<i style="inset:${pad}px;background-image:url(${dir}${src});background-size:${im.width * k}px ${im.height * k}px;background-position:${-x * k}px ${-y * k}px"></i>`;
  document.body.append(d);
}

export function stage({ env = 0.5, key = 2, ambient = 0.2, shadow = 6, w: W = 1820, h: H = 956, dpr = 3 } = {}) {
  const canvas = document.createElement("canvas"); canvas.id = "gl"; document.body.append(canvas);
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(dpr); r.setSize(W, H, false);
  canvas.style.cssText = `width:${W}px;height:${H}px`; r.toneMapping = THREE.NoToneMapping;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = env;
  const cam = new THREE.OrthographicCamera(0, W, 0, -H, -3000, 4000);
  const l = new THREE.DirectionalLight(0xffffff, key);
  l.position.set(W / 2 - 500, -H / 2 + 750, 1300); l.target.position.set(W / 2, -H / 2, 0);
  l.castShadow = true; l.shadow.mapSize.set(8192, 8192); l.shadow.radius = shadow; l.shadow.bias = -0.0006; l.shadow.normalBias = 1.5;
  Object.assign(l.shadow.camera, { left: -1200, right: 1200, top: 900, bottom: -900, near: 1, far: 4500 });
  scene.add(l, l.target, new THREE.AmbientLight(0xffffff, ambient));
  return { scene, cam, r, async done() { await document.fonts.ready; r.render(scene, cam); document.title = "ready"; } };
}

// A strip through points with an explicit width direction per sample.
export function strip(P, dirs, width, { uLen = 1, vFlip = false, thick = 0 } = {}) {
  const pos = [], uv = [], idx = []; let s = 0;
  P.forEach((p, i) => {
    if (i) s += p.distanceTo(P[i - 1]);
    for (const v of [0, 1]) {
      const q = p.clone().addScaledVector(dirs[i], (v - 0.5) * width);
      pos.push(q.x, q.y, q.z); uv.push(s / uLen, vFlip ? 1 - v : v);
    }
    if (i < P.length - 1) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
export const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
export const curve = (pts) => new THREE.CatmullRomCurve3(pts.map((p) => V(...p)), false, "centripetal");
export function mesh(scene, g, m) { const o = new THREE.Mesh(g, m); o.castShadow = o.receiveShadow = true; scene.add(o); return o; }
export function texture(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
