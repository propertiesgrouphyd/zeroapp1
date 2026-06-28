import {
  db,
  collection,
  addDoc
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

function createReel(videoId, username){

const reel =
document.createElement("section");

reel.className =
"reel";

reel.dataset.videoId =
videoId;

reel.innerHTML = `

<div class="video-placeholder">

<img
src="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg"
onerror="this.src='https://i.ytimg.com/vi/${videoId}/hqdefault.jpg'"
loading="lazy">

<button class="play-btn">

▶

</button>

</div>

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

loader.style.display = "flex";

try{

const latestResponse =
await fetch(
"./data/latest.json",
{
cache:"no-store"
}
);

if(!latestResponse.ok){

throw new Error("latest.json not found");

}

const latest =
await latestResponse.json();

if(!latest.file){

emptyState.classList.remove("hidden");

loader.style.display="none";

return;

}

const videosResponse =
await fetch(
"./data/" + latest.file,
{
cache:"no-store"
}
);

if(!videosResponse.ok){

throw new Error("Videos file not found");

}

const videos =
await videosResponse.json();

feed.innerHTML="";

if(!videos.length){

emptyState.classList.remove("hidden");

loader.style.display="none";

return;

}

emptyState.classList.add("hidden");

if(!Array.isArray(videos)){

throw new Error("Invalid videos.json");

}

videos.forEach(video=>{

feed.appendChild(

createReel(

video[1],
video[0]

)

);

});

loader.style.display="none";

}catch(err){

console.error(err);

loader.style.display="none";

showToast("Failed to load videos");

}

}


let currentIframe = null;

feed.addEventListener(
"click",
e=>{

const btn =
e.target.closest(".play-btn");

if(!btn) return;

const reel =
btn.closest(".reel");

const videoId =
reel.dataset.videoId;

if(currentIframe){

currentIframe.remove();

currentIframe = null;

document
.querySelectorAll(".video-placeholder")
.forEach(v=>v.style.display="block");

}

const placeholder =
reel.querySelector(
".video-placeholder"
);

placeholder.style.display =
"none";

const iframe =
document.createElement(
"iframe"
);

iframe.src =
`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;

iframe.allow =
"autoplay; encrypted-media";

iframe.allowFullscreen =
true;

reel.prepend(
iframe
);

iframe.style.pointerEvents = "none";



currentIframe =
iframe;

}
);


feed.addEventListener(
"scroll",
()=>{

if(currentIframe){

currentIframe.remove();

currentIframe = null;

document
.querySelectorAll(".video-placeholder")
.forEach(v=>{

v.style.display = "block";

});

}

},
{ passive:true }
);



// ======================================================
// DAILY LIMIT (5 VIDEOS)
// ======================================================

function canUploadToday(){

const today =
new Date().toISOString().split("T")[0];

const savedDate =
localStorage.getItem("uploadDate");

let count =
parseInt(
localStorage.getItem("uploadCount") || "0"
);

if(savedDate !== today){

localStorage.setItem(
"uploadDate",
today
);

localStorage.setItem(
"uploadCount",
"0"
);

count = 0;

}

return count < 5;

}

function increaseUploadCount(){

const count =
parseInt(
localStorage.getItem("uploadCount") || "0"
);

localStorage.setItem(
"uploadCount",
String(count + 1)
);

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

if(!canUploadToday()){

uploadStatus.innerText =
"Daily limit reached (5 videos/day)";

return;

}

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

increaseUploadCount();

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
