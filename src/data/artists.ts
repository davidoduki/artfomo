export type MomentumLevel = "breakout" | "rising" | "steady" | "emerging";

export interface Artist {
  slug: string;
  name: string;
  medium: string;
  location: string;
  priceRange: string;
  momentum: MomentumLevel;
  momentumScore: number; // 0-100
  bio: string;
  highlights: string[];
  galleries: string[];
  recentDrops: { title: string; date: string; price: string; soldOut: boolean }[];
  tags: string[];
  imageColor: string; // placeholder color for mock
}

export const artists: Artist[] = [
  {
    slug: "amara-osei",
    name: "Amara Osei",
    medium: "Mixed Media",
    location: "Lagos, Nigeria",
    priceRange: "$2K – $8K",
    momentum: "breakout",
    momentumScore: 94,
    bio: "Amara Osei blends traditional West African textile patterns with digital collage techniques, creating large-scale works that explore diaspora identity and cultural memory. Her work has been acquired by three major institutional collections in the past year.",
    highlights: [
      "Shortlisted for the Future Generation Art Prize 2025",
      "Solo show at White Cube Bermondsey, March 2026",
      "Acquired by Tate Modern permanent collection",
    ],
    galleries: ["White Cube", "Goodman Gallery"],
    recentDrops: [
      { title: "Threads of Return", date: "2026-02-01", price: "$6,500", soldOut: true },
      { title: "Memory Weave III", date: "2026-01-15", price: "$4,200", soldOut: true },
      { title: "Ancestral Data", date: "2025-12-10", price: "$3,800", soldOut: false },
    ],
    tags: ["mixed media", "textiles", "identity", "african art"],
    imageColor: "from-amber-600 to-rose-600",
  },
  {
    slug: "kai-tanaka",
    name: "Kai Tanaka",
    medium: "Digital Sculpture",
    location: "Tokyo, Japan",
    priceRange: "$1K – $5K",
    momentum: "breakout",
    momentumScore: 91,
    bio: "Kai Tanaka creates algorithmically generated sculptures that exist at the intersection of traditional Japanese ceramics and computational design. Each piece is fabricated using custom robotic arms and fired in a wood-burning kiln.",
    highlights: [
      "Featured in Artforum 'Best of 2025'",
      "Residency at MIT Media Lab",
      "Commission for teamLab Borderless Tokyo",
    ],
    galleries: ["Pace Gallery", "SCAI The Bathhouse"],
    recentDrops: [
      { title: "Kintsugi Algorithm #7", date: "2026-01-28", price: "$4,800", soldOut: true },
      { title: "Digital Raku Series", date: "2026-01-05", price: "$2,200", soldOut: true },
    ],
    tags: ["digital", "sculpture", "ceramics", "algorithmic"],
    imageColor: "from-cyan-600 to-blue-600",
  },
  {
    slug: "elena-vasquez",
    name: "Elena Vasquez",
    medium: "Oil on Canvas",
    location: "Mexico City, Mexico",
    priceRange: "$3K – $12K",
    momentum: "rising",
    momentumScore: 82,
    bio: "Elena Vasquez paints hyper-saturated dreamscapes that draw from Mexican surrealist traditions and contemporary climate anxiety. Her canvases pulse with neon flora overtaking urban landscapes.",
    highlights: [
      "Group show at Gagosian, 2025",
      "Acquired by LACMA",
      "Cover of Frieze magazine, November 2025",
    ],
    galleries: ["Kurimanzutto", "David Zwirner"],
    recentDrops: [
      { title: "Neon Selva IV", date: "2026-02-10", price: "$11,000", soldOut: false },
      { title: "After the Flood", date: "2025-11-20", price: "$8,500", soldOut: true },
    ],
    tags: ["painting", "surrealism", "climate", "latin american art"],
    imageColor: "from-green-600 to-emerald-500",
  },
  {
    slug: "marcus-reed",
    name: "Marcus Reed",
    medium: "Photography",
    location: "Detroit, USA",
    priceRange: "$800 – $3K",
    momentum: "rising",
    momentumScore: 76,
    bio: "Marcus Reed documents post-industrial transformation through large-format photography. His work captures the tension between decay and renewal in American cities, with a focus on community resilience.",
    highlights: [
      "Whitney Biennial 2026 selection",
      "Monograph published by Aperture",
      "MacArthur Fellowship nominee",
    ],
    galleries: ["Marianne Boesky Gallery"],
    recentDrops: [
      { title: "Rust Belt Bloom", date: "2026-01-20", price: "$2,800", soldOut: true },
      { title: "Assembly Line Garden", date: "2025-12-05", price: "$1,500", soldOut: false },
    ],
    tags: ["photography", "documentary", "urban", "american"],
    imageColor: "from-orange-600 to-red-600",
  },
  {
    slug: "yuki-chen",
    name: "Yuki Chen",
    medium: "Installation",
    location: "Berlin, Germany",
    priceRange: "$5K – $25K",
    momentum: "rising",
    momentumScore: 73,
    bio: "Yuki Chen creates immersive light installations that explore the perceptual boundaries between physical and digital space. Working with custom LED arrays and spatial audio, her installations transform entire rooms into living organisms.",
    highlights: [
      "Venice Biennale 2025 participant",
      "Permanent installation at Haus der Kunst, Munich",
    ],
    galleries: ["Sprüth Magers", "Esther Schipper"],
    recentDrops: [
      { title: "Breathing Room", date: "2025-11-01", price: "$22,000", soldOut: true },
    ],
    tags: ["installation", "light art", "immersive", "technology"],
    imageColor: "from-violet-600 to-indigo-600",
  },
  {
    slug: "omar-hassan",
    name: "Omar Hassan",
    medium: "Painting",
    location: "London, UK",
    priceRange: "$1.5K – $6K",
    momentum: "steady",
    momentumScore: 65,
    bio: "Omar Hassan creates gestural abstract paintings informed by Arabic calligraphy and street art. His work bridges high art traditions with urban energy, using spray paint alongside oil on raw linen.",
    highlights: [
      "Saatchi Gallery group show 2025",
      "Collected by Jay-Z and Beyoncé",
    ],
    galleries: ["Saatchi Gallery", "Unit London"],
    recentDrops: [
      { title: "Script & Spray XII", date: "2026-01-10", price: "$4,500", soldOut: false },
      { title: "Medina Echoes", date: "2025-10-15", price: "$3,200", soldOut: true },
    ],
    tags: ["painting", "abstract", "calligraphy", "street art"],
    imageColor: "from-rose-600 to-pink-600",
  },
  {
    slug: "freya-lindstrom",
    name: "Freya Lindström",
    medium: "Textile Art",
    location: "Stockholm, Sweden",
    priceRange: "$2K – $9K",
    momentum: "emerging",
    momentumScore: 58,
    bio: "Freya Lindström hand-weaves monumental tapestries using reclaimed industrial materials. Her work comments on fast fashion, sustainability, and the human labor embedded in textiles.",
    highlights: [
      "Finalist, Loewe Craft Prize 2025",
      "Residency at Textile Museum of Sweden",
    ],
    galleries: ["Galerie Nordenhake"],
    recentDrops: [
      { title: "Unraveled Labor", date: "2025-12-20", price: "$7,500", soldOut: false },
    ],
    tags: ["textile", "sustainability", "craft", "scandinavian"],
    imageColor: "from-teal-600 to-cyan-600",
  },
  {
    slug: "diego-morales",
    name: "Diego Morales",
    medium: "Sculpture",
    location: "São Paulo, Brazil",
    priceRange: "$4K – $15K",
    momentum: "emerging",
    momentumScore: 52,
    bio: "Diego Morales casts organic forms in bronze and resin, drawing from the biodiversity of the Amazon basin. His sculptures blur the line between botanical specimen and abstract form.",
    highlights: [
      "São Paulo Biennial 2025",
      "Commission for Inhotim outdoor collection",
    ],
    galleries: ["Galeria Fortes D'Aloia & Gabriel"],
    recentDrops: [
      { title: "Canopy Fragment VI", date: "2026-02-05", price: "$12,000", soldOut: false },
      { title: "Root System", date: "2025-09-01", price: "$8,000", soldOut: true },
    ],
    tags: ["sculpture", "bronze", "nature", "brazilian art"],
    imageColor: "from-lime-600 to-green-600",
  },
];

export const mediums = [...new Set(artists.map((a) => a.medium))].sort();

export function getMomentumColor(momentum: MomentumLevel) {
  switch (momentum) {
    case "breakout":
      return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    case "rising":
      return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    case "steady":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "emerging":
      return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
  }
}

export function getMomentumIcon(momentum: MomentumLevel) {
  switch (momentum) {
    case "breakout":
      return "⬆⬆";
    case "rising":
      return "⬆";
    case "steady":
      return "→";
    case "emerging":
      return "✦";
  }
}
