// Each photo key points to a file in /img/. Add more photos to a place by dropping the file in
// public/img/ and adding its key here, then listing the key in that place's `photos` array.
const webp = (alt) => ({ alt, file: (key) => `${key}.webp` });
const svg = (alt) => ({ alt, file: (key) => `${key}.svg` });

export const photos = {
  gulmarg: webp('Green meadows of Gulmarg'),
  strawberry: webp('Strawberry Valley near Gulmarg'),
  'strawberry-2': webp('Pine-ringed meadow in Strawberry Valley'),
  drung: webp('Drung Waterfall near Tangmarg'),
  'drung-2': webp('Close view of Drung Waterfall'),
  gurez: webp('Gurez Valley'),
  'gurez-2': webp('Mountain slopes in Gurez Valley'),
  kishanganga: webp('Kishanganga River in Gurez'),
  'kishanganga-2': webp('River bend of the Kishanganga'),
  lolab: webp('Lolab Valley'),
  'lolab-2': webp('Lolab countryside'),
  'lolab-3': webp('Fields and slopes in Lolab'),
  bangus: webp('Bangus Valley meadows'),
  'bangus-2': webp('Grassy slopes of Bangus Valley'),
  'bangus-3': webp('Woodland edge in Bangus Valley'),
  harwan: webp('Harwan Garden'),
  'harwan-2': webp('Harwan Garden paths and trees'),
  'harwan-3': webp('Harwan Garden flowerbeds'),
  burzahom: webp('Burzahom earthenware'),
  'burzahom-2': webp('Burzahom earthenware, top view'),
  'burzahom-3': webp('Burzahom earthenware, lower view'),
  shalimar: webp('Shalimar Bagh'),
  'shalimar-2': webp('Shalimar Bagh terraces'),
  'shalimar-3': webp('Shalimar Bagh water channel'),
  ganderbal: webp('Kheer Bhawani, Tulmulla'),
  'ganderbal-2': webp('Kheer Bhawani surroundings'),
  'ganderbal-3': webp('Tulmulla village scene'),
  'dal-lake': svg('Illustration of Dal Lake with a shikara'),
  'dal-lake-2': svg('Illustration of Dal Lake at sunrise'),
  'dal-lake-3': svg('Illustration of lotus flowers on Dal Lake'),
  'wular-lake': svg('Illustration of Wular Lake'),
  'wular-lake-2': svg('Illustration of Wular Lake and mountains'),
  'wular-lake-3': svg('Illustration of a boat on Wular Lake'),
  manasbal: svg('Illustration of Manasbal Lake'),
  'manasbal-2': svg('Illustration of lotus flowers at Manasbal'),
  'manasbal-3': svg('Illustration of Manasbal Lake at sunset'),
  dachigam: svg('Illustration of Dachigam forest'),
  'dachigam-2': svg('Illustration of pine trees in Dachigam'),
  'dachigam-3': svg('Illustration of a Dachigam meadow'),
  sonamarg: svg('Illustration of Sonamarg meadows and snowy peaks'),
  'sonamarg-2': svg('Illustration of snowy mountains near Sonamarg'),
  'sonamarg-3': svg('Illustration of a Sonamarg valley'),
  pahalgam: svg('Illustration of Pahalgam valley'),
  'pahalgam-2': svg('Illustration of meadows in Pahalgam'),
  'pahalgam-3': svg('Illustration of pine trees in Pahalgam'),
};

export const photoSrc = (key) => `/img/${photos[key].file(key)}`;

export const places = [
  {
    name: 'Gulmarg', area: 'Baramulla', photos: ['gulmarg', 'strawberry', 'drung'], near: 'Strawberry Valley · Drung Waterfall',
    description: 'Start in Gulmarg’s open meadows, then explore a quieter valley and a waterfall near Tangmarg.',
    stops: [
      { name: 'Strawberry Valley', photos: ['strawberry', 'strawberry-2'], description: 'A meadow ringed by pines near Gulmarg. Look for wildflowers and notice how the landscape changes with the seasons.', map: 'Strawberry Valley Gulmarg Kashmir' },
      { name: 'Drung Waterfall', photos: ['drung', 'drung-2'], description: 'A waterfall near Tangmarg that can form curtains of ice in winter. Watch from a safe spot and check conditions before visiting.', map: 'Drung Waterfall Tangmarg Kashmir' },
    ],
  },
  {
    name: 'Gurez Valley', area: 'Bandipora', photos: ['gurez', 'kishanganga', 'gurez-2'], near: 'Kishanganga River',
    description: 'Mountain slopes and riverside villages make up this valley in northern Kashmir. The Kishanganga flows through it.',
    stops: [{ name: 'Kishanganga River', photos: ['kishanganga', 'kishanganga-2'], description: 'Look for the bends of the Kishanganga near Dawar and the mountains rising over the valley. Keep back from the river’s edge.', map: 'Kishanganga River Dawar Gurez Kashmir' }],
  },
  {
    name: 'Lolab Valley', area: 'Kupwara', photos: ['lolab', 'lolab-2', 'lolab-3'], near: 'Fields, orchards & villages',
    description: 'This green valley in Kupwara is a good place to notice how farmland, orchards, and forests meet.',
    stops: [{ name: 'Sogam and the Lolab countryside', photos: ['lolab', 'lolab-2', 'lolab-3'], description: 'Look for village paths, orchards, and cultivated fields nestled under the wooded slopes.', map: 'Lolab Valley Sogam Kupwara' }],
  },
  {
    name: 'Bangus Valley', area: 'Kupwara', photos: ['bangus', 'bangus-2', 'bangus-3'], near: 'Bungus meadows',
    description: 'A high landscape of open meadows and surrounding woodland, also spelled Bungus.',
    stops: [{ name: 'Bangus meadows', photos: ['bangus', 'bangus-2', 'bangus-3'], description: 'Look for streams and broad, grassy slopes. Ask a trusted adult to check local access and weather before setting out.', map: 'Bangus Valley Kupwara Kashmir' }],
  },
  {
    name: 'Harwan', area: 'Srinagar foothills', photos: ['harwan', 'harwan-2', 'harwan-3'], near: 'Harwan Garden',
    description: 'A green corner at the foot of the mountains, not far from Dachigam National Park.',
    stops: [{ name: 'Harwan Garden', photos: ['harwan', 'harwan-2', 'harwan-3'], description: 'Follow the garden paths past flowerbeds and trees. Can you spot the mountains beyond the garden?', map: 'Harwan Garden Srinagar' }],
  },
  {
    name: 'Burzahom', area: 'Near Srinagar', photos: ['burzahom', 'burzahom-2', 'burzahom-3'], near: 'Burzahom archaeological site',
    description: 'An ancient settlement that offers clues to early life in Kashmir.',
    stops: [{ name: 'Burzahom archaeological site', photos: ['burzahom', 'burzahom-2', 'burzahom-3'], contain: true, description: 'The site is known for pit dwellings and archaeological finds. People lived here thousands of years ago. What would you ask them?', map: 'Burzahom archaeological site Srinagar' }],
  },
  {
    name: 'Shalimar', area: 'By Dal Lake', photos: ['shalimar', 'shalimar-2', 'shalimar-3'], near: 'Shalimar Bagh',
    description: 'A Mughal garden near Dal Lake, with terraces, water channels, and chinar trees.',
    stops: [{ name: 'Shalimar Bagh', photos: ['shalimar', 'shalimar-2', 'shalimar-3'], description: 'Follow the central water channel through the garden and look for how the pavilions frame the view.', map: 'Shalimar Bagh Srinagar' }],
  },
  {
    name: 'Ganderbal', area: 'Sind Valley', photos: ['ganderbal', 'ganderbal-2', 'ganderbal-3'], near: 'Tulmulla · Kheer Bhawani',
    description: 'Explore beyond Srinagar and learn about a place of worship in Tulmulla village.',
    stops: [{ name: 'Kheer Bhawani, Tulmulla', photos: ['ganderbal', 'ganderbal-2', 'ganderbal-3'], description: 'The temple sits around a sacred spring. Follow local guidance and respect worshippers and photography rules.', map: 'Kheer Bhawani Temple Tulmulla Ganderbal' }],
  },
  {
    name: 'Dal Lake', area: 'Srinagar', photos: ['dal-lake', 'dal-lake-2', 'dal-lake-3'], near: 'Shikaras · Floating gardens',
    description: 'Srinagar’s famous lake, where shikara boats glide past houseboats, lotus flowers, and floating vegetable gardens.',
    stops: [{ name: 'A shikara ride on Dal Lake', photos: ['dal-lake', 'dal-lake-2', 'dal-lake-3'], description: 'Sit quietly in a shikara and watch the lake life around you: boats, birds, and gardens that float on the water. Always wear a life jacket.', map: 'Dal Lake Srinagar' }],
  },
  {
    name: 'Wular Lake', area: 'Bandipora', photos: ['wular-lake', 'wular-lake-2', 'wular-lake-3'], near: 'One of Asia’s largest freshwater lakes',
    description: 'A very wide lake in Bandipora fed by the Jhelum river, with mountains rising on its far shore.',
    stops: [{ name: 'Wular Lake shore', photos: ['wular-lake', 'wular-lake-2', 'wular-lake-3'], description: 'Look for water birds and fishing boats, and notice how big the lake feels. Weather can change fast, so stay on the shore with your grown-up.', map: 'Wular Lake Bandipora' }],
  },
  {
    name: 'Manasbal Lake', area: 'Ganderbal', photos: ['manasbal', 'manasbal-2', 'manasbal-3'], near: 'Lotus flowers',
    description: 'A calm, deep lake in Ganderbal that is covered with lotus flowers in summer.',
    stops: [{ name: 'Lotus blooms at Manasbal', photos: ['manasbal', 'manasbal-2', 'manasbal-3'], description: 'In summer, the lotus leaves spread across the water. Can you count how many flowers you can spot from the shore?', map: 'Manasbal Lake Ganderbal' }],
  },
  {
    name: 'Dachigam National Park', area: 'Srinagar', photos: ['dachigam', 'dachigam-2', 'dachigam-3'], near: 'Home of the hangul',
    description: 'A protected forest near Srinagar and home of the hangul, the Kashmir stag, along with many other animals and birds.',
    stops: [{ name: 'Forest and meadow trails', photos: ['dachigam', 'dachigam-2', 'dachigam-3'], description: 'Visits are only with permission, so ask a grown-up to check the rules. Wild animals need quiet and space, so watch from far away.', map: 'Dachigam National Park Srinagar' }],
  },
  {
    name: 'Sonamarg', area: 'Ganderbal', photos: ['sonamarg', 'sonamarg-2', 'sonamarg-3'], near: 'Meadow of gold',
    description: 'A high meadow in the Sind Valley, with snowy peaks all around. Its name means “meadow of gold”.',
    stops: [{ name: 'Sonamarg meadows', photos: ['sonamarg', 'sonamarg-2', 'sonamarg-3'], description: 'Look up at the snowy peaks and down at the Sind river. It is cold up here, so pack warm clothes even in summer.', map: 'Sonamarg Ganderbal' }],
  },
  {
    name: 'Pahalgam', area: 'Anantnag', photos: ['pahalgam', 'pahalgam-2', 'pahalgam-3'], near: 'Lidder River · Pine forests',
    description: 'A green valley beside the Lidder river, surrounded by pine forests and meadows.',
    stops: [{ name: 'Lidder River banks', photos: ['pahalgam', 'pahalgam-2', 'pahalgam-3'], description: 'Listen to the river and look for pine trees and meadow flowers. Keep back from the water, because the current can be strong.', map: 'Lidder River Pahalgam' }],
  },
];
