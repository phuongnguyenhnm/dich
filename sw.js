const CACHE='pwa-translate-v1';
const PRECACHE=['./','./index.html','./styles.css','./app.js','./js/translate.js','./js/speech.js','./js/ocr.js','./js/conversation.js','./manifest.webmanifest','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(cached=>{const network=fetch(e.request).then(res=>{caches.open(CACHE).then(c=>c.put(e.request,res.clone()));return res;});return cached||network;}));});