// Neon Ramen Rush — tuning numbers and colours in one place.
// A neon Tokyo ramen shop at night. Playfield is a fixed 1280x720 logical
// area for the HUD; the 3D scene is rendered behind it.
export const FIELD = { width: 1280, height: 720 };

/** Fixed simulation step: 60 updates a second whatever the display rate. */
export const STEP = 1 / 60;

/** One full shift, in seconds. */
export const SHIFT_SECONDS = 180;

export const HEARTS = 3;
export const BURN_SECONDS = 4;
export const VIP_CHANCE = 0.25;

/** Three levels inside one 180 s shift. Pressure grows for real: patience
 *  shrinks, orders spawn faster, more tickets fit the board, new dishes
 *  unlock, VIPs arrive in Neon Rush — and in Neon Rush a panci/grill job left
 *  more than BURN_SECONDS after it finishes burns and must be trashed. */
export const LEVEL_AT = [0, 60, 120];
export const LEVELS = [
  {
    name: 'BUKA KEDAI', patience: 45, spawn: 11, maxOrders: 2,
    dishes: ['ramen-shoyu', 'ramen-tonkotsu', 'sushi-salmon', 'sushi-tuna'], unlock: [],
  },
  {
    name: 'JAM MAKAN SIANG', patience: 35, spawn: 8, maxOrders: 3,
    dishes: ['ramen-shoyu', 'ramen-tonkotsu', 'sushi-salmon', 'sushi-tuna', 'gyoza', 'tempura-ebi', 'tonkatsu', 'miso-soup'],
    unlock: ['gyoza', 'tempura-ebi', 'tonkatsu', 'miso-soup'],
  },
  {
    name: 'NEON RUSH', patience: 25, spawn: 6, maxOrders: 4,
    dishes: ['ramen-shoyu', 'ramen-tonkotsu', 'sushi-salmon', 'sushi-tuna', 'gyoza', 'tempura-ebi', 'tonkatsu', 'miso-soup', 'takoyaki', 'yakitori', 'matcha-latte', 'mochi'],
    unlock: ['takoyaki', 'yakitori', 'matcha-latte', 'mochi'],
  },
];

// --- Ingredients -------------------------------------------------------------
// 13 bins on the counter (keys 1-9, 0, Q, E, R).
export const CHOP_SECONDS = 1.6;
export const COOK_SECONDS = 3.0;
export const GRILL_SECONDS = 3.2;

export const INGREDIENTS = [
  { id: 'mie', label: 'Mie', color: '#f2c94c', shape: 'nest' },
  { id: 'kaldu', label: 'Kaldu', color: '#c98a3d', shape: 'broth' },
  { id: 'telur', label: 'Telur', color: '#fdf3d0', shape: 'egg' },
  { id: 'nori', label: 'Nori', color: '#1d3a24', shape: 'sheet' },
  { id: 'salmon', label: 'Salmon', color: '#f28a5a', shape: 'fillet' },
  { id: 'tuna', label: 'Tuna', color: '#c94a5a', shape: 'fillet' },
  { id: 'nasi', label: 'Nasi', color: '#f5efe0', shape: 'bowl' },
  { id: 'udang', label: 'Udang', color: '#f2a594', shape: 'shrimp' },
  { id: 'ayam', label: 'Ayam', color: '#e88a7a', shape: 'drum' },
  { id: 'gurita', label: 'Gurita', color: '#b08ac9', shape: 'octopus' },
  { id: 'saus', label: 'Saus', color: '#5a3220', shape: 'bottle' },
  { id: 'matcha', label: 'Matcha', color: '#5a8a3d', shape: 'powder' },
  { id: 'es', label: 'Es', color: '#aee6f5', shape: 'cube' },
];

/** Keyboard label per bin: 1-9, then 0, Q, E, R. */
export const KEY_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'E', 'R'];

export const ING_BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));

// Chopping: raw -> sliced. Cooking (panci): raw -> boiled/fried. Grilling.
export const CHOP = { salmon: 'salmon-iris', tuna: 'tuna-iris', ayam: 'ayam-potong', gurita: 'gurita-potong' };
export const COOK = {
  mie: 'mie-rebus', telur: 'ajitama', udang: 'tempura-ebi',
  ayam: 'ayam-katsu', 'gurita-potong': 'takoyaki',
};
export const GRILL = { 'ayam-potong': 'yakitori', ayam: 'ayam-panggang' };

export const ITEM_LABEL = {
  mie: 'Mie', kaldu: 'Kaldu', telur: 'Telur', nori: 'Nori', salmon: 'Salmon',
  tuna: 'Tuna', nasi: 'Nasi', udang: 'Udang', ayam: 'Ayam', gurita: 'Gurita',
  saus: 'Saus', matcha: 'Matcha', es: 'Es Batu',
  'salmon-iris': 'Salmon Iris', 'tuna-iris': 'Tuna Iris', 'ayam-potong': 'Ayam Potong',
  'gurita-potong': 'Gurita Potong', 'mie-rebus': 'Mie Rebus', ajitama: 'Ajitama',
  'tempura-ebi': 'Tempura Ebi', 'ayam-katsu': 'Tonkatsu', takoyaki: 'Takoyaki',
  yakitori: 'Yakitori', 'ayam-panggang': 'Ayam Panggang', gosong: 'Gosong!',
};

export const ITEM_COLOR = {
  mie: '#f2c94c', kaldu: '#c98a3d', telur: '#fdf3d0', nori: '#1d3a24',
  salmon: '#f28a5a', tuna: '#c94a5a', nasi: '#f5efe0', udang: '#f2a594',
  ayam: '#e88a7a', gurita: '#b08ac9', saus: '#5a3220', matcha: '#5a8a3d', es: '#aee6f5',
  'salmon-iris': '#f28a5a', 'tuna-iris': '#c94a5a', 'ayam-potong': '#e88a7a',
  'gurita-potong': '#b08ac9', 'mie-rebus': '#f7dc7a', ajitama: '#f7d774',
  'tempura-ebi': '#e8a83c', 'ayam-katsu': '#c98a3d', takoyaki: '#a06a2e',
  yakitori: '#8a4a1e', 'ayam-panggang': '#8a4a1e', gosong: '#1a1a1a',
};

// --- Dishes (plate recipes) ---------------------------------------------------
// 12 dishes, prices in yen: 4 from level 1, 4 unlock at level 2, 4 at level 3.
export const DISHES = [
  { id: 'ramen-shoyu', name: 'Ramen Shoyu', needs: ['mie-rebus', 'kaldu', 'ajitama'], price: 900, color: '#c98a3d', icon: 'bowl' },
  { id: 'ramen-tonkotsu', name: 'Ramen Tonkotsu', needs: ['mie-rebus', 'kaldu', 'nori'], price: 1100, color: '#e8dcc0', icon: 'bowl' },
  { id: 'sushi-salmon', name: 'Sushi Salmon', needs: ['nasi', 'salmon-iris', 'nori'], price: 1200, color: '#f28a5a', icon: 'sushi' },
  { id: 'sushi-tuna', name: 'Sushi Tuna', needs: ['nasi', 'tuna-iris', 'nori'], price: 1300, color: '#c94a5a', icon: 'sushi' },
  { id: 'gyoza', name: 'Gyoza', needs: ['ayam-potong', 'saus'], price: 800, color: '#e8c89a', icon: 'fold' },
  { id: 'tempura-ebi', name: 'Tempura Ebi', needs: ['tempura-ebi', 'saus'], price: 1000, color: '#e8a83c', icon: 'shrimp' },
  { id: 'tonkatsu', name: 'Tonkatsu', needs: ['ayam-katsu', 'nasi', 'saus'], price: 1200, color: '#c98a3d', icon: 'cutlet' },
  { id: 'miso-soup', name: 'Miso Soup', needs: ['kaldu', 'nori'], price: 600, color: '#a06a2e', icon: 'broth' },
  { id: 'takoyaki', name: 'Takoyaki', needs: ['takoyaki', 'saus'], price: 900, color: '#a06a2e', icon: 'balls' },
  { id: 'yakitori', name: 'Yakitori', needs: ['yakitori', 'saus'], price: 800, color: '#8a4a1e', icon: 'skewer' },
  { id: 'matcha-latte', name: 'Matcha Latte', needs: ['matcha', 'es'], price: 700, color: '#5a8a3d', icon: 'cup' },
  { id: 'mochi', name: 'Mochi', needs: ['nasi', 'matcha'], price: 800, color: '#f5efe0', icon: 'mochi' },
];

export const DISH_BY_ID = Object.fromEntries(DISHES.map((d) => [d.id, d]));

export const PALETTE = {
  backdrop: '#0d0a1a',
  wall: '#1a1430',
  counter: '#2a1e3a',
  counterTop: '#3a2a4e',
  board: '#12081f',
  boardPaper: '#fff8e6',
  panel: '#fff8e6',
  ink: '#1a1030',
  muted: '#8a7aa8',
  accent: '#ff2e88',
  gold: '#f2c94c',
  green: '#4e9b47',
  red: '#ff3b5c',
  timer: '#ff3b5c',
  hand: '#ffe9a8',
  neonPink: '#ff2e88',
  neonCyan: '#22d3ee',
  neonGold: '#f2c94c',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Best score between visits (this browser only). */
export const BEST_KEY = 'neon-ramen.best';
