import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAt4d11ASECig6a2ByaLg_716AuLh6HPdc",
  authDomain: "quantumfeed-e9b1d.firebaseapp.com",
  projectId: "quantumfeed-e9b1d",
  storageBucket: "quantumfeed-e9b1d.firebasestorage.app",
  messagingSenderId: "304072670051",
  appId: "1:304072670051:web:f233d7622165781f54b156"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit
};
