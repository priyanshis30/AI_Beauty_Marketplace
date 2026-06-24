// ===== DATA =====

const AREAS = ["South Delhi", "West Delhi", "Gurugram", "Noida", "Central Delhi", "Dwarka"];

const STYLE_TAGS = ["Soft Glam", "Traditional", "HD Airbrush", "Minimal/Dewy", "Bold Bridal", "Indo-Western", "Pastel", "Heavy Kumkum"];

const ARTISTS = [
  {
    id: "a1",
    name: "Meher Kapoor Studio",
    area: "South Delhi",
    rating: 4.9,
    reviews: 212,
    priceFrom: 18000,
    styles: ["Soft Glam", "Minimal/Dewy", "Pastel"],
    tagline: "Editorial bridal looks, dewy skin focus",
    bio: "",
    experience: 8,
    bookedThisMonth: 14
  },
  {
    id: "a2",
    name: "Rangrez Bridal Atelier",
    area: "Gurugram",
    rating: 4.8,
    reviews: 189,
    priceFrom: 35000,
    styles: ["Traditional", "Heavy Kumkum", "Bold Bridal"],
    tagline: "Classic North Indian bridal, heavy kumkum specialists",
    bio: "",
    experience: 15,
    bookedThisMonth: 22
  },
  {
    id: "a3",
    name: "Glow Theory by Anaya",
    area: "Noida",
    rating: 4.7,
    reviews: 96,
    priceFrom: 12000,
    styles: ["HD Airbrush", "Minimal/Dewy", "Indo-Western", "Soft Glam"],
    tagline: "HD airbrush specialist for cocktail & reception",
    bio: "",
    experience: 5,
    bookedThisMonth: 9
  },
  {
    id: "a4",
    name: "The Sindoor House",
    area: "Central Delhi",
    rating: 4.95,
    reviews: 340,
    priceFrom: 45000,
    styles: ["Traditional", "Bold Bridal", "Heavy Kumkum"],
    tagline: "Old Delhi legacy salon, three generations of bridal artistry",
    bio: "",
    experience: 22,
    bookedThisMonth: 31
  },
  {
    id: "a5",
    name: "Petal & Pearl Makeovers",
    area: "West Delhi",
    rating: 4.6,
    reviews: 74,
    priceFrom: 9500,
    styles: ["Pastel", "Minimal/Dewy", "Soft Glam"],
    tagline: "Budget-friendly soft glam for sangeet & mehendi",
    bio: "",
    experience: 4,
    bookedThisMonth: 6
  },
  {
    id: "a6",
    name: "Zoya Bridal Couture Makeup",
    area: "Dwarka",
    rating: 4.85,
    reviews: 158,
    priceFrom: 22000,
    styles: ["Indo-Western", "Bold Bridal", "HD Airbrush"],
    tagline: "Fusion looks for destination & Indo-Western weddings",
    bio: "",
    experience: 10,
    bookedThisMonth: 17
  },
  {
    id: "a7",
    name: "Henna & Highlights",
    area: "South Delhi",
    rating: 4.5,
    reviews: 61,
    priceFrom: 8000,
    styles: ["Traditional", "Pastel"],
    tagline: "Mehendi function specialists, natural day looks",
    bio: "",
    experience: 6,
    bookedThisMonth: 8
  },
  {
    id: "a8",
    name: "Maison Mehera",
    area: "Gurugram",
    rating: 4.92,
    reviews: 275,
    priceFrom: 52000,
    styles: ["Soft Glam", "HD Airbrush", "Indo-Western"],
    tagline: "Celebrity bridal team, A-list wedding portfolio",
    bio: "",
    experience: 18,
    bookedThisMonth: 27
  },
  {
    id: "a9",
    name: "Ivory & Vermilion",
    area: "Central Delhi",
    rating: 4.78,
    reviews: 142,
    priceFrom: 28000,
    styles: ["Soft Glam", "Pastel", "Minimal/Dewy"],
    tagline: "Soft glam bridal team for South Delhi's heritage venues",
    bio: "",
    experience: 9,
    bookedThisMonth: 16
  },
  {
    id: "a10",
    name: "Naina Studio",
    area: "West Delhi",
    rating: 4.65,
    reviews: 88,
    priceFrom: 11000,
    styles: ["Traditional", "Heavy Kumkum", "HD Airbrush"],
    tagline: "Traditional bridal at West Delhi's most-booked salon chain",
    bio: "",
    experience: 7,
    bookedThisMonth: 11
  },
  {
    id: "a11",
    name: "Saffron Bride Co.",
    area: "Dwarka",
    rating: 4.7,
    reviews: 103,
    priceFrom: 15000,
    styles: ["Soft Glam", "Indo-Western", "Pastel"],
    tagline: "Dwarka's go-to for sangeet and reception soft glam",
    bio: "",
    experience: 6,
    bookedThisMonth: 13
  },
  {
    id: "a12",
    name: "Kohl & Kalash",
    area: "Noida",
    rating: 4.82,
    reviews: 121,
    priceFrom: 24000,
    styles: ["Bold Bridal", "Heavy Kumkum", "Traditional"],
    tagline: "Bold bridal looks built for Noida's biggest banquet weddings",
    bio: "",
    experience: 11,
    bookedThisMonth: 19
  },
  {
    id: "a13",
    name: "Aaina Bridal Lounge",
    area: "Gurugram",
    rating: 4.6,
    reviews: 67,
    priceFrom: 16500,
    styles: ["Minimal/Dewy", "Pastel"],
    tagline: "Quiet-luxury minimal bridal looks for Gurugram's farmhouse weddings",
    bio: "",
    experience: 5,
    bookedThisMonth: 8
  },
  {
    id: "a14",
    name: "Roohani Makeovers",
    area: "South Delhi",
    rating: 4.88,
    reviews: 176,
    priceFrom: 31000,
    styles: ["Bold Bridal", "HD Airbrush", "Heavy Kumkum"],
    tagline: "South Delhi's bold bridal and HD airbrush specialist",
    bio: "",
    experience: 13,
    bookedThisMonth: 21
  },
  {
    id: "a15",
    name: "Champa Studio",
    area: "Central Delhi",
    rating: 4.55,
    reviews: 54,
    priceFrom: 9800,
    styles: ["Pastel", "Indo-Western", "Minimal/Dewy"],
    tagline: "Budget-friendly pastel and fusion looks near CP",
    bio: "",
    experience: 4,
    bookedThisMonth: 7
  },
  {
    id: "a16",
    name: "Mehfil Bridal House",
    area: "Dwarka",
    rating: 4.91,
    reviews: 198,
    priceFrom: 38000,
    styles: ["Traditional", "Heavy Kumkum", "Bold Bridal"],
    tagline: "Dwarka's premier traditional heavy-kumkum bridal house",
    bio: "",
    experience: 17,
    bookedThisMonth: 24
  }
];

// Generate illustrative portraits for each artist — keyed off their style mix so
// the visual identity (palette/motif) matches their specialty. Portfolio uses a
// second and third style from their tags (or repeats the primary) for variety,
// rendered at slightly different seeds so each tile looks distinct.
ARTISTS.forEach(a => {
  a.photo = portraitDataUri(a.id, a.styles[0], 600);
  a.portfolio = [
    portfolioTileUri(a.id + "-p1", a.styles[0], "full", 400),
    portfolioTileUri(a.id + "-p2", a.styles[1] || a.styles[0], "eye", 400),
    portfolioTileUri(a.id + "-p3", a.styles[2] || a.styles[0], "hand", 400)
  ];
});

// Keyword → style tag mapping for the AI look-matcher (mocked NLP)
const LOOK_KEYWORDS = {
  "soft": ["Soft Glam", "Minimal/Dewy"],
  "glam": ["Soft Glam", "Bold Bridal"],
  "dewy": ["Minimal/Dewy", "Soft Glam"],
  "minimal": ["Minimal/Dewy", "Pastel"],
  "natural": ["Minimal/Dewy", "Pastel"],
  "traditional": ["Traditional", "Heavy Kumkum"],
  "kumkum": ["Heavy Kumkum", "Traditional"],
  "heavy": ["Heavy Kumkum", "Bold Bridal"],
  "bold": ["Bold Bridal", "Heavy Kumkum"],
  "airbrush": ["HD Airbrush"],
  "hd": ["HD Airbrush"],
  "pastel": ["Pastel", "Minimal/Dewy"],
  "fusion": ["Indo-Western"],
  "indo": ["Indo-Western"],
  "western": ["Indo-Western"],
  "reception": ["HD Airbrush", "Bold Bridal"],
  "mehendi": ["Traditional", "Pastel"],
  "sangeet": ["Soft Glam", "Pastel"],
  "cocktail": ["Indo-Western", "HD Airbrush"],
  "destination": ["Indo-Western"],
  "classic": ["Traditional"],
  "modern": ["Indo-Western", "Soft Glam"],
  "dramatic": ["Bold Bridal"],
  "elegant": ["Soft Glam", "Minimal/Dewy"]
};

// Sample reference looks for the visual matcher (illustrative, generated — not photos of real people)
const SAMPLE_LOOKS = [
  { id: "l1", label: "Soft glam, dewy skin", styles: ["Soft Glam", "Minimal/Dewy"] },
  { id: "l2", label: "Traditional, heavy kumkum", styles: ["Traditional", "Heavy Kumkum"] },
  { id: "l3", label: "HD airbrush, bold", styles: ["HD Airbrush", "Bold Bridal"] },
  { id: "l4", label: "Indo-western fusion", styles: ["Indo-Western"] }
];
SAMPLE_LOOKS.forEach(l => { l.img = portraitDataUri("sample-" + l.id, l.styles[0], 300); });

// Booking slots — used by both the calendar UI and the waitlist/scheduling feature
function generateSlots() {
  const slots = {};
  ARTISTS.forEach(artist => {
    slots[artist.id] = {};
    for (let d = 1; d <= 14; d++) {
      const dateKey = `2026-07-${String(d).padStart(2, '0')}`;
      // deterministic pseudo-availability based on id+day for consistent demo
      const seed = (artist.id.charCodeAt(1) + d * 7) % 5;
      slots[artist.id][dateKey] = seed === 0 ? "full" : (seed === 1 ? "limited" : "open");
    }
  });
  return slots;
}
const AVAILABILITY = generateSlots();

let STATE = {
  view: "home",
  filters: { area: "All Areas", style: "All Styles", sort: "Recommended" },
  selectedArtist: null,
  chatMessages: [],
  matchResults: null,
  favorites: new Set(),
  bookingDraft: null
};
