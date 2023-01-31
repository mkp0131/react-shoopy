import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { v4 as uuid } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// 구글 로그인
const provider = new GoogleAuthProvider();
const auth = getAuth();

export async function login() {
  return signInWithPopup(auth, provider).catch((error) => {
    console.error(error);
  });
}

export async function logout() {
  return signOut(auth).catch((error) => {
    console.error(error);
  });
}

export function onUserStateChange(callback) {
  // Auth 상태를 리슨하는 함수
  // Auth 상태 변경시 함수가 실행된다.
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}

// DB 접속
const db = getDatabase();

async function adminUser(user) {
  return get(ref(db, "admins")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        const admins = snapshot.val();
        const isAdmin = admins.includes(user.uid);
        return { ...user, isAdmin };
      }
      // 네트워크 오류가 생겼을 경우
      return user;
    });
}

export async function addNewProduct(product, imageUrl) {
  const id = uuid();
  // 파이어 베이스 저장
  set(ref(db, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image: imageUrl,
    options: product.options.split(",").map((item) => item.trim()),
  });
}

export async function getProducts() {
  return get(ref(db, "products")).then((snapshot) => {
    console.log("✅ getProducts 실행");
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  });
}

export async function getCart(userId) {
  return get(ref(db, `carts/${userId}`)).then((snapshot) => {
    const items = snapshot.val() || {};
    return Object.values(items);
  });
}

export async function addCart(userId, product) {
  // 파이어 베이스 저장
  return set(ref(db, `carts/${userId}/${product.id}`), product);
}

export async function removeCart(userId, productId) {
  return remove(ref(db, `carts/${userId}/${productId}`));
}
