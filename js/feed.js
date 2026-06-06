import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit
}
from "./firebase-config.js";

// ======================================================
// ELEMENTS
// ======================================================

const feed =
document.getElementById("feed");

const loader =
document.getElementById("loader");

const addBtn =
document.getElementById("addBtn");

const installBtn =
document.getElementById("installBtn");

const uploadModal =
document.getElementById("uploadModal");

const closeModal =
document.getElementById("closeModal");

const submitVideo =
document.getElementById("submitVideo");

const usernameInput =
document.getElementById("username");

const shortUrlInput =
document.getElementById("shortUrl");

const uploadStatus =
document.getElementById("uploadStatus");

const toast =
document.getElementById("toast");

const emptyState =
document.getElementById("emptyState");

// ======================================================
// INSTALL
// ======================================================

let deferredPrompt = null;

window.addEventListener(
"beforeinstallprompt",
e => {

e.preventDefault();

deferredPrompt = e;

installBtn.style.display =
"flex";

}
);

installBtn.addEventListener(
"click",
async ()=>{

const isIOS =
/iphone|ipad|ipod/i
.test(
navigator.userAgent
);

if(isIOS){

showToast(
"Tap Share → Add to Home Screen"
);

return;
}

if(!deferredPrompt){

showToast(
"Install from browser menu"
);

return;
}

deferredPrompt.prompt();

deferredPrompt = null;

}
);

window.addEventListener(
"appinstalled",
()=>{

installBtn.style.display =
"none";

}
);

// ======================================================
// TOAST
// ======================================================

function showToast(text){

toast.innerText =
text;

toast.classList.remove(
"hidden"
);

setTimeout(()=>{

toast.classList.add(
"hidden"
);

},2500);

}

// ======================================================
// MODAL
// ======================================================

addBtn.onclick = ()=>{

uploadModal.classList.remove(
"hidden"
);

};

closeModal.onclick = ()=>{

uploadModal.classList.add(
"hidden"
);

};

// ======================================================
// SHORTS VALIDATION
// ======================================================

function extractVideoId(url){

const regex =
/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;

const match =
url.match(regex);

if(!match){

return null;

}

return match[1];

}

// ======================================================
// CREATE REEL
// ======================================================

function createReel(videoId,username){

const reel =
document.createElement(
"section"
);

reel.className =
"reel";

reel.innerHTML = `

<iframe

reel.innerHTML = `
<iframe
src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&playlist=${videoId}&loop=1"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen
referrerpolicy="strict-origin-when-cross-origin">
</iframe>

<div class="reel-overlay">
  <div class="username">
    @${username}
  </div>
</div>
`;

allow="
autoplay;
encrypted-media;
fullscreen
"

allowfullscreen>

</iframe>

<div class="reel-overlay">

<div class="username">

@${username}

</div>

</div>

`;

return reel;

}

// ======================================================
// LOAD VIDEOS
// ======================================================

async function loadVideos(){

try{

const q = query(

collection(
db,
"videos"
),

orderBy(
"createdAt",
"desc"
),

limit(100)

);

const snap =
await getDocs(q);

feed.innerHTML = "";

if(snap.empty){

emptyState.classList.remove(
"hidden"
);

loader.style.display =
"none";

return;
}

emptyState.classList.add(
"hidden"
);

snap.forEach(doc=>{

const data =
doc.data();

feed.appendChild(

createReel(

data.videoId,

data.username

)

);

});

loader.style.display =
"none";

}catch(err){

console.error(err);

showToast(
"Failed to load videos"
);

}

}

// ======================================================
// SUBMIT
// ======================================================

submitVideo.onclick =
async ()=>{

const username =
usernameInput.value.trim();

const url =
shortUrlInput.value.trim();

if(!username){

uploadStatus.innerText =
"Enter your name";

return;
}

const videoId =
extractVideoId(url);

if(!videoId){

uploadStatus.innerText =
"Only YouTube Shorts links allowed";

return;
}

try{

uploadStatus.innerText =
"Uploading...";

await addDoc(

collection(
db,
"videos"
),

{

username,

videoId,

createdAt:
Date.now()

}

);

usernameInput.value = "";
shortUrlInput.value = "";

uploadStatus.innerText =
"";

uploadModal.classList.add(
"hidden"
);

showToast(
"Short Added"
);

await loadVideos();

}catch(err){

console.error(err);

uploadStatus.innerText =
"Upload failed";

}

};

// ======================================================
// ESC CLOSE
// ======================================================

document.addEventListener(
"keydown",
e=>{

if(
e.key === "Escape"
){

uploadModal.classList.add(
"hidden"
);

}

}
);

// ======================================================
// START
// ======================================================

loadVideos();

// ======================================================
// SERVICE WORKER
// ======================================================

if(
"serviceWorker" in navigator
){

window.addEventListener(
"load",
()=>{

navigator.serviceWorker
.register("/sw.js")
.catch(console.error);

});

}
