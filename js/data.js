/* ============================================================
   Content — projects & pricing. Edit freely.
   images: base names in img/ (full = name.webp, thumb = name_t.webp)
   size: 'wide' (8/12) · 'narrow tall' (4/12) · 'half' (6/12)
   ============================================================ */
const PROJECTS = [
  {
    id: 'master-suite', title: 'Master Suite', tags: ['Interior', 'Residential'], size: 'wide',
    images: ['p3_001', 'p3_002_1', 'p3_004', 'p3_005', 'p3_003_1', 'p3_004_1', 'p3_005_1', 'p3_001_1'],
    year: '2025', client: 'Interior design studio', tools: ['Blender · Cycles'],
    brief: 'Master bedroom for a private apartment: beaded pendant lights, fluted panels, a working corner and a hidden wardrobe — all from the designer\'s drawings and moodboard.',
    result: 'Eight angles covering every wall, two bedding variants, morning light. Approved by the homeowner on the first presentation.',
    deliverables: ['8 stills · 4K', '2 styling variants', 'Editable Blender file'],
  },
  {
    id: 'onyx-bath', title: 'Onyx & Brass Bathroom', tags: ['Interior', 'Bathroom'], size: 'narrow tall',
    images: ['p4_003', 'p4_001', 'p4_005', 'p4_008', 'p4_011', 'p4_014', 'p4_002', 'p4_013'],
    year: '2025', client: 'Interior design studio', tools: ['Blender · Cycles'],
    brief: 'Book-matched onyx, brushed brass fixtures and a pink glass chandelier — a small bathroom that had to look like a hotel suite.',
    result: 'Eight angles including tight fixture close-ups, so the client could sign off on tile layout and brass finishes before ordering.',
    deliverables: ['8 stills · 4K', 'Close-up details'],
  },
  {
    id: 'walnut-apartment', title: 'Walnut Apartment', tags: ['Interior', 'Residential'], size: 'narrow tall',
    images: ['p29_001', 'p29_002', 'p29_003', 'p29_004', 'p29_005', 'p29_006', 'p29_007', 'p29_008', 'p29_009', 'p29_010'],
    year: '2025', client: 'Private client', tools: ['Blender · Cycles'],
    brief: 'Open-plan living, kitchen with a walnut island, marble fireplace wall and a long entrance hall — a full apartment built from the designer\'s layouts and real supplier catalogues (Astor Mobili, Teka, Hofmann).',
    result: 'Twenty-two renders across every room; each appliance, fixture and light modelled from the manufacturer\'s spec so the visuals matched the order list one-to-one.',
    deliverables: ['22 stills', 'Every room', 'Catalogue-accurate furniture'],
  },
  {
    id: 'teen-room', title: 'Gamer\'s Bedroom', tags: ['Interior', 'Day / Night'], size: 'wide',
    images: ['p2_002', 'p2_001', 'p2_003', 'p2_006', 'p2_007', 'p2_004', 'p2_005'],
    year: '2025', client: 'Interior design studio', tools: ['Blender · Cycles'],
    brief: 'A teenager\'s room with a desk setup, projector wall and a glass-fronted display cabinet — needed both daylight and evening "gaming" mood.',
    result: 'Seven angles, daytime and a night scene lit only by the projector and LED strips.',
    deliverables: ['7 stills', 'Day + night', 'Cabinet detail'],
  },
  {
    id: 'lily-nozzle', title: 'Lily Nozzle — Product Film', tags: ['Product animation', 'Hard-surface'], size: 'wide',
    images: ['p30_001', 'p30_002', 'p30_003', 'p30_004', 'p30_005', 'p30_006'],
    videos: [
      { src: 'video/lily_promo.mp4', poster: 'video/lily_promo_poster.jpg', label: 'Product film · 37 s' },
      { src: 'video/nozzle.mp4', poster: 'video/nozzle_poster.jpg', label: 'Turntable' },
    ],
    year: '2026', client: 'Fountain manufacturer', tools: ['Blender · Cycles', 'CAD drawings', 'Camera animation'],
    brief: 'A launch film for the Lily multi-jet nozzle: the manufacturer needed a catalogue-grade product video of a part that exists only as a fabrication drawing.',
    result: 'Millimetre-accurate model from the CAD sheet, studio lighting rig, macro passes on the threads and a slow exploded-view of the nozzle stack — 37 seconds, rendered in Cycles.',
    deliverables: ['37 s film · 1080p', 'Exploded-view sequence', 'Turntable loop', '6 stills'],
  },
  {
    id: 'spa-lounge', title: 'Spa Lounge', tags: ['Interior', 'Wellness'], size: 'narrow tall',
    images: ['p1_017', 'p1_016', 'p1_012', 'p1_014'],
    year: '2025', client: 'Interior design studio', tools: ['Blender · Cycles'],
    brief: 'Relaxation room of a private spa: heated benches, fluted wall, copper pendant, linen storage.',
    result: 'Four calm, warm renders that sold the material palette.',
    deliverables: ['4 stills'],
  },
  {
    id: 'japandi-bath', title: 'Japandi Bathroom', tags: ['Interior', 'Bathroom'], size: 'half',
    images: ['p5_001', 'p5_002', 'p5_003', 'p5_004'],
    year: '2025', client: 'Interior design studio', tools: ['Blender · Cycles'],
    brief: 'Oak, micro-cement and plants — a bathroom that should feel like a ryokan.',
    result: 'Four views with soft diffused daylight and accurate oak grain from the supplier\'s samples.',
    deliverables: ['4 stills'],
  },
  {
    id: 'blush-bath', title: 'Blush Bathroom', tags: ['Interior', 'Bathroom'], size: 'half',
    images: ['p6_camera_004', 'p6_camera_001', 'p6_camera_002', 'p6_camera_003'],
    year: '2025', client: 'Interior design studio', tools: ['Blender · Cycles'],
    brief: 'A playful pink bathroom with vertical tile mosaic, glass pendants and terrazzo floor.',
    result: 'Four views; the tile pattern was re-laid twice in 3D before the client committed to it.',
    deliverables: ['4 stills', 'Tile layout variants'],
  },
  {
    id: 'neon-katana', title: 'Neon Katana', tags: ['Hard-surface', 'Game art'], size: 'wide',
    images: ['p28_001', 'p28_002', 'p28_003', 'p28_004', 'p28_005', 'p28_006', 'p28_007', 'p28_008', 'p28_009', 'p28_010'],
    year: '2025', client: 'Personal project', tools: ['Blender', 'PBR texturing', 'Unreal Engine 5'],
    brief: 'A cyberpunk katana with a segmented blade, emissive edge and skeletonised grip — modelled game-ready for real-time.',
    result: 'Clean quad topology, hard-surface bevels, PBR set with emissive mask; rendered in studio light and checked in UE5.',
    deliverables: ['9 stills · 4K', 'Topology view', 'Game-ready asset'],
  },
  {
    id: 'frame-1800', title: 'Fountain Frame 1800', tags: ['Hard-surface', 'Technical'], size: 'narrow tall',
    images: ['p26_001', 'p26_002', 'p26_003', 'p26_004', 'p26_005', 'p26_006', 'p26_007'],
    videos: [{ src: 'video/nozzle.mp4', poster: 'video/nozzle_poster.jpg', label: 'Lily nozzle · turntable' }],
    year: '2026', client: 'Fountain manufacturer', tools: ['Blender', 'CAD drawings'],
    brief: 'The steel frame of an 1800 mm sphere fountain — modelled to the engineer\'s drawing, millimetre-accurate, for the workshop and the catalogue.',
    result: 'Plan and elevation views, an exploded assembly of the ring basin and a turntable of the Lily nozzle; every part matches the fabrication drawing.',
    deliverables: ['7 stills', 'Plan + elevation', 'Exploded view', 'Nozzle turntable'],
  },
  {
    id: 'aqua-mall', title: 'Aqua Mall Environment', tags: ['Exterior', 'Landscape'], size: 'wide',
    images: ['p27_001', 'p27_002', 'p27_003', 'p27_004'],
    year: '2026', client: 'Fountain manufacturer', tools: ['Blender · Cycles', 'LiquiGen'],
    brief: 'A full shopping-mall forecourt as a catalogue environment: parking, terraces, topiary, a sculptural bench and a custom ring fountain by the entrance.',
    result: 'Aerial and eye-level views by day, plus the ring fountain lit at dusk — the same environment now hosts the whole product catalogue.',
    deliverables: ['4 stills · 4K', 'Reusable environment', 'Day + dusk'],
  },
  {
    id: 'blossom-spheres', title: 'Blossom Spheres', tags: ['Fluid simulation', 'Day / Night'], size: 'narrow tall',
    images: ['p20_001', 'p20_002', 'p20_003', 'p20_004', 'p20_005', 'p20_006', 'p20_007'],
    year: '2026', client: 'Fountain manufacturer', tools: ['Blender · Cycles', 'LiquiGen'],
    brief: 'A 1.5 × 3 m timber basin with three polished spheres set into a parterre of blue and white flowers — show the piece by day and as a lit night feature.',
    result: 'Matched day / night cameras, plus variants with jet programmes and coloured underwater lighting. Water film on the spheres simulated in LiquiGen.',
    deliverables: ['7 stills · 4K', 'Day + night matched camera', 'Lighting variants'],
  },
  {
    id: 'heart-fountain', title: 'Heart Fountain', tags: ['Fluid simulation', 'Product'], size: 'half',
    images: ['p13_001', 'p13_002', 'p13_003', 'p13_004', 'p13_005', 'p13_006'],
    year: '2026', client: 'Fountain manufacturer', tools: ['Blender · Cycles', 'LiquiGen'],
    brief: 'Two steel arcs throwing crossing water sheets into a pebble basin — a catalogue piece for a fountain manufacturer.',
    result: 'Six states: daylight, dry with lit nozzles, running water, and a pink-lit night programme. Water sheets simulated with correct velocity and break-up.',
    deliverables: ['6 stills', 'Dry + running states', 'Night lighting programme'],
  },
  {
    id: 'long-basin', title: 'Long Steel Basin', tags: ['Fluid simulation', 'Day / Night'], size: 'half',
    images: ['p23_001', 'p23_002', 'p23_003', 'p23_004', 'p23_005'],
    year: '2026', client: 'Urban design studio', tools: ['Blender · Cycles', 'LiquiGen'],
    brief: 'A 6 m brushed-steel basin with a row of foam jets on a city square — one camera, three times of day.',
    result: 'Day, dusk and night from the identical camera so the client could pick the lighting programme; wet-paving reflections after the evening cycle.',
    deliverables: ['5 stills', 'Day · dusk · night', 'Matched camera'],
  },
  {
    id: 'square-basin', title: 'Square Basin & Spheres', tags: ['Fluid simulation', 'Public space'], size: 'half',
    images: ['p22_001', 'p22_002', 'p22_003', 'p22_004'],
    year: '2026', client: 'Fountain manufacturer', tools: ['Blender · Cycles', 'LiquiGen'],
    brief: 'A 6 m² timber-clad basin with a central geyser jet, satellite foam nozzles and two mirror spheres on a downtown square.',
    result: 'Daylight and lit-night views with all jets running; the geyser column and foam heads simulated at the specified flow rates.',
    deliverables: ['4 stills', 'Day + night', 'Jet spec match'],
  },
  {
    id: 'sculpture-park', title: 'Sculpture Park', tags: ['Landscape', 'Day / Night'], size: 'half',
    images: ['p7_002', 'p7_001', 'p7_003', 'p7_004'],
    year: '2025', client: 'Landscape architects', tools: ['Blender · Cycles', 'LiquiGen'],
    brief: 'Pocket park with a sculptural fountain, pergola and topiary — two matching camera sets for day and night.',
    result: 'Identical cameras rendered in both lighting states so the client can slide between them (see the Day / Night section).',
    deliverables: ['4 stills', 'Day + night matched cameras'],
  },
  {
    id: 'private-garden', title: 'Private Garden', tags: ['Landscape', 'Water features'], size: 'half',
    images: ['p8_1000', 'p8_01', 'p8_2001', 'p8_1001', 'p8_02', 'p8_04'],
    year: '2025', client: 'Private client', tools: ['Blender · Cycles'],
    brief: 'A walled garden with three water features — basalt monolith, mirror pool and a steel sphere — for a private house.',
    result: 'Six views at golden hour and dusk, vegetation matched to the planting plan.',
    deliverables: ['6 stills', 'Golden hour + dusk'],
  },
  {
    id: 'dancing-fountain', title: 'Dancing Fountain Show', tags: ['Fluid simulation', 'Night show'], size: 'half',
    images: ['p9_001', 'p9_002', 'p9_003', 'p9_004', 'p9_005'],
    year: '2025', client: 'Fountain manufacturer', tools: ['Blender · Cycles', 'LiquiGen', 'EmberGen'],
    brief: 'A dry-deck dancing fountain on a shopping-mall plaza — the client needed to sell the night show to city authorities before a single nozzle was installed.',
    result: 'Daytime plaza views plus a full night sequence with RGB-lit jets simulated in LiquiGen. Mist and spray from EmberGen tie the water to the scene.',
    deliverables: ['5 stills · 4K', 'Day + night scenario', 'Jet choreography previs'],
  },
];

/* Day / Night matched pairs for the comparison slider */
const LIGHT_PAIRS = [
  { label: 'Blossom spheres', day: 'p20_002', night: 'p20_003' },
  { label: 'Long basin', day: 'p23_001', night: 'p23_003' },
  { label: 'Fountain plaza', day: 'p7_001', night: 'p7_004' },
  { label: 'Aerial view', day: 'p7_002', night: 'p7_003' },
  { label: 'Twin pools', day: 'p11_001', night: 'p11_002' },
];

/* Process section: aligned before / after + technical-modelling story */
const PROCESS = {
  schematic: { before: 'p17_001', after: 'p17_002', beforeLabel: 'Hydraulic schematic', afterLabel: 'Fluid simulation' },
  steps: [
    { img: 'p26_002', label: 'Plan view', note: 'Sphere layout and frame ring from the engineer\'s drawing.' },
    { img: 'p26_003', label: 'Elevation', note: 'Every strut and mount at drawing dimensions.' },
    { img: 'p26_001', label: 'Assembled', note: 'Frame, spheres and nozzles — ready for the workshop.' },
  ],
  film: { video: 'video/lily_promo.mp4', poster: 'video/lily_promo_poster.jpg' },
};

/* ============================================================
   Quote calculator — all numbers in USD. Tune to your real rates.
   ============================================================ */
const PRICING = {
  types: {
    interior:  { label: 'Interior render',      perView: 45,  min: 90 },
    exterior:  { label: 'Exterior / landscape',  perView: 70,  min: 140 },
    fluid:     { label: 'Fountain + water sim',  perView: 120, min: 240, note: 'includes LiquiGen / EmberGen simulation' },
    realtime:  { label: 'Real-time UE5 scene',   perView: 0,   min: 600, flat: 600, note: 'interactive walkthrough, per scene' },
  },
  resolution: { '2K': 1, '4K': 1.2 },
  lightingScenario: 0.5,      // each extra lighting scenario = +50% of view cost
  animation: 150,             // per 10-second flythrough
  editableFile: 0.25,         // +25% for a fully editable Blender file
  rush: 1.5,                  // ×1.5 for 48-hour delivery
  rangeSpread: 0.15,          // shown as ±15%
  currency: '$',
};
