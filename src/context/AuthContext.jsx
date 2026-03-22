import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig"; // 請確認這裡指向你的 firebaseConfig.js 正確路徑
import { onAuthStateChanged } from "firebase/auth";

// 1. 建立 Context (這就像是一個廣播電台)
const AuthContext = createContext();

// 2. 建立 Provider 元件 (負責發送廣播內容)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 預設沒有人登入
    const [loading, setLoading] = useState(true); // 讓系統有時間去跟 Firebase 確認狀態

    useEffect(() => {
        // Firebase 的守衛：只要登入或登出，他就會立刻通知我們 currentUser 是誰
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // 確認完畢，解除載入中狀態
        });

        // 元件卸載時取消監聽，節省效能
        return () => unsubscribe(); 
    }, []);

    // 把 user 狀態透過 value 廣播給所有被包在裡面的 children 元件
    return (
        <AuthContext.Provider value={{ user, loading }}>
            {/* 確保確認完身分後，才渲染畫面，避免畫面閃爍 */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};

// 3. 寫一個捷徑 Hook，讓其他元件可以一秒拿到使用者資料
export const useAuth = () => {
    return useContext(AuthContext);
};