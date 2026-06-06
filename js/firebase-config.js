// ======================================================
// QUANTUMFEED
// FIREBASE V10 CONFIG
// ======================================================

import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {

getFirestore

}

from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// ======================================================
// FIREBASE CONFIG
// ======================================================
//
// REPLACE WITH YOUR REAL VALUES
//
// Firebase Console
// Project Settings
// General
// Web App
//
// ======================================================

const firebaseConfig = {

apiKey:
"REPLACE_API_KEY",

authDomain:
"REPLACE_PROJECT.firebaseapp.com",

projectId:
"REPLACE_PROJECT",

storageBucket:
"REPLACE_PROJECT.appspot.com",

messagingSenderId:
"REPLACE_SENDER_ID",

appId:
"REPLACE_APP_ID"

};

// ======================================================
// INIT
// ======================================================

const app =
initializeApp(
firebaseConfig
);

const db =
getFirestore(
app
);

// ======================================================
// EXPORT
// ======================================================

export {

db

};
