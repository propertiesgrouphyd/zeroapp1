// ======================================================
// QUANTUMFEED
// SERVICE WORKER
// ======================================================

const CACHE_NAME =
"quantumfeed-v1";

const ASSETS = [

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

self.addEventListener(
"install",
event=>{

event.waitUntil(

caches.open(
CACHE_NAME
)

.then(cache=>

cache.addAll(
ASSETS
)

)

);

self.skipWaiting();

}
);

// ======================================================
// ACTIVATE
// ======================================================

self.addEventListener(
"activate",
event=>{

event.waitUntil(

caches.keys()

.then(keys=>

Promise.all(

keys.map(key=>{

if(
key !== CACHE_NAME
){

return caches.delete(
key
);

}

})

)

)

);

self.clients.claim();

}
);

// ======================================================
// FETCH
// ======================================================

self.addEventListener(
"fetch",
event=>{

if(
event.request.method !==
"GET"
){
return;
}

event.respondWith(

caches.match(
event.request
)

.then(cached=>{

if(cached){

return cached;

}

return fetch(
event.request
)

.then(response=>{

const copy =
response.clone();

caches.open(
CACHE_NAME
)

.then(cache=>{

cache.put(
event.request,
copy
);

});

return response;

})

.catch(()=>{

return caches.match(
"/index.html"
);

});

})

);

}
);
