const CACHE = 'cosmog-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/css/webp-fallback.css',
  '/assets/css/image-optimizations.css',
  '/assets/js/main.js',
  '/assets/js/sw-register.js',
  '/assets/js/image-loader.js',
  '/assets/js/responsive-images.js',
  '/events.html',
  '/schedule.html',
  '/contact.html',
  '/code-of-conduct.html',
  '/form-success.html',
  '/assets/img/favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
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


