// Neon Ramen Rush — rules and state, no drawing and no browser in it.
// Orders arrive on the board, the chef picks ingredients from the counter,
// chops / fries / grills them at stations, assembles a dish on the plate and
// serves the matching order before its patience runs out.
// step() advances one fixed step and returns what happened as bit flags.
import {
  CHOP, COOK, GRILL, DISHES, DISH_BY_ID, FIELD, HEARTS,
  LEVELS, LEVEL_AT, BURN_SECONDS, VIP_CHANCE, SHIFT_SECONDS,
  CHOP_SECONDS, COOK_SECONDS, GRILL_SECONDS, ITEM_LABEL,
} from './config.js';

export const EVENT_SERVED = 1;
export const EVENT_EXPIRED = 2;
export const EVENT_OVER = 4;
export const EVENT_WRONG = 8;
export const EVENT_COOKED = 16;
export const EVENT_CHOPPED = 32;
export const EVENT_PLATED = 64;
export const EVENT_LEVELUP = 128;
export const EVENT_BURNT = 256;

export const STATION_CHOP = 'chop';
export const STATION_WOK = 'wok';
export const STATION_GRILL = 'grill';
export const STATION_PLATE = 'plate';
export const STATION_TRASH = 'trash';

// Rectangles (logical 1280x720) the renderer draws and input hit-tests.
export const STATIONS = {
  [STATION_CHOP]: { x: 330, y: 300, w: 180, h: 120, label: 'TALENAN', sub: 'iris' },
  [STATION_WOK]: { x: 530, y: 300, w: 180, h: 120, label: 'PANCI', sub: 'rebus · goreng' },
  [STATION_GRILL]: { x: 730, y: 300, w: 180, h: 120, label: 'GRILL', sub: 'yakitori' },
  [STATION_PLATE]: { x: 930, y: 300, w: 180, h: 120, label: 'PIRING', sub: 'rakit hidangan' },
  [STATION_TRASH]: { x: 1130, y: 300, w: 110, h: 120, label: 'SAMPAH', sub: 'buang' },
};

export const ING_BIN = { x: 16, y: 592, w: 92, h: 112, gap: 4 };
export const ORDER_BOARD = { x: 16, y: 76, w: 296, h: 224 };
/** Order ticket geometry inside the board: first ticket offset, row step, height. */
export const ORDER_TICKET = { dy: 36, step: 46, h: 42 };
export const PLATE_SLOT = { x: 930, y: 440, w: 310, h: 90 };

/** Level from elapsed seconds: 1 before 60 s, 2 before 120 s, 3 after. */
export function levelFor(elapsed) {
  if (elapsed >= LEVEL_AT[2]) return 3;
  if (elapsed >= LEVEL_AT[1]) return 2;
  return 1;
}

let orderSeq = 0;

function pickDish(random, level) {
  const pool = LEVELS[level - 1].dishes;
  return DISH_BY_ID[pool[Math.floor(random() * pool.length)]];
}

export function createWorld(random) {
  const state = {
    score: 0,
    coins: 0,
    served: 0,
    wrong: 0,
    hearts: HEARTS,
    combo: 0,
    bestCombo: 0,
    timeLeft: SHIFT_SECONDS,
    elapsed: 0,
    spawnTimer: 4,
    orders: [],
    hand: null, // ingredient/item id in the chef's hand
    plate: [], // item ids on the plate
    plateReady: null, // dish id when the plate matches a recipe
    station: { kind: null, progress: 0, total: 0, input: null, result: null },
    chefX: 640,
    chefTargetX: 640,
    floaters: [], // {x,y,text,color,life}
    over: false,
    overReason: '',
    muted: false,
    level: 1,
    levelName: LEVELS[0].name,
    levelBanner: 0,
    levelReached: 1,
    vipServed: 0,
    burnt: 0,
    servedDishes: [],
  };

  function addFloater(x, y, text, color) {
    state.floaters.push({ x, y, text, color, life: 1.4 });
    if (state.floaters.length > 8) state.floaters.shift();
  }

  function spawnOrder() {
    const lv = LEVELS[state.level - 1];
    if (state.orders.length >= lv.maxOrders) return;
    const dish = pickDish(random, state.level);
    const vip = state.level === 3 && random() < VIP_CHANCE;
    const patience = lv.patience * (vip ? 0.7 : 1);
    orderSeq += 1;
    state.orders.push({
      id: orderSeq,
      dish: dish.id,
      name: dish.name,
      needs: [...dish.needs],
      patience,
      maxPatience: patience,
      face: Math.floor(random() * 4),
      vip,
    });
  }

  function reset() {
    state.score = 0;
    state.coins = 0;
    state.served = 0;
    state.wrong = 0;
    state.hearts = HEARTS;
    state.combo = 0;
    state.bestCombo = 0;
    state.timeLeft = SHIFT_SECONDS;
    state.elapsed = 0;
    state.spawnTimer = 4;
    state.orders = [];
    state.hand = null;
    state.plate = [];
    state.plateReady = null;
    state.station = { kind: null, progress: 0, total: 0, input: null, result: null, doneAt: null, burnt: false };
    state.floaters = [];
    state.over = false;
    state.overReason = '';
    state.level = 1;
    state.levelName = LEVELS[0].name;
    state.levelBanner = 0;
    state.levelReached = 1;
    state.vipServed = 0;
    state.burnt = 0;
    state.servedDishes = [];
    spawnOrder();
    spawnOrder();
  }

  function checkPlate() {
    state.plateReady = null;
    for (const dish of DISHES) {
      if (dish.needs.length !== state.plate.length) continue;
      const sortedPlate = [...state.plate].sort();
      const sortedNeeds = [...dish.needs].sort();
      if (sortedPlate.every((v, i) => v === sortedNeeds[i])) {
        state.plateReady = dish.id;
        return;
      }
    }
  }

  /** Pick an ingredient from the counter into the hand. */
  function pickIngredient(id) {
    if (state.over) return 0;
    if (state.hand !== null) return EVENT_WRONG;
    if (state.station.kind !== null) return EVENT_WRONG;
    state.hand = id;
    return 0;
  }

  /** Use a station with whatever is in the hand. Returns event flags. */
  function useStation(kind) {
    if (state.over) return 0;
    if (state.station.kind !== null) return EVENT_WRONG; // busy: collect first
    const hand = state.hand;
    if (kind === STATION_TRASH) {
      state.hand = null;
      state.plate = [];
      state.plateReady = null;
      return 0;
    }
    if (kind === STATION_PLATE) {
      if (hand === null) return EVENT_WRONG;
      if (state.plate.length >= 3) return EVENT_WRONG;
      state.plate.push(hand);
      state.hand = null;
      checkPlate();
      return EVENT_PLATED;
    }
    if (hand === null) return EVENT_WRONG;
    if (kind === STATION_CHOP) {
      const result = CHOP[hand];
      if (!result) return EVENT_WRONG;
      state.station = { kind, progress: 0, total: CHOP_SECONDS, input: hand, result, doneAt: null, burnt: false };
      state.hand = null;
      return 0;
    }
    if (kind === STATION_WOK) {
      const result = COOK[hand];
      if (!result) return EVENT_WRONG;
      state.station = { kind, progress: 0, total: COOK_SECONDS, input: hand, result, doneAt: null, burnt: false };
      state.hand = null;
      return 0;
    }
    if (kind === STATION_GRILL) {
      const result = GRILL[hand];
      if (!result) return EVENT_WRONG;
      state.station = { kind, progress: 0, total: GRILL_SECONDS, input: hand, result, doneAt: null, burnt: false };
      state.hand = null;
      return 0;
    }
    return EVENT_WRONG;
  }

  /** Collect a finished station job into the hand. */
  function collectStation() {
    if (state.station.kind === null) return 0;
    if (state.station.progress < state.station.total) return EVENT_WRONG;
    if (state.hand !== null) return EVENT_WRONG;
    state.hand = state.station.result;
    const ev = state.station.kind === STATION_CHOP ? EVENT_CHOPPED : EVENT_COOKED;
    state.station = { kind: null, progress: 0, total: 0, input: null, result: null, doneAt: null, burnt: false };
    return ev;
  }

  /** Serve the ready plate to an order ticket. */
  function serveOrder(orderId) {
    if (state.over) return 0;
    if (state.plateReady === null) return EVENT_WRONG;
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return EVENT_WRONG;
    if (order.dish !== state.plateReady) {
      state.wrong += 1;
      state.combo = 0;
      return EVENT_WRONG;
    }
    const dish = DISH_BY_ID[order.dish];
    const timeBonus = Math.round((order.patience / order.maxPatience) * 500);
    const comboBonus = state.combo * 100;
    const base = order.vip ? Math.round(dish.price * 1.5) : dish.price;
    const earned = base + timeBonus + comboBonus;
    state.score += earned;
    state.coins += base;
    state.served += 1;
    if (order.vip) state.vipServed += 1;
    if (!state.servedDishes.includes(order.dish)) state.servedDishes.push(order.dish);
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    addFloater(640, 280, `+¥${earned.toLocaleString('en-US')}${order.vip ? ' ★VIP' : ''}`, '#4e9b47');
    state.orders = state.orders.filter((o) => o.id !== orderId);
    state.plate = [];
    state.plateReady = null;
    return EVENT_SERVED;
  }

  function step(dt) {
    let events = 0;
    if (state.over) return events;
    state.elapsed += dt;
    state.timeLeft = Math.max(0, SHIFT_SECONDS - state.elapsed);

    // Level up: pressure grows for real at 60 s and 120 s.
    const lv = levelFor(state.elapsed);
    if (lv > state.level) {
      state.level = lv;
      state.levelName = LEVELS[lv - 1].name;
      state.levelReached = Math.max(state.levelReached, lv);
      state.levelBanner = 3;
      addFloater(640, 200, `LEVEL ${lv} — ${state.levelName}!`, '#f2c94c');
      events |= EVENT_LEVELUP;
    }
    if (state.levelBanner > 0) state.levelBanner = Math.max(0, state.levelBanner - dt);

    // Chef walks toward the busy station.
    const target = state.station.kind ? STATIONS[state.station.kind].x + 90 : 640;
    state.chefTargetX = target;
    state.chefX += (target - state.chefX) * Math.min(1, dt * 6);

    // Station progress; a finished wok/grill job burns in Rush Hour.
    if (state.station.kind !== null) {
      state.station.progress += dt;
      if (state.station.progress >= state.station.total) {
        state.station.progress = state.station.total;
        if (state.station.doneAt === null) state.station.doneAt = state.elapsed;
        if (!state.station.burnt && state.level === 3
          && (state.station.kind === STATION_WOK || state.station.kind === STATION_GRILL)
          && state.elapsed - state.station.doneAt > BURN_SECONDS) {
          state.station.burnt = true;
          state.station.result = 'gosong';
          state.burnt += 1;
          addFloater(640, 250, 'GOSONG! Cepat buang ke sampah!', '#c0392b');
          events |= EVENT_BURNT;
        }
      }
    }

    // Orders spawn and lose patience (rates follow the current level).
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnOrder();
      state.spawnTimer = LEVELS[state.level - 1].spawn;
    }
    for (const order of state.orders) order.patience -= dt;
    const expired = state.orders.filter((o) => o.patience <= 0);
    if (expired.length > 0) {
      state.orders = state.orders.filter((o) => o.patience > 0);
      state.hearts -= expired.length;
      state.combo = 0;
      events |= EVENT_EXPIRED;
      if (state.hearts <= 0) {
        state.hearts = 0;
        state.over = true;
        state.overReason = 'Pelanggan kecewa semua — kedai tutup!';
        events |= EVENT_OVER;
      }
    }

    // Floaters fade.
    for (const f of state.floaters) f.life -= dt;
    state.floaters = state.floaters.filter((f) => f.life > 0);

    if (!state.over && state.timeLeft <= 0) {
      state.over = true;
      state.overReason = 'Shift selesai! Kedai tutup dengan bangga.';
      events |= EVENT_OVER;
    }
    return events;
  }

  reset();
  return {
    state, reset, step, pickIngredient, useStation, collectStation, serveOrder,
    dishName: (id) => DISH_BY_ID[id]?.name ?? id,
    itemLabel: (id) => ITEM_LABEL[id] ?? id,
  };
}
