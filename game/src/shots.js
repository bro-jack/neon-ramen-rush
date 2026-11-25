// Screenshot scenes behind ?shot=start|play|serve|end.
// Each stages a real game state (orders, plate, station progress, timer)
// through the world's own reset/serve path, so the frame is what a real
// game looks like at that moment, and the same seed always gives the same frame.
import { STEP } from './config.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

function setOrders(world, specs) {
  world.state.orders = specs.map((s, i) => ({
    id: i + 1,
    dish: s.dish,
    name: s.name,
    needs: [...s.needs],
    patience: s.patience,
    maxPatience: s.maxPatience ?? s.patience,
    face: s.face,
    vip: !!s.vip,
  }));
}

/** Stage `world` to the named scene and return the screen to draw and best. */
export function stageShot(name, world) {
  const s = world.state;
  if (name === 'play') {
    // Neon Rush (level 3): 4 orders incl. a VIP, a new dish mid-assembly.
    world.reset();
    s.level = 3;
    s.levelName = 'NEON RUSH';
    s.levelReached = 3;
    s.timeLeft = 50;
    s.elapsed = 130;
    s.score = 5200;
    s.coins = 28400;
    s.combo = 3;
    s.served = 9;
    setOrders(world, [
      { dish: 'takoyaki', name: 'Takoyaki', needs: ['takoyaki', 'saus'], patience: 18, maxPatience: 25, face: 1, vip: true },
      { dish: 'ramen-tonkotsu', name: 'Ramen Tonkotsu', needs: ['mie-rebus', 'kaldu', 'nori'], patience: 22, maxPatience: 25, face: 2 },
      { dish: 'yakitori', name: 'Yakitori', needs: ['yakitori', 'saus'], patience: 15, maxPatience: 25, face: 0 },
      { dish: 'mochi', name: 'Mochi', needs: ['nasi', 'matcha'], patience: 20, maxPatience: 25, face: 3 },
    ]);
    // Takoyaki mid-assembly: panci frying gurita-potong, plate holds takoyaki.
    s.station = { kind: 'wok', progress: 1.9, total: 3.0, input: 'gurita-potong', result: 'takoyaki', doneAt: null, burnt: false };
    s.plate = ['takoyaki'];
    s.hand = 'saus';
    s.chefX = 690;
    // A just-earned coin floater: the kitchen feels alive, mid-rush.
    s.floaters = [{ text: '+¥1.350', x: 700, y: 290, life: 0.9, color: '#7ee787' }];
    return { screen: SCREEN_PLAY, best: 5200 };
  }
  if (name === 'serve') {
    // Jam Makan Siang (level 2): a new dish (Tonkatsu) complete and ready.
    world.reset();
    s.level = 2;
    s.levelName = 'JAM MAKAN SIANG';
    s.levelReached = 2;
    s.timeLeft = 96;
    s.elapsed = 84;
    s.score = 3200;
    s.coins = 18100;
    s.combo = 4;
    s.served = 6;
    setOrders(world, [
      { dish: 'tonkatsu', name: 'Tonkatsu', needs: ['ayam-katsu', 'nasi', 'saus'], patience: 30, maxPatience: 35, face: 1 },
      { dish: 'ramen-shoyu', name: 'Ramen Shoyu', needs: ['mie-rebus', 'kaldu', 'ajitama'], patience: 18, maxPatience: 35, face: 3 },
    ]);
    // Plate complete and ready: the matching order glows for serving.
    s.plate = ['ayam-katsu', 'nasi', 'saus'];
    s.plateReady = 'tonkatsu';
    s.hand = null;
    s.chefX = 690;
    s.floaters = [{ text: '+¥1.200', x: 1020, y: 290, life: 0.95, color: '#7ee787' }];
    return { screen: SCREEN_PLAY, best: 3200 };
  }
  if (name === 'end') {
    world.reset();
    s.level = 3;
    s.levelName = 'NEON RUSH';
    s.levelReached = 3;
    s.timeLeft = 0;
    s.elapsed = 180;
    s.score = 14200;
    s.coins = 31200;
    s.served = 18;
    s.bestCombo = 7;
    s.combo = 0;
    s.hearts = 2;
    s.vipServed = 2;
    s.burnt = 1;
    s.servedDishes = ['ramen-shoyu', 'ramen-tonkotsu', 'sushi-salmon', 'takoyaki', 'yakitori', 'matcha-latte'];
    s.orders = [];
    s.over = true;
    s.overReason = 'Shift selesai! Kedai tutup dengan bangga.';
    return { screen: SCREEN_OVER, best: 14200 };
  }
  // start (default): title over a live kitchen with two orders waiting.
  world.reset();
  s.timeLeft = 180;
  setOrders(world, [
    { dish: 'ramen-shoyu', name: 'Ramen Shoyu', needs: ['mie-rebus', 'kaldu', 'ajitama'], patience: 41, face: 0 },
    { dish: 'sushi-salmon', name: 'Sushi Salmon', needs: ['nasi', 'salmon-iris', 'nori'], patience: 35, face: 2 },
  ]);
  s.chefX = 690;
  return { screen: SCREEN_TITLE, best: 0 };
}

export { STEP };
