/* jerrinmathew.com: keeps the site's files on the device so repeat visits are fast.
   Pages always come from the network when it answers within 3 seconds; files in /assets/ come from the device.
   A new version name is written on every build, which clears the old copies. */
const V = 'jm-822bc6bb00';
const PRE = ['/', '/assets/site.css?v=ed5aea88', '/assets/signup.js?v=20a1237c', '/assets/site.js?v=aa70035b', '/assets/fonts/inter-400.woff2', '/assets/fonts/inter-500.woff2', '/assets/fonts/inter-600.woff2', '/assets/fonts/newsreader-300.woff2', '/assets/fonts/newsreader-400-italic.woff2', '/assets/fonts/newsreader-400.woff2', '/assets/fonts/newsreader-500.woff2', '/assets/portrait-480.webp', '/assets/jm-mark.svg', '/assets/favicon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(PRE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/guide/')) return;
  if (u.pathname.startsWith('/assets/')) {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); } return res; })));
    return;
  }
  if (r.mode === 'navigate' || (r.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(new Promise(done => {
      let settled = false;
      const fallback = () => caches.match(r).then(hit => hit || caches.match('/')).then(hit => { if (!settled && hit) { settled = true; done(hit); } });
      const t = setTimeout(fallback, 3000);
      fetch(r).then(res => {
        clearTimeout(t);
        if (res.ok) { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); }
        if (!settled) { settled = true; done(res); }
      }).catch(() => { clearTimeout(t); caches.match(r).then(hit => hit || caches.match('/')).then(hit => { if (!settled) { settled = true; done(hit || Response.error()); } }); });
    }));
  }
});
