// ===== ILLUSTRATIVE PORTRAIT GENERATOR =====
// Replaces hotlinked stock photography (unreliable to load, and risks depicting real
// identifiable people as fake business "portfolio" work) with generated SVG portraits.
// Each is an abstract, stylized bridal silhouette + ornamental motif keyed to the
// artist's primary style category and a deterministic accent palette per artist id —
// never a photographic likeness of a real person.

const PORTRAIT_PALETTES = {
  "Soft Glam":     { bg: "#F3E3D9", veil: "#E8C4D4", accent: "#C9925F", line: "#9B2242" },
  "Traditional":   { bg: "#F0D9C2", veil: "#D4915A", accent: "#9B2242", line: "#6E1530" },
  "HD Airbrush":   { bg: "#E9DCEE", veil: "#C9B8E0", accent: "#7A5FA0", line: "#4A3470" },
  "Minimal/Dewy":  { bg: "#F4EDE3", veil: "#E6D9C4", accent: "#B89968", line: "#8A6A3F" },
  "Bold Bridal":   { bg: "#EFD3D9", veil: "#C9425F", accent: "#9B2242", line: "#5C1530" },
  "Indo-Western":  { bg: "#DCE6E2", veil: "#7FA396", accent: "#3D5C4E", line: "#26392F" },
  "Pastel":        { bg: "#F2E6EE", veil: "#E0B8D0", accent: "#C98FB0", line: "#8A5070" },
  "Heavy Kumkum":  { bg: "#EAC9A0", veil: "#C77B3D", accent: "#9B2242", line: "#6E1530" }
};

// Simple deterministic hash so the same artist always gets the same face-shape variant
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function generatePortraitSVG(artistId, primaryStyle, size) {
  const pal = PORTRAIT_PALETTES[primaryStyle] || PORTRAIT_PALETTES["Soft Glam"];
  const seed = hashSeed(artistId);
  const faceVariant = seed % 3;        // 0,1,2 — subtle silhouette variation
  const jewelryVariant = (seed >> 2) % 3;
  const w = size || 600, h = Math.round((size || 600) * 1.25);

  // Three subtle silhouette profiles so cards don't feel identical
  const faceShapes = [
    `M ${w*0.5} ${h*0.30} C ${w*0.62} ${h*0.30} ${w*0.68} ${h*0.42} ${w*0.66} ${h*0.54} C ${w*0.64} ${h*0.66} ${w*0.58} ${h*0.74} ${w*0.5} ${h*0.76} C ${w*0.42} ${h*0.74} ${w*0.36} ${h*0.66} ${w*0.34} ${h*0.54} C ${w*0.32} ${h*0.42} ${w*0.38} ${h*0.30} ${w*0.5} ${h*0.30} Z`,
    `M ${w*0.5} ${h*0.28} C ${w*0.60} ${h*0.29} ${w*0.67} ${h*0.40} ${w*0.65} ${h*0.52} C ${w*0.64} ${h*0.62} ${w*0.60} ${h*0.72} ${w*0.5} ${h*0.78} C ${w*0.40} ${h*0.72} ${w*0.36} ${h*0.62} ${w*0.35} ${h*0.52} C ${w*0.33} ${h*0.40} ${w*0.40} ${h*0.29} ${w*0.5} ${h*0.28} Z`,
    `M ${w*0.5} ${h*0.31} C ${w*0.61} ${h*0.32} ${w*0.66} ${h*0.43} ${w*0.64} ${h*0.55} C ${w*0.63} ${h*0.65} ${w*0.57} ${h*0.73} ${w*0.5} ${h*0.75} C ${w*0.43} ${h*0.73} ${w*0.37} ${h*0.65} ${w*0.36} ${h*0.55} C ${w*0.34} ${h*0.43} ${w*0.39} ${h*0.32} ${w*0.5} ${h*0.31} Z`
  ];

  // jewelry: a maang-tikka style drop + earrings, varied position/size
  const jewelryDots = [
    `<circle cx="${w*0.5}" cy="${h*0.27}" r="${w*0.012}" fill="${pal.line}" opacity="0.85"/><circle cx="${w*0.5}" cy="${h*0.31}" r="${w*0.018}" fill="${pal.accent}"/>`,
    `<circle cx="${w*0.5}" cy="${h*0.26}" r="${w*0.014}" fill="${pal.line}" opacity="0.85"/><circle cx="${w*0.5}" cy="${h*0.305}" r="${w*0.02}" fill="${pal.accent}"/><circle cx="${w*0.5}" cy="${h*0.335}" r="${w*0.012}" fill="${pal.line}" opacity="0.7"/>`,
    `<circle cx="${w*0.5}" cy="${h*0.28}" r="${w*0.016}" fill="${pal.accent}"/>`
  ];

  return `
<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated bridal style portrait">
  <defs>
    <linearGradient id="bg-${artistId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${pal.bg}"/>
      <stop offset="100%" stop-color="${pal.veil}" stop-opacity="0.55"/>
    </linearGradient>
    <radialGradient id="glow-${artistId}" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${pal.accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${pal.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg-${artistId})"/>
  <rect width="${w}" height="${h}" fill="url(#glow-${artistId})"/>

  <!-- ornamental arch motif (mandap-style), low opacity texture -->
  <path d="M 0 ${h} L 0 ${h*0.08} Q ${w*0.5} ${-h*0.05} ${w} ${h*0.08} L ${w} ${h}" fill="none" stroke="${pal.line}" stroke-width="1" opacity="0.10"/>
  <path d="M ${w*0.08} ${h} L ${w*0.08} ${h*0.18} Q ${w*0.5} ${h*0.04} ${w*0.92} ${h*0.18} L ${w*0.92} ${h}" fill="none" stroke="${pal.line}" stroke-width="1" opacity="0.08"/>

  <!-- veil / dupatta drape behind silhouette -->
  <path d="M ${w*0.5} ${h*0.20} C ${w*0.78} ${h*0.30} ${w*0.84} ${h*0.62} ${w*0.74} ${h*0.95} L ${w*0.26} ${h*0.95} C ${w*0.16} ${h*0.62} ${w*0.22} ${h*0.30} ${w*0.5} ${h*0.20} Z" fill="${pal.veil}" opacity="0.55"/>

  <!-- shoulders / neckline -->
  <path d="M ${w*0.28} ${h*1.0} C ${w*0.30} ${h*0.86} ${w*0.38} ${h*0.78} ${w*0.5} ${h*0.78} C ${w*0.62} ${h*0.78} ${w*0.70} ${h*0.86} ${w*0.72} ${h*1.0} Z" fill="${pal.accent}" opacity="0.9"/>

  <!-- face silhouette -->
  <path d="${faceShapes[faceVariant]}" fill="${pal.bg}" stroke="${pal.line}" stroke-width="1.5" opacity="0.95"/>

  <!-- minimal facial cues: brow line + suggestion of features, abstracted, no likeness -->
  <path d="M ${w*0.42} ${h*0.47} Q ${w*0.46} ${h*0.45} ${w*0.50} ${h*0.47}" stroke="${pal.line}" stroke-width="1.2" fill="none" opacity="0.4"/>
  <path d="M ${w*0.50} ${h*0.47} Q ${w*0.54} ${h*0.45} ${w*0.58} ${h*0.47}" stroke="${pal.line}" stroke-width="1.2" fill="none" opacity="0.4"/>
  <path d="M ${w*0.46} ${h*0.62} Q ${w*0.50} ${h*0.645} ${w*0.54} ${h*0.62}" stroke="${pal.line}" stroke-width="1.4" fill="none" opacity="0.5"/>

  <!-- bindi / sindoor mark -->
  <circle cx="${w*0.5}" cy="${h*0.40}" r="${w*0.01}" fill="${pal.line}" opacity="0.75"/>

  <!-- maang-tikka jewelry -->
  ${jewelryDots[jewelryVariant]}

  <!-- earrings -->
  <circle cx="${w*0.345}" cy="${h*0.52}" r="${w*0.014}" fill="${pal.accent}"/>
  <circle cx="${w*0.655}" cy="${h*0.52}" r="${w*0.014}" fill="${pal.accent}"/>
</svg>`;
}

function portraitDataUri(artistId, primaryStyle, size) {
  const svg = generatePortraitSVG(artistId, primaryStyle, size);
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// ===== COMPOSITION VARIANTS FOR PORTFOLIO TILES =====
// A real bridal portfolio mixes shot types — full look, eye/lash close-up,
// hand+jewelry detail — not the same framing recolored three times.
// "full" reuses generatePortraitSVG; "eye" and "hand" are distinct compositions.

function generateEyeDetailSVG(artistId, primaryStyle, size) {
  const pal = PORTRAIT_PALETTES[primaryStyle] || PORTRAIT_PALETTES["Soft Glam"];
  const seed = hashSeed(artistId);
  const lashVariant = seed % 3;
  const w = size || 400, h = Math.round((size || 400) * 1.25);

  const lashStyles = [
    // soft, short lashes
    `<path d="M ${w*0.30} ${h*0.50} Q ${w*0.40} ${h*0.44} ${w*0.50} ${h*0.43}" stroke="${pal.line}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
     ${[0.32,0.38,0.44].map(x => `<line x1="${w*x}" y1="${h*0.47}" x2="${w*x-6}" y2="${h*0.40}" stroke="${pal.line}" stroke-width="1.8" stroke-linecap="round"/>`).join('')}`,
    // dramatic winged liner, longer lashes
    `<path d="M ${w*0.28} ${h*0.52} Q ${w*0.40} ${h*0.42} ${w*0.56} ${h*0.40} L ${w*0.62} ${h*0.36}" stroke="${pal.line}" stroke-width="3" fill="none" stroke-linecap="round"/>
     ${[0.30,0.36,0.42,0.48].map(x => `<line x1="${w*x}" y1="${h*0.46}" x2="${w*x-8}" y2="${h*0.36}" stroke="${pal.line}" stroke-width="2" stroke-linecap="round"/>`).join('')}`,
    // medium natural lash line
    `<path d="M ${w*0.29} ${h*0.51} Q ${w*0.40} ${h*0.43} ${w*0.52} ${h*0.42}" stroke="${pal.line}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
     ${[0.31,0.37,0.43,0.49].map(x => `<line x1="${w*x}" y1="${h*0.46}" x2="${w*x-7}" y2="${h*0.38}" stroke="${pal.line}" stroke-width="1.8" stroke-linecap="round"/>`).join('')}`
  ];

  return `
<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated eye makeup detail">
  <defs>
    <linearGradient id="ebg-${artistId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${pal.bg}"/>
      <stop offset="100%" stop-color="${pal.veil}" stop-opacity="0.65"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#ebg-${artistId})"/>
  <!-- eyeshadow wash -->
  <ellipse cx="${w*0.42}" cy="${h*0.46}" rx="${w*0.22}" ry="${h*0.11}" fill="${pal.accent}" opacity="0.35"/>
  <ellipse cx="${w*0.42}" cy="${h*0.46}" rx="${w*0.14}" ry="${h*0.07}" fill="${pal.accent}" opacity="0.3"/>
  <!-- eye shape -->
  <path d="M ${w*0.22} ${h*0.50} Q ${w*0.42} ${h*0.40} ${w*0.62} ${h*0.50} Q ${w*0.42} ${h*0.58} ${w*0.22} ${h*0.50} Z" fill="white" opacity="0.85" stroke="${pal.line}" stroke-width="1"/>
  <circle cx="${w*0.42}" cy="${h*0.50}" r="${w*0.045}" fill="${pal.line}" opacity="0.8"/>
  ${lashStyles[lashVariant]}
  <!-- brow -->
  <path d="M ${w*0.24} ${h*0.34} Q ${w*0.42} ${h*0.28} ${w*0.60} ${h*0.34}" stroke="${pal.line}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
  <!-- decorative kundan/bindi accent off to the side -->
  <circle cx="${w*0.80}" cy="${h*0.66}" r="${w*0.025}" fill="${pal.accent}"/>
  <circle cx="${w*0.80}" cy="${h*0.66}" r="${w*0.012}" fill="${pal.line}" opacity="0.6"/>
</svg>`;
}

function generateHandDetailSVG(artistId, primaryStyle, size) {
  const pal = PORTRAIT_PALETTES[primaryStyle] || PORTRAIT_PALETTES["Soft Glam"];
  const seed = hashSeed(artistId + "-hand");
  const henVariant = seed % 2;
  const w = size || 400, h = Math.round((size || 400) * 1.25);

  return `
<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated bridal hand and jewelry detail">
  <defs>
    <linearGradient id="hbg-${artistId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${pal.veil}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${pal.bg}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#hbg-${artistId})"/>
  <!-- stylized hand/palm shape -->
  <path d="M ${w*0.35} ${h*0.85} L ${w*0.32} ${h*0.45} Q ${w*0.32} ${h*0.38} ${w*0.37} ${h*0.38} Q ${w*0.41} ${h*0.38} ${w*0.41} ${h*0.45} L ${w*0.42} ${h*0.62}
           L ${w*0.43} ${h*0.40} Q ${w*0.43} ${h*0.33} ${w*0.48} ${h*0.33} Q ${w*0.52} ${h*0.33} ${w*0.52} ${h*0.40} L ${w*0.52} ${h*0.62}
           L ${w*0.54} ${h*0.42} Q ${w*0.54} ${h*0.36} ${w*0.59} ${h*0.36} Q ${w*0.63} ${h*0.36} ${w*0.63} ${h*0.42} L ${w*0.62} ${h*0.62}
           L ${w*0.64} ${h*0.48} Q ${w*0.64} ${h*0.43} ${w*0.68} ${h*0.43} Q ${w*0.71} ${h*0.43} ${w*0.71} ${h*0.48} L ${w*0.69} ${h*0.68}
           Q ${w*0.78} ${h*0.72} ${w*0.76} ${h*0.85} Z"
        fill="${pal.bg}" stroke="${pal.line}" stroke-width="1.5" opacity="0.96"/>

  <!-- mehendi-style ornamental lines across the palm -->
  ${henVariant === 0 ? `
    <path d="M ${w*0.40} ${h*0.68} Q ${w*0.48} ${h*0.62} ${w*0.56} ${h*0.68} Q ${w*0.62} ${h*0.72} ${w*0.58} ${h*0.78}" stroke="${pal.line}" stroke-width="1.3" fill="none" opacity="0.55"/>
    <circle cx="${w*0.48}" cy="${h*0.65}" r="3" fill="${pal.line}" opacity="0.5"/>
    <circle cx="${w*0.54}" cy="${h*0.70}" r="3" fill="${pal.line}" opacity="0.5"/>
  ` : `
    <path d="M ${w*0.42} ${h*0.70} L ${w*0.62} ${h*0.70} M ${w*0.46} ${h*0.66} L ${w*0.46} ${h*0.76} M ${w*0.52} ${h*0.65} L ${w*0.52} ${h*0.77} M ${w*0.58} ${h*0.66} L ${w*0.58} ${h*0.76}" stroke="${pal.line}" stroke-width="1.2" opacity="0.5"/>
  `}

  <!-- bangle / kaleera detail -->
  <ellipse cx="${w*0.55}" cy="${h*0.80}" rx="${w*0.16}" ry="${h*0.025}" fill="none" stroke="${pal.accent}" stroke-width="4" opacity="0.85"/>
  <ellipse cx="${w*0.55}" cy="${h*0.86}" rx="${w*0.165}" ry="${h*0.025}" fill="none" stroke="${pal.line}" stroke-width="3" opacity="0.6"/>

  <!-- ring with stone -->
  <circle cx="${w*0.48}" cy="${h*0.56}" r="${w*0.022}" fill="none" stroke="${pal.accent}" stroke-width="2.5"/>
  <circle cx="${w*0.48}" cy="${h*0.545}" r="${w*0.012}" fill="${pal.accent}"/>
</svg>`;
}

function portfolioTileUri(artistId, primaryStyle, compositionType, size) {
  let svg;
  if (compositionType === 'eye') svg = generateEyeDetailSVG(artistId, primaryStyle, size);
  else if (compositionType === 'hand') svg = generateHandDetailSVG(artistId, primaryStyle, size);
  else svg = generatePortraitSVG(artistId, primaryStyle, size);
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// ===== MASCOT DOODLE: SUNDARI =====
// A small, friendly bride-doodle used as the chat widget's avatar — same illustration
// language as the portraits above (silhouette + maang-tikka + veil), but simplified,
// warmer-lined, and cropped tighter for use at small sizes (avatar/bubble scale).
function generateSundariSVG(size) {
  const s = size || 120;
  const pal = { bg: "#F3E3D9", veil: "#E8C4D4", accent: "#D4AF6A", line: "#9B2242" };
  return `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sundari, illustrated booking assistant mascot">
  <defs>
    <linearGradient id="sun-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${pal.bg}"/>
      <stop offset="100%" stop-color="${pal.veil}"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="60" fill="url(#sun-bg)"/>
  <!-- veil -->
  <path d="M 60 22 C 82 28 90 52 84 86 L 36 86 C 30 52 38 28 60 22 Z" fill="${pal.veil}" opacity="0.7"/>
  <!-- shoulders -->
  <path d="M 30 100 C 32 88 42 80 60 80 C 78 80 88 88 90 100 Z" fill="${pal.accent}" opacity="0.9"/>
  <!-- face -->
  <path d="M 60 36 C 70 36 76 46 75 56 C 74 66 68 74 60 75 C 52 74 46 66 45 56 C 44 46 50 36 60 36 Z" fill="${pal.bg}" stroke="${pal.line}" stroke-width="1.6"/>
  <!-- closed-smile eyes -->
  <path d="M 51 55 Q 54 53 57 55" stroke="${pal.line}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M 63 55 Q 66 53 69 55" stroke="${pal.line}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <!-- smile -->
  <path d="M 54 65 Q 60 69 66 65" stroke="${pal.line}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <!-- bindi -->
  <circle cx="60" cy="46" r="1.6" fill="${pal.line}" opacity="0.85"/>
  <!-- maang-tikka -->
  <circle cx="60" cy="32" r="1.8" fill="${pal.line}" opacity="0.85"/>
  <circle cx="60" cy="36.5" r="2.6" fill="${pal.accent}"/>
  <!-- earrings -->
  <circle cx="45.5" cy="58" r="1.8" fill="${pal.accent}"/>
  <circle cx="74.5" cy="58" r="1.8" fill="${pal.accent}"/>
</svg>`;
}

function sundariUri(size) {
  return "data:image/svg+xml;utf8," + encodeURIComponent(generateSundariSVG(size));
}
