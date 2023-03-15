var CACHE_NAME = 'sw-cache-v1'
var urlsToCache = ['/', '/styles/main.css', '/script/main.js']
self.addEventListener('install', (event) => {
    // 确认所有需要的资产是否已缓存
    event.waitUntil(
        // 打开缓存
        caches.open(CACHE_NAME).then((cache) => {
            // 缓存文件
            return cache.addAll(urlsToCache)
        })
    )
})
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response
            }
            //调用 fetch 发出网络请求
            return fetch(event.request)
        })
    )
})
self.addEventListener('activate', (event) => {
    var cacheAllowlist = ['pages-cache-v1', 'blog-posts-chache-v1']
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((item) => {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})
