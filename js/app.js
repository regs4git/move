(() => {
'use strict';

/* ---------- Utilitários ---------- */
const $ = id => document.getElementById(id);
const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const ICONS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  chevron: '<polyline points="6 9 12 15 18 9"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
  alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'
};
const icon = name => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

/* ---------- Estado ---------- */
const AREAS = [['inicio', 'Início', 'home'], ['guia', 'Guia', 'book'], ['exercicios', 'Exercícios', 'dumbbell'], ['rotinas', 'Rotinas', 'clock']];
const TABS = {
  exercicios: [['casa', 'Casa'], ['ginasio', 'Ginásio'], ['superior', 'Superior']],
  rotinas: [['manha', 'Manhã'], ['trabalho', 'Trabalho'], ['casa', 'Casa'], ['noite', 'Noite']]
};
const SIZES = { normal: 1, large: 1.1, xlarge: 1.2 };
const state = { area: 'inicio', sub: { exercicios: 'casa', rotinas: 'manha' }, open: null };
let fav = store.get('mp_fav', []);
let font = store.get('mp_font', 'large');
let theme = store.get('mp_theme', 'light'); // light | dark | system
const prefersDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = () => theme === 'dark' || (theme === 'system' && prefersDark());

/* ---------- Componentes ---------- */
function tabs(area) {
  const list = TABS[area];
  return `<div class="tabs" role="tablist" style="--cols:${list.length}">${list.map(([v, l]) =>
    `<button class="tab" role="tab" aria-selected="${v === state.sub[area]}" data-act="tab" data-v="${v}">${l}</button>`).join('')}</div>`;
}

function figure(id, alt) {
  const has = (window.MP_IMAGES || []).includes(id);
  return `<div class="fig">${has
    ? `<img src="./assets/img/${esc(id)}.webp" alt="${esc(alt)}" loading="lazy">`
    : `<div class="ph" role="img" aria-label="Ilustração em preparação: ${esc(alt)}">${icon('image')}</div>`}</div>`;
}

function blocks(list) {
  return list.map(b =>
    b.p ? `<p>${esc(b.p)}</p>` :
    b.note ? `<div class="note">${esc(b.note)}</div>` :
    b.img ? figure(b.img, b.alt || '') :
    b.alert ? `<div class="alert">${b.alert.map((x, i) => i === 0 ? `<strong>${esc(x)}</strong>` : `<div>${esc(x)}</div>`).join('')}</div>` :
    b.list ? b.list.map(x => `<div class="item">${icon('check')}<span>${esc(x)}</span></div>`).join('') : ''
  ).join('');
}

/* Ficha colapsável genérica (exercício, tema do guia, rotina) */
function card(id, title, body, extraClass = '') {
  const isFav = fav.includes(id);
  const open = state.open === id;
  return `<article class="fx${open ? ' open' : ''} ${extraClass}" id="fx-${id}">
    <div class="fxhead">
      <button class="fxtoggle" data-act="toggle" data-id="${id}" aria-expanded="${open}" aria-controls="fxb-${id}"><span>${esc(title)}</span>${icon('chevron')}</button>
      <button class="heart${isFav ? ' on' : ''}" data-act="fav" data-id="${id}" aria-pressed="${isFav}" aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}: ${esc(title)}">${icon('heart')}</button>
    </div>
    <div class="fxbody" id="fxb-${id}"${open ? '' : ' hidden'}>${body}</div>
  </article>`;
}

const exerciseBody = e => `${figure(e.id, e.name)}
  <div class="pills"><span class="pill">${esc(e.dose)}</span></div>
  <p><b>Como fazer:</b> ${esc(e.how)}</p>
  <p><b>Trabalha:</b> ${esc(e.muscle)}. <b>Porquê:</b> ${esc(e.why)}</p>
  <p><b>Adaptação lombar:</b> ${esc(e.adapt)}</p>`;
const exerciseCard = e => card(e.id, e.name, exerciseBody(e));
const guiaCard = g => card('g-' + g.id, g.titulo, blocks(g.blocks), g.id === 'alertas' ? 'alertcard' : '');
const routineBody = r => `<div class="eyebrow">${esc(r.dur)}</div>${r.passos.map((x, i) => `<div class="item"><span class="num">${i + 1}</span><span>${esc(x)}</span></div>`).join('')}`;
const routineCard = k => card('r-' + k, window.MP_ROTINAS[k].titulo, routineBody(window.MP_ROTINAS[k]));
const WARN = '<div class="note warn">Não faças estes exercícios se tiveres dor lombar.</div>';

/* ---------- Pesquisa ---------- */
const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function searchIndex() {
  const catName = { casa: 'Casa', ginasio: 'Ginásio', superior: 'Superior' };
  const out = [];
  window.MP_EX.forEach(e => out.push({ type: 'ex', id: e.id, title: e.name, where: 'Exercício · ' + catName[e.cat], text: [e.name, e.muscle, e.why, e.how, e.adapt].join(' ') }));
  window.MP_GUIA.forEach(g => out.push({ type: 'guia', id: g.id, title: g.titulo, where: 'Guia',
    text: [g.titulo, ...g.blocks.flatMap(b => b.p ? [b.p] : b.note ? [b.note] : b.list || b.alert || [])].join(' ') }));
  Object.entries(window.MP_ROTINAS).forEach(([k, r]) => out.push({ type: 'rot', id: k, title: r.titulo, where: 'Rotina', text: [r.titulo, ...r.passos].join(' ') }));
  return out.map(x => ({ ...x, n: norm(x.text), t: norm(x.title) }));
}
let SEARCH_INDEX = null;
function searchResults(q) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (terms.join('').length < 2) return '<p class="mini">Escreve pelo menos 2 letras.</p>';
  SEARCH_INDEX = SEARCH_INDEX || searchIndex();
  const hits = SEARCH_INDEX.filter(x => terms.every(t => x.n.includes(t))).sort((a, b) => terms.every(t => b.t.includes(t)) - terms.every(t => a.t.includes(t)));
  return hits.length ? hits.map(h => `<button class="result" data-act="result" data-type="${h.type}" data-id="${h.id}"><span>${esc(h.title)}</span><small>${esc(h.where)}</small></button>`).join('')
    : '<div class="card empty">Sem resultados.</div>';
}

/* ---------- Ecrãs ---------- */
const VIEWS = {
  inicio() {
    const quick = [['sun', 'Ao acordar', 'manha'], ['briefcase', 'No trabalho', 'trabalho'], ['home', 'Ao chegar a casa', 'casa'],
                   ['dumbbell', 'Vou ao ginásio', 'gym'], ['moon', 'Antes de dormir', 'noite'], ['heart', 'Os meus favoritos', 'fav']];
    return `<div class="quickgrid">${quick.map(([ic, l, v]) => `<button class="quick" data-act="quick" data-v="${v}">${icon(ic)}${l}</button>`).join('')}</div>
      <button class="quick wide" data-act="quick" data-v="alertas">${icon('alert')}Sinais de alerta</button>
      <div class="card rule"><div class="eyebrow">Regra essencial</div><p>Ganha força sem aumentares a hiperextensão dos joelhos. E protege a lombar.</p></div>`;
  },
  guia() { return window.MP_GUIA.map(guiaCard).join(''); },
  exercicios() {
    const cat = state.sub.exercicios;
    return `${WARN}${tabs('exercicios')}${window.MP_EX.filter(e => e.cat === cat).map(exerciseCard).join('')}`;
  },
  rotinas() {
    const k = state.sub.rotinas, r = window.MP_ROTINAS[k], id = 'r-' + k, isFav = fav.includes(id);
    return `${tabs('rotinas')}<div class="card"><div class="row-head"><h2>${esc(r.titulo)}</h2>
      <button class="heart${isFav ? ' on' : ''}" data-act="fav" data-id="${id}" aria-pressed="${isFav}" aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}: ${esc(r.titulo)}">${icon('heart')}</button></div>
      ${routineBody(r)}</div>`;
  },
  favoritos() {
    const ex = window.MP_EX.filter(e => fav.includes(e.id));
    const gu = window.MP_GUIA.filter(g => fav.includes('g-' + g.id));
    const ro = Object.keys(window.MP_ROTINAS).filter(k => fav.includes('r-' + k));
    if (!ex.length && !gu.length && !ro.length) return '<div class="card empty">Ainda não há favoritos. Toca no coração de uma ficha para a guardar.</div>';
    const sec = (t, html) => html ? `<div class="eyebrow sec">${t}</div>${html}` : '';
    return sec('Exercícios', ex.length ? WARN + ex.map(exerciseCard).join('') : '') + sec('Guia', gu.map(guiaCard).join('')) + sec('Rotinas', ro.map(routineCard).join(''));
  },
  pesquisa() {
    return `<input id="q" class="search" type="search" placeholder="Pesquisar exercícios, guia, rotinas" aria-label="Pesquisar" autocomplete="off"><div id="results"></div>`;
  },
  config() {
    const opt = (v, cur, l) => `<option value="${v}"${v === cur ? ' selected' : ''}>${l}</option>`;
    return `<h1>Configuração</h1>
      <div class="card">
        <div class="setting"><strong>Tamanho da letra</strong><select id="fontselect">${opt('normal', font, 'Normal')}${opt('large', font, 'Grande')}${opt('xlarge', font, 'Muito grande')}</select></div>
        <div class="setting"><strong>Aspecto</strong><select id="themeselect">${opt('light', theme, 'Claro')}${opt('dark', theme, 'Escuro')}${opt('system', theme, 'Sistema')}</select></div>
        <div class="setting"><div><strong>Favoritos</strong><div class="mini">${fav.length} guardado(s)</div></div><button class="btn" data-act="resetfav">Limpar</button></div>
        <div class="setting"><div><strong>Actualizações</strong><div class="mini">Versão ${esc(window.APP_VERSION)}</div></div><button class="btn" data-act="update">Procurar</button></div>
        <div class="setting"><strong>Repor preferências</strong><button class="btn" data-act="reset">Repor</button></div>
      </div>
      <div class="card"><label for="notes"><strong>As minhas notas</strong></label>
        <p class="mini">Ficam só neste telemóvel. Por exemplo: o que o fisioterapeuta autorizou e quando.</p>
        <textarea id="notes" rows="5">${esc(store.get('mp_notes', ''))}</textarea></div>
      <div class="card" style="text-align:center"><b>Piquinho Software</b><p style="font-size:.85em">Craft with Altitude. Built with Joy</p></div>`;
  }
};

/* ---------- Renderização ---------- */
function render() {
  document.body.classList.toggle('dark', isDark());
  document.body.style.setProperty('--size', SIZES[font] || 1.1);
  $('theme').innerHTML = icon(isDark() ? 'sun' : 'moon');
  $('search').innerHTML = icon('search');
  $('settings').innerHTML = icon('sliders');
  $('ver').textContent = 'v' + window.APP_VERSION;
  $('bottom').innerHTML = AREAS.map(([v, l, ic]) =>
    `<button class="nav" data-act="nav" data-v="${v}"${state.area === v ? ' aria-current="page"' : ''}>${icon(ic)}<span>${l}</span></button>`).join('');
  $('main').innerHTML = VIEWS[state.area]();
}

function url() { return '#' + state.area + (TABS[state.area] ? '/' + state.sub[state.area] : ''); }
function snapshot() { return { area: state.area, sub: { ...state.sub } }; }

function go(area, sub, push, open) {
  state.area = area;
  if (sub) state.sub[area] = sub;
  state.open = open || null;
  render();
  if (open) $('fx-' + open)?.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
  if (area === 'pesquisa') $('q')?.focus();
  history[push ? 'pushState' : 'replaceState'](snapshot(), '', url());
}

function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ---------- Acções ---------- */
function toggleCard(id) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.fx.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.fxtoggle').setAttribute('aria-expanded', 'false');
    el.querySelector('.fxbody').hidden = true;
  });
  if (state.open === id) { state.open = null; return; }
  state.open = id;
  const el = $('fx-' + id);
  el.classList.add('open');
  el.querySelector('.fxtoggle').setAttribute('aria-expanded', 'true');
  el.querySelector('.fxbody').hidden = false;
  el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
}

function toggleFav(id) {
  fav = fav.includes(id) ? fav.filter(x => x !== id) : [...fav, id];
  store.set('mp_fav', fav);
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
  const b = document.querySelector(`.heart[data-id="${id}"]`);
  if (b) b.focus({ preventScroll: true });
}

function quick(v) {
  if (v === 'fav') go('favoritos', null, true);
  else if (v === 'alertas') go('guia', null, true, 'g-alertas');
  else if (v === 'gym') go('exercicios', 'superior', true);
  else go('rotinas', v, true);
}

async function checkForUpdate() {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return toast('Actualizações indisponíveis neste modo.');
    await reg.update();
    if (reg.installing || reg.waiting) toast('Nova versão encontrada. A actualizar…');
    else toast('Tens a versão mais recente (' + window.APP_VERSION + ').');
  } catch { toast('Não foi possível verificar. Confirma a ligação à internet.'); }
}

document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-act]');
  if (!b) return;
  const { act, v, id } = b.dataset;
  if (act === 'nav') go(v, null, state.area !== v);
  else if (act === 'tab') go(state.area, v, false);
  else if (act === 'quick') quick(v);
  else if (act === 'toggle') toggleCard(id);
  else if (act === 'fav') toggleFav(id);
  else if (act === 'resetfav') { if (confirm('Limpar todos os favoritos?')) { fav = []; store.set('mp_fav', fav); render(); } }
  else if (act === 'reset') { if (confirm('Repor as preferências de visualização?')) { font = 'large'; theme = 'light'; store.set('mp_font', font); store.set('mp_theme', theme); render(); } }
  else if (act === 'update') checkForUpdate();
  else if (act === 'result') {
    const t = b.dataset.type;
    if (t === 'ex') go('exercicios', window.MP_EX.find(e => e.id === id).cat, true, id);
    else if (t === 'guia') go('guia', null, true, 'g-' + id);
    else go('rotinas', id, true);
  }
});

document.addEventListener('input', ev => {
  if (ev.target.id === 'q') $('results').innerHTML = searchResults(ev.target.value);
  if (ev.target.id === 'notes') store.set('mp_notes', ev.target.value);
});

document.addEventListener('change', ev => {
  if (ev.target.id === 'fontselect') { font = ev.target.value; store.set('mp_font', font); render(); }
  if (ev.target.id === 'themeselect') { theme = ev.target.value; store.set('mp_theme', theme); render(); }
});

$('theme').onclick = () => { theme = isDark() ? 'light' : 'dark'; store.set('mp_theme', theme); render(); };
$('search').onclick = () => go('pesquisa', null, state.area !== 'pesquisa');
$('settings').onclick = () => go('config', null, state.area !== 'config');
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (theme === 'system') render(); });

window.addEventListener('popstate', ev => {
  const s = ev.state;
  if (!s || !VIEWS[s.area]) return;
  state.area = s.area; Object.assign(state.sub, s.sub); state.open = null;
  render(); window.scrollTo(0, 0);
});

/* ---------- Arranque ---------- */
(function init() {
  const [a, s] = location.hash.slice(1).split('/');
  if (VIEWS[a]) { state.area = a; if (TABS[a] && TABS[a].some(t => t[0] === s)) state.sub[a] = s; }
  render();
  history.replaceState(snapshot(), '', url());
})();

/* ---------- Service worker ---------- */
if ('serviceWorker' in navigator) {
  const hadController = !!navigator.serviceWorker.controller; // só recarrega em actualizações, não na 1.ª instalação
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return;
    reloading = true; location.reload();
  });
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.warn));
}

/* ---------- Splash ---------- */
const splash = $('splash');
function closeSplash() {
  if (!splash || splash.classList.contains('hidden')) return;
  splash.classList.add('hidden');
  setTimeout(() => splash.remove(), 500);
}
if (splash) { setTimeout(closeSplash, 3600); splash.addEventListener('click', closeSplash); }
})();
