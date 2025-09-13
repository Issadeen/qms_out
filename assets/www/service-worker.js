// Enhanced Service Worker (no external toolbox dependency)
const VERSION = 'v1';
const PRECACHE = `qms-precache-${VERSION}`;
const RUNTIME = `qms-runtime-${VERSION}`;
const CORE_ASSETS = [
  'index.html',
  'manifest.json',
  'build/main.js',
  'build/vendor.js',
  'build/polyfills.js',
  'build/main.css',
  'js/api-client.js',
  'js/store.js'
];

// Install: precache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE).then(cache => cache.addAll(CORE_ASSETS)).then(()=> self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => ![PRECACHE, RUNTIME].includes(k)).map(k => caches.delete(k))
    )).then(()=> self.clients.claim())
  );
});

// Fetch strategy mapping
// HTML: network-first with offline fallback
// JS/CSS: stale-while-revalidate
// Images/Fonts: cache-first with max entries cleanup

function isHTML(request){ return request.destination === 'document' || request.headers.get('accept')?.includes('text/html'); }
function isStaticAsset(request){ return ['script','style'].includes(request.destination); }
function isMedia(request){ return ['image','font'].includes(request.destination); }

async function networkFirst(event){
  try {
    const fresh = await fetch(event.request);
    const cache = await caches.open(RUNTIME);
    cache.put(event.request, fresh.clone());
    return fresh;
  } catch (e){
    const cached = await caches.match(event.request);
    if(cached) return cached;
    // Offline fallback for HTML
    if(isHTML(event.request)) return caches.match('index.html');
    throw e;
  }
}

async function staleWhileRevalidate(event){
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(event.request);
  const fetchPromise = fetch(event.request).then(resp => {
    cache.put(event.request, resp.clone());
    return resp;
  }).catch(()=> cached);
  return cached || fetchPromise;
}

async function cacheFirst(event, { maxEntries = 60 } = {}){
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(event.request);
  if(cached) return cached;
  const resp = await fetch(event.request);
  cache.put(event.request, resp.clone());
  // Simple LRU trim by listing keys (not fully LRU but bounds size)
  cache.keys().then(keys => { if(keys.length > maxEntries){ cache.delete(keys[0]); } });
  return resp;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if(request.method !== 'GET') return; // let non-GET pass through
  const url = new URL(request.url);
  // Only handle same-origin
  if(url.origin !== self.location.origin) return;
  if(isHTML(request)){
    event.respondWith(networkFirst(event));
  } else if(isStaticAsset(request)) {
    event.respondWith(staleWhileRevalidate(event));
  } else if(isMedia(request)) {
    event.respondWith(cacheFirst(event));
  } else {
    // Default: try cache, then network
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(resp => {
        return caches.open(RUNTIME).then(c => { c.put(request, resp.clone()); return resp; });
      }).catch(()=> cached))
    );
  }
});

// Listen for skipWaiting trigger from page
self.addEventListener('message', evt => {
  if(evt.data && evt.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
});

