const CACHE = 'cosmog-v1';
const ASSETS = [
  '/',
  '/cosmog-2K25/',
  '/cosmog-2K25/index.html',
  '/cosmog-2K25/assets/css/styles.css',
  '/cosmog-2K25/assets/js/main.js',
  '/cosmog-2K25/events.html',
  '/cosmog-2K25/schedule.html',
  '/cosmog-2K25/contact.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => cached))
  );
});


