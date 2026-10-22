'use strict';
/* PUBLIC / MOVE — concept prototype. All data is fictional and simulated. */
const NS = 'http://www.w3.org/2000/svg';
const $ = (s, r = document) => r.querySelector(s);
const app = $('#app'), sheet = $('#sheet'), mapEl = $('#map'), svg = $('#mapsvg');
const money = n => '$' + n.toFixed(2);
const START = 8 * 60 + 12;
const clock = m => { const h = Math.floor(m / 60) % 24, mm = m % 60; return ((h + 11) % 12 + 1) + ':' + String(mm).padStart(2, '0') + (h < 12 ? ' AM' : ' PM'); };

/* ---------- icons ---------- */
const P = {
  car: '<path d="M4 15l1.6-5a2 2 0 011.9-1.4h9a2 2 0 011.9 1.4L20 15v4h-3v-2H7v2H4z"/><path d="M4 15h16"/>',
  shuttle: '<rect x="3" y="5" width="18" height="12" rx="3"/><path d="M3 11h18M8 17v2M16 17v2"/>',
  community: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M12 17c-2-1.4-3-2.4-3-3.6a1.6 1.6 0 013-.6 1.6 1.6 0 013 .6c0 1.2-1 2.2-3 3.6z"/>',
  work: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
  health: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
  market: '<path d="M4 9h16l-1.5 10h-13zM8 9l3-5M16 9l-3-5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  access: '<circle cx="12" cy="5" r="2"/><path d="M5 9l7 1.5L19 9M12 10.5V15l-3 5M12 15l3 5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  go: '<path d="M4 11l16-7-7 16-2-7z"/>',
  city: '<path d="M3 20V9l6-3v14M9 20V4l6 3v13M15 20V11l6 2v7M2 20h20"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  siren: '<path d="M6 18v-5a6 6 0 0112 0v5M4 18h16v3H4zM12 3v2M3.5 6.5L5 8M20.5 6.5L19 8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  walk: '<circle cx="13" cy="4.5" r="2"/><path d="M10 21l2-6-2.5-2.5 1-4 3.5 2 2.5 1M9.5 12.5L7 14"/>',
  stairs: '<path d="M4 20h4v-4h4v-4h4V8h4"/>',
  quiet: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>',
  audio: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/>',
  text: '<path d="M3 19L8 5l5 14M5 14h6M15 19l3.5-9 3.5 9M16.3 16h4.4"/>',
  motion: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
  ramp: '<circle cx="9" cy="5" r="2"/><path d="M9 8v6h5l3 6M9 11h5M6 16a5 5 0 109 3"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  heart: '<path d="M12 20s-8-4.8-8-10.4A4.4 4.4 0 0112 7a4.4 4.4 0 018 2.6C20 15.2 12 20 12 20z"/>',
  moon: '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>',
  ret: '<path d="M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5"/>',
  leaf: '<path d="M5 19c0-8 4-13 15-14 0 9-4 14-12 14M5 19c2-5 5-8 9-10"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>'
};
const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;

/* ---------- data ---------- */
const DEST = {
  work: { name: 'Work', place: 'Meridian Works', icon: 'work', km: 6.4, mult: 1, eligible: true, cover: 'Covered by Employment Mobility Benefit', benefit: 'Employment Mobility Benefit', route: 'M220 560V320H500V200H780', end: [780, 200], note: 'Benefit applies' },
  health: { name: 'Healthcare', place: 'Riverside Clinic', icon: 'health', km: 4.1, mult: .8, eligible: true, cover: 'Healthcare journey: $0', benefit: 'Healthcare Mobility Benefit', route: 'M220 560H500V680', end: [500, 680], note: '$0 healthcare journey' },
  market: { name: 'Elm Park Market', place: 'Groceries & errands', icon: 'market', km: 1.9, mult: .4, eligible: false, cover: 'Monthly $18 fare cap', benefit: 'Monthly fare cap', route: 'M220 560V440H360', end: [360, 440], note: 'Small fare · $18 cap' }
};
const OPTS = {
  car: { name: 'Public autonomous car', icon: 'car', pickup: 4, ride: 18, base: 9.4, line: 'Private cabin · up to 3 riders', acc: 'Wheelchair-ready · low floor', plate: 'PM-0417', vname: 'City autonomous car' },
  shuttle: { name: 'Shared public shuttle', icon: 'shuttle', pickup: 7, ride: 27, base: 2.5, line: 'Shared with about 5 neighbours', acc: 'Level boarding · ramp · priority seats', plate: 'SH-22', vname: 'Shared shuttle, 5 seats free' },
  comm: { name: 'Community-contributed vehicle', icon: 'community', pickup: 3, ride: 21, base: 4.1, line: 'Community vehicle provided by a resident', acc: 'Standard entry · no ramp', plate: 'CV-3081', vname: 'Provided by a resident of Elm Park' }
};
const DISTRICTS = {
  central: { name: 'Central', max: 5, now: 3.1 },
  neighbourhood: { name: 'Neighbourhoods', max: 10, now: 4.6 },
  outlying: { name: 'Outlying', max: 15, now: 7.9 },
  night: { name: 'Overnight', max: 20, now: 9.4 }
};

/* ---------- state ---------- */
let saved = {};
try { saved = JSON.parse(localStorage.getItem('pm-access')) || {}; } catch (e) { }
const S = {
  screen: 'go', prev: 'go', step: 'home', dest: 'work', opt: 'car',
  access: Object.assign({ wheel: false, walk: false, stairs: false, quiet: false, audio: false, large: false, calm: false }, saved),
  cs: { on: true, win: 'work', essential: true, energy: 41.8, credit: 126 },
  district: 'central', hide: {}, events: [], em: null,
  sim: { phase: 'idle' }, journeys: 34, fare: 11.6, benefits: 96.4,
  city: { vehicles: 1284, wait: 3.8, riders: 18420, emerg: 46, comm: 212, step: 9310 }
};
const stepFree = () => S.access.wheel || S.access.stairs;

function applyAccess() {
  document.documentElement.style.fontSize = S.access.large ? '18px' : '16px';
  document.body.classList.toggle('calm', S.access.calm);
  try { localStorage.setItem('pm-access', JSON.stringify(S.access)); } catch (e) { }
}

function quote(k) {
  const d = DEST[S.dest], o = OPTS[k];
  const base = +(o.base * d.mult).toFixed(2);
  let cover, pay;
  if (d.eligible) { cover = base; pay = 0; }
  else { pay = +Math.min(base, Math.max(0, 18 - S.fare)).toFixed(2); cover = +(base - pay).toFixed(2); }
  const energy = +(base * .38).toFixed(2), upkeep = +(base * .47).toFixed(2);
  return { base, cover, pay, energy, upkeep, access: +(base - energy - upkeep).toFixed(2), pickup: o.pickup + (S.access.wheel ? (k === 'shuttle' ? 2 : 1) : 0), ride: o.ride };
}

/* ---------- announce / toast ---------- */
let toastT;
function toast(t, ms = 4200) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), ms); }
function announce(t) {
  $('#live').textContent = t;
  if (S.access.audio && 'speechSynthesis' in window) { try { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(t)); } catch (e) { } }
}

/* ---------- map ---------- */
const PATHS = {
  loopA: 'M80 200H640V560H80Z', loopB: 'M220 80H780V440H220Z', loopC: 'M360 320H920V680H360Z',
  l1: 'M60 440H360L440 360H640L720 280H940',
  l2: 'M510 30V250L640 380V720',
  l3: 'M60 640H300L380 560H780L860 480V380',
  ap: 'M640 680H220V560', em: 'M360 640V60'
};
const LINEC = { l1: '#8a3f6f', l2: '#3b5ba5', l3: '#c47a1a' };
const pathEls = {};
let vehicles = [];

function buildMap() {
  const xs = [], ys = [];
  for (let x = -340; x <= 1200; x += 140) xs.push(x);
  for (let y = -280; y <= 920; y += 120) ys.push(y);
  const hash = (a, b) => { const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return v - Math.floor(v); };
  const parks = [[80, 320], [360, 80], [640, 440]];
  let blocks = '';
  xs.slice(0, -1).forEach((x, i) => ys.slice(0, -1).forEach((y, j) => {
    const park = parks.some(p => p[0] === x && p[1] === y), r = hash(i, j);
    if (park) {
      blocks += `<rect x="${x + 9}" y="${y + 9}" width="122" height="102" rx="16" fill="#d3dfbf"/>`;
      for (let k = 0; k < 6; k++) blocks += `<circle cx="${x + 24 + hash(i + k, j) * 92}" cy="${y + 22 + hash(j + k, i) * 76}" r="${5 + hash(k, i + j) * 4}" fill="#b9cf9f"/>`;
    } else {
      const f = r > .66 ? '#e2d9c6' : r > .33 ? '#e6decd' : '#e9e1d1';
      blocks += `<rect x="${x + 9}" y="${y + 9}" width="122" height="102" rx="9" fill="${f}"/>`;
      if (r > .45) blocks += `<rect x="${x + 22}" y="${y + 22}" width="${40 + r * 30}" height="${30 + r * 20}" rx="5" fill="#dcd2bd"/>`;
    }
  }));
  const vr = xs.map(x => `M${x} -400V1100`).join(''), hr = ys.map(y => `M-500 ${y}H1500`).join('');
  const major = 'M500 -400V1100M-500 320H1500';
  const stations = {
    l1: [[200, 440], [360, 440], [630, 360], [830, 280]], l2: [[510, 100], [510, 250], [640, 480], [640, 640]], l3: [[150, 640], [300, 640], [500, 560], [780, 560], [860, 430]]
  };
  const st = Object.entries(stations).map(([k, a]) => a.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="6.5" fill="#fff" stroke="${LINEC[k]}" stroke-width="3.5"/>`).join('')).join('');
  svg.innerHTML = `
  <defs>${Object.entries(PATHS).map(([k, d]) => `<path id="p-${k}" d="${d}" fill="none"/>`).join('')}</defs>
  <rect x="-1500" y="-1500" width="4000" height="4000" fill="#ede6d6"/>
  ${blocks}
  <path d="M-500 890C100 800 260 870 520 825S900 790 1500 860" fill="none" stroke="#c4d8d7" stroke-width="96" stroke-linecap="round"/>
  <path d="M-500 890C100 800 260 870 520 825S900 790 1500 860" fill="none" stroke="#d3e4e2" stroke-width="70" stroke-linecap="round"/>
  <path d="${vr}${hr}" stroke="#d8cdb8" stroke-width="15" fill="none"/>
  <path d="${major}" stroke="#d8cdb8" stroke-width="21" fill="none"/>
  <path d="${vr}${hr}" stroke="#fffdf8" stroke-width="11" fill="none"/>
  <path d="${major}" stroke="#fffdf8" stroke-width="17" fill="none"/>
  <g class="lines" fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${['l1', 'l2', 'l3'].map(k => `<path d="${PATHS[k]}" stroke="#fffdf8" stroke-width="12"/><path d="${PATHS[k]}" stroke="${LINEC[k]}" stroke-width="6.5"/>`).join('')}
  </g>
  ${st}
  <g class="hubs">
    <circle cx="630" cy="364" r="15" fill="#fff" stroke="#15120e" stroke-width="5"/><text class="hublbl" x="652" y="342">Civic Hub</text>
    <circle cx="640" cy="560" r="15" fill="#fff" stroke="#15120e" stroke-width="5"/><text class="hublbl" x="662" y="538">Eastgate</text>
    <circle cx="300" cy="640" r="15" fill="#fff" stroke="#15120e" stroke-width="5"/><text class="hublbl" x="322" y="620">Harbor Yards</text>
    <circle cx="510" cy="250" r="15" fill="#fff" stroke="#15120e" stroke-width="5"/><text class="hublbl" x="532" y="236">Elm Exchange</text>
  </g>
  <text class="linelbl" x="70" y="426" fill="#8a3f6f">LINE 1</text><text class="linelbl" x="524" y="50" fill="#3b5ba5">LINE 2</text><text class="linelbl" x="70" y="664" fill="#c47a1a">LINE 3</text>
  <text class="lbl" x="92" y="386">Elm Park</text><text class="lbl" x="372" y="146">Civic Gardens</text><text class="lbl" x="652" y="506">Eastgate</text><text class="lbl" x="780" y="760" opacity=".8">The River</text>
  <g class="routeLayer">
    <path id="routeLine" d="${DEST.work.route}" fill="none" stroke="#15120e" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path id="routeDone" d="${DEST.work.route}" fill="none" stroke="#0b6b4f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 9999"/>
    <path id="apLine" d="${PATHS.ap}" fill="none" stroke="#15120e" stroke-width="5" stroke-dasharray="2 11" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g id="pinA"><circle cx="220" cy="560" r="22" fill="#0b6b4f" opacity=".16" class="pulse"/><circle cx="220" cy="560" r="11" fill="#fff" stroke="#15120e" stroke-width="5"/><text id="pinAl" x="238" y="584" class="hublbl" style="opacity:1;font-size:14px">Elm St &amp; 3rd</text></g>
  <g id="pinB" class="destpin routeLayer" transform="translate(780 200)"><rect x="-11" y="-11" width="22" height="22" rx="4" fill="#15120e" stroke="#fff" stroke-width="3"/><rect x="-4" y="-4" width="8" height="8" fill="#fff"/><text id="pinBl" x="-18" y="-14" text-anchor="end" class="hublbl" style="opacity:1;font-size:14px">Meridian Works</text></g>
  <g id="vehicles"></g>
  <g id="emV" style="display:none"></g>
  <g id="hero" style="transition:opacity .4s"></g>`;
  ['loopA', 'loopB', 'loopC', 'l1', 'l2', 'l3', 'ap', 'em'].forEach(k => pathEls[k] = $('#p-' + k));
  pathEls.route = $('#routeLine');
  buildVehicles();
}

function vehShape(type, color) {
  if (type === 'shuttle') return `<rect x="-14" y="-6" width="28" height="12" rx="5" fill="#0b6b4f" stroke="#fff" stroke-width="2"/><rect x="-9" y="-3" width="18" height="4" rx="2" fill="#bfe3d2"/>`;
  if (type === 'tram') return `<rect x="-19" y="-6" width="38" height="12" rx="6" fill="${color}" stroke="#fff" stroke-width="2.2"/><path d="M-12 -2h24" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>`;
  if (type === 'comm') return `<rect x="-10" y="-6" width="20" height="12" rx="4" fill="#c47a1a" stroke="#fff" stroke-width="2"/><circle cx="2" cy="0" r="2.6" fill="#fff"/>`;
  if (type === 'emerg') return `<circle r="11" fill="#c8372d" class="sirenpulse"/><rect x="-12" y="-6.5" width="24" height="13" rx="4" fill="#c8372d" stroke="#fff" stroke-width="2"/><path d="M-2 -3.5h4v7h-4zM-5 -1h10v2h-10z" fill="#fff"/>`;
  return `<rect x="-10" y="-6" width="20" height="12" rx="4.5" fill="#15120e" stroke="#fff" stroke-width="2"/><rect x="-3" y="-4" width="8" height="8" rx="2" fill="#6d665a"/>`;
}

function buildVehicles() {
  const g = $('#vehicles');
  const def = [
    ['car', 'loopA', .02, 46], ['car', 'loopA', .38, 46], ['shuttle', 'loopA', .62, 38], ['comm', 'loopA', .85, 44],
    ['car', 'loopB', .1, 50], ['shuttle', 'loopB', .45, 40], ['comm', 'loopB', .7, 46], ['car', 'loopB', .9, 52],
    ['car', 'loopC', .05, 48], ['car', 'loopC', .33, 44], ['shuttle', 'loopC', .55, 38], ['comm', 'loopC', .8, 46],
    ['emerg', 'loopC', .2, 120], ['emerg', 'loopA', .5, 110],
    ['tram', 'l1', .1, 62, '#8a3f6f'], ['tram', 'l1', .6, 62, '#8a3f6f'], ['tram', 'l2', .2, 58, '#3b5ba5'], ['tram', 'l2', .7, 58, '#3b5ba5'], ['tram', 'l3', .15, 60, '#c47a1a'], ['tram', 'l3', .65, 60, '#c47a1a']
  ];
  vehicles = def.map(([type, path, off, speed, color]) => {
    const el = document.createElementNS(NS, 'g'); el.setAttribute('class', 'veh'); el.innerHTML = vehShape(type, color); g.appendChild(el);
    return { type, path: pathEls[path], len: pathEls[path].getTotalLength(), off, speed, pp: path[0] === 'l', el };
  });
}

function place(el, path, d) {
  const a = path.getPointAtLength(d), b = path.getPointAtLength(d + 1.5);
  el.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(1)})`);
}

/* viewBox fitting */
let vb = { x: 0, y: 0, w: 1000, h: 800 }, tg = null;
function insets() {
  const W = innerWidth, H = innerHeight;
  if (W >= 900) return { l: 120 + 440 + 20, t: 70, r: 70, b: 30 };
  const top = sheet.getBoundingClientRect().top;
  return { l: 10, r: 10, t: 74, b: Math.max(60, H - top + 14) };
}
function fit(bb) {
  const W = mapEl.clientWidth || innerWidth, H = mapEl.clientHeight || innerHeight, i = insets();
  const uw = Math.max(80, W - i.l - i.r), uh = Math.max(80, H - i.t - i.b);
  const s = Math.min(uw / bb.w, uh / bb.h), cx = bb.x + bb.w / 2, cy = bb.y + bb.h / 2;
  return { x: cx - (i.l + uw / 2) / s, y: cy - (i.t + uh / 2) / s, w: W / s, h: H / s };
}
function pad(b, p) { return { x: b.x - p, y: b.y - p, w: b.width ? b.width + 2 * p : b.w + 2 * p, h: b.height ? b.height + 2 * p : b.h + 2 * p }; }
function bboxNow() {
  if (S.screen === 'city') return { x: 20, y: 20, w: 940, h: 840 };
  const st = S.step, rb = pathEls.route.getBBox();
  if (st === 'home') return { x: 80, y: 400, w: 420, h: 330 };
  if (st === 'approach') {
    const a = pathEls.ap.getBBox(); const x = Math.min(a.x, rb.x), y = Math.min(a.y, rb.y), x2 = Math.max(a.x + a.width, rb.x + rb.width), y2 = Math.max(a.y + a.height, rb.y + rb.height);
    return S.sim.phase === 'matching' || S.sim.phase === 'approach' || S.sim.phase === 'wait' ? pad({ x: a.x, y: a.y, width: a.width, height: a.height }, 70) : pad({ x, y, width: x2 - x, height: y2 - y }, 70);
  }
  return pad({ x: rb.x, y: rb.y, width: rb.width, height: rb.height }, 80);
}
function retarget(snap) { tg = fit(bboxNow()); if (snap || S.access.calm) { vb = { ...tg }; applyVB(); } }
function applyVB() { svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); }
addEventListener('resize', () => retarget(true));

/* ---------- views ---------- */
function backBtn(act, label) { return `<button class="back" data-act="${act}">${ic('back')}${label || 'Back'}</button>`; }

function viewHome() {
  return `<div class="grab"></div>
  <p class="eyebrow">A concept for 2040 · Elm St &amp; 3rd</p>
  <h1 id="h" tabindex="-1">Where would you like to go?</h1>
  <p class="meta" style="display:flex;gap:8px;align-items:center;margin-top:10px"><span class="chip live">12 vehicles within 5 min</span> <span class="meta">2 accessible</span></p>
  <div class="list">${Object.entries(DEST).map(([k, d]) => `
    <button class="row" data-act="dest" data-id="${k}"><span class="ico">${ic(d.icon)}</span>
    <span class="body"><b>${d.name}</b><span class="meta">${d.place} · ${d.km} km</span></span>
    <span class="chip ${d.eligible ? 'good' : ''}">${d.note}</span></button>`).join('')}</div>
  <p class="fine" style="margin-top:18px;display:flex;gap:8px;align-items:center">${ic('ret')} Every journey comes with a guaranteed way back.</p>`;
}

function viewOptions() {
  const d = DEST[S.dest];
  if (S.opt === 'comm' && S.access.wheel) S.opt = 'car';
  const q = quote(S.opt), o = OPTS[S.opt];
  const rows = Object.entries(OPTS).map(([k, o2]) => {
    const qq = quote(k), blocked = k === 'comm' && S.access.wheel, sel = S.opt === k;
    const free = qq.pay === 0;
    const tags = [];
    if (k === 'comm') tags.push(`<span class="tag good">${ic('heart')}Community vehicle provided by a resident</span>`);
    else tags.push(`<span class="tag">${ic('access')}${o2.acc}</span>`);
    if (stepFree() && k !== 'comm') tags.push(`<span class="tag good">${ic('check')}Accessible vehicle reserved</span>`);
    if (S.access.walk) tags.push(`<span class="tag">${ic('walk')}Door-to-door pickup</span>`);
    if (S.access.quiet) tags.push(`<span class="tag">${ic('quiet')}Quiet cabin</span>`);
    return `<button class="opt" role="radio" aria-checked="${sel}" aria-disabled="${blocked}" ${blocked ? 'disabled' : ''} data-act="opt" data-id="${k}">
      <span class="ico">${ic(o2.icon)}</span>
      <span class="body"><b>${o2.name}</b>
        <span class="meta">Pickup in ${qq.pickup} min · Arrive ${clock(START + qq.pickup + qq.ride)}</span>
        ${blocked ? `<span class="meta" style="margin-top:6px;font-weight:700">Not wheelchair-accessible, so it's not offered for your settings.</span>` : `<span class="tags">${tags.join('')}</span>`}</span>
      <span class="price ${free ? 'free' : 'paid'}"><strong class="num">${free ? '$0' : money(qq.pay)}</strong>${qq.cover > 0 && !blocked ? `<s>${money(qq.base)}</s>` : ''}</span></button>`;
  }).join('');
  const bene = d.eligible
    ? `<div class="rline benefit"><span>${ic('check')}${d.cover}</span><span class="num">−${money(q.cover)}</span></div>`
    : `<div class="rline benefit"><span>${ic('check')}${q.cover > 0 ? 'Monthly $18 fare cap applied' : 'No fare for this trip'}</span><span class="num">−${money(q.cover)}</span></div>`;
  return `<div class="grab"></div>${backBtn('back-home', 'Destinations')}
  <p class="eyebrow">Elm St &amp; 3rd → ${d.place} · ${d.km} km</p>
  <h1 id="h" tabindex="-1">Choose your ride to ${d.name === 'Work' ? 'work' : d.name.toLowerCase()}</h1>
  <div class="opts" role="radiogroup" aria-label="Journey options">${rows}</div>
  <h2>The whole cost, in the open</h2>
  <div class="receipt" aria-live="polite">
    <div class="rline"><span>Fare, at cost</span><span class="num">${money(q.base)}</span></div>
    <div class="rline sub"><span>Energy</span><span class="num">${money(q.energy)}</span></div>
    <div class="rline sub"><span>Vehicle upkeep</span><span class="num">${money(q.upkeep)}</span></div>
    <div class="rline sub"><span>Accessible service</span><span class="num">${money(q.access)}</span></div>
    ${bene}
    <div class="rline total ${q.pay === 0 ? 'zero' : ''}"><span>You pay</span><span class="num">${money(q.pay)}</span></div>
  </div>
  <p class="fine">No surge. No tips. No ads. Fares only cover energy and upkeep.</p>
  <div class="sticky"><button class="btn" data-act="confirm">Confirm ${o.name}</button></div>`;
}

function viewApproach() {
  const s = S.sim, o = OPTS[S.opt], q = quote(S.opt);
  const wait = s.phase === 'wait', match = s.phase === 'matching';
  const title = match ? 'Finding your vehicle…' : wait ? 'Your vehicle is here' : 'Your vehicle is on its way';
  const ex = [];
  if (stepFree()) ex.push(`<li class="${s.reassigned ? 'pop' : ''}">${ic('ramp')}<span>Accessible vehicle reserved${S.access.wheel ? ' · ramp ready' : ' · step-free route'}</span></li>`);
  if (s.reassigned) ex.push(`<li class="alert pop">${ic('siren')}<span>Vehicle reassigned for an accessibility need — your new vehicle is ${q.pickup} min away.</span></li>`);
  return `<div class="grab"></div>
  <div class="banner">${ic('check')}Trip confirmed · You pay ${money(q.pay)}</div>
  <h1 id="h" tabindex="-1">${title}</h1>
  <div class="bigeta" aria-hidden="${match}"><span class="num" id="eta">${wait ? 0 : q.pickup}</span><span>min away</span></div>
  <div class="bar" role="progressbar" aria-label="Vehicle approach"><i id="bar" style="width:${wait ? 100 : 0}%"></i></div>
  <div class="vcard"><span class="ico">${ic(o.icon)}</span><div><b><span class="plate">${o.plate}</span></b><span class="meta">${o.vname}</span></div></div>
  <ul class="facts">
    ${ex.join('')}
    <li>${ic(DEST[S.dest].eligible ? 'heart' : 'check')}<span>${DEST[S.dest].cover}</span></li>
    <li>${ic('ret')}<span>Return journey guaranteed</span></li>
    ${S.access.quiet ? `<li>${ic('quiet')}<span>Quiet cabin on</span></li>` : ''}
  </ul>
  <button class="btn accent ${wait ? 'ready-go' : ''}" id="readyBtn" data-act="ready" ${wait ? '' : 'disabled'}>I’m Ready</button>
  <p class="fine" style="text-align:center;margin-top:10px">${wait ? 'Doors are unlocked. Press when you’re seated.' : 'Doors unlock when your vehicle arrives.'}</p>
  <button class="link" data-act="cancel">Cancel trip · always free</button>`;
}

function viewRide() {
  const d = DEST[S.dest], q = quote(S.opt);
  return `<div class="grab"></div>
  <p class="eyebrow">En route · ${OPTS[S.opt].plate}</p>
  <h1 id="h" tabindex="-1">On your way to ${d.name === 'Work' ? 'work' : d.name}</h1>
  <div class="bigeta"><span class="num" id="eta">${q.ride}</span><span>min left</span></div>
  <div class="bar" role="progressbar" aria-label="Journey progress"><i id="bar" style="width:0"></i></div>
  <p class="now">${ic('pin')}<span id="street">Elm Street</span></p>
  <ul class="events" id="events" aria-live="polite">${S.events.map(e => `<li class="${e.k}">${e.t}</li>`).join('')}</ul>
  <div class="chips">${DEST[S.dest].eligible ? `<span class="chip good">${ic('check')}$0 fare</span>` : ''}${S.access.quiet ? `<span class="chip">${ic('quiet')}Quiet cabin</span>` : ''}${S.access.audio ? `<span class="chip">${ic('audio')}Audio navigation</span>` : ''}${stepFree() ? `<span class="chip">${ic('stairs')}Step-free route</span>` : ''}</div>`;
}

function viewArrived() {
  const d = DEST[S.dest], q = quote(S.opt);
  return `<div class="grab"></div>
  <div class="check">${ic('check')}</div>
  <h1 id="h" tabindex="-1">You’ve arrived at ${d.place}</h1>
  <p class="lead" style="margin-bottom:6px">${d.eligible ? d.cover + '.' : 'Thank you for riding.'}</p>
  <div class="sumrow"><span>You paid</span><b class="num" style="color:var(--accent)">${money(q.pay)}</b></div>
  <div class="sumrow"><span>Journey</span><b>${q.ride} min · ${d.km} km</b></div>
  <div class="sumrow"><span>Emissions avoided vs. driving alone</span><b>≈ ${(d.km * .17).toFixed(1)} kg CO₂</b></div>
  <div class="card green" style="margin:18px 0"><div style="display:flex;gap:12px;align-items:flex-start"><span style="margin-top:2px">${ic('ret')}</span><div><b style="font-size:1.05rem">Return journey guaranteed</b><p class="fine" style="margin-top:4px">${S.dest === 'work' ? 'A vehicle is reserved for 5:30 PM.' : 'A vehicle will be ready when you are.'} Change or cancel any time. It’s always free.</p></div></div></div>
  <button class="btn" data-act="done">Done</button>
  <button class="link" data-act="to-impact">See what this journey adds up to</button>`;
}

function viewGo() {
  return { home: viewHome, options: viewOptions, approach: viewApproach, ride: viewRide, arrived: viewArrived }[S.step]();
}

function viewCity() {
  const c = S.city;
  const leg = (k, label, color) => `<button class="leg" data-act="legend" data-id="${k}" aria-pressed="${!S.hide[k]}"><i style="background:${color}"></i>${label}</button>`;
  return `<div class="grab"></div>
  <p class="eyebrow"><span class="chip live">Live · fictional demo data</span></p>
  <h1 id="h" tabindex="-1">Your City Right Now</h1>
  <div class="stats">
    <div class="stat"><small>Vehicles in service</small><strong id="s-veh">${c.vehicles.toLocaleString()}</strong></div>
    <div class="stat"><small>Average pickup</small><strong id="s-wait">${c.wait.toFixed(1)} min</strong></div>
    <div class="stat"><small>Neighbours riding</small><strong id="s-rid">${c.riders.toLocaleString()}</strong></div>
    <div class="stat"><small>Emergency units ready</small><strong id="s-em">${c.emerg} / 48</strong></div>
    <div class="stat"><small>Community vehicles lent</small><strong id="s-com">${c.comm}</strong></div>
    <div class="stat"><small>Step-free trips today</small><strong id="s-stp">${c.step.toLocaleString()}</strong></div>
  </div>
  <div class="legend" role="group" aria-label="Show on map">
    ${leg('car', 'Public cars', '#f2f2f2')}${leg('shuttle', 'Shuttles', '#0b6b4f')}${leg('comm', 'Community', '#c47a1a')}${leg('emerg', 'Emergency', '#c8372d')}${leg('tram', 'Transit lines', 'linear-gradient(90deg,#8a3f6f,#3b5ba5,#c47a1a)')}
  </div>
  <div class="ticker" aria-live="off">${ic('siren')}<span id="tick">${TICKS[0]}</span></div>`;
}
const TICKS = [
  'Emergency unit E-12 is responding on Civic Ave. Nearby vehicles are yielding.',
  'Line 2 is running every 4 minutes. Shuttles are covering the Elm Park detour.',
  'A resident’s car just joined the network in Eastgate.',
  'Harbor Yards depot: 31 vehicles charging on surplus solar.',
  'Vehicle reassigned for an accessibility need, with 2 min added to pickup.'
];

function viewServe() {
  const c = S.cs, wins = { work: 'Work hours', night: 'Nights', always: 'Whenever parked' };
  return `<div class="page"><div class="page-head"><p class="eyebrow">Community Service</p>
  <h1 id="h" tabindex="-1">Lend your car to the city while it sleeps.</h1>
  <p class="lead">Most cars sit parked about 95% of the time. Contributed cars carry neighbours, and you’re reimbursed for the energy they use. It isn’t income. It’s the city saying thanks.</p></div>
  <div class="card" style="padding:6px 20px">
    <button class="switch" role="switch" aria-checked="${c.on}" data-act="cs-on"><span class="ico">${ic('car')}</span><span class="body"><b>My Solene S2 · contributing</b><span class="meta">${c.on ? 'Available when parked and unused' : 'Paused · stays at home, fully yours'}</span></span><span class="knob"></span></button>
    <div style="padding:6px 0 14px"><p class="fine" style="font-weight:700;margin-bottom:2px">Share it during</p>
      <div class="seg" role="group" aria-label="Sharing window">${Object.entries(wins).map(([k, v]) => `<button data-act="cs-win" data-id="${k}" aria-pressed="${c.win === k}">${v}</button>`).join('')}</div>
      <button class="switch" role="switch" aria-checked="${c.essential}" data-act="cs-ess" style="border:0;min-height:60px"><span class="body"><b>Essential trips only</b><span class="meta">Healthcare, work and food. Never errands.</span></span><span class="knob"></span></button></div>
  </div>
  <div class="card dark"><p class="eyebrow" style="color:#bfe3d2">Right now</p><p style="font-size:1.15rem;font-weight:700" id="cs-now">${c.on ? 'Carrying a neighbour to Riverside Clinic · 6 min left' : 'Resting at home. Nothing is asked of your car.'}</p>
    <p class="fine" style="margin-top:6px">${c.on ? 'Community vehicle provided by a resident. That’s you.' : ''}</p>
    <button class="btn ghost" style="margin-top:16px;min-height:52px" data-act="recall">Recall my car</button></div>
  <div class="grid2">
    <div class="mini"><small>Energy reimbursed · October</small><strong id="cs-en">${money(c.energy)}</strong><p class="fine" style="margin-top:6px">Metered kWh at cost. No margin.</p></div>
    <div class="mini"><small>Public-service credit</small><strong id="cs-cr">${c.credit}</strong><p class="fine" style="margin-top:6px">≈ 21 hours of civic service</p></div>
  </div>
  <div class="card"><h2>What credit is for</h2>
    <div class="promise"><span class="ico">${ic('heart')}</span><div><h3>Neighbour Rides</h3><p class="fine">Gift trips to someone who needs one.</p><button class="chip good" style="margin-top:8px;min-height:44px" data-act="redeem" data-id="Gifted 20 credits as Neighbour Rides.">Gift 20 credits</button></div></div>
    <div class="promise"><span class="ico">${ic('bolt')}</span><div><h3>Home energy rebate</h3><p class="fine">Credit against your home charger’s grid fees.</p><button class="chip good" style="margin-top:8px;min-height:44px" data-act="redeem" data-id="Applied 30 credits to your energy rebate.">Apply 30 credits</button></div></div>
    <p class="fine" style="padding-top:6px"><b>Credit never buys faster service.</b> Nobody can skip the queue. Your car comes home charged, cleaned and on time.</p></div></div>`;
}

function viewRights() {
  const dd = DISTRICTS[S.district];
  return `<div class="page"><div class="page-head"><p class="eyebrow">The Mobility Guarantee</p>
  <h1 id="h" tabindex="-1">A way to get where you need to go. Always.</h1>
  <p class="lead">Not a feature. A promise the city is accountable for, and publishes every day.</p></div>
  <div class="card green"><p class="eyebrow" style="color:#cdeedd">Maximum pickup time</p>
    <div class="big num" id="g-max">${dd.max}<span style="font-size:.4em;letter-spacing:0"> min</span></div>
    <p class="fine" style="margin-top:8px">Right now the average in this area is <b id="g-now" class="num">${dd.now} min</b>.</p>
    <div class="seg" role="group" aria-label="Area" style="background:rgba(255,255,255,.16)">${Object.entries(DISTRICTS).map(([k, v]) => `<button data-act="district" data-id="${k}" aria-pressed="${S.district === k}" style="${S.district === k ? 'background:#fff;color:var(--onink)' : ''}">${v.name}</button>`).join('')}</div></div>
  <div class="card" style="padding:4px 20px">
    <div class="promise"><span class="ico">${ic('moon')}</span><div><h3>24/7 for essential travel</h3><p class="fine">Healthcare, shift work, food and safety. Every hour, every district.</p>
      <div class="day" role="img" aria-label="Full service 6 AM to 10 PM, essential travel service 10 PM to 6 AM"><span style="flex:4;background:#2f5d4b">Essential trips</span><span style="flex:16;background:var(--accent)">Every journey</span><span style="flex:4;background:#2f5d4b">Essential</span></div><div class="fine" style="display:flex;justify-content:space-between"><span>12 AM</span><span>6 AM</span><span>6 PM</span><span>12 AM</span></div></div></div>
    <div class="promise"><span class="ico">${ic('ramp')}</span><div><h3>Accessible service, everywhere</h3><p class="fine">A ramp vehicle within 8 minutes in every neighbourhood. If yours is reassigned for an accessibility need, you’re told right away.</p></div></div>
    <div class="promise"><span class="ico">${ic('ret')}</span><div><h3>Guaranteed return transportation</h3><p class="fine">Every outbound trip reserves a way back, whether it’s late, raining, or the vehicle you came in has been called away.</p></div></div>
    <div class="promise"><span class="ico">${ic('siren')}</span><div><h3>Emergency vehicles go first</h3><p class="fine">Self-driving ambulances and fire units have right-of-way. Your vehicle yields, the guarantee clock pauses, and you’re kept informed.</p></div></div>
  </div>
  <div class="card"><h3>If we miss a promise</h3><p class="fine" style="margin-top:6px">The delay is logged in the public ledger, a person at the city reviews it, and your trip stays at $0.</p></div></div>`;
}

function sw(k, icon, title, desc) {
  return `<button class="switch" role="switch" aria-checked="${S.access[k]}" data-act="acc" data-id="${k}"><span class="ico">${ic(icon)}</span><span class="body"><b>${title}</b><span class="meta">${desc}</span></span><span class="knob"></span></button>`;
}
function viewAccess() {
  const a = S.access, bits = [];
  if (a.wheel) bits.push('Ramp vehicle'); if (a.walk) bits.push('Door-to-door'); if (a.stairs) bits.push('Step-free route'); if (a.quiet) bits.push('Quiet cabin'); if (a.audio) bits.push('Spoken updates');
  return `<div class="page"><div class="page-head">${backBtn('close-access', 'Back')}<p class="eyebrow">Accessibility</p>
  <h1 id="h" tabindex="-1">Travel on your terms.</h1>
  <p class="lead">Set once. Every journey, vehicle and route follows.</p></div>
  <div class="card" style="padding:6px 20px">
    ${sw('wheel', 'ramp', 'Wheelchair access', 'Ramp vehicles only, with extra time to board')}
    ${sw('walk', 'walk', 'Reduced walking', 'Door-to-door pickup and drop-off')}
    ${sw('stairs', 'stairs', 'No-stairs routing', 'Step-free stations, entrances and transfers')}
    ${sw('quiet', 'quiet', 'Quiet travel', 'Low-sensory cabin, softer light, no announcements')}
    ${sw('audio', 'audio', 'Audio navigation', 'Spoken updates for pickup, route and arrival')}
  </div>
  <div class="card" style="padding:6px 20px">
    ${sw('large', 'text', 'Larger text', 'Increases text across the app')}
    ${sw('calm', 'motion', 'Reduce motion', 'Calm animations and fewer moving parts')}
  </div>
  <div class="card dark"><p class="eyebrow" style="color:#bfe3d2">Your next journey</p>
    <p style="font-size:1.1rem;font-weight:700">${bits.length ? bits.join(' · ') : 'Standard service. Switch something on to see it applied.'}</p>
    ${a.wheel ? '<p class="fine" style="margin-top:8px">Community vehicles without a ramp won’t be offered to you.</p>' : ''}</div></div>`;
}

const FACTS_REAL = [
  ['≈ $13,000', 'saved per year by a household that takes public transit instead of owning a car.', 'APTA, public transportation savings estimates'],
  ['≈ $12,000', 'a year to own and run a new car in the U.S., about $1,000 a month.', 'AAA, Your Driving Costs (2023)'],
  ['~10×', 'safer per mile: public transit travel compared with travelling by car.', 'APTA, citing National Safety Council data'],
  ['≈ 40,000', 'people die on U.S. roads each year, a toll that transit and safer vehicles can reduce.', 'NHTSA, FARS annual reports'],
  ['≈ 28%', 'of U.S. greenhouse gas emissions come from transportation, the largest source.', 'U.S. EPA, GHG inventory'],
  ['$1 → ~$5', 'in economic return for every dollar invested in public transportation.', 'APTA / Economic Development Research Group'],
  ['≈ 95%', 'of the time a typical private car sits parked.', 'Shoup, The High Cost of Free Parking; RAC Foundation']
];
const FACTS_PROJ = [
  ['up to 90%', 'fewer cars needed in a city served by shared self-driving fleets plus high-capacity transit.', 'ITF/OECD, Shared Mobility Simulations for Lisbon (2015). Modelled scenario'],
  ['up to 95%', 'of on-street parking space could be freed for homes, trees and bike lanes.', 'ITF/OECD, Lisbon study. Modelled scenario'],
  ['1 in 4', 'U.S. adults live with a disability. Door-to-door ramp vehicles could mean independence on demand.', 'CDC, Disability and Health data'],
  ['≈ 94%', 'of crashes involve a driver-related critical factor in NHTSA’s survey. Better systems may remove many of them.', 'NHTSA (2015). Frequently debated; treat as directional'],
  ['Faster', 'emergency response when idle autonomous units are pre-positioned and cars yield automatically.', 'Concept. No claim of measured results']
];

function viewImpact() {
  const months = [['May', 14.2, 56], ['Jun', 16.0, 64], ['Jul', 18, 74], ['Aug', 17.4, 70], ['Sep', 15.1, 62], ['Oct', S.fare, 68]];
  const pct = Math.min(100, S.fare / 18 * 100);
  const proof = (f, cls) => `<div class="proof ${cls}"><div class="n">${f[0]}</div><p>${f[1]}<span class="src">${f[2]}</span></p></div>`;
  return `<div class="page"><div class="page-head"><p class="eyebrow">Public Benefit · October</p>
  <h1 id="h" tabindex="-1">What this network gave back.</h1>
  <p class="lead">Fictional numbers for a fictional neighbour. Everything below is shown in the open.</p></div>
  <div class="card green"><p class="eyebrow" style="color:#cdeedd">Your fares this month</p>
    <div class="big num">${money(S.fare)}</div>
    <div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="18" aria-valuenow="${S.fare}" aria-label="Fare cap"><i style="width:${pct}%"></i></div>
    <p class="fine"><b>$18 fare cap</b>: you never pay more than this in a month, however much you travel.</p></div>
  <div class="grid2">
    <div class="mini"><small>Journeys taken</small><strong id="im-j">${S.journeys}</strong></div>
    <div class="mini"><small>Benefits applied</small><strong>${money(S.benefits)}</strong></div>
    <div class="mini" style="grid-column:1/-1"><small>Estimated private-car costs avoided</small><strong>$684</strong><p class="fine" style="margin-top:6px">Illustrative: about two-thirds of a typical ~$1,015 monthly car cost.</p></div>
  </div>
  <div class="card"><h2>Six months of your costs</h2><p class="fine">Green: car costs avoided (illustrative). Labels: what you paid.</p>
    <div class="chart" role="img" aria-label="Monthly fares were always $18 or less">${months.map((m, i) => `<div><span class="num">$${m[1].toFixed(0)}</span><i style="height:${m[2]}%;animation-delay:${i * 80}ms"></i><span>${m[0]}</span></div>`).join('')}</div></div>
  <div class="card"><h2>Where each dollar goes</h2>
    <div class="stack" role="img" aria-label="Energy 38%, upkeep 47%, accessible service 15%"><span style="flex:38;background:var(--accent)"></span><span style="flex:47;background:var(--ink)"></span><span style="flex:15;background:var(--indigo)"></span></div>
    <p class="fine">Energy 38% · Upkeep 47% · Accessible service 15%. Same split as the receipt you saw when booking.</p>
    <h3 style="margin-top:18px">You’ll never find</h3><ul class="never"><li>Surge pricing</li><li>Tipping</li><li>Advertising</li><li>Premium tier</li><li>Paid queue-jumping</li></ul></div>

  <p class="kicker" style="color:var(--accent)">Why this works</p>
  <h2 style="font-size:1.6rem;letter-spacing:-.02em">What public transportation already proves.</h2>
  <div>${FACTS_REAL.map(f => proof(f, '')).join('')}</div>
  <p class="kicker" style="color:var(--amber)">What this technology could add</p>
  <h2 style="font-size:1.6rem;letter-spacing:-.02em">Projections for shared, public, self-driving fleets.</h2>
  <p class="fine">Scenarios from modelling studies, not promises.</p>
  <div>${FACTS_PROJ.map(f => proof(f, 'proj')).join('')}</div>
  <p class="kicker" style="color:var(--indigo)">Honest about the hard parts</p>
  <h2 style="font-size:1.6rem;letter-spacing:-.02em">Questions this vision has to answer.</h2>
  <div class="card" style="padding:4px 20px">
    <div class="promise"><span class="ico">${ic('work')}</span><div><h3>Drivers’ livelihoods</h3><p class="fine">Hundreds of thousands of people drive buses, taxis and rideshares. A fair transition (retraining, pay, public jobs in fleet care and accessibility) must come first, not last.</p></div></div>
    <div class="promise"><span class="ico">${ic('shield')}</span><div><h3>Privacy and surveillance</h3><p class="fine">A public network knows where everyone goes. Data should be minimal, deleted fast and never sold or handed over without a warrant.</p></div></div>
    <div class="promise"><span class="ico">${ic('check')}</span><div><h3>Safety, proven in the open</h3><p class="fine">Autonomy must earn trust with published incident data and independent audits before replacing human drivers at scale.</p></div></div>
    <div class="promise"><span class="ico">${ic('chart')}</span><div><h3>Who pays</h3><p class="fine">Roads, schools and libraries are funded together. This would be too, ideally by redirecting road and parking subsidies, with public ownership and oversight.</p></div></div>
  </div>
  <div class="card dark"><p class="eyebrow" style="color:#bfe3d2">Make it real</p>
    <p style="font-size:1.15rem;font-weight:700">Mobility as a public right takes people, not just technology.</p>
    <ul class="never" style="margin-top:12px"><li>Ask your city council for a public-mobility pilot</li><li>Back transit riders’ unions and disability-rights groups</li><li>Demand open safety data from any AV operator</li><li>Share this concept with a neighbour</li></ul></div>
  <p class="fine" style="margin-top:20px">Figures are rounded from public sources and are shown for concept illustration. Check the original before citing. Personal data on this screen is fictional.</p>
  <button class="btn" style="margin-top:22px" data-act="goto" data-id="go">Plan a journey</button></div>`;
}

/* ---------- render ---------- */
const TABS = [['go', 'Go', 'go'], ['city', 'City', 'city'], ['serve', 'Serve', 'community'], ['rights', 'Guarantee', 'shield'], ['impact', 'Impact', 'chart']];
function renderTabs() {
  $('#tabs').innerHTML = TABS.map(t => `<button class="tab" data-act="goto" data-id="${t[0]}" ${S.screen === t[0] ? 'aria-current="page"' : ''}>${ic(t[2])}<span>${t[1]}</span></button>`).join('');
  $('#gearBtn').innerHTML = ic('access');
  $('#gearBtn').setAttribute('aria-pressed', S.screen === 'access');
}
function render(focus = true) {
  app.dataset.mode = (S.screen === 'go' || S.screen === 'city') ? 'map' : 'page';
  app.dataset.screen = S.screen; app.dataset.step = S.step;
  const v = { go: viewGo, city: viewCity, serve: viewServe, rights: viewRights, impact: viewImpact, access: viewAccess }[S.screen]();
  sheet.innerHTML = `<div class="enter">${v}</div>`; sheet.scrollTop = 0;
  renderTabs(); syncMap();
  if (focus) { const h = $('#h'); if (h) h.focus({ preventScroll: true }); }
}
function syncMap() {
  const d = DEST[S.dest];
  ['routeLine', 'routeDone'].forEach(id => $('#' + id).setAttribute('d', d.route));
  const rl = pathEls.route.getTotalLength();
  $('#routeDone').setAttribute('stroke-dasharray', `0 ${rl + 10}`);
  $('#pinB').setAttribute('transform', `translate(${d.end[0]} ${d.end[1]})`); $('#pinBl').textContent = d.place;
  buildHero();
  vehicles.forEach(v => { const k = v.type; v.el.style.display = S.hide[k] ? 'none' : ''; });
  setTimeout(() => retarget(false), 30); retarget(false);
}
function buildHero() {
  const o = S.opt, h = $('#hero');
  const shape = o === 'shuttle' ? `<rect x="-18" y="-9" width="36" height="18" rx="7" fill="#0b6b4f" stroke="#fff" stroke-width="3"/><rect x="-12" y="-5" width="24" height="6" rx="3" fill="#bfe3d2"/>`
    : o === 'comm' ? `<rect x="-14" y="-8.5" width="28" height="17" rx="6" fill="#c47a1a" stroke="#fff" stroke-width="3"/><circle cx="3" cy="0" r="3.4" fill="#fff"/>`
      : `<rect x="-14" y="-8.5" width="28" height="17" rx="6" fill="#15120e" stroke="#fff" stroke-width="3"/><rect x="-4" y="-5.5" width="11" height="11" rx="3" fill="#6d665a"/>`;
  h.innerHTML = `<g transform="scale(1.35)"><circle r="22" fill="#0b6b4f" opacity=".25" class="pulse"/>${shape}</g>`;
}

/* ---------- simulation ---------- */
const SIM = { matching: 1800, approach: 14000, ride: 22000 };
function addEvent(t, k = '') {
  S.events.push({ t, k });
  const ul = $('#events'); if (ul) { const li = document.createElement('li'); li.className = k; li.textContent = t; ul.appendChild(li); }
  announce(t);
}
function streetAt(f) { return f < .26 ? 'Elm Street' : f < .56 ? 'Civic Avenue' : f < .7 ? 'Riverside Row' : 'Meridian Avenue'; }
function startTrip() {
  S.step = 'approach'; S.events = []; S.em = null;
  S.sim = { phase: 'matching', t0: performance.now(), moved: 0, hold: 0, ev: {}, reassigned: false };
  render(); announce('Trip confirmed. Finding your vehicle.');
}
function resetTrip() { S.step = 'home'; S.sim = { phase: 'idle' }; S.events = []; S.em = null; $('#emV').style.display = 'none'; render(); }

let last = performance.now();
function frame(now) {
  const dt = Math.min(.1, (now - last) / 1000); last = now;
  const t = now / 1000;
  // ambient fleet
  vehicles.forEach(v => {
    let d = t * v.speed + v.off * v.len;
    if (v.pp) { const m = d % (2 * v.len); d = m > v.len ? 2 * v.len - m : m; } else d = d % v.len;
    place(v.el, v.path, d);
  });
  // trip
  const s = S.sim, hero = $('#hero');
  if (s.phase && s.phase !== 'idle') {
    const rl = pathEls.route.getTotalLength(), al = pathEls.ap.getTotalLength();
    if (s.phase === 'matching') {
      place(hero, pathEls.ap, 0);
      if (now - s.t0 >= SIM.matching) {
        s.phase = 'approach'; s.t0 = now;
        if (stepFree()) { s.reassigned = true; toast('Vehicle reassigned for an accessibility need'); }
        render(); announce('Your vehicle is on its way.');
      }
    } else if (s.phase === 'approach') {
      const p = Math.min(1, (now - s.t0) / SIM.approach), q = quote(S.opt);
      place(hero, pathEls.ap, p * al);
      const eta = $('#eta'), bar = $('#bar'); if (eta) eta.textContent = Math.max(0, Math.ceil((1 - p) * q.pickup)); if (bar) bar.style.width = (p * 100) + '%';
      if (p >= 1) { s.phase = 'wait'; render(); announce('Your vehicle is here. Press I’m Ready when you are seated.'); }
    } else if (s.phase === 'wait') {
      place(hero, pathEls.ap, al);
    } else if (s.phase === 'ride') {
      if (now >= s.hold) s.moved += dt * 1000;
      const p = Math.min(1, s.moved / SIM.ride), q = quote(S.opt);
      place(hero, pathEls.route, p * rl);
      $('#routeDone').setAttribute('stroke-dasharray', `${p * rl} ${rl + 10}`);
      const eta = $('#eta'), bar = $('#bar'), st = $('#street');
      if (eta) eta.textContent = Math.max(0, Math.ceil((1 - p) * q.ride)); if (bar) bar.style.width = (p * 100) + '%'; if (st) st.textContent = streetAt(p);
      if (DEST[S.dest].route === DEST.work.route && p >= .38 && !s.ev.em) {
        s.ev.em = 1; s.hold = now + 3300; S.em = { t0: now };
        addEvent('Emergency vehicle passing. Yielding right of way.', 'em'); toast('Emergency vehicle passing. Your vehicle is yielding.');
      }
      if (p >= .72 && !s.ev.hub) { s.ev.hub = 1; addEvent(DEST[S.dest].route === DEST.work.route ? 'Passing Civic Hub. Line 1 transfer available.' : 'Halfway there. All on time.'); }
      if (p >= 1) {
        s.phase = 'done'; S.step = 'arrived'; S.journeys++; S.fare = +(S.fare + q.pay).toFixed(2); S.benefits = +(S.benefits + q.cover).toFixed(2);
        render(); announce('You have arrived. ' + (q.pay === 0 ? 'This journey cost nothing.' : ''));
      }
    } else if (s.phase === 'done') place(hero, pathEls.route, rl);
  }
  // emergency crossing
  const emv = $('#emV');
  if (S.em) {
    const el = pathEls.em, L = el.getTotalLength(), d = (now - S.em.t0) / 1000 * 230;
    if (!emv.firstChild) emv.innerHTML = vehShape('emerg');
    if (d >= L) { S.em = null; emv.style.display = 'none'; } else { emv.style.display = ''; place(emv, el, d); }
  }
  // map camera
  if (tg && S.screen !== 'impact') {
    const k = 1 - Math.exp(-dt * 4.5);
    ['x', 'y', 'w', 'h'].forEach(a => vb[a] += (tg[a] - vb[a]) * k);
    applyVB();
  }
  requestAnimationFrame(frame);
}

/* live ticks */
let tickI = 0;
setInterval(() => {
  const c = S.city, j = (n, a) => Math.round(n + (Math.random() - .5) * a);
  c.vehicles = j(c.vehicles, 6); c.riders = j(c.riders, 60); c.step = Math.max(9000, c.step + Math.round(Math.random() * 5)); c.wait = Math.max(3.1, Math.min(4.6, c.wait + (Math.random() - .5) * .2)); c.emerg = Math.max(44, Math.min(48, c.emerg + (Math.random() > .5 ? 1 : -1) * (Math.random() > .7 ? 1 : 0)));
  const set = (id, v) => { const e = $('#' + id); if (e) e.textContent = v; };
  set('s-veh', c.vehicles.toLocaleString()); set('s-rid', c.riders.toLocaleString()); set('s-wait', c.wait.toFixed(1) + ' min'); set('s-em', c.emerg + ' / 48'); set('s-stp', c.step.toLocaleString());
  if (S.cs.on) { S.cs.energy += .03; set('cs-en', money(S.cs.energy)); }
}, 2200);
setInterval(() => { const e = $('#tick'); if (e) { tickI = (tickI + 1) % TICKS.length; e.textContent = TICKS[tickI]; } }, 5200);

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
  const id = b.dataset.id, a = b.dataset.act;
  switch (a) {
    case 'start': closeIntro(); break;
    case 'explore': closeIntro(); S.screen = 'city'; render(false); break;
    case 'goto': S.screen = id; render(); break;
    case 'open-access': if (S.screen === 'access') { S.screen = S.prev; } else { S.prev = S.screen; S.screen = 'access'; } render(); break;
    case 'close-access': S.screen = S.prev || 'go'; render(); break;
    case 'dest': S.dest = id; S.step = 'options'; S.opt = 'car'; render(); break;
    case 'back-home': S.step = 'home'; render(); break;
    case 'opt': S.opt = id; keepScroll(); break;
    case 'confirm': startTrip(); break;
    case 'ready': S.step = 'ride'; S.sim.phase = 'ride'; S.sim.moved = 0; S.events = []; render(); addEvent('Doors closed. Your journey has begun.'); addEvent(DEST[S.dest].eligible ? 'Your way back is already reserved.' : 'Your fare is capped at $18 this month.'); break;
    case 'cancel': resetTrip(); toast('Trip cancelled. Cancelling is always free.'); break;
    case 'done': S.sim = { phase: 'idle' }; S.step = 'home'; S.events = []; render(); break;
    case 'to-impact': S.sim = { phase: 'idle' }; S.step = 'home'; S.screen = 'impact'; render(); break;
    case 'legend': S.hide[id] = !S.hide[id]; keepScroll(); break;
    case 'acc': S.access[id] = !S.access[id]; applyAccess(); keepScroll(); break;
    case 'cs-on': S.cs.on = !S.cs.on; keepScroll(); break;
    case 'cs-win': S.cs.win = id; keepScroll(); break;
    case 'cs-ess': S.cs.essential = !S.cs.essential; keepScroll(); break;
    case 'recall': toast('Your car is heading home. Arriving in 4 min, fully charged.'); break;
    case 'redeem': { const n = parseInt(id.match(/\d+/)[0], 10); if (S.cs.credit >= n) { S.cs.credit -= n; toast(id); keepScroll(); } else toast('Not enough credit yet.'); break; }
    case 'district': S.district = id; keepScroll(); break;
  }
});
function keepScroll() {
  const y = sheet.scrollTop, f = document.activeElement, act = f && f.dataset && f.dataset.act, id = f && f.dataset && f.dataset.id;
  render(false); sheet.firstElementChild.style.animation = 'none'; sheet.scrollTop = y;
  if (act) { const n = [...sheet.querySelectorAll('[data-act]')].find(x => x.dataset.act === act && x.dataset.id === id && !x.disabled); if (n) n.focus({ preventScroll: true }); }
}

const BG = ['#brand', '#gearBtn', '#sheet', '#tabs'];
const setBg = on => BG.forEach(s => { const e = $(s); if (e) e.inert = on; });
function closeIntro() { $('#intro').classList.add('hide'); $('#intro').inert = true; setBg(false); const h = $('#h'); if (h) h.focus({ preventScroll: true }); }
setBg(true);
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#intro').classList.contains('hide')) closeIntro(); });
$('#startBtn').focus();
applyAccess(); buildMap(); render(false); retarget(true);
requestAnimationFrame(frame);
