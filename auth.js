import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

window.register = async function () { // Делаем функцию глобальной
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Сохраняем пользователя в Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            username: email.split("@")[0]
        });

        alert("Регистрация успешна!");
        showUser(user);
    } catch (error) {
        alert("Ошибка: " + error.message);
        console.error(error);
    }
};

window.login = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Вход выполнен!");
        showUser(userCredential.user);
    } catch (error) {
        alert("Ошибка: " + error.message);
        console.error(error);
    }
};

window.logout = function () {
    signOut(auth).then(() => {
        alert("Выход выполнен!");
        document.getElementById("auth").style.display = "block";
        document.getElementById("user-info").style.display = "none";
    });
};

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
