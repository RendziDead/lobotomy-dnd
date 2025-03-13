import { auth, db, setDoc, doc } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            
            // Сохраняем пользователя в Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                username: email.split("@")[0] // Делаем ник из email
            });

            alert("Регистрация успешна!");
            showUser(user);
        })
        .catch(error => alert(error.message));
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert("Вход выполнен!");
            showUser(userCredential.user);
        })
        .catch(error => alert(error.message));
}

function logout() {
    signOut(auth).then(() => {
        alert("Выход выполнен!");
        document.getElementById("auth").style.display = "block";
        document.getElementById("user-info").style.display = "none";
    });
}

function showUser(user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("user-info").style.display = "block";
    document.getElementById("user-email").innerText = user.email;
}

auth.onAuthStateChanged(user => {
    if (user) {
        showUser(user);
    }
});
