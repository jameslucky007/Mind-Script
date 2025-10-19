// frontend/src/app/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFZBCOtIwNhI668MLU1DTN2UaIOiwoyIs",
  authDomain: "mind-script-3a6d6.firebaseapp.com",
  projectId: "mind-script-3a6d6",
  storageBucket: "mind-script-3a6d6.firebasestorage.app",
  messagingSenderId: "435025388457",
  appId: "1:435025388457:web:254f6c7498165a630bdab8",
  measurementId: "G-7L8ZGNZCHS"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
