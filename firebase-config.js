import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ТВОЙ КОНФИГ (СКОПИРУЙ ИЗ FIREBASE)
const firebaseConfig = {
    apiKey: "AIzaSyAxPxpofMEGXJtgEJkYuM0DHrR3B0csK6w",
    authDomain: "lobotomy-dnd.firebaseapp.com",
    projectId: "lobotomy-dnd",
    storageBucket: "lobotomy-dnd.firebasestorage.app",
    messagingSenderId: "1093526604904",
    appId: "1:1093526604904:web:08f3154b1e37502081bfdd"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };