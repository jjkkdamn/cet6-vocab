// Service Worker for 六级词汇学习卡 PWA
const CACHE_NAME = 'vocab-v2';
const CORE_FILES = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './turtle.gif',
  './danzi.gif',
  './wordlist1.js','./wordlist2.js','./wordlist3.js','./wordlist4.js',
  './wordlist5.js','./wordlist6.js','./wordlist7.js','./wordlist8.js',
  './wordlist9.js','./wordlist10.js','./wordlist11.js','./wordlist12.js',
  './wordlist13.js','./wordlist14.js','./wordlist15.js','./wordlist16.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
