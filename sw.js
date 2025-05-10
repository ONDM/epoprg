const cacheName = 'epoprg-cache';

self.addEventListener('install', (event) =>
{
  console.log('Service Worker Installed');
  event.waitUntil(
  caches.open(cacheName).then((cache) =>
  {
    return cache.addAll([
      '/epoprg/',
      '/epoprg/manifest.json',
      '/epoprg/style.css',
      '/epoprg/script.js',
      '/epoprg/favicon.png',
      '/epoprg/font.woff2',
      '/epoprg/sw.js',
      '/epoprg/logo.png',
      '/epoprg/folder/1.pdf', '/epoprg/folder/2.pdf', '/epoprg/folder/3.pdf', '/epoprg/folder/4.pdf', '/epoprg/folder/5.pdf',
      '/epoprg/folder/6.pdf', '/epoprg/folder/7.pdf', '/epoprg/folder/8.pdf', '/epoprg/folder/9.pdf', '/epoprg/folder/10.pdf',
      '/epoprg/folder/11.pdf', '/epoprg/folder/12.pdf', '/epoprg/folder/13.pdf', '/epoprg/folder/14.pdf', '/epoprg/folder/15.pdf',
      '/epoprg/folder/16.pdf', '/epoprg/folder/17.pdf', '/epoprg/folder/18.pdf', '/epoprg/folder/19.pdf', '/epoprg/folder/20.pdf',
      '/epoprg/folder/21.pdf', '/epoprg/folder/22.pdf', '/epoprg/folder/23.pdf', '/epoprg/folder/24.pdf', '/epoprg/folder/25.pdf',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) =>
{
  event.respondWith(
  caches.match(event.request).then((response) =>
  {
    return response || fetch(event.request);
  })
  );
});