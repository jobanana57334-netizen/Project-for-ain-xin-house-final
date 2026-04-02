import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {getStorage} from 'firebase/storage';
import { getAuth } from "firebase/auth";
// 這裡填入你在 Firebase 控制台看到的 Web 配置內容
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
// 匯出資料庫實體，讓其他組件可以呼叫
export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);