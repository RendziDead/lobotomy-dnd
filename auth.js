// auth.js
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ======== Показ/Скрытие блоков ========
window.showRegister = function() {
  document.getElementById("mode-select").classList.add("hidden");
  document.getElementById("login-block").classList.add("hidden");
  document.getElementById("register-block").classList.remove("hidden");
};

window.showLogin = function() {
  document.getElementById("mode-select").classList.add("hidden");
  document.getElementById("register-block").classList.add("hidden");
  document.getElementById("login-block").classList.remove("hidden");
};
window.backToMenu = function() {
    document.getElementById("register-block").classList.add("hidden");
    document.getElementById("login-block").classList.add("hidden");
    document.getElementById("mode-select").classList.remove("hidden");
  };

// ======== Регистрация ========
window.registerUser = async function() {
  clearErrors(); // очистим красные рамки и ошибки

  const profileName = document.getElementById("reg-profile").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  // Проверки пустых полей
  if (!profileName) return setError("reg-profile", "Введите имя профиля");
  if (!email) return setError("reg-email", "Введите email");
  if (!password) return setError("reg-password", "Введите пароль");

  try {
    // Создаём пользователя в Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Отправляем письмо с подтверждением
    await user.sendEmailVerification();

    // Сохраняем профиль в Firestore
    await setDoc(doc(db, "users", user.uid), {
      profileName: profileName,
      email: email,
      uid: user.uid
    });

    // Сообщаем пользователю
    document.getElementById("reg-error").textContent = "На почту отправлено письмо. Подтвердите аккаунт!";
    // Можно сразу логаут сделать, чтобы пользователь не считался залогиненным до верификации
    await signOut(auth);

  } catch (error) {
    setError("reg-error", error.message);
  }
};

// ======== Вход ========
window.loginUser = async function() {
  clearErrors();

  const profileName = document.getElementById("login-profile").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!profileName) return setError("login-profile", "Введите имя профиля");
  if (!password) return setError("login-password", "Введите пароль");

  try {
    // 1) Ищем, какой email у этого profileName
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("profileName", "==", profileName));
    const snap = await getDocs(q);

    if (snap.empty) {
      return setError("login-error", "Пользователь с таким именем не найден");
    }

    // Предположим, что profileName уникален
    let userData;
    snap.forEach(doc => {
      userData = doc.data();
    });

    // 2) Логинимся через email, найденный по profileName
    const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
    const user = userCredential.user;

    // 3) Проверяем, верифицирован ли email
    if (!user.emailVerified) {
      await signOut(auth);
      return setError("login-error", "Вы не подтвердили почту! Проверьте email");
    }

    // 4) Если всё хорошо, переходим на "второе окно"
    window.location.href = "game.html";
    
  } catch (error) {
    setError("login-error", error.message);
  }
};

// ======== Общие функции ========

// Убираем ошибки и красные рамки
function clearErrors() {
  document.querySelectorAll(".error-text").forEach(el => el.textContent = "");
  document.querySelectorAll("input").forEach(el => el.classList.remove("error"));
}

// Ставим ошибку в блок и красим поле
function setError(fieldOrBlock, msg) {
  const input = document.getElementById(fieldOrBlock);
  if (input) {
    input.classList.add("error");
  } else {
    // Возможно, это id="login-error" или "reg-error"
    document.getElementById(fieldOrBlock).textContent = msg;
  }
}

// Следим за входом/выходом (необязательно здесь)
onAuthStateChanged(auth, (user) => {
  // можно отследить, если кто-то уже залогинен
  // но в нашем случае делаем всё при логине
});
