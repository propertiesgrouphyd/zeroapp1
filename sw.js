// ======================================================
// ZERO APP
// SERVICE WORKER
// ======================================================

const CACHE_NAME = "zeroapp-v2";

// ======================================================
// STATIC ASSETS
// ======================================================

const STATIC_ASSETS = [

  "/",

  "/index.html",

  "/manifest.json",

  "/favicon.ico",

  "/css/style.css",

  "/js/firebase-config.js",

  "/js/feed.js",

  "/icons/logo.png",

  "/icons/icon-192.png",

  "/icons/icon-512.png"

];

// ======================================================
// INSTALL
// ======================================================

self.addEventListener("install", event=>{

  event.waitUntil(

    caches.open(CACHE_NAME)

    .then(cache=>cache.addAll(STATIC_ASSETS))

  );

  self.skipWaiting();

});

// ======================================================
// ACTIVATE
// ======================================================

self.addEventListener("activate",event=>{

  event.waitUntil(

    caches.keys()

    .then(keys=>

      Promise.all(

        keys.map(key=>{

          if(key!==CACHE_NAME){

            return caches.delete(key);

          }

        })

      )

    )

  );

  self.clients.claim();

});

// ======================================================
// FETCH
// ======================================================

self.addEventListener("fetch",event=>{

  if(event.request.method!=="GET"){

    return;

  }

  const url=new URL(event.request.url);

  // ===========================================
  // NEVER CACHE DATA FILES
  // ===========================================

  if(url.pathname.startsWith("/data/")){

    event.respondWith(

      fetch(event.request,{

        cache:"no-store"

      })

    );

    return;

  }

  // ===========================================
  // HTML
  // Network First
  // ===========================================

  if(event.request.mode==="navigate"){

    event.respondWith(

      fetch(event.request)

      .then(response=>{

        const copy=response.clone();

        caches.open(CACHE_NAME)

        .then(cache=>{

          cache.put(event.request,copy);

        });

        return response;

      })

      .catch(()=>{

        return caches.match("/index.html");

      })

    );

    return;

  }

  // ===========================================
  // STATIC FILES
  // Cache First
  // ===========================================

  event.respondWith(

    caches.match(event.request)

    .then(cached=>{

      if(cached){

        return cached;

      }

      return fetch(event.request)

      .then(response=>{

        if(!response || response.status!==200){

          return response;

        }

        const copy=response.clone();

        caches.open(CACHE_NAME)

        .then(cache=>{

          cache.put(event.request,copy);

        });

        return response;

      });

    })

  );

});
