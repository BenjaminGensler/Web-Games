// =====================================================================
// Play the Market: a playable test table. You play against computer
// traders using the rules as written, with switches for the fixes the
// simulator suggested. Everything runs in this page; nothing is saved.
// =====================================================================

// ---------------------------------------------------------- game data
const SECTORS = {
  Tech: ['CYBER', 'AI', 'DATA', 'ROBO', 'DEV'],
  Food: ['GRAIN', 'DAIRY', 'SWEET', 'SNACK', 'GROW'],
  Health: ['MED', 'BIOT', 'SCAN', 'VACC', 'MIND'],
  Materials: ['ROCK', 'IRON', 'GOLD', 'TREE', 'CHEM'],
  Energy: ['CRUDE', 'PIPE', 'SOLR', 'WIND', 'GRID'],
  Industrial: ['SHIP', 'AERO', 'TRUK', 'FACT', 'WARE'],
};
const ROLL_ORDER = ['Tech', 'Food', 'Health', 'Materials', 'Energy', 'Industrial']; // die 1-6
const START = {
  CYBER: 85, AI: 240, DATA: 120, ROBO: 8, DEV: 45,
  GRAIN: 12, DAIRY: 25, SWEET: 60, SNACK: 35, GROW: 3,
  MED: 110, BIOT: 6, SCAN: 150, VACC: 40, MIND: 18,
  ROCK: 160, IRON: 180, GOLD: 300, TREE: 140, CHEM: 220,
  CRUDE: 90, PIPE: 55, SOLR: 15, WIND: 22, GRID: 75,
  SHIP: 65, AERO: 250, TRUK: 30, FACT: 100, WARE: 4,
};
const TICKERS = Object.keys(START);
const SECTOR_OF = {};
for (const s in SECTORS) for (const t of SECTORS[s]) SECTOR_OF[t] = s;

// Fixed-move Market cards, as written in the rulebook
const FIXED_AS_WRITTEN = [
  ['AI Gold Rush', 'Sector News', { AI: 15, DATA: 10, ROBO: 5 }],
  ['Massive Data Breach', 'Sector News', { DATA: -15, DEV: -5, CYBER: 10 }],
  ['Bumper Harvest', 'Sector News', { GRAIN: -10, SNACK: 10, SWEET: 5 }],
  ['Contamination Recall', 'Sector News', { DAIRY: -15, SNACK: -10, GROW: 10 }],
  ['Outbreak Fears', 'Sector News', { VACC: 15, MED: 5, MIND: 5 }],
  ['Drug Trial Fails', 'Sector News', { BIOT: -20, SCAN: -5 }],
  ['Housing Boom', 'Sector News', { TREE: 10, ROCK: 10, IRON: 5 }],
  ['Mine Collapse', 'Sector News', { IRON: -15, ROCK: -10, GOLD: 5 }],
  ['Oil Shock', 'Sector News', { CRUDE: 15, PIPE: 10, SOLR: 5 }],
  ['Green Mandate', 'Sector News', { SOLR: 10, WIND: 10, CRUDE: -15 }],
  ['Port Strike', 'Sector News', { SHIP: -15, WARE: -5, TRUK: 10 }],
  ['Defense Contract', 'Sector News', { AERO: 15, FACT: 5 }],
  ['Pandemic Scare', 'Cross-Sector', { VACC: 15, BIOT: 10, AERO: -15, SHIP: -10 }],
  ['Chip Shortage', 'Cross-Sector', { AI: -10, ROBO: -10, FACT: -5, IRON: 5 }],
  ['Blackout', 'Cross-Sector', { GRID: -15, DATA: -10, SOLR: 10 }],
  ['Trade War', 'Cross-Sector', { SHIP: -10, GRAIN: -10, IRON: 10 }],
  ['Automation Wave', 'Cross-Sector', { ROBO: 15, WARE: 10, TRUK: -10 }],
  ['Flight to Safety', 'Cross-Sector', { GOLD: 15, AI: -10, AERO: -5 }],
  ['Fertilizer Shortage', 'Cross-Sector', { CHEM: 15, GRAIN: -10, GROW: -5 }],
  ['Hurricane Season', 'Cross-Sector', { PIPE: -15, TREE: 10, CRUDE: 5 }],
  ['Sugar Tax', 'Cross-Sector', { SWEET: -15, GROW: 10, MED: 5 }],
  ['Burnout Nation', 'Cross-Sector', { MIND: 15, DEV: -5 }],
];
// Proposed rebalance from the simulator: every stock gets good and bad news
const FIXED_BALANCED = [
  ['AI Gold Rush', 'Sector News', { AI: 15, DATA: 10, DEV: 5 }],
  ['Massive Data Breach', 'Sector News', { DATA: -15, DEV: -5, CYBER: 10 }],
  ['Bumper Harvest', 'Sector News', { GRAIN: -10, SNACK: 10, SWEET: 5, DAIRY: 10 }],
  ['Contamination Recall', 'Sector News', { DAIRY: -15, SNACK: -10, GROW: 10 }],
  ['Outbreak Fears', 'Sector News', { VACC: 15, MED: 5, MIND: 5 }],
  ['Drug Trial Fails', 'Sector News', { BIOT: -20, VACC: -10, SCAN: -5 }],
  ['Housing Boom', 'Sector News', { TREE: 10, ROCK: 10, IRON: 5, GOLD: -10 }],
  ['Mine Collapse', 'Sector News', { IRON: -15, ROCK: -10, GOLD: 5 }],
  ['Oil Shock', 'Sector News', { CRUDE: 15, PIPE: 10, SOLR: 5 }],
  ['Green Mandate', 'Sector News', { SOLR: 10, WIND: 10, CRUDE: -15, CHEM: -10 }],
  ['Port Strike', 'Sector News', { SHIP: -15, WARE: -5, TRUK: 10 }],
  ['Defense Contract', 'Sector News', { AERO: 15, FACT: 5, GRID: 10 }],
  ['Pandemic Scare', 'Cross-Sector', { VACC: 10, BIOT: 10, AERO: -15, SHIP: 10 }],
  ['Chip Shortage', 'Cross-Sector', { AI: -10, ROBO: -10, FACT: -5, IRON: 5 }],
  ['Blackout', 'Cross-Sector', { GRID: -15, DATA: -5, SOLR: 10 }],
  ['Trade War', 'Cross-Sector', { SHIP: -10, GRAIN: -10, IRON: 10, TREE: -10 }],
  ['Automation Wave', 'Cross-Sector', { ROBO: 15, WARE: 10, TRUK: -10 }],
  ['Flight to Safety', 'Cross-Sector', { GOLD: 15, AI: -10, AERO: -5 }],
  ['Fertilizer Shortage', 'Cross-Sector', { CHEM: 15, GRAIN: 10, GROW: -5 }],
  ['Hurricane Season', 'Cross-Sector', { PIPE: -15, TREE: 10, CRUDE: 5, SOLR: -10 }],
  ['Sugar Tax', 'Cross-Sector', { SWEET: -15, GROW: 10, MED: 5 }],
  ['Burnout Nation', 'Cross-Sector', { MIND: 15, DEV: -5 }],
];

// Action cards: type, timing, copies, card text and (for Effects) cost
const ACTIONS = {
  'Breaking News': ['Reporter', 'Bell', 3, 'A stock of your choice +10%.'],
  'Hit Piece': ['Reporter', 'Bell', 3, 'A stock of your choice -10%.'],
  'Earnings Call': ['Reporter', 'Bell', 2, 'Choose a stock and roll: 1 is -15%, 2 is -5%, 3-4 is +5%, 5 is +10%, 6 is +20%.'],
  'Rumor Mill': ['Reporter', 'Bell', 2, 'Choose a stock and flip a coin: heads +15%, tails -15%.'],
  'Sector Spotlight': ['Reporter', 'Bell', 2, 'Choose a sector: its cheapest stock +10%, its priciest -5%.'],
  'Hype Cycle': ['Reporter', 'Bell', 1, 'A stock +15% now. It drops 10% when the next Pre-Market card flips.'],
  'Retraction': ['Reporter', 'Bell', 1, 'Cancel one Reporter card resolved this round and restore the price it changed.'],
  'Market Peek': ['Access', 'Instant', 4, 'Look at one face-down Market card: Live or After-Hours.'],
  'Front-Runner': ['Access', 'Instant', 2, 'Look at the Live and After-Hours cards. You may swap them.'],
  'Short Squeeze': ['Reaction', 'Bell', 2, 'A stock the Live card lowered: restore its old price, then raise it by the same percentage.'],
  'Circuit Breaker': ['Reaction', 'Bell', 1, 'Choose a sector. Restore the prices the Live card changed in it.'],
  'Momentum': ['Reaction', 'Bell', 2, 'A stock the Live card moved moves the same percentage again.'],
  'Dead Cat Bounce': ['Reaction', 'Bell', 2, 'A stock marked with a down arrow +15%.'],
  'Bubble Warning': ['Reaction', 'Bell', 2, 'A stock marked with an up arrow -15%.'],
  'Buyback': ['Reaction', 'Bell', 1, 'A stock you own gains 5% for every $250 worth you hold, up to +15%.'],
  'Put Option': ['Reaction', 'Bell', 2, 'A stock you own that the Live card lowered: the bank pays back your loss, up to $200.'],
  'Premium Buyer': ['Buy/Sell', 'Instant', 2, 'Sell up to $500 worth of one stock at 20% above board price.'],
  'Discount Broker': ['Buy/Sell', 'Instant', 2, 'Buy up to $500 worth of one stock at 20% below board price.'],
  'Dividend': ['Buy/Sell', 'Instant', 2, 'Collect 10% of the value of your shares in one stock, up to $150.'],
  'Tax Break': ['Buy/Sell', 'Instant', 2, 'Collect $20 for each sector you hold shares in.'],
  'Short Sell': ['Buy/Sell', 'Instant', 2, 'Name a stock: take the price of up to $500 worth now, pay back their new price after After-Hours.'],
  'Hostile Takeover': ['Buy/Sell', 'Bell', 1, 'Name a player and a stock. They sell you up to $300 worth at board price.'],
  'Margin Call': ['Buy/Sell', 'Bell', 2, 'Name a player. They sell $300 worth of shares to the bank at 10% below board price.'],
  'Limit Order': ['Buy/Sell', 'Bell', 1, 'Name a stock you own. If After-Hours lowers it, you sell at the price before that card.'],
  'Insider Trading': ['Effect', 'Effect', 2, 'Name a player. See their hand and face-down Bell card.', 'Lasts 2 rounds.'],
  'Media Mogul': ['Effect', 'Effect', 1, 'Your Breaking News and Hit Piece move a stock 15% instead of 10%.', 'You cannot play Access cards.'],
  'Trading Desk': ['Effect', 'Effect', 1, 'See the Live card before each first trading window.', 'You cannot play Buy/Sell cards.'],
  'Market Maker': ['Effect', 'Effect', 1, 'Once per trading window, trade up to $300 worth at 10% better than board price.', 'Pay $20 each After-Hours.'],
  'Dividend Portfolio': ['Effect', 'Effect', 1, 'Each After-Hours, collect $20 per sector where you hold $300 worth or more.', 'No Reaction cards or Short Sell.'],
  'Day Trader': ['Effect', 'Effect', 1, 'Draw 2 Action cards instead of 1 and keep one.', 'No buying more of a stock once you hold $500 of it.'],
  'Diamond Hands': ['Effect', 'Effect', 1, 'Hostile Takeover and Margin Call cannot target you.', 'Sell only one stock per trading window.'],
  'SEC Investigation': ['Effect', 'Instant', 2, 'Discard one Effect card in play. If it was Insider Trading, its owner pays $100.'],
  'Under Investigation': ['Effect', 'Effect', 2, 'Play on another player: no Buy/Sell cards until they pay $150 at After-Hours.'],
};
const TYPE = n => ACTIONS[n][0];
const TIMING = n => ACTIONS[n][1];
const PERSISTENT = new Set(['Insider Trading', 'Media Mogul', 'Trading Desk', 'Market Maker', 'Dividend Portfolio', 'Day Trader', 'Diamond Hands']);
// Order in which sharp computer traders like to play cards
const SHARP_PRIORITY = ['Trading Desk', 'Hype Cycle', 'Breaking News', 'Sector Spotlight', 'Front-Runner', 'Market Peek',
  'Insider Trading', 'Market Maker', 'Discount Broker', 'Dividend Portfolio', 'Tax Break', 'Earnings Call', 'Media Mogul',
  'SEC Investigation', 'Dividend', 'Premium Buyer', 'Short Sell', 'Under Investigation', 'Momentum', 'Short Squeeze',
  'Put Option', 'Dead Cat Bounce', 'Buyback', 'Circuit Breaker', 'Limit Order', 'Rumor Mill', 'Hit Piece',
  'Bubble Warning', 'Margin Call', 'Hostile Takeover', 'Retraction', 'Day Trader', 'Diamond Hands'];
const BOT_NAMES = ['Dana', 'Marco', 'Priya', 'Theo', 'Lena'];

// ---------------------------------------------------------- settings
const settings = {
  rivals: 3,             // computer traders
  style: 'mixed',        // casual, sharp or mixed
  rounding: 'rounded',   // players' choice in the rulebook
  cap: false,            // fix: at most 25% of net worth in one stock
  rolled: false,         // fix: Meme Stock, Flash Crash, Earnings Season pick a rolled stock
  balanced: false,       // fix: rebalanced Market deck
  hypeEnd: false,        // fix: Hype Cycle played on day 8 drops at the closing bell
};

let G = null;          // the current game
let selected = 'AI';   // stock chosen on the board for trading
let screen = 'setup';  // setup, game or results

// ---------------------------------------------------------- helpers
const rnd = () => Math.random();
const d6 = () => 1 + Math.floor(rnd() * 6);
const pick = a => a[Math.floor(rnd() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function money(x) {
  if (x === null || x === undefined) return '—';
  const neg = x < 0; x = Math.abs(x);
  const s = x < 10 || settings.rounding === 'exact' ? x.toFixed(2) : Math.round(x).toLocaleString('en-US');
  return (neg ? '-$' : '$') + s;
}
const cash = x => (x < 0 ? '-$' : '$') + Math.round(Math.abs(x)).toLocaleString('en-US');
const pct = p => (p > 0 ? '+' : '') + p + '%';
function roundPrice(x) {
  if (settings.rounding === 'exact') return Math.round(x * 100) / 100;
  if (x >= 10) return Math.floor(x + 0.5);
  return Math.floor(x * 10 + 0.5) / 10;
}

// ---------------------------------------------------------- market deck
function buildMarketDeck() {
  const fixed = settings.balanced ? FIXED_BALANCED : FIXED_AS_WRITTEN;
  const deck = fixed.map(([name, family, moves]) => ({ name, family, kind: 'fixed', moves }));
  for (const s of ROLL_ORDER) deck.push({ name: s + ' Swing', family: 'Sector Swing', kind: 'swing', sector: s });
  for (const n of ['Bargain Hunting', 'Profit Taking', 'Earnings Season', 'Flash Crash', 'Meme Stock', 'Dividend Day'])
    deck.push({ name: n, family: 'Whole Market', kind: n });
  for (let i = 0; i < 5; i++) deck.push({ name: 'Quiet Session', family: 'Whole Market', kind: 'quiet' });
  return shuffle(deck);
}
function marketText(c) {
  const r = settings.rolled;
  switch (c.kind) {
    case 'swing': return 'Flip a coin. Every ' + c.sector + ' stock +10% (heads) or -10% (tails).';
    case 'Bargain Hunting': return 'Every stock marked with a down arrow +10%.';
    case 'Profit Taking': return 'Every stock marked with an up arrow -10%.';
    case 'Earnings Season': return (r ? 'Roll a stock in each sector' : "Roll for each sector's most expensive stock") + ': 1-2 is -10%, 3-4 is +5%, 5-6 is +15%.';
    case 'Flash Crash': return r ? 'Roll a sector, then a stock. It loses half its value.' : 'Roll for a sector. Its most expensive stock loses half its value.';
    case 'Meme Stock': return r ? 'Roll a sector, then a stock. It doubles.' : 'The cheapest stock on the board doubles.';
    case 'Dividend Day': return 'Roll for a sector. Everyone collects 5% of the value of their shares in it, up to $150.';
    case 'quiet': return 'Nothing happens.';
    default: return '';
  }
}

// Plain-language descriptions of cards, used in the log and in prompts
function actionText(c) { const a = ACTIONS[c]; return a[3] + (a[4] ? ' Cost: ' + a[4] : ''); }
function marketSummary(c) {
  if (!c) return '';
  if (c.kind === 'fixed') return Object.keys(c.moves).map(t => t + ' ' + pct(c.moves[t])).join(', ') + '.';
  return marketText(c);
}

// ---------------------------------------------------------- players
function newPlayer(id, name, human, style) {
  return { id, name, human, style, cash: 2000, shares: {}, hand: [], effect: null, effectLeft: 0, insiderTarget: null,
    bell: null, shorts: [], limit: null, investigated: false, known: {}, picks: [], soldThisWindow: new Set(),
    mmUsed: false, worthByDay: [], today: '' };
}
const held = (p, t) => p.shares[t] || 0;
const live = () => TICKERS.filter(t => G.prices[t] !== null);
const valueOf = (p, t) => held(p, t) * (G.prices[t] || 0);
const holdingsValue = p => TICKERS.reduce((s, t) => s + valueOf(p, t), 0);
const worth = p => p.cash + holdingsValue(p) - p.shorts.reduce((s, [t, n]) => s + n * (G.prices[t] || 0), 0);
const human = () => G.players[0];
const others = p => G.players.filter(o => o !== p);
function topHolding(p) {
  const h = live().filter(t => held(p, t) > 0);
  return h.length ? h.reduce((a, b) => (valueOf(p, a) >= valueOf(p, b) ? a : b)) : null;
}
function rivalHolding(p) {
  // The stock other players hold most of that this player does not own
  let best = null, bestV = -1;
  for (const t of live()) {
    if (held(p, t) > 0) continue;
    const v = others(p).reduce((s, o) => s + valueOf(o, t), 0);
    if (v > bestV) { bestV = v; best = t; }
  }
  return best || pick(live());
}

// ---------------------------------------------------------- log
function log(text, cls) { G.log.push({ day: G.day, text, cls: cls || '' }); }

// ---------------------------------------------------------- price changes
function move(t, p, rec, why) {
  const old = G.prices[t];
  if (old === null || old === undefined || !p) return;
  const nw = roundPrice(old * (1 + p / 100));
  if (rec && !(t in rec)) rec[t] = old;
  G.prices[t] = nw;
  G.arrows[t] = nw > old ? 1 : (nw < old ? -1 : (G.arrows[t] || 0));
  G.hist[t].push(nw);
  log(t + ' ' + pct(p) + '  ' + money(old) + ' to ' + money(nw) + (why ? '  (' + why + ')' : ''));
  checkLimits(t);
}
function setPrice(t, price, why) {
  const old = G.prices[t];
  if (old === null || old === undefined) return;
  G.prices[t] = roundPrice(price);
  G.hist[t].push(G.prices[t]);
  log(t + ' restored ' + money(old) + ' to ' + money(G.prices[t]) + (why ? '  (' + why + ')' : ''));
  checkLimits(t);
}
function checkLimits(t) {
  const p = G.prices[t];
  if (p === null) return;
  if (p < 1) {
    log(t + ' goes bankrupt. Every share of it is erased. It relists at $5 next round.', 'big');
    for (const pl of G.players) pl.shares[t] = 0;
    G.prices[t] = null;
    G.relist.add(t);
    G.stats.bankrupt++;
  } else if (p >= 500) {
    G.prices[t] = p / 2;
    for (const pl of G.players) {
      pl.shares[t] = held(pl, t) * 2;
      for (const s of pl.shorts) if (s[0] === t) { s[1] *= 2; s[2] /= 2; }
    }
    log(t + ' splits 2-for-1 and is now ' + money(G.prices[t]) + '. Holders double their shares.', 'big');
    G.stats.splits++;
  }
}
function rolledStock() {
  // Roll a sector, then 1-5 for a stock in it; re-roll a 6 or a bankrupt stock
  for (;;) {
    const s = ROLL_ORDER[d6() - 1], r = d6();
    if (r <= 5 && G.prices[SECTORS[s][r - 1]] !== null) return SECTORS[s][r - 1];
  }
}
function applyMarket(card, slot) {
  log(slot + ': ' + card.name, 'act');
  log(marketSummary(card), 'txt');
  const rec = {};
  const k = card.kind;
  if (k === 'fixed') {
    for (const t in card.moves) move(t, card.moves[t], rec);
  } else if (k === 'swing') {
    const heads = rnd() < 0.5;
    log('Coin: ' + (heads ? 'heads' : 'tails'));
    for (const t of SECTORS[card.sector]) move(t, heads ? 10 : -10, rec);
  } else if (k === 'Bargain Hunting' || k === 'Profit Taking') {
    const want = k === 'Bargain Hunting' ? -1 : 1;
    const hits = live().filter(t => G.arrows[t] === want);
    if (!hits.length) log('No stocks are marked, so nothing moves.');
    for (const t of hits) move(t, k === 'Bargain Hunting' ? 10 : -10, rec);
  } else if (k === 'Earnings Season') {
    for (const s of ROLL_ORDER) {
      const lv = SECTORS[s].filter(t => G.prices[t] !== null);
      if (!lv.length) continue;
      let t;
      if (settings.rolled) { let r; do { r = d6(); } while (r > 5 || G.prices[SECTORS[s][r - 1]] === null); t = SECTORS[s][r - 1]; }
      else t = lv.reduce((a, b) => (G.prices[a] >= G.prices[b] ? a : b));
      const r = d6();
      move(t, r <= 2 ? -10 : (r <= 4 ? 5 : 15), rec, 'rolled ' + r);
    }
  } else if (k === 'Flash Crash') {
    if (settings.rolled) move(rolledStock(), -50, rec, 'rolled');
    else {
      const s = ROLL_ORDER[d6() - 1];
      const lv = SECTORS[s].filter(t => G.prices[t] !== null);
      log('Rolled ' + s + '.');
      if (lv.length) move(lv.reduce((a, b) => (G.prices[a] >= G.prices[b] ? a : b)), -50, rec);
    }
  } else if (k === 'Meme Stock') {
    if (settings.rolled) move(rolledStock(), 100, rec, 'rolled');
    else move(live().reduce((a, b) => (G.prices[a] <= G.prices[b] ? a : b)), 100, rec);
  } else if (k === 'Dividend Day') {
    const s = ROLL_ORDER[d6() - 1];
    log('Rolled ' + s + '.');
    for (const pl of G.players) {
      const v = SECTORS[s].reduce((a, t) => a + valueOf(pl, t), 0);
      const pay = Math.min(150, 0.05 * v);
      if (pay > 0) { pl.cash += pay; log(pl.name + ' collects ' + cash(pay) + '.'); }
    }
  } else {
    log('Nothing happens.');
  }
  return rec;
}
// What a player who has seen a Market card expects it to do (used by computer traders)
function preview(card) {
  if (!card) return {};
  if (card.kind === 'fixed') return Object.assign({}, card.moves);
  if (card.kind === 'Meme Stock' && !settings.rolled) {
    const t = live().reduce((a, b) => (G.prices[a] <= G.prices[b] ? a : b));
    return { [t]: 100 };
  }
  if (card.kind === 'Bargain Hunting') { const o = {}; live().forEach(t => { if (G.arrows[t] === -1) o[t] = 10; }); return o; }
  if (card.kind === 'Profit Taking') { const o = {}; live().forEach(t => { if (G.arrows[t] === 1) o[t] = -10; }); return o; }
  return {};
}

// ---------------------------------------------------------- trading
function maxBuyDollars(p, t) {
  // How much this player may spend on one stock right now, under the active rules
  let room = p.cash;
  if (settings.cap) room = Math.min(room, Math.max(0, 0.25 * worth(p) - valueOf(p, t)));
  if (p.effect === 'Day Trader') room = Math.min(room, Math.max(0, 500 - valueOf(p, t)));
  return room;
}
function buy(p, t, dollars, quiet) {
  const price = G.prices[t];
  if (price === null) return 0;
  const n = Math.floor(Math.min(dollars, maxBuyDollars(p, t)) / price + 1e-9);
  if (n <= 0) return 0;
  p.cash -= n * price;
  p.shares[t] = held(p, t) + n;
  if (!quiet) log(p.name + ' buys ' + n + ' ' + t + ' at ' + money(price) + '.', p.human ? 'me' : '');
  return n;
}
function canSell(p, t) {
  if (p.effect === 'Diamond Hands' && p.soldThisWindow.size && !p.soldThisWindow.has(t)) return false;
  return held(p, t) > 0 && G.prices[t] !== null;
}
function sell(p, t, n, quiet) {
  n = Math.min(n, held(p, t));
  if (n <= 0 || !canSell(p, t)) return 0;
  p.cash += n * G.prices[t];
  p.shares[t] -= n;
  p.soldThisWindow.add(t);
  if (!quiet) log(p.name + ' sells ' + n + ' ' + t + ' at ' + money(G.prices[t]) + '.', p.human ? 'me' : '');
  return n;
}
function setPortfolio(p, targets) {
  // Computer traders rebalance by selling out and buying their targets (trading is free)
  for (const t of TICKERS) if (held(p, t) > 0 && G.prices[t] !== null && !(t in targets)) sell(p, t, held(p, t), true);
  const w = worth(p);
  for (const t in targets) {
    const want = w * targets[t];
    const have = valueOf(p, t);
    if (have > want + G.prices[t]) sell(p, t, Math.floor((have - want) / G.prices[t]), true);
  }
  for (const t of Object.keys(targets).sort((a, b) => targets[b] - targets[a])) {
    const want = w * targets[t] - valueOf(p, t);
    if (want > 0) buy(p, t, want, true);
  }
}

// ---------------------------------------------------------- computer traders
function baseline(p) {
  const lv = live();
  if (p.style === 'sharp') { const o = {}; lv.forEach(t => (o[t] = 1 / lv.length)); return o; }
  const picks = p.picks.filter(t => G.prices[t] !== null);
  const use = picks.length ? picks : lv.slice(0, 5);
  const o = {}; use.forEach(t => (o[t] = 1 / use.length)); return o;
}
function knownEdges(p, slot) {
  // Sum of % moves this player knows are coming before the next unknown card
  const e = {};
  const add = (t, v) => { if (t && G.prices[t] !== null) e[t] = (e[t] || 0) + v; };
  if (p.style !== 'sharp') return e;
  if (slot === 'live') {
    if (p.bell && p.bell.plan) {
      const c = p.bell.card;
      if (c === 'Breaking News') add(p.bell.plan, p.effect === 'Media Mogul' ? 15 : 10);
      if (c === 'Hype Cycle') add(p.bell.plan, 15);
      if (c === 'Sector Spotlight') add(p.bell.plan, 10);
    }
    if (p.known.live) { const pv = preview(p.known.live); for (const t in pv) add(t, pv[t]); }
    if (p.effect === 'Insider Trading' && p.insiderTarget && p.insiderTarget.bell) {
      const b = p.insiderTarget.bell;
      if (b.plan && ['Breaking News', 'Hype Cycle', 'Sector Spotlight'].includes(b.card)) add(b.plan, 10);
    }
  } else if (p.known.after) {
    const pv = preview(p.known.after); for (const t in pv) add(t, pv[t]);
  }
  return e;
}
function botTrade(p, slot) {
  if (p.style !== 'sharp') return;
  const e = knownEdges(p, slot);
  let best = null;
  for (const t in e) if (e[t] > 0 && (best === null || e[t] > e[best])) best = t;
  if (best) {
    const f = settings.cap ? 0.25 : 1;
    const tg = f < 1 ? Object.assign({}, baseline(p)) : {};
    for (const t in tg) tg[t] *= (1 - f);
    tg[best] = (tg[best] || 0) + f;
    setPortfolio(p, tg);
    log(p.name + ' loads up on ' + best + '.', 'big');
  } else {
    setPortfolio(p, baseline(p));
  }
  if (p.effect === 'Market Maker' && !p.mmUsed) { p.cash += 30; p.mmUsed = true; }
}
function legal(p, c) {
  if (TYPE(c) === 'Access' && p.effect === 'Media Mogul') return 'Media Mogul blocks Access cards.';
  if (TYPE(c) === 'Buy/Sell' && p.effect === 'Trading Desk') return 'Trading Desk blocks Buy/Sell cards.';
  if (TYPE(c) === 'Buy/Sell' && p.investigated) return 'You are Under Investigation.';
  if ((TYPE(c) === 'Reaction' || c === 'Short Sell') && p.effect === 'Dividend Portfolio') return 'Dividend Portfolio blocks this card.';
  return '';
}
function botChooseCard(p) {
  const ok = p.hand.filter(c => !legal(p, c));
  if (!ok.length) return null;
  if (p.style === 'sharp') {
    let pri = SHARP_PRIORITY.slice();
    if (p.effect) pri = pri.filter(c => !PERSISTENT.has(c)).concat(pri.filter(c => PERSISTENT.has(c)));
    return ok.reduce((a, b) => (pri.indexOf(a) <= pri.indexOf(b) ? a : b));
  }
  return pick(ok);
}

// ---------------------------------------------------------- choices
// A human choice waits for a click; a computer trader takes its default at once
let pending = null;
function waitFor(state) { return new Promise(resolve => { pending = Object.assign({ resolve }, state); render(); }); }
async function choose(p, title, text, options, botValue) {
  if (!p.human) return typeof botValue === 'function' ? botValue() : botValue;
  if (!options.length) return null;
  return waitFor({ kind: 'choice', title, text, options });
}
const stockOpts = ts => ts.map(t => ({ label: t, sub: money(G.prices[t]), value: t }));
const sectorOpts = () => ROLL_ORDER.map(s => ({ label: s, value: s }));

// ---------------------------------------------------------- playing Action cards
async function resolveInstant(p, c) {
  const lv = live();
  if (TIMING(c) === 'Bell') {
    let plan = null;
    if (p.style === 'sharp') {
      const e = knownEdges(p, 'live');
      plan = Object.keys(e).sort((a, b) => e[b] - e[a])[0] || pick(lv);
      if (c === 'Sector Spotlight') { const s = SECTORS[SECTOR_OF[plan]].filter(t => G.prices[t] !== null); plan = s.reduce((a, b) => (G.prices[a] <= G.prices[b] ? a : b)); }
    }
    p.bell = { card: c, plan };
    return;
  }
  if (c === 'Under Investigation') {
    const v = await choose(p, 'Under Investigation', 'Who goes under investigation?', others(p).map(o => ({ label: o.name, value: o.id })), () => pick(others(p)).id);
    const victim = G.players.find(o => o.id === v);
    victim.investigated = true;
    log(victim.name + ' is under investigation: no Buy/Sell cards until they pay $150.', 'big');
    return;
  }
  if (PERSISTENT.has(c)) {
    if (p.effect) log(p.name + ' discards ' + p.effect + '.');
    p.effect = c;
    if (c === 'Insider Trading') {
      p.effectLeft = 2;
      const v = await choose(p, 'Insider Trading', 'Whose cards do you want to watch for 2 rounds?', others(p).map(o => ({ label: o.name, value: o.id })), () => pick(others(p)).id);
      p.insiderTarget = G.players.find(o => o.id === v);
      log(p.name + ' watches ' + p.insiderTarget.name + '.');
    }
    if (c === 'Trading Desk') p.known.live = G.slots.live;
    return;
  }
  switch (c) {
    case 'Market Peek': {
      const slot = await choose(p, 'Market Peek', 'Which face-down card do you want to see?', [{ label: 'Live', value: 'live' }, { label: 'After-Hours', value: 'after' }], 'live');
      p.known[slot] = G.slots[slot];
      log(p.name + ' looks at the ' + (slot === 'live' ? 'Live' : 'After-Hours') + ' card.');
      if (p.human) await waitFor({ kind: 'continue', title: 'You see: ' + G.slots[slot].name, text: marketSummary(G.slots[slot]) + ' It is shown on the slot only to you. Tell the table whatever you like.', label: 'Got it' });
      return;
    }
    case 'Front-Runner': {
      p.known.live = G.slots.live; p.known.after = G.slots.after;
      log(p.name + ' looks at the Live and After-Hours cards.');
      const swap = await choose(p, 'Front-Runner', 'Live is ' + G.slots.live.name + ' (' + marketSummary(G.slots.live) + ') After-Hours is ' + G.slots.after.name + ' (' + marketSummary(G.slots.after) + ') Swap them?',
        [{ label: 'Keep them', value: false }, { label: 'Swap them', value: true }], false);
      if (swap) { [G.slots.live, G.slots.after] = [G.slots.after, G.slots.live]; p.known = { live: G.slots.live, after: G.slots.after }; log(p.name + ' swaps the two cards.'); }
      return;
    }
    case 'Tax Break': {
      const n = new Set(lv.filter(t => held(p, t) > 0).map(t => SECTOR_OF[t])).size;
      p.cash += 20 * n; log(p.name + ' collects ' + cash(20 * n) + '.');
      return;
    }
    case 'Dividend': {
      const own = lv.filter(t => held(p, t) > 0);
      const t = await choose(p, 'Dividend', 'Collect 10% of your shares in which stock?', stockOpts(own), () => topHolding(p));
      if (t) { const pay = Math.min(150, 0.1 * valueOf(p, t)); p.cash += pay; log(p.name + ' collects ' + cash(pay) + ' from ' + t + '.'); }
      return;
    }
    case 'Premium Buyer': {
      const own = lv.filter(t => held(p, t) > 0);
      const t = await choose(p, 'Premium Buyer', 'Sell up to $500 worth of which stock at 20% above board price?', stockOpts(own), () => topHolding(p));
      if (t) {
        const n = Math.min(held(p, t), Math.max(1, Math.floor(500 / G.prices[t])));
        p.shares[t] -= n; p.cash += n * G.prices[t] * 1.2;
        log(p.name + ' sells ' + n + ' ' + t + ' at ' + money(G.prices[t] * 1.2) + '.');
      }
      return;
    }
    case 'Discount Broker': {
      const t = await choose(p, 'Discount Broker', 'Buy up to $500 worth of which stock at 20% below board price?', stockOpts(lv), () => topHolding(p) || pick(lv));
      const price = G.prices[t] * 0.8;
      const n = Math.floor(Math.min(500, p.cash) / price);
      p.cash -= n * price; p.shares[t] = held(p, t) + n;
      log(p.name + ' buys ' + n + ' ' + t + ' at ' + money(price) + '.');
      return;
    }
    case 'Short Sell': {
      const t = await choose(p, 'Short Sell', 'Short which stock? You take the price of up to $500 worth now and pay back their price after After-Hours.', stockOpts(lv), () => {
        const pv = preview(p.known.live);
        const fall = Object.keys(pv).filter(x => pv[x] < 0 && G.prices[x] !== null);
        return fall.length ? fall.reduce((a, b) => (pv[a] <= pv[b] ? a : b)) : pick(lv);
      });
      const n = Math.max(1, Math.floor(500 / G.prices[t]));
      p.cash += n * G.prices[t]; p.shorts.push([t, n, G.prices[t]]);
      log(p.name + ' shorts ' + n + ' ' + t + ' at ' + money(G.prices[t]) + '.');
      return;
    }
    case 'SEC Investigation': {
      const tg = others(p).filter(o => o.effect);
      if (!tg.length) { log('No other player has an Effect card in play.'); return; }
      const v = await choose(p, 'SEC Investigation', 'Whose Effect card do you discard?', tg.map(o => ({ label: o.name, sub: o.effect, value: o.id })), () => pick(tg).id);
      const victim = G.players.find(o => o.id === v);
      if (victim.effect === 'Insider Trading') { victim.cash -= 100; log(victim.name + ' pays a $100 fine.'); }
      log(victim.name + ' loses ' + victim.effect + '.');
      victim.effect = null;
      return;
    }
  }
}

async function resolveBell(p) {
  const c = p.bell.card, plan = p.bell.plan;
  const lv = live();
  const own = topHolding(p);
  const rec = {};
  const who = c + ', ' + p.name;
  const mogul = p.effect === 'Media Mogul' ? 5 : 0;
  log((p.human ? 'You flip ' : p.name + ' flips ') + c + '.', 'act');
  log(actionText(c), 'txt');
  p.today = 'Bell card: ' + c;
  const planOr = def => (plan && G.prices[plan] !== null ? plan : def);
  const liveMoved = dir => Object.keys(G.liveRec).filter(t => G.prices[t] !== null && (dir > 0 ? G.prices[t] > G.liveRec[t] : dir < 0 ? G.prices[t] < G.liveRec[t] : G.prices[t] !== G.liveRec[t]));
  switch (c) {
    case 'Breaking News': {
      const t = await choose(p, 'Breaking News', 'Which stock gets the good news (+' + (10 + mogul) + '%)?', stockOpts(lv), () => planOr(own || pick(lv)));
      move(t, 10 + mogul, rec, who); break;
    }
    case 'Hit Piece': {
      const t = await choose(p, 'Hit Piece', 'Which stock gets the bad news (-' + (10 + mogul) + '%)?', stockOpts(lv), () => rivalHolding(p));
      move(t, -(10 + mogul), rec, who); break;
    }
    case 'Earnings Call': {
      const t = await choose(p, 'Earnings Call', 'Which stock reports? Then you roll.', stockOpts(lv), () => own || pick(lv));
      const r = d6(); move(t, [-15, -5, 5, 5, 10, 20][r - 1], rec, who + ', rolled ' + r); break;
    }
    case 'Rumor Mill': {
      const t = await choose(p, 'Rumor Mill', 'Which stock is the rumor about? Then you flip a coin.', stockOpts(lv), () => own || pick(lv));
      move(t, rnd() < 0.5 ? 15 : -15, rec, who); break;
    }
    case 'Sector Spotlight': {
      const s = await choose(p, 'Sector Spotlight', 'Which sector? Its cheapest stock +10%, its priciest -5%.', sectorOpts(), () => SECTOR_OF[planOr(own || pick(lv))]);
      const ls = SECTORS[s].filter(t => G.prices[t] !== null);
      if (ls.length) {
        move(ls.reduce((a, b) => (G.prices[a] <= G.prices[b] ? a : b)), 10, rec, who);
        move(ls.reduce((a, b) => (G.prices[a] >= G.prices[b] ? a : b)), -5, rec, who);
      }
      break;
    }
    case 'Hype Cycle': {
      const t = await choose(p, 'Hype Cycle', 'Which stock gets hyped (+15% now, -10% at the next Pre-Market)?', stockOpts(lv), () => planOr(own || pick(lv)));
      move(t, 15, rec, who); G.hype.add(t); break;
    }
    case 'Retraction': {
      const opts = G.reporterLog.map((r, i) => ({ label: r.card + ' by ' + r.who, sub: Object.keys(r.rec).join(', '), value: i }));
      if (!opts.length) { log('There is no Reporter card to cancel.'); break; }
      const i = await choose(p, 'Retraction', 'Cancel which Reporter card?', opts, () => {
        let worst = null, loss = 0;
        G.reporterLog.forEach((r, k) => { const l = Object.keys(r.rec).reduce((s, t) => s + held(p, t) * (r.rec[t] - (G.prices[t] || 0)), 0); if (l > loss) { loss = l; worst = k; } });
        return worst;
      });
      if (i !== null && i !== undefined) for (const t in G.reporterLog[i].rec) setPrice(t, G.reporterLog[i].rec[t], who);
      break;
    }
    case 'Short Squeeze': {
      const down = liveMoved(-1);
      if (!down.length) { log('The Live card lowered nothing, so this card does nothing.'); break; }
      const t = await choose(p, 'Short Squeeze', 'Which stock that the Live card lowered?', stockOpts(down), () => down.reduce((a, b) => (valueOf(p, a) >= valueOf(p, b) ? a : b)));
      const old = G.liveRec[t], drop = Math.round((old - G.prices[t]) / old * 100);
      setPrice(t, old, who); move(t, drop, rec, who); break;
    }
    case 'Circuit Breaker': {
      const changed = Object.keys(G.liveRec).filter(t => G.prices[t] !== null);
      if (!changed.length) { log('The Live card moved nothing, so this card does nothing.'); break; }
      const secs = [...new Set(changed.map(t => SECTOR_OF[t]))];
      const s = await choose(p, 'Circuit Breaker', 'Restore the Live card\'s changes in which sector?', secs.map(x => ({ label: x, value: x })), () => {
        let best = secs[0], loss = -Infinity;
        for (const x of secs) { const l = changed.filter(t => SECTOR_OF[t] === x).reduce((a, t) => a + held(p, t) * (G.liveRec[t] - G.prices[t]), 0); if (l > loss) { loss = l; best = x; } }
        return best;
      });
      for (const t of changed) if (SECTOR_OF[t] === s) setPrice(t, G.liveRec[t], who);
      break;
    }
    case 'Momentum': {
      const mv = liveMoved(0);
      if (!mv.length) { log('The Live card moved nothing, so this card does nothing.'); break; }
      const t = await choose(p, 'Momentum', 'Which stock moves the same percentage again?', stockOpts(mv), () => {
        const upMv = mv.filter(x => G.prices[x] > G.liveRec[x]);
        const pool = upMv.length ? upMv : mv;
        return pool.reduce((a, b) => (valueOf(p, a) >= valueOf(p, b) ? a : b));
      });
      move(t, Math.round((G.prices[t] - G.liveRec[t]) / G.liveRec[t] * 100), rec, who); break;
    }
    case 'Dead Cat Bounce': {
      const down = lv.filter(t => G.arrows[t] === -1);
      if (!down.length) { log('No stock has a down arrow, so this card does nothing.'); break; }
      const t = await choose(p, 'Dead Cat Bounce', 'Which down-arrow stock bounces +15%?', stockOpts(down), () => down.reduce((a, b) => (valueOf(p, a) >= valueOf(p, b) ? a : b)));
      move(t, 15, rec, who); break;
    }
    case 'Bubble Warning': {
      const up = lv.filter(t => G.arrows[t] === 1);
      if (!up.length) { log('No stock has an up arrow, so this card does nothing.'); break; }
      const t = await choose(p, 'Bubble Warning', 'Which up-arrow stock falls 15%?', stockOpts(up), () => { const n = up.filter(x => !held(p, x)); return n.length ? pick(n) : pick(up); });
      move(t, -15, rec, who); break;
    }
    case 'Buyback': {
      const ownL = lv.filter(t => held(p, t) > 0);
      if (!ownL.length) { log('You own no stocks, so this card does nothing.'); break; }
      const t = await choose(p, 'Buyback', 'Which of your stocks? +5% for every $250 you hold, up to +15%.', ownL.map(x => ({ label: x, sub: cash(valueOf(p, x)) + ' held', value: x })), () => own);
      move(t, Math.min(15, 5 * Math.floor(valueOf(p, t) / 250)), rec, who); break;
    }
    case 'Put Option': {
      const down = liveMoved(-1).filter(t => held(p, t) > 0);
      if (!down.length) { log('The Live card lowered none of your stocks, so this card does nothing.'); break; }
      const t = await choose(p, 'Put Option', 'Which of your stocks did the Live card lower?', stockOpts(down), () => down.reduce((a, b) => (held(p, a) * (G.liveRec[a] - G.prices[a]) >= held(p, b) * (G.liveRec[b] - G.prices[b]) ? a : b)));
      const pay = Math.min(200, held(p, t) * (G.liveRec[t] - G.prices[t])); p.cash += pay;
      log(p.name + ' collects ' + cash(pay) + ' from the bank.'); break;
    }
    case 'Hostile Takeover': {
      const tg = others(p).filter(o => o.effect !== 'Diamond Hands' && topHolding(o));
      if (!tg.length) { log('Nobody can be targeted.'); break; }
      const v = await choose(p, 'Hostile Takeover', 'Take shares from whom?', tg.map(o => ({ label: o.name, value: o.id })), () => pick(tg).id);
      const victim = G.players.find(o => o.id === v);
      const vs = live().filter(t => held(victim, t) > 0);
      const t = await choose(p, 'Hostile Takeover', 'Which of ' + victim.name + '\'s stocks? They sell you up to $300 worth at board price.', stockOpts(vs), () => topHolding(victim));
      const n = Math.min(held(victim, t), Math.floor(Math.min(300, p.cash) / G.prices[t]));
      victim.shares[t] -= n; p.shares[t] = held(p, t) + n; victim.cash += n * G.prices[t]; p.cash -= n * G.prices[t];
      log(victim.name + ' sells ' + n + ' ' + t + ' to ' + p.name + '.', 'big'); break;
    }
    case 'Margin Call': {
      const tg = others(p).filter(o => o.effect !== 'Diamond Hands');
      if (!tg.length) { log('Nobody can be targeted.'); break; }
      const v = await choose(p, 'Margin Call', 'Who gets the margin call?', tg.map(o => ({ label: o.name, sub: cash(worth(o)), value: o.id })), () => tg.reduce((a, b) => (worth(a) >= worth(b) ? a : b)).id);
      const victim = G.players.find(o => o.id === v);
      let left = 300, sold = 0;
      for (const t of live().sort((a, b) => valueOf(victim, b) - valueOf(victim, a))) {
        while (left > 0 && held(victim, t) > 0) { victim.shares[t]--; victim.cash += G.prices[t] * 0.9; left -= G.prices[t]; sold += G.prices[t]; }
      }
      log(victim.name + ' sells ' + cash(sold) + ' of shares to the bank at 10% below board price.', 'big'); break;
    }
    case 'Limit Order': {
      const ownL = lv.filter(t => held(p, t) > 0);
      if (!ownL.length) { log('You own no stocks, so this card does nothing.'); break; }
      p.limit = await choose(p, 'Limit Order', 'Protect which stock from tonight\'s After-Hours card?', stockOpts(ownL), () => own);
      log(p.name + ' places a limit order.'); break;
    }
  }
  if (TYPE(c) === 'Reporter' && c !== 'Retraction' && Object.keys(rec).length) G.reporterLog.push({ card: c, who: p.name, rec });
}

// ---------------------------------------------------------- the day
const STEPS = ['Deal', 'Actions', 'Trade', 'Bell', 'Trade', 'After-Hours', 'Pass'];
function drawAction() {
  if (!G.adeck.length) { G.adeck = shuffle(G.adiscard); G.adiscard = []; log('The Action deck is reshuffled.'); }
  return G.adeck.pop();
}
async function drawUp(p) {
  while (p.hand.length < 3) {
    let c = drawAction();
    if (p.effect === 'Day Trader') {
      const c2 = drawAction();
      let keep = p.human
        ? await waitFor({ kind: 'choice', title: 'Day Trader', text: 'Keep one of these two cards.', options: [{ label: c, sub: TYPE(c), value: c }, { label: c2, sub: TYPE(c2), value: c2 }] })
        : (SHARP_PRIORITY.indexOf(c) <= SHARP_PRIORITY.indexOf(c2) ? c : c2);
      G.adiscard.push(keep === c ? c2 : c);
      c = keep;
    }
    p.hand.push(c);
  }
}
async function tradeWindow(which) {
  G.step = which === 'live' ? 2 : 4;
  for (const p of G.players) { p.soldThisWindow = new Set(); p.mmUsed = false; }
  for (const p of G.players) if (!p.human) botTrade(p, which);
  G.trading = true;
  await waitFor({ kind: 'trade', title: which === 'live' ? 'First trading window' : 'Second trading window',
    text: which === 'live' ? 'Buy and sell before the bell. Pick a stock on the board.' : 'Last trades before tonight\'s After-Hours card and tomorrow\'s Pre-Market card.',
    label: which === 'live' ? 'Ring the bell' : 'Close the day' });
  G.trading = false;
}
async function playDay() {
  const d = G.day, order = G.players.slice(G.dealer).concat(G.players.slice(0, G.dealer));
  // 1. Deal
  G.step = 0;
  for (const t of [...G.relist]) { G.prices[t] = 5; G.hist[t].push(5); G.relist.delete(t); log(t + ' relists at $5.'); }
  if (G.mdeck.length < 3) { G.mdeck = buildMarketDeck(); log('The Market deck is reshuffled.'); }
  G.slots = { pre: G.mdeck.pop(), live: G.mdeck.pop(), after: G.mdeck.pop() };
  G.flipped = { pre: true, live: false, after: false };
  G.reporterLog = []; G.liveRec = {};
  for (const p of G.players) { p.known = {}; p.bell = null; p.limit = null; p.today = ''; }
  log('Day ' + d + ', ' + G.players[G.dealer].name + ' deals.', 'day');
  const preRec = applyMarket(G.slots.pre, 'Pre-Market');
  for (const t of [...G.hype]) move(t, -10, preRec, 'Hype Cycle drop');
  G.hype.clear();
  for (const t of Object.keys(G.arrows)) if (!(t in preRec)) delete G.arrows[t];
  await waitFor({ kind: 'continue', title: 'Day ' + d + ': Pre-Market', text: 'The Pre-Market card is ' + G.slots.pre.name + '. Yesterday\'s arrows are wiped; today\'s moves keep theirs.', label: 'Play Action cards' });
  // 2. Action cards, starting with the dealer
  G.step = 1;
  for (const p of order) {
    if (p.effect === 'Trading Desk') p.known.live = G.slots.live;
    if (p.human) {
      const r = await waitFor({ kind: 'hand', title: 'Your turn', text: 'Play one Action card, or discard one.' });
      p.hand.splice(p.hand.indexOf(r.card), 1);
      G.adiscard.push(r.card);
      if (r.discard) { log('You discard ' + r.card + ' instead of playing.', 'act'); p.today = 'Discarded ' + r.card; }
      else {
        if (TIMING(r.card) === 'Bell') { log('You play ' + r.card + ' face down for the bell.', 'act'); p.today = 'Bell card face down'; }
        else { log('You play ' + r.card + '.', 'act'); log(actionText(r.card), 'txt'); p.today = 'Played ' + r.card; }
        await resolveInstant(p, r.card);
      }
    } else {
      const c = botChooseCard(p);
      if (!c) {
        // Only when every card in hand is blocked by an Effect or an investigation
        const x = p.hand.shift(); G.adiscard.push(x);
        log(p.name + ' cannot play any card in hand, so discards one face down.', 'act');
        p.today = 'Discarded (no legal card)';
      } else {
        p.hand.splice(p.hand.indexOf(c), 1);
        G.adiscard.push(c);
        if (TIMING(c) === 'Bell') { log(p.name + ' plays a Bell card face down. It is revealed at the bell.', 'act'); p.today = 'Bell card face down'; }
        else { log(p.name + ' plays ' + c + '.', 'act'); log(actionText(c), 'txt'); p.today = 'Played ' + c; }
        await resolveInstant(p, c);
      }
    }
    await drawUp(p);
  }
  for (const p of G.players) if (p.effect === 'Trading Desk') p.known.live = G.slots.live;
  // 3. First trading window
  await tradeWindow('live');
  // 4. Bell: the Live card, then Bell cards in turn order
  G.step = 3;
  G.flipped.live = true;
  G.liveRec = applyMarket(G.slots.live, 'Live');
  for (const p of order) if (p.bell) await resolveBell(p);
  await waitFor({ kind: 'continue', title: 'After the bell', text: 'The Live card was ' + G.slots.live.name + '. Check the board, then trade again.', label: 'Open the second window' });
  // 5. Second trading window
  await tradeWindow('after');
  // 6. After-Hours card, then limit orders, shorts and Effect upkeep
  G.step = 5;
  G.flipped.after = true;
  const before = Object.assign({}, G.prices);
  applyMarket(G.slots.after, 'After-Hours');
  for (const p of G.players) {
    const t = p.limit;
    if (t && G.prices[t] !== null && before[t] && G.prices[t] < before[t] && held(p, t) > 0) {
      p.cash += held(p, t) * before[t];
      log(p.name + '\'s limit order sells ' + held(p, t) + ' ' + t + ' at ' + money(before[t]) + '.', 'big');
      p.shares[t] = 0;
    }
    for (const [t, n, entry] of p.shorts) {
      const now = G.prices[t] === null ? 0 : G.prices[t];
      p.cash -= n * now;
      log(p.name + ' closes a short on ' + t + ': ' + (entry >= now ? 'gains ' : 'loses ') + cash(Math.abs(n * (entry - now))) + '.', 'big');
    }
    p.shorts = [];
    if (p.effect === 'Market Maker') { p.cash -= 20; log(p.name + ' pays $20 for Market Maker.'); }
    if (p.effect === 'Dividend Portfolio') {
      const secs = new Set(live().filter(t => valueOf(p, t) >= 300).map(t => SECTOR_OF[t]));
      if (secs.size) { p.cash += 20 * secs.size; log(p.name + ' collects ' + cash(20 * secs.size) + ' from Dividend Portfolio.'); }
    }
    if (p.effect === 'Insider Trading') { p.effectLeft--; if (p.effectLeft <= 0) { p.effect = null; p.insiderTarget = null; log(p.name + '\'s Insider Trading ends.'); } }
    if (p.investigated) {
      const pay = p.cash >= 150 && await choose(p, 'Under Investigation', 'Pay $150 now to clear the investigation?', [{ label: 'Pay $150', value: true }, { label: 'Not now', value: false }], true);
      if (pay) { p.cash -= 150; p.investigated = false; log(p.name + ' pays $150 and is cleared.'); }
    }
  }
  if (d === G.lastDay && settings.hypeEnd) for (const t of [...G.hype]) { move(t, -10, null, 'Hype Cycle drop at the closing bell'); G.hype.delete(t); }
  for (const p of G.players) p.worthByDay.push(worth(p));
  G.step = 6;
  if (d < G.lastDay) await waitFor({ kind: 'continue', title: 'Day ' + d + ' closes', text: 'The bell passes to ' + G.players[(G.dealer + 1) % G.players.length].name + '.', label: 'Start day ' + (d + 1) });
}

async function runGame() {
  // Opening hands and the opening buy
  for (const p of G.players) {
    for (let i = 0; i < 3; i++) p.hand.push(drawAction());
    p.picks = shuffle(TICKERS.slice()).slice(0, 5);
    if (!p.human) setPortfolio(p, baseline(p));
  }
  for (const p of G.players) p.worthByDay.push(worth(p));
  log('Opening buy at the starting prices.', 'day');
  G.trading = true; G.step = -1;
  await waitFor({ kind: 'trade', title: 'Opening buy', text: 'Everyone buys at the starting prices. Pick a stock on the board, then buy. Your rivals have already bought.', label: 'Start day 1' });
  G.trading = false;
  for (G.day = 1; G.day <= G.lastDay; G.day++) {
    G.dealer = (G.day - 1) % G.players.length;
    await playDay();
  }
  G.day = G.lastDay;
  screen = 'results';
  pending = null;
  render();
}

function startGame() {
  const players = [newPlayer(0, 'You', true, 'human')];
  for (let i = 0; i < settings.rivals; i++) {
    const style = settings.style === 'mixed' ? (i % 2 === 0 ? 'sharp' : 'casual') : settings.style;
    players.push(newPlayer(i + 1, BOT_NAMES[i], false, style));
  }
  const adeck = [];
  for (const n in ACTIONS) for (let i = 0; i < ACTIONS[n][2]; i++) adeck.push(n);
  G = { players, prices: Object.assign({}, START), hist: {}, arrows: {}, relist: new Set(), hype: new Set(),
    mdeck: buildMarketDeck(), adeck: shuffle(adeck), adiscard: [], slots: { pre: null, live: null, after: null },
    flipped: { pre: false, live: false, after: false }, liveRec: {}, reporterLog: [], log: [], day: 0, lastDay: 8,
    dealer: 0, step: -1, trading: false, stats: { bankrupt: 0, splits: 0 } };
  for (const t of TICKERS) G.hist[t] = [START[t]];
  selected = 'AI';
  screen = 'game';
  runGame();
}

// ---------------------------------------------------------- your trades
function humanTrade(kind, amount) {
  const p = human(), t = selected;
  if (!G.trading || G.prices[t] === null) return;
  const price = G.prices[t];
  if (kind === 'buy') {
    const dollars = amount === 'max' ? maxBuyDollars(p, t) : (amount === 1 ? price : amount);
    buy(p, t, dollars);
  } else if (kind === 'sell') {
    const n = amount === 'all' ? held(p, t) : (amount === 1 ? 1 : Math.max(1, Math.ceil(amount / price)));
    sell(p, t, n);
  } else if (kind === 'mm-buy' && p.effect === 'Market Maker' && !p.mmUsed) {
    const pr = price * 0.9, n = Math.floor(Math.min(300, p.cash) / pr);
    if (n > 0) { p.cash -= n * pr; p.shares[t] = held(p, t) + n; p.mmUsed = true; log('You buy ' + n + ' ' + t + ' at ' + money(pr) + ' with Market Maker.', 'me'); }
  } else if (kind === 'mm-sell' && p.effect === 'Market Maker' && !p.mmUsed && held(p, t) > 0) {
    const n = Math.min(held(p, t), Math.max(1, Math.floor(300 / price)));
    p.shares[t] -= n; p.cash += n * price * 1.1; p.mmUsed = true; log('You sell ' + n + ' ' + t + ' at ' + money(price * 1.1) + ' with Market Maker.', 'me');
  }
  render();
}

// ---------------------------------------------------------- rendering
function spark(t) {
  const h = G.hist[t].slice(-24).filter(x => x !== null && x !== undefined);
  if (h.length < 2) return '<svg viewBox="0 0 100 18" aria-hidden="true"><line x1="0" y1="9" x2="100" y2="9" stroke="var(--line)" stroke-width="1.5"></line></svg>';
  const lo = Math.min(...h), hi = Math.max(...h), span = hi - lo || 1;
  const pts = h.map((v, i) => (i / (h.length - 1) * 100).toFixed(1) + ',' + (16 - (v - lo) / span * 14).toFixed(1)).join(' ');
  const col = h[h.length - 1] >= h[0] ? 'var(--up)' : 'var(--down)';
  return '<svg viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true"><polyline points="' + pts + '" fill="none" stroke="' + col + '" stroke-width="1.6" vector-effect="non-scaling-stroke"></polyline></svg>';
}
function boardHTML() {
  const me = human();
  return '<div class="board">' + ROLL_ORDER.map((s, i) => '<div class="sector"><div class="sector-name">' + s.toUpperCase() + '<em>ROLL ' + (i + 1) + '</em></div>' +
    SECTORS[s].map(t => {
      const p = G.prices[t];
      if (p === null) return '<div class="stock dead"><div class="tk"><span>' + t + '</span></div><div class="px">BANKRUPT</div><div class="chg"><span>relists at $5</span></div></div>';
      const ch = Math.round((p / START[t] - 1) * 100);
      const arrow = G.arrows[t] === 1 ? '<span class="up">&#9650;</span>' : G.arrows[t] === -1 ? '<span class="down">&#9660;</span>' : '';
      const mine = held(me, t);
      return '<button type="button" class="stock' + (t === selected ? ' sel' : '') + (mine ? ' own' : '') + '" data-stock="' + t + '" aria-label="' + t + ' ' + money(p) + '">' +
        '<div class="tk"><span>' + t + ' ' + arrow + (G.hype.has(t) ? ' <span class="star" title="Hype Cycle drop pending">&#9733;</span>' : '') + '</span><span>' + (mine ? mine + ' sh' : '') + '</span></div>' +
        '<div class="px">' + money(p) + '</div>' + spark(t) +
        '<div class="chg"><span class="' + (ch > 0 ? 'up' : ch < 0 ? 'down' : '') + '">' + (ch > 0 ? '+' : '') + ch + '%</span><span>from ' + money(START[t]) + '</span></div></button>';
    }).join('') + '</div>').join('') + '</div>';
}
function marketCardHTML(c, slotName, seen) {
  let body = '';
  if (c.kind === 'fixed') body = '<div class="mrows">' + Object.keys(c.moves).map(t => '<span><b>' + t + '</b><b class="' + (c.moves[t] > 0 ? 'u' : 'd') + '">' + pct(c.moves[t]) + '</b></span>').join('') + '</div>';
  else body = '<div class="mtext">' + esc(marketText(c)) + '</div>';
  return '<div class="slot face' + (seen ? ' seen' : '') + '"><div class="slot-name">' + slotName + ' &middot; ' + esc(c.family.toUpperCase()) + '</div><div class="mtitle">' + esc(c.name) + '</div>' + body + '</div>';
}
function slotsHTML() {
  const me = human();
  const names = { pre: 'PRE-MARKET', live: 'LIVE', after: 'AFTER-HOURS' };
  return '<div class="slots">' + ['pre', 'live', 'after'].map(k => {
    const c = G.slots[k];
    if (!c) return '<div class="slot back"><div class="slot-name">' + names[k] + '</div><div class="candles"><i style="height:40%"></i><i style="height:65%"></i><i class="h" style="height:50%"></i><i style="height:90%"></i></div></div>';
    if (G.flipped[k]) return marketCardHTML(c, names[k], false);
    if (me.known[k] === c) return marketCardHTML(c, names[k] + ' (ONLY YOU SEE THIS)', true);
    return '<div class="slot back"><div class="slot-name">' + names[k] + ' &middot; FACE DOWN</div><div class="candles"><i style="height:40%"></i><i style="height:65%"></i><i class="h" style="height:50%"></i><i style="height:90%"></i><i style="height:75%"></i></div></div>';
  }).join('') + '</div>';
}
function actionCardHTML(c, playable, reason) {
  const a = ACTIONS[c];
  return '<div class="acard"><div class="ah"><span>' + a[0].toUpperCase() + '</span><span>' + a[1].toUpperCase() + '</span></div><div class="ab">' +
    '<div class="at">' + esc(c) + '</div><div class="ax">' + esc(a[3]) + '</div>' + (a[4] ? '<div class="ac"><b>COST</b>' + esc(a[4]) + '</div>' : '') +
    (reason ? '<div class="why">' + esc(reason) + '</div>' : '') +
    (playable ? '<div class="aa"><button type="button" class="play" data-play="' + esc(c) + '"' + (reason ? ' disabled' : '') + '>Play</button><button type="button" data-discard="' + esc(c) + '">Discard</button></div>' : '') +
    '</div></div>';
}
function promptHTML() {
  if (!pending) return '';
  let inner = '<h3>' + esc(pending.title) + '</h3>' + (pending.text ? '<p>' + esc(pending.text) + '</p>' : '');
  if (pending.kind === 'continue') inner += '<div class="opts"><button type="button" class="btn go" data-continue="1">' + esc(pending.label) + '</button></div>';
  if (pending.kind === 'choice') inner += '<div class="opts">' + pending.options.map((o, i) => '<button type="button" class="btn" data-choice="' + i + '">' + esc(o.label) + (o.sub ? '<small>' + esc(o.sub) + '</small>' : '') + '</button>').join('') + '</div>';
  if (pending.kind === 'trade') inner += tradeHTML() + '<div class="opts"><button type="button" class="btn go" data-continue="1">' + esc(pending.label) + '</button></div>';
  if (pending.kind === 'hand') inner += '<p class="note">Every player must play one card or discard one each day. Bell cards are played face down and resolve at the bell, where you pick the target.</p>';
  return '<div class="prompt hot" aria-live="polite">' + inner + '</div>';
}
function tradeHTML() {
  const p = human(), t = selected, price = G.prices[t];
  if (price === null) return '<p class="note">' + t + ' is bankrupt. Pick another stock.</p>';
  const room = maxBuyDollars(p, t);
  const canBuy = room >= price, canSellIt = canSell(p, t);
  const mm = p.effect === 'Market Maker' && !p.mmUsed && G.step !== -1;
  let limits = [];
  if (settings.cap) limits.push('25% cap: you can put ' + cash(Math.max(0, 0.25 * worth(p) - valueOf(p, t))) + ' more into ' + t + '.');
  if (p.effect === 'Day Trader') limits.push('Day Trader: at most $500 of one stock.');
  if (p.effect === 'Diamond Hands') limits.push('Diamond Hands: you may sell only one stock this window.');
  return '<div class="trade"><div class="selected"><span><b>' + t + '</b> <span class="mono">' + money(price) + '</span></span><span class="mono note">You hold ' + held(p, t) + ' (' + cash(valueOf(p, t)) + ')</span></div>' +
    '<div class="grid2">' +
    '<button type="button" class="btn" data-trade="buy:1"' + (canBuy ? '' : ' disabled') + '>Buy 1</button>' +
    '<button type="button" class="btn" data-trade="buy:100"' + (room >= price ? '' : ' disabled') + '>Buy $100</button>' +
    '<button type="button" class="btn" data-trade="buy:500"' + (room >= price ? '' : ' disabled') + '>Buy $500</button>' +
    '<button type="button" class="btn" data-trade="buy:max"' + (canBuy ? '' : ' disabled') + '>Buy max</button>' +
    '<button type="button" class="btn" data-trade="sell:1"' + (canSellIt ? '' : ' disabled') + '>Sell 1</button>' +
    '<button type="button" class="btn" data-trade="sell:100"' + (canSellIt ? '' : ' disabled') + '>Sell $100</button>' +
    '<button type="button" class="btn" data-trade="sell:500"' + (canSellIt ? '' : ' disabled') + '>Sell $500</button>' +
    '<button type="button" class="btn" data-trade="sell:all"' + (canSellIt ? '' : ' disabled') + '>Sell all</button>' +
    '</div>' +
    (mm ? '<div class="grid2"><button type="button" class="btn" data-trade="mm-buy:0">Market Maker buy</button><button type="button" class="btn" data-trade="mm-sell:0"' + (held(p, t) ? '' : ' disabled') + '>Market Maker sell</button></div>' : '') +
    (limits.length ? '<p class="note">' + esc(limits.join(' ')) + '</p>' : '') + '</div>';
}
function sheetHTML() {
  const p = human();
  const rows = TICKERS.filter(t => held(p, t) > 0).map(t => '<div class="row"><span>' + held(p, t) + ' ' + t + '</span><span>' + cash(valueOf(p, t)) + '</span></div>');
  const shorts = p.shorts.map(([t, n, e]) => '<div class="row"><span>Short ' + n + ' ' + t + ' from ' + money(e) + '</span><span>' + cash(-n * G.prices[t]) + '</span></div>');
  return '<div class="sheet num"><div class="row"><span>Cash</span><span>' + cash(p.cash) + '</span></div>' + rows.join('') + shorts.join('') +
    '<div class="row"><b>Net worth</b><b>' + cash(worth(p)) + '</b></div></div>' +
    (p.effect ? '<div><span class="effect-pill">EFFECT &middot; ' + esc(p.effect.toUpperCase()) + (p.effect === 'Insider Trading' ? ' &middot; ' + p.effectLeft + ' LEFT' : '') + '</span></div>' : '') +
    (p.investigated ? '<p class="note down">Under Investigation: no Buy/Sell cards until you pay $150 at After-Hours.</p>' : '') +
    (p.bell ? '<p class="note"><span class="facedown"></span>Face down for the bell: <b>' + esc(p.bell.card) + '</b></p>' : '');
}
function rivalsHTML() {
  const me = human();
  return '<div class="rivals">' + others(me).map(o => {
    const hs = TICKERS.filter(t => held(o, t) > 0).sort((a, b) => valueOf(o, b) - valueOf(o, a));
    const watch = me.effect === 'Insider Trading' && me.insiderTarget === o;
    return '<div class="rival"><div class="rh"><b>' + esc(o.name) + '</b><span class="mono num">' + cash(worth(o)) + '</span></div>' +
      '<div class="tag">' + (o.style === 'sharp' ? 'SHARP TRADER' : 'CASUAL TRADER') + ' &middot; CASH ' + cash(o.cash) + '</div>' +
      '<div class="holds num">' + (hs.length ? hs.slice(0, 8).map(t => '<span>' + held(o, t) + ' ' + t + '</span>').join('') + (hs.length > 8 ? '<span>+' + (hs.length - 8) + ' more</span>' : '') : '<span>No shares</span>') + '</div>' +
      (o.effect ? '<div><span class="effect-pill">' + esc(o.effect.toUpperCase()) + '</span></div>' : '') +
      (o.investigated ? '<div class="tag down">UNDER INVESTIGATION</div>' : '') +
      '<div class="today">' + (o.today ? '<span class="label">Today</span> ' + esc(o.today) : '<span class="label">Today</span> Has not played yet') + '</div>' +
      (watch ? '<div class="tag up">YOU ARE WATCHING THIS PLAYER (INSIDER TRADING)</div>' : '') +
      '</div>';
  }).join('') + '</div>';
}
function insiderHTML() {
  // With Insider Trading you see the watched player's hand and face-down Bell card in full
  const me = human(), o = me.effect === 'Insider Trading' ? me.insiderTarget : null;
  if (!o) return '';
  const bell = o.bell && !G.flipped.live ? '<div class="label">' + esc(o.name) + '\'s face-down Bell card</div><div class="hand">' + actionCardHTML(o.bell.card, false, '') + '</div>' : '';
  return '<div class="spy"><div class="label up">Insider Trading: ' + esc(o.name) + '\'s hand</div><div class="hand">' + o.hand.map(c => actionCardHTML(c, false, '')).join('') + '</div>' + bell + '</div>';
}
function logHTML() {
  let out = '', last = null;
  for (const e of G.log.slice(-160)) {
    if (e.cls === 'day') { out += '<div class="d">' + esc(e.text.toUpperCase()) + '</div>'; continue; }
    out += '<div class="e ' + e.cls + '">' + esc(e.text) + '</div>';
  }
  return '<div class="log" id="log">' + out + '</div>';
}
function gameHTML() {
  const me = human();
  const showHand = pending && pending.kind === 'hand';
  return '<header class="top"><div class="brand">PLAY THE MARKET<small>TEST TABLE</small></div>' +
    '<div class="daybox"><div class="day">' + (G.day ? 'DAY ' + G.day + ' / ' + G.lastDay : 'OPENING BUY') + '</div>' +
    '<ol class="steps">' + STEPS.map((s, i) => '<li class="' + (G.step === i ? 'on' : '') + '">' + s.toUpperCase() + '</li>').join('') + '</ol></div>' +
    '<div class="worth"><span class="label">Your net worth</span><b class="num">' + cash(worth(me)) + '</b></div></header>' +
    '<div class="main"><section class="panel" aria-label="Market"><div class="panel-head"><h2>THE BOARD</h2><span class="label">Tap a stock to trade it</span></div>' + slotsHTML() + boardHTML() + '</section>' +
    '<section class="panel" aria-label="Your seat"><div class="panel-head"><h2>YOUR SEAT</h2><span class="label">' + (G.trading ? 'Trading is open' : 'Trading is closed') + '</span></div>' +
    promptHTML() +
    '<div class="label">Your hand</div><div class="hand">' + me.hand.map(c => actionCardHTML(c, showHand, showHand ? legal(me, c) : '')).join('') + '</div>' +
    insiderHTML() +
    '<div class="label">Your sheet</div>' + sheetHTML() + '</section></div>' +
    '<div class="lower"><section class="panel" aria-label="Rivals"><div class="panel-head"><h2>RIVAL SHEETS</h2><span class="label">Open to everyone</span></div>' + rivalsHTML() + '</section>' +
    '<section class="panel" aria-label="Log"><div class="panel-head"><h2>THE TAPE</h2><span class="label">Everything that happened</span></div>' + logHTML() + '</section></div>';
}
function setupHTML() {
  const seg = (key, vals) => '<div class="seg" role="group">' + vals.map(([v, l]) => '<button type="button" data-set="' + key + ':' + v + '" aria-pressed="' + (String(settings[key]) === String(v)) + '">' + l + '</button>').join('') + '</div>';
  const fix = (key, title, desc) => '<button type="button" class="fix" data-fix="' + key + '" aria-pressed="' + settings[key] + '"><span class="box">' + (settings[key] ? '&#10003;' : '') + '</span><span><b>' + title + '</b><span class="d">' + desc + '</span></span></button>';
  const tape = [['AI', 15], ['CRUDE', -15], ['GOLD', 5], ['SHIP', -10], ['VACC', 15], ['GROW', 100], ['DATA', -15], ['ROBO', 10], ['TREE', 10], ['BIOT', -20]];
  return '<div class="setup"><div class="hero"><h1>PLAY THE MARKET</h1><p>A test table for the card game. You trade against computer traders for 8 days, using the rules as written. Switch on any of the proposed fixes to see how they change the game.</p></div>' +
    '<div class="tape" aria-hidden="true">' + tape.map(([t, v]) => '<span>' + t + ' <span class="' + (v > 0 ? 'up' : 'down') + '">' + (v > 0 ? '&#9650; +' : '&#9660; ') + v + '%</span></span>').join('') + '</div>' +
    '<div class="field"><span class="label">Computer traders</span>' + seg('rivals', [[2, '2'], [3, '3'], [4, '4'], [5, '5']]) + '</div>' +
    '<div class="field"><span class="label">How they play</span>' + seg('style', [['casual', 'Casual: buy and hold'], ['sharp', 'Sharp: use every edge'], ['mixed', 'Mixed']]) + '</div>' +
    '<div class="field"><span class="label">Rounding (players\' choice)</span>' + seg('rounding', [['rounded', 'Rounded'], ['exact', 'Exact to the cent']]) + '</div>' +
    '<div class="field"><span class="label">Proposed fixes</span><div class="fixes">' +
    fix('cap', '25% cap per stock', 'No stock may be more than a quarter of your net worth when you buy it.') +
    fix('rolled', 'Rolled picks', 'Meme Stock, Flash Crash and Earnings Season hit a rolled stock instead of the cheapest or priciest.') +
    fix('balanced', 'Rebalanced Market deck', 'Eleven cards edited so every stock gets good and bad news.') +
    fix('hypeEnd', 'Hype Cycle closes out', 'A Hype Cycle played on day 8 drops 10% at the closing bell.') +
    '</div></div>' +
    '<div class="opts"><button type="button" class="btn go" data-start="1">Deal me in</button></div>' +
    '<p class="note">Not included: the optional Volatility Meter, trades between players, and the 90-second timer (trading stays open until you close it). Computer traders\' Bell card targets are chosen by them at the bell.</p></div>';
}
function resultsHTML() {
  const ranked = G.players.slice().sort((a, b) => worth(b) - worth(a));
  const days = G.players[0].worthByDay.length;
  const all = G.players.flatMap(p => p.worthByDay);
  const lo = Math.min(...all) * 0.95, hi = Math.max(...all) * 1.05;
  const W = 640, H = 240, L = 54, R = 10, T = 10, B = 28;
  const x = i => L + i / (days - 1) * (W - L - R), y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const cols = ['#2fbf71', '#ef5b5f', '#6cb6ff', '#f2c94c', '#c58af9', '#f08c4a'];
  let grid = '';
  for (let k = 0; k <= 4; k++) { const v = lo + (hi - lo) * k / 4; grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#2a302d"></line><text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" fill="#9aa39e" font-size="11" text-anchor="end" font-family="IBM Plex Mono, monospace">' + cash(v) + '</text>'; }
  for (let i = 0; i < days; i++) grid += '<text x="' + x(i) + '" y="' + (H - 8) + '" fill="#9aa39e" font-size="11" text-anchor="middle" font-family="IBM Plex Mono, monospace">' + (i === 0 ? 'Start' : 'D' + i) + '</text>';
  const lines = G.players.map((p, i) => '<polyline points="' + p.worthByDay.map((v, k) => x(k) + ',' + y(v)).join(' ') + '" fill="none" stroke="' + cols[i] + '" stroke-width="' + (p.human ? 3 : 1.8) + '"></polyline>').join('');
  const movers = TICKERS.filter(t => G.prices[t] !== null).map(t => [t, G.prices[t] / START[t] - 1]).sort((a, b) => b[1] - a[1]);
  const won = ranked[0].human;
  return '<div class="setup results"><div class="hero"><h1>' + (won ? 'YOU WIN' : esc(ranked[0].name.toUpperCase()) + ' WINS') + '</h1><p>After 8 days everyone sold at board prices. ' + (G.stats.bankrupt ? G.stats.bankrupt + ' bankruptcies' : 'No bankruptcies') + ' and ' + (G.stats.splits ? G.stats.splits + ' splits' : 'no splits') + ' this game.</p></div>' +
    '<div class="tablewrap"><table><thead><tr><th>Place</th><th>Player</th><th>Plays</th><th class="r">Final cash</th></tr></thead><tbody>' +
    ranked.map((p, i) => '<tr><td>' + (i + 1) + '</td><td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + cols[G.players.indexOf(p)] + ';margin-right:8px"></span>' + esc(p.name) + '</td><td>' + (p.human ? 'You' : p.style === 'sharp' ? 'Sharp' : 'Casual') + '</td><td class="r num">' + cash(worth(p)) + '</td></tr>').join('') +
    '</tbody></table></div>' +
    '<div class="field"><span class="label">Net worth by day</span><svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Net worth of each player at the end of each day">' + grid + lines + '</svg></div>' +
    '<div class="field"><span class="label">Biggest movers</span><p class="note mono">Up: ' + movers.slice(0, 4).map(([t, v]) => t + ' ' + (v >= 0 ? '+' : '') + Math.round(v * 100) + '%').join(', ') + '<br>Down: ' + movers.slice(-4).reverse().map(([t, v]) => t + ' ' + (v >= 0 ? '+' : '') + Math.round(v * 100) + '%').join(', ') + '</p></div>' +
    '<div class="opts"><button type="button" class="btn go" data-again="1">New game</button></div></div>';
}
function render() {
  const app = document.getElementById('app');
  const logEl = document.getElementById('log');
  const atBottom = !logEl || logEl.scrollTop + logEl.clientHeight >= logEl.scrollHeight - 30;
  app.innerHTML = screen === 'setup' ? setupHTML() : screen === 'results' ? resultsHTML() : gameHTML();
  const nl = document.getElementById('log');
  if (nl && atBottom) nl.scrollTop = nl.scrollHeight;
}

// ---------------------------------------------------------- clicks
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  const d = b.dataset;
  if (d.set) { const [k, v] = d.set.split(':'); settings[k] = k === 'rivals' ? Number(v) : v; render(); return; }
  if (d.fix) { settings[d.fix] = !settings[d.fix]; render(); return; }
  if (d.start) { startGame(); return; }
  if (d.again) { screen = 'setup'; G = null; pending = null; render(); return; }
  if (d.stock) { selected = d.stock; render(); return; }
  if (d.trade) { const [k, a] = d.trade.split(':'); humanTrade(k, a === 'max' || a === 'all' ? a : Number(a)); return; }
  if (!pending) return;
  const r = pending.resolve;
  if (d.continue) { pending = null; r(true); render(); return; }
  if (d.choice) { const v = pending.options[Number(d.choice)].value; pending = null; r(v); render(); return; }
  if (d.play && pending.kind === 'hand') { pending = null; r({ card: d.play, discard: false }); render(); return; }
  if (d.discard && pending.kind === 'hand') { pending = null; r({ card: d.discard, discard: true }); render(); return; }
});

render();
