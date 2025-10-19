// frontend/src/app/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiC4UA_Id5a0BIQelW98gXue09ogRB8IQ",
  authDomain: "veritas-ai-801b4.firebaseapp.com",
  projectId: "veritas-ai-801b4",
  storageBucket: "veritas-ai-801b4.appspot.com",
  messagingSenderId: "385176087644",
  appId: "1:385176087644:web:ee33bcf2ad97b4dfcd8a99",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
