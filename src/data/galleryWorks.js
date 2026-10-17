/**
 * Visual Archive — add a poster by appending an object to `galleryWorks`.
 * The 3D layout, category clusters, and filter pills are derived from this list.
 *
 *   id          unique string
 *   title       overlay heading
 *   category    cluster + filter pill. A new name creates its own cluster.
 *   src         public path or absolute URL. Empty string renders a typographic stand-in.
 *   width       pixel width of the artwork (plane aspect)
 *   height      pixel height of the artwork
 *   description one or two sentences for the close-up card
 */

export const galleryWorks = [
  {
    id: "trip-south",
    title: "Trip South Festival",
    category: "Posters",
    src: "/gallery/trip-south.jpg",
    width: 579,
    height: 719,
    description: "Afrobeats festival poster. Portrait, type, and color locked into one vertical system.",
  },
  {
    id: "hardware-hacking",
    title: "Hardware Hacking",
    category: "Posters",
    src: "/gallery/hardware-hacking.jpg",
    width: 257,
    height: 366,
    description: "Workshop poster for a hardware hacking session. Tight type, high contrast, one job: get people in the room.",
  },
  {
    id: "christmas-calendar",
    title: "Christmas Calendar",
    category: "Posters",
    src: "/gallery/christmas-calendar.jpg",
    width: 709,
    height: 800,
    description: "Typographic Christmas calendar. The grid is the illustration.",
  },
  {
    id: "michael-jackson",
    title: "Michael Jackson",
    category: "Posters",
    src: "/gallery/mj-poster.jpg",
    width: 558,
    height: 800,
    description: "World tour tribute poster. A single figure, a loud crop, and type that stays out of the silhouette.",
  },
  {
    id: "ugadi",
    title: "Ugadi",
    category: "Posters",
    src: "/gallery/ugadi.jpg",
    width: 259,
    height: 367,
    description: "Ugadi celebrations poster. Festival color held in a quiet hierarchy.",
  },
  {
    id: "eamcet",
    title: "EAMCET",
    category: "Posters",
    // Leave src empty for the typographic stand-in. Set it to the final file
    // (for example "/gallery/eamcet.jpg") and the plane swaps to that image.
    src: "",
    width: 720,
    height: 1080,
    description: "Campaign poster for the EAMCET entrance exam. Dates, hierarchy, and one call to action.",
  },
  {
    id: "food-combo",
    title: "Food Combo",
    category: "Posters",
    src: "/gallery/combo-biryani.jpg",
    width: 370,
    height: 370,
    description: "Biryani combo for social. Square format, the meal is the hero, the offer reads in a glance.",
  },
  {
    id: "product-campaign",
    title: "Product Campaign",
    category: "Posters",
    src: "/gallery/product-ads.jpg",
    width: 800,
    height: 450,
    description: "A series of product advertisements composed as one campaign board.",
  },
  {
    id: "redantio",
    title: "Redantio",
    category: "Posters",
    src: "/redantio.webp",
    width: 720,
    height: 1080,
    description: "Identity sprint for a cybersecurity brand. Red as the only loud decision.",
  },
  {
    id: "uiux-collage",
    title: "UI/UX Collage",
    category: "UI/UX",
    src: "/gallery/uiux-collage.jpg",
    width: 800,
    height: 450,
    description: "A wall of interface studies. Systems, screens, and the spaces between them.",
  },
  {
    id: "compatriot-board",
    title: "CompatrIoT Board",
    category: "UI/UX",
    src: "/gallery/compatriot-board.jpg",
    width: 2086,
    height: 1170,
    description: "Hardware product interface for CompatrIoT. The board and the screen designed as one object.",
  },
  {
    id: "compatriot-labs",
    title: "CompatrIoT Labs",
    category: "UI/UX",
    src: "/gallery/compatriot-labs.jpg",
    width: 2092,
    height: 1164,
    description: "Terminal labs for CompatrIoT. Dense information, calm chrome.",
  },
  {
    id: "editorial-thumbnails",
    title: "Editorial Thumbnails",
    category: "UI/UX",
    src: "/gallery/thumbnails.jpg",
    width: 800,
    height: 450,
    description: "YouTube thumbnail system. Same skeleton, different stories.",
  },
  {
    id: "notbad-editor",
    title: "NotBad Editor",
    category: "UI/UX",
    src: "/notbad-editor.png",
    width: 1280,
    height: 800,
    description: "A writing surface where the chrome disappears until you ask for it.",
  },
  {
    id: "notbad-palette",
    title: "NotBad Palette",
    category: "UI/UX",
    src: "/notbad-palette.png",
    width: 1280,
    height: 800,
    description: "Command palette for NotBad. One field, every action.",
  },
  {
    id: "openweave",
    title: "OpenWeave",
    category: "UI/UX",
    src: "/openweave-app.png",
    width: 1319,
    height: 875,
    description: "Product interface for OpenWeave. Structure first, decoration last.",
  },
  {
    id: "own-your-bill",
    title: "Own Your Bill",
    category: "UI/UX",
    src: "/ownyourbill.png",
    width: 2152,
    height: 2152,
    description: "Billing product mark and interface, built to be understood at thumbnail size.",
  },
  {
    id: "tailus",
    title: "Tailus UI",
    category: "UI/UX",
    src: "/tailus.png",
    width: 656,
    height: 581,
    description: "Design-system case study. Components, rhythm, and a documented scale.",
  },
  {
    id: "college-post",
    title: "College Post",
    category: "UI/UX",
    src: "/images/about/College%20Post%20learner%20dashboard.png",
    width: 1438,
    height: 1400,
    description: "Learner dashboard. A school tool that reads as a product, not a portal.",
  },
  {
    id: "banking-ui",
    title: "Mobile Banking",
    category: "UI/UX",
    src: "/videos/6.webp",
    width: 800,
    height: 800,
    description: "Next-generation banking screens. Balances, motion, and a single primary action.",
  },
  {
    id: "hvac-ui",
    title: "HVAC Interface",
    category: "UI/UX",
    src: "/videos/1.webp",
    width: 800,
    height: 800,
    description: "Service-business interface. The schedule is the product.",
  },
  {
    id: "ai-advertisement",
    title: "AI Advertisement",
    category: "AI & Motion",
    src: "/aivideos/posters/AI_ADVERTISEMENT.jpg",
    width: 640,
    height: 272,
    description: "Still from a generated commercial. Direction, grade, and frame chosen by hand.",
  },
  {
    id: "hangy",
    title: "Hangy",
    category: "AI & Motion",
    src: "/aivideos/posters/HANGY.jpg",
    width: 640,
    height: 272,
    description: "Motion study poster. A character, a loop, a readable silhouette.",
  },
  {
    id: "ai-host",
    title: "AI Host",
    category: "AI & Motion",
    src: "/aivideos/posters/female_host_ai_generated.jpg",
    width: 360,
    height: 640,
    description: "Generated host for a vertical film. Face, light, and wardrobe directed as a shoot.",
  },
  {
    id: "niat-ugc",
    title: "NIAT UGC",
    category: "AI & Motion",
    src: "/aivideos/posters/niat_ugc.jpg",
    width: 360,
    height: 640,
    description: "User-generated style film for NIAT. Phone-native framing, campaign-grade finish.",
  },
  {
    id: "mustang",
    title: "Mustang Realism",
    category: "AI & Motion",
    src: "/aivideos/posters/mustang_ai_realism.jpg",
    width: 640,
    height: 360,
    description: "Automotive realism study. Metal, motion blur, and a camera that behaves like a camera.",
  },
  {
    id: "hyper-real",
    title: "Hyper Real Detail",
    category: "AI & Motion",
    src: "/aivideos/posters/hyper_realistic_detail.jpg",
    width: 360,
    height: 640,
    description: "Macro detail pass. Surface, light, and the decision of what stays sharp.",
  },
  {
    id: "engineerudu-wide",
    title: "Engineerudu Wide",
    category: "AI & Motion",
    src: "/aivideos/posters/engineerudu_horizontal.jpg",
    width: 640,
    height: 360,
    description: "Horizontal cut of the Engineerudu film. Title, character, and grade in one frame.",
  },
  {
    id: "engineerudu-tall",
    title: "Engineerudu Tall",
    category: "AI & Motion",
    src: "/aivideos/posters/engineerudu_vertical.jpg",
    width: 360,
    height: 640,
    description: "Vertical cut of the same film. Same world, reframed for a phone.",
  },
  {
    id: "satya-coin",
    title: "Satya Coin",
    category: "3D & Visuals",
    src: "/gallery/satya-coin.jpg",
    width: 791,
    height: 800,
    description: "3D coin render. Metal, edge light, and a mark that reads in the round.",
  },
  {
    id: "amplifier",
    title: "Amplifier Box",
    category: "3D & Visuals",
    src: "/customamplifierbox.webp",
    width: 1920,
    height: 1440,
    description: "Custom amplifier enclosure. Product form, vents, and the hardware as the layout.",
  },
  {
    id: "bi0s-hardware",
    title: "bi0s Hardware",
    category: "3D & Visuals",
    src: "/bi0shardware.png",
    width: 1611,
    height: 1079,
    description: "Hardware visual for bi0s. The object photographed like a product, composed like a poster.",
  },
  {
    id: "comic-cover",
    title: "Comic Cover",
    category: "3D & Visuals",
    src: "/images/about/comic-portfolio/comic-portfolio/assets/images/cover.jpg",
    width: 784,
    height: 1168,
    description: "Cover for a comic portfolio. Figure, title, and a world in one frame.",
  },
  {
    id: "mission-galaxy",
    title: "Mission Galaxy",
    category: "3D & Visuals",
    src: "/images/about/comic-portfolio/comic-portfolio/assets/images/mission-galaxy.jpg",
    width: 1168,
    height: 784,
    description: "Story panel. Space, scale, and a path through the frame.",
  },
  {
    id: "mission-neon",
    title: "Mission Neon",
    category: "3D & Visuals",
    src: "/images/about/comic-portfolio/comic-portfolio/assets/images/mission-neon.jpg",
    width: 1168,
    height: 784,
    description: "Neon interior panel. Light does the separating that outlines usually do.",
  },
  {
    id: "toothpaste-panel",
    title: "Packaging Panel",
    category: "3D & Visuals",
    src: "/toothpaste-panel-wide.png",
    width: 1600,
    height: 900,
    description: "Wide product panel. Packaging, type, and a single material story.",
  },
];

const PREFERRED_CATEGORIES = ["Posters", "UI/UX", "AI & Motion", "3D & Visuals"];
const CELL_W = 4.9;
const CELL_H = 3.95;
const CLUSTER_GAP = 3.6;
const MAX_YAW = (8 * Math.PI) / 180;

function hashString(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function categoryOrder(works) {
  const present = new Set(works.map((work) => work.category));
  const ordered = PREFERRED_CATEGORIES.filter((category) => present.has(category));
  for (const work of works) {
    if (!ordered.includes(work.category)) ordered.push(work.category);
  }
  return ordered;
}

export function galleryCategories(works = galleryWorks) {
  return ["All", ...categoryOrder(works)];
}

function columnsFor(count) {
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  if (count % 4 === 0) return 4;
  if (count <= 9) return 3;
  return 4;
}

function fitArt(width, height, jitter) {
  const aspect = Math.max(width, 1) / Math.max(height, 1);
  const maxW = 3.28;
  const maxH = 2.68;
  let h = 2.02 * jitter;
  if (aspect < 0.78) h = 2.58 * jitter;
  else if (aspect > 1.7) h = 1.52 * jitter;
  else if (aspect > 1.2) h = 1.76 * jitter;
  let w = h * aspect;
  if (w > maxW) {
    w = maxW;
    h = w / aspect;
  }
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }
  return { w, h };
}

export function layoutGallery(works = galleryWorks) {
  const order = categoryOrder(works);
  const groups = new Map(order.map((category) => [category, []]));
  for (const work of works) {
    groups.get(work.category).push(work);
  }

  const items = [];
  const clusters = [];
  let cursor = 0;

  for (const category of order) {
    const group = groups.get(category);
    if (!group.length) continue;
    const cols = Math.min(columnsFor(group.length), group.length);
    const rows = Math.ceil(group.length / cols);
    const width = cols * CELL_W;
    const height = rows * CELL_H;
    const top = height / 2 - CELL_H / 2;

    group.forEach((work, index) => {
      const rand = mulberry32(hashString(String(work.id)));
      const col = index % cols;
      const row = Math.floor(index / cols);
      const jitter = 0.94 + rand() * 0.12;
      const art = fitArt(work.width || 1, work.height || 1, jitter);
      const x = cursor + CELL_W / 2 + col * CELL_W + (rand() - 0.5) * 0.38;
      const y = top - row * CELL_H + (col % 2 === 0 ? 0.26 : -0.2) + (rand() - 0.5) * 0.32;
      const z = (rand() - 0.5) * 2.5;
      const rotation = [
        (rand() - 0.5) * 2 * ((3.4 * Math.PI) / 180),
        (rand() - 0.5) * 2 * MAX_YAW,
        (rand() - 0.5) * 2 * ((3.2 * Math.PI) / 180),
      ];
      items.push({
        ...work,
        art,
        position: [x, y, z],
        rotation,
        floatPhase: rand() * Math.PI * 2,
        floatSpeed: 0.32 + rand() * 0.28,
      });
    });

    const placed = items.filter((item) => item.category === category);
    const centerX = placed.reduce((sum, item) => sum + item.position[0], 0) / placed.length;
    const centerY = placed.reduce((sum, item) => sum + item.position[1], 0) / placed.length;
    const labelY = Math.max(...placed.map((item) => item.position[1] + item.art.h / 2)) + 0.78;
    clusters.push({
      category,
      label: [centerX, labelY, 0.15],
      center: [centerX, centerY, 0],
      span: [width + 1.2, height + 1.1],
    });
    cursor += width + CLUSTER_GAP;
  }

  const bounds = {
    min: [Infinity, Infinity, Infinity],
    max: [-Infinity, -Infinity, -Infinity],
  };
  for (const item of items) {
    const [x, y, z] = item.position;
    bounds.min[0] = Math.min(bounds.min[0], x - item.art.w / 2);
    bounds.min[1] = Math.min(bounds.min[1], y - item.art.h / 2);
    bounds.min[2] = Math.min(bounds.min[2], z - 0.4);
    bounds.max[0] = Math.max(bounds.max[0], x + item.art.w / 2);
    bounds.max[1] = Math.max(bounds.max[1], y + item.art.h / 2);
    bounds.max[2] = Math.max(bounds.max[2], z + 0.4);
  }

  return { items, clusters, bounds };
}

export function viewForCluster(cluster, aspect, fovDeg) {
  const [cx, cy] = cluster.center;
  const [spanX, spanY] = cluster.span;
  const vFov = (fovDeg * Math.PI) / 180;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(aspect, 0.6));
  const distH = (spanY * 0.5) / Math.tan(vFov / 2);
  const distW = (spanX * 0.5) / Math.tan(hFov / 2);
  const dist = Math.max(distH, distW) * 1.02 + 1.2;
  return {
    camera: [cx, cy + 0.28, dist],
    target: [cx, cy, 0],
  };
}
