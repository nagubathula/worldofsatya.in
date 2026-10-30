"use client";

import { Component, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, Html } from "@react-three/drei";
import * as THREE from "three";
import { galleryWorks, layoutGallery, viewForCluster } from "@/data/galleryWorks";

const ACTION = CameraControlsImpl.ACTION;
const BACKGROUND = "#ffffff";
// Works hang as the landing fan's cards: the picture runs to a deckled edge, no frame.
const FRAME_PAD = 0;
const CARD_BASE = "#e5e5e5";
const LOAD_DISTANCE = 48;

function makeShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 70, 6, 64, 64, 64);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.26)");
  gradient.addColorStop(0.42, "rgba(0, 0, 0, 0.09)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Seeded so every card keeps the same edge between visits.
function seededRandom(seed) {
  let value = seed % 2147483647 || 1;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

// The fan's deckled paper edge as an alpha map: a rounded card outline whose
// border wanders in and out a few pixels, so only the edge frays.
function makeDeckleTexture(aspect, seed) {
  const width = 512;
  const height = Math.round(width / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  const random = seededRandom(seed * 9301 + 49297);
  const inset = 6;
  const radius = Math.min(width, height) * 0.07;
  const w = width - inset * 2;
  const h = height - inset * 2;
  const straight = [w - radius * 2, h - radius * 2];
  const arc = (Math.PI * radius) / 2;
  const perimeter = (straight[0] + straight[1]) * 2 + arc * 4;
  const steps = Math.round(perimeter / 3);
  // Coarse wobble plus fine grain, like torn paper.
  const knots = Array.from({ length: Math.ceil(steps / 14) + 2 }, () => random());

  const corner = (cx, cy, start) => (d) => {
    const a = start + d / radius;
    return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
  };
  const segments = [
    [straight[0], (d) => [inset + radius + d, inset]],
    [arc, corner(inset + w - radius, inset + radius, -Math.PI / 2)],
    [straight[1], (d) => [inset + w, inset + radius + d]],
    [arc, corner(inset + w - radius, inset + h - radius, 0)],
    [straight[0], (d) => [inset + w - radius - d, inset + h]],
    [arc, corner(inset + radius, inset + h - radius, Math.PI / 2)],
    [straight[1], (d) => [inset, inset + h - radius - d]],
    [arc, corner(inset + radius, inset + radius, Math.PI)],
  ];
  const pointAt = (distance) => {
    let left = distance;
    for (const [length, at] of segments) {
      if (left <= length) return at(left);
      left -= length;
    }
    return segments[0][1](0);
  };

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const [x, y] = pointAt((i / steps) * perimeter);
    const k = i / 14;
    const j = Math.floor(k);
    const f = (1 - Math.cos((k - j) * Math.PI)) / 2;
    const wobble = knots[j] * (1 - f) + knots[j + 1] * f;
    const bite = wobble * 4.5 + random() * 1.6;
    // Pull each edge point toward the middle by its bite.
    const dx = width / 2 - x;
    const dy = height / 2 - y;
    const length = Math.hypot(dx, dy) || 1;
    const px = x + (dx / length) * bite;
    const py = y + (dy / length) * bite;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function makePlaceholderTexture(item) {
  const height = 1280;
  const width = Math.max(480, Math.round(height * (item.art.w / item.art.h)));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  // A work without a picture yet: the landing's grey card, name and cyan rule.
  const sans = "Inter, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillStyle = "#f5f5f7";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#111111";
  ctx.font = `600 120px ${sans}`;
  ctx.fillText(String(item.title || "Poster"), 84, height * 0.5);
  ctx.fillStyle = "#2ec4f0";
  ctx.fillRect(88, height * 0.5 + 44, 160, 6);
  ctx.fillStyle = "#6e6e73";
  ctx.font = `500 30px ${sans}`;
  ctx.fillText(String(item.category || ""), 88, height * 0.5 + 110);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function textureFromImage(image, anisotropy) {
  const maxEdge = 1280;
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
  let source = image;
  if (scale < 0.999) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    canvas.getContext("2d", { alpha: false }).drawImage(image, 0, 0, canvas.width, canvas.height);
    source = canvas;
  }
  const texture = new THREE.Texture(source);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function coverTexture(texture, imageAspect, planeAspect) {
  if (!imageAspect || !planeAspect) return;
  if (imageAspect > planeAspect + 0.01) {
    const repeat = planeAspect / imageAspect;
    texture.repeat.set(repeat, 1);
    texture.offset.set((1 - repeat) / 2, 0);
  } else if (planeAspect > imageAspect + 0.01) {
    const repeat = imageAspect / planeAspect;
    texture.repeat.set(1, repeat);
    texture.offset.set(0, (1 - repeat) / 2);
  }
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
}

// A texture holds one still, and an <img> hands over an animation's first frame.
// Motion pieces often open on a blank frame, so take the middle one instead.
async function middleFrame(src) {
  if (!/\.(webp|gif)$/i.test(src) || typeof ImageDecoder === "undefined") return null;
  try {
    const response = await fetch(src);
    const type = response.headers.get("content-type") || "";
    if (!(await ImageDecoder.isTypeSupported(type))) return null;
    const decoder = new ImageDecoder({ data: await response.arrayBuffer(), type });
    await decoder.tracks.ready;
    const frames = decoder.tracks.selectedTrack?.frameCount || 1;
    if (frames < 2) {
      decoder.close();
      return null;
    }
    const { image } = await decoder.decode({ frameIndex: Math.floor(frames / 2) });
    const canvas = document.createElement("canvas");
    canvas.width = image.displayWidth;
    canvas.height = image.displayHeight;
    canvas.getContext("2d").drawImage(image, 0, 0);
    image.close();
    decoder.close();
    return canvas;
  } catch {
    return null;
  }
}

// Still posters go through Next's image optimizer: a 1080px WebP is plenty for a
// texture and a fraction of the original JPG/PNG. Animations and remote files
// load as they are (the middle-frame grab needs the original bytes).
function optimizedSrc(src) {
  if (!src.startsWith("/") || /\.(webp|gif|svg)$/i.test(src)) return null;
  return `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=75`;
}

async function loadArtwork(item, anisotropy) {
  if (!item.src) return makePlaceholderTexture(item);
  const still = await middleFrame(item.src);
  if (still) {
    const texture = textureFromImage(still, anisotropy);
    coverTexture(texture, still.width / still.height, item.art.w / item.art.h);
    return texture;
  }
  const optimized = optimizedSrc(item.src);
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      const texture = textureFromImage(image, anisotropy);
      coverTexture(texture, image.width / image.height, item.art.w / item.art.h);
      resolve(texture);
    };
    image.onerror = () => {
      // No optimizer (a static export, say): fall back to the original file once.
      if (optimized && image.src.includes("/_next/image")) {
        image.src = item.src;
        return;
      }
      resolve(makePlaceholderTexture(item));
    };
    image.src = optimized || item.src;
  });
}

function biasView(view, width, height, fovDeg) {
  const vFov = (fovDeg * Math.PI) / 180;
  const aspect = width / Math.max(1, height);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(aspect, 0.6));
  const dist = Math.abs(view.camera[2] - view.target[2]) || 1;
  const halfW = dist * Math.tan(hFov / 2);
  const halfH = dist * Math.tan(vFov / 2);
  const narrow = width < 900;
  const slideX = Math.min(narrow ? 36 : 150, width * (narrow ? 0.05 : 0.12));
  const slideY = Math.min(narrow ? 250 : 36, height * (narrow ? 0.24 : 0.045));
  const shiftX = (slideX / Math.max(width, 1)) * halfW * 2;
  const shiftY = (slideY / Math.max(height, 1)) * halfH * 2;
  return {
    camera: [view.camera[0] - shiftX, view.camera[1] + shiftY, view.camera[2]],
    target: [view.target[0] - shiftX, view.target[1] + shiftY, view.target[2]],
  };
}

function fitDistance(width, height, fovRad, aspect) {
  const fill = 0.58;
  const distH = height / fill / (2 * Math.tan(fovRad / 2));
  const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
  const distW = width / fill / (2 * Math.tan(hFov / 2));
  return Math.max(distH, distW) + 0.55;
}

// Three.js compiles the program from the material's first state. Changing
// `map` or `transparent` later is ignored until `needsUpdate` bumps the version.
// Deckled cards stay transparent: their alpha map only applies while blending.
function applyFade(material, opacity) {
  if (!material) return;
  const solid = opacity > 0.97;
  if (!material.alphaMap && material.transparent !== !solid) {
    material.transparent = !solid;
    material.needsUpdate = true;
  }
  material.opacity = opacity;
  material.depthWrite = solid;
}

class GalleryErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function Poster({ item, index, active, selected, reduceMotion, shadowMap, anisotropy, onSelect }) {
  const group = useRef(null);
  const cardMat = useRef(null);
  const imageMat = useRef(null);
  const shadowMat = useRef(null);
  const [texture, setTexture] = useState(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hovered, setHovered] = useState(false);
  const textureRef = useRef(null);
  const presence = useRef(active ? 1 : 0);
  const revealed = useRef(0);
  const hoverCount = useRef(0);
  const pointer = useRef(null);
  const gl = useThree((state) => state.gl);
  const deckle = useMemo(() => makeDeckleTexture(item.art.w / item.art.h, index + 3), [item.art.w, item.art.h, index]);

  useEffect(() => () => deckle.dispose(), [deckle]);

  useEffect(() => {
    if (!shouldLoad) return undefined;
    let cancelled = false;
    loadArtwork(item, anisotropy).then((next) => {
      if (cancelled) {
        next.dispose();
        return;
      }
      const previous = textureRef.current;
      textureRef.current = next;
      setTexture(next);
      if (previous && previous !== next) previous.dispose();
    });
    return () => {
      cancelled = true;
    };
  }, [shouldLoad, item, anisotropy]);

  useEffect(() => () => {
    textureRef.current?.dispose();
    textureRef.current = null;
  }, []);

  useLayoutEffect(() => {
    const material = imageMat.current;
    if (!material || !texture) return;
    if (material.map !== texture) material.map = texture;
    material.needsUpdate = true;
  }, [texture]);

  useFrame((state, delta) => {
    const groupObject = group.current;
    if (!groupObject) return;

    if (!shouldLoad && (selected || (active && state.camera.position.distanceTo(groupObject.position) < LOAD_DISTANCE))) {
      setShouldLoad(true);
    }

    presence.current = THREE.MathUtils.damp(presence.current, active ? 1 : 0, 5.5, delta);
    revealed.current = THREE.MathUtils.damp(revealed.current, texture ? 1 : 0, 7, delta);
    const shown = presence.current;
    groupObject.visible = shown > 0.04;

    const floatAmp = reduceMotion || selected || shown < 0.85 ? 0 : 0.05;
    groupObject.position.y = item.position[1] + Math.sin(state.clock.elapsedTime * item.floatSpeed + item.floatPhase) * floatAmp;
    const lift = hovered && active ? 0.16 : 0;
    groupObject.position.z = THREE.MathUtils.damp(groupObject.position.z, item.position[2] + lift, 7, delta);

    const nextScale = THREE.MathUtils.damp(
      groupObject.scale.x,
      (hovered && active ? 1.035 : 1) * (0.9 + 0.1 * shown),
      8,
      delta,
    );
    groupObject.scale.setScalar(nextScale);

    const imageOpacity = shown * revealed.current;
    applyFade(cardMat.current, shown);
    applyFade(imageMat.current, imageOpacity);
    if (shadowMat.current) shadowMat.current.opacity = shown;
  });

  const frameW = item.art.w + FRAME_PAD * 2;
  const frameH = item.art.h + FRAME_PAD * 2;

  return (
    <group
      ref={group}
      position={item.position}
      rotation={item.rotation}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (!active) return;
        hoverCount.current += 1;
        gl.domElement.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        hoverCount.current = Math.max(0, hoverCount.current - 1);
        if (hoverCount.current === 0) {
          gl.domElement.style.cursor = "";
          setHovered(false);
        }
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        pointer.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        if (!pointer.current || !active) return;
        const dx = event.clientX - pointer.current.x;
        const dy = event.clientY - pointer.current.y;
        pointer.current = null;
        if (dx * dx + dy * dy <= 36) onSelect(item.id);
      }}
    >
      <mesh position={[0, -frameH * 0.04, -0.22]} raycast={() => null}>
        <planeGeometry args={[frameW * 1.22, frameH * 1.14]} />
        <meshBasicMaterial ref={shadowMat} map={shadowMap} transparent depthWrite={false} toneMapped={false} />
      </mesh>

      {/* The card: grey paper until the picture arrives, both cut to the same deckled edge. */}
      <mesh>
        <planeGeometry args={[frameW, frameH]} />
        <meshBasicMaterial ref={cardMat} color={CARD_BASE} alphaMap={deckle} alphaTest={0.02} transparent toneMapped={false} />
      </mesh>

      {texture && (
        <mesh position={[0, 0, 0.004]}>
          <planeGeometry args={[item.art.w, item.art.h]} />
          <meshBasicMaterial
            ref={imageMat}
            map={texture}
            alphaMap={deckle}
            alphaTest={0.02}
            toneMapped={false}
            transparent
            opacity={0}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
      )}
    </group>
  );
}

function ClusterLabel({ cluster, dim }) {
  const el = useRef(null);
  useFrame(({ camera }) => {
    if (!el.current) return;
    const dx = camera.position.x - cluster.label[0];
    const dy = camera.position.y - cluster.label[1];
    const dz = camera.position.z - cluster.label[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const fog = THREE.MathUtils.clamp(1 - (distance - 14) / 32, 0, 1);
    el.current.style.opacity = dim ? "0" : fog.toFixed(3);
  });

  return (
    <Html
      position={cluster.label}
      center
      distanceFactor={12}
      zIndexRange={[8, 0]}
      wrapperClass="pointer-events-none"
      style={{ pointerEvents: "none" }}
    >
      <div ref={el} className="select-none whitespace-nowrap text-[13px] font-medium tracking-[-0.01em] text-[#6e6e73]">
        {cluster.category}
      </div>
    </Html>
  );
}

function GalleryWorld({ nav, reduceMotion, onSelect, onUserNavigate }) {
  const controls = useRef(null);
  const layout = useMemo(() => layoutGallery(galleryWorks), []);
  const saved = useRef(null);
  const selectedRef = useRef(nav.selectedId);
  const sawNav = useRef(false);
  const shadowMap = useMemo(() => makeShadowTexture(), []);
  const { gl } = useThree();
  const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
  const scratch = useRef({
    offset: new THREE.Vector2(),
    desired: new THREE.Vector2(),
    normal: new THREE.Vector3(),
    look: new THREE.Vector3(),
    cam: new THREE.Vector3(),
    euler: new THREE.Euler(),
    hadOffset: false,
  });

  selectedRef.current = nav.selectedId;

  const viewportAspect = useCallback(() => {
    const width = gl.domElement.clientWidth || window.innerWidth;
    const height = gl.domElement.clientHeight || window.innerHeight;
    return { width, height, aspect: width / Math.max(1, height), fov: width < 768 ? 48 : 38 };
  }, [gl]);

  const frameCategory = useCallback((category, animate) => {
    const api = controls.current;
    if (!api) return;
    const cluster = category === "All"
      ? layout.clusters[0]
      : layout.clusters.find((entry) => entry.category === category) || layout.clusters[0];
    const { width, height, aspect, fov } = viewportAspect();
    const view = biasView(viewForCluster(cluster, aspect, fov), width, height, fov);
    api.setLookAt(view.camera[0], view.camera[1], view.camera[2], view.target[0], view.target[1], view.target[2], animate);
  }, [layout.clusters, viewportAspect]);

  const focusItem = useCallback((id, animate) => {
    const api = controls.current;
    const item = layout.items.find((entry) => entry.id === id);
    if (!api || !item) return;
    if (!saved.current) {
      saved.current = {
        position: api.getPosition(new THREE.Vector3()).toArray(),
        target: api.getTarget(new THREE.Vector3()).toArray(),
      };
    }
    const s = scratch.current;
    s.euler.set(item.rotation[0], item.rotation[1], item.rotation[2], "XYZ");
    // PlaneGeometry faces +Z. Sit the camera on that normal so the print is frontal.
    s.normal.set(0, 0, 1).applyEuler(s.euler);
    const camera = api.camera;
    const dist = fitDistance(
      item.art.w + FRAME_PAD * 2,
      item.art.h + FRAME_PAD * 2,
      (camera.fov * Math.PI) / 180,
      camera.aspect,
    );
    s.look.set(item.position[0], item.position[1] - item.art.h * 0.12, item.position[2]);
    s.cam.copy(s.look).addScaledVector(s.normal, dist);
    api.setLookAt(s.cam.x, s.cam.y, s.cam.z, s.look.x, s.look.y, s.look.z, animate);
  }, [layout.items]);

  useLayoutEffect(() => {
    const api = controls.current;
    if (!api) return;
    api.smoothTime = reduceMotion ? 0 : 0.48;
    api.draggingSmoothTime = reduceMotion ? 0 : 0.16;
    api.dollySpeed = 0.62;
    api.truckSpeed = 2.15;
    api.azimuthRotateSpeed = 0.32;
    api.polarRotateSpeed = 0.22;
    api.minDistance = 2.05;
    api.maxDistance = 42;
    api.minPolarAngle = Math.PI / 2 - 0.42;
    api.maxPolarAngle = Math.PI / 2 + 0.06;
    api.minAzimuthAngle = -0.62;
    api.maxAzimuthAngle = 0.62;
    api.dollyToCursor = true;
    api.infinityDolly = false;
    api.mouseButtons.left = ACTION.TRUCK;
    api.mouseButtons.right = ACTION.ROTATE;
    api.mouseButtons.middle = ACTION.DOLLY;
    api.mouseButtons.wheel = ACTION.DOLLY;
    api.touches.one = ACTION.TOUCH_TRUCK;
    api.touches.two = ACTION.TOUCH_DOLLY_TRUCK;
    api.touches.three = ACTION.TOUCH_TRUCK;
    api.setBoundary(new THREE.Box3(
      new THREE.Vector3(layout.bounds.min[0] - 6, layout.bounds.min[1] - 4.5, -4),
      new THREE.Vector3(layout.bounds.max[0] + 6, layout.bounds.max[1] + 4.5, 8),
    ));
    frameCategory(nav.category, false);
  // The controls rig is configured once. Navigation after mount is the effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const api = controls.current;
    if (!api) return;
    api.smoothTime = reduceMotion ? 0 : 0.48;
    api.draggingSmoothTime = reduceMotion ? 0 : 0.16;
  }, [reduceMotion]);

  useEffect(() => {
    if (!sawNav.current) {
      sawNav.current = true;
      return;
    }
    const api = controls.current;
    if (!api) return;
    const animate = !reduceMotion;
    if (nav.type === "focus" && nav.selectedId) {
      focusItem(nav.selectedId, animate);
      return;
    }
    if (nav.type === "keep") return;
    if (nav.type === "restore") {
      if (saved.current) {
        const { position, target } = saved.current;
        saved.current = null;
        api.setLookAt(position[0], position[1], position[2], target[0], target[1], target[2], animate);
      }
      return;
    }
    saved.current = null;
    frameCategory(nav.category, animate);
  }, [nav, focusItem, frameCategory, reduceMotion]);

  useEffect(() => {
    const onKey = (event) => {
      const api = controls.current;
      if (!api || !api.enabled) return;
      if (!event.key.startsWith("Arrow")) return;
      event.preventDefault();
      const step = event.shiftKey ? 1.7 : 0.9;
      if (event.key === "ArrowLeft") api.truck(-step, 0, true);
      else if (event.key === "ArrowRight") api.truck(step, 0, true);
      else if (event.key === "ArrowUp") api.truck(0, step, true);
      else if (event.key === "ArrowDown") api.truck(0, -step, true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => shadowMap.dispose(), [shadowMap]);

  useFrame((state, delta) => {
    const api = controls.current;
    if (!api) return;
    const s = scratch.current;
    const dragging = api.currentAction !== ACTION.NONE;
    const amount = dragging || nav.selectedId || reduceMotion ? 0 : 1;
    s.desired.set(state.pointer.x * 0.22 * amount, state.pointer.y * 0.14 * amount);
    s.offset.x = THREE.MathUtils.damp(s.offset.x, s.desired.x, 3, delta);
    s.offset.y = THREE.MathUtils.damp(s.offset.y, s.desired.y, 3, delta);
    const idle = Math.abs(s.offset.x) < 0.0008 && Math.abs(s.offset.y) < 0.0008 && amount === 0;
    if (idle) {
      if (s.hadOffset) {
        api.setFocalOffset(0, 0, 0, false);
        s.hadOffset = false;
      }
      return;
    }
    s.hadOffset = true;
    api.setFocalOffset(s.offset.x, s.offset.y, 0, false);
  }, -2);

  const releaseSelection = () => {
    if (!selectedRef.current) return;
    const action = controls.current ? controls.current.currentAction : 0;
    const panning = action & (
      ACTION.TRUCK |
      ACTION.ROTATE |
      ACTION.TOUCH_TRUCK |
      ACTION.TOUCH_ROTATE |
      ACTION.SCREEN_PAN |
      ACTION.TOUCH_SCREEN_PAN
    );
    if (!panning) return;
    saved.current = null;
    selectedRef.current = null;
    onUserNavigate();
  };

  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <fog attach="fog" args={[BACKGROUND, 32, 82]} />

      <CameraControls
        ref={controls}
        makeDefault
        enabled={nav.controlsEnabled !== false}
        onControl={releaseSelection}
      />

      {layout.items.map((item, index) => (
        <Poster
          key={item.id}
          item={item}
          index={index}
          active={nav.category === "All" || item.category === nav.category}
          selected={nav.selectedId === item.id}
          reduceMotion={reduceMotion}
          shadowMap={shadowMap}
          anisotropy={anisotropy}
          onSelect={onSelect}
        />
      ))}

      {layout.clusters.map((cluster) => (
        <ClusterLabel
          key={cluster.category}
          cluster={cluster}
          dim={nav.category !== "All" && nav.category !== cluster.category}
        />
      ))}
    </>
  );
}

export default function CanvasGallery({ nav, reduceMotion, onSelect, onDismiss, onUserNavigate }) {
  const [failed, setFailed] = useState(false);
  const narrow = typeof window !== "undefined" && window.innerWidth < 768;
  const home = useMemo(() => {
    const layout = layoutGallery(galleryWorks);
    const cluster = layout.clusters[0];
    const width = typeof window === "undefined" ? 1440 : window.innerWidth;
    const height = typeof window === "undefined" ? 900 : window.innerHeight;
    const fov = narrow ? 48 : 38;
    return biasView(viewForCluster(cluster, width / Math.max(1, height), fov), width, height, fov);
  }, [narrow]);

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-[#6e6e73]">
        This browser can’t open the 3D archive. Try a current desktop browser with WebGL enabled.
      </div>
    );
  }

  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={narrow ? [1, 1.25] : [1, 1.6]}
      camera={{ position: home.camera, fov: narrow ? 48 : 38, near: 0.08, far: 160 }}
      gl={{
        antialias: true,
        alpha: false,
        stencil: false,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      onCreated={(state) => {
        state.gl.outputColorSpace = THREE.SRGBColorSpace;
        state.gl.toneMapping = THREE.NoToneMapping;
      }}
      onPointerMissed={() => {
        if (nav.selectedId) onDismiss();
      }}
    >
      <GalleryErrorBoundary onError={() => setFailed(true)}>
        <GalleryWorld
          nav={nav}
          reduceMotion={reduceMotion}
          onSelect={onSelect}
          onUserNavigate={onUserNavigate}
        />
      </GalleryErrorBoundary>
    </Canvas>
  );
}
