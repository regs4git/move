// Service worker Move+. A versão e a lista de ficheiros vêm de version.js (gerado por tools/release.py).
importScripts('./version.js');
const CACHE = 'move-plus-' + self.APP_VERSION;

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(self.APP_FILES)).then(() => self.skipWaiting())
));

self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) {
    if ((k.startsWith('move-plus-') || k.startsWith('movimento-plus-')) && k !== CACHE) await caches.delete(k);
  }
  await self.clients.claim();
})()));

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;

  // version.json: sempre da rede (serve para detectar actualizações)
  if (u.pathname.endsWith('/version.json')) {
    e.respondWith(fetch(r, { cache: 'no-store' }).catch(() => caches.match(r, { ignoreSearch: true })));
    return;
  }

  // restante: cache primeiro, actualizada em segundo plano
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(r, { ignoreSearch: true });
    const net = fetch(r).then(resp => { if (resp.ok) cache.put(r, resp.clone()); return resp; }).catch(() => null);
    if (hit) return hit;
    const resp = await net;
    if (resp) return resp;
    if (r.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
    return Response.error();
  })());
});
