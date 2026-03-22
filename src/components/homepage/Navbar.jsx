import SvgIcon from '../SvgIcons';
import {Link} from 'react-router-dom';
import Menu from '../Menu/Menu';
import UserMenu from '../Menu/UserMenu';

import { db } from '../../firebaseConfig';
import { getAuth,onAuthStateChanged,signOut } from 'firebase/auth';
// 🌟 新增：引入 Firestore 相關模組 (假設你使用的是 Firestore)
import { doc, onSnapshot } from 'firebase/firestore';


import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../store/MessageSlice';

const Navbar = () => {

    // 建立使用者狀態變數
    const [currentUser, setCurrentUser] = useState(null);
    // 🌟 新增：建立頭像網址的狀態變數
    const [avatarUrl, setAvatarUrl] = useState(null);
    
    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 使用useEffect 來監聽使用者登入狀態
    useEffect(()=>{

        // 宣告一個變數來裝資料庫的監聽取消函數
        let unsubscribeSnapshot = null;
        const unsubscribe = onAuthStateChanged(auth,async(user)=>{
            if(user){
                setCurrentUser(user); //已登入,將登入資訊存起來
                // 🌟 新增：去資料庫抓取使用者的頭像資料
                try {
                    // 假設你的資料表叫做 'users'，且文件 ID 就是 user.uid
                    const userDocRef = doc(db, 'users', user.uid);
                    // 🌟 3. 使用 onSnapshot 取代原本的 getDoc
                    unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            
                            // 🌟 4. 注意這裡！你的 BasicData.jsx 是把圖片存成 'img'
                            // 所以這裡優先讀取 userData.img
                            const fetchedAvatar = userData.img || user.photoURL; 
                            setAvatarUrl(fetchedAvatar || null);
                        }
                    }, (error) => {
                        console.error("即時監聽使用者資料失敗：", error);
                    });
                } catch (error) {
                    dispatch(showMessage({
                        type:"error",
                        text:"獲取使用者頭像失敗!如有問題,請聯繫客服"
                    }))
                }
            }else{
                setCurrentUser(null); //解除登入,將登入資訊取消
                setAvatarUrl(null);   // 🌟 新增：清空頭像狀態
            }
        });

        // 離開 Navbar 元件時，取消 Auth 監聽與資料庫監聽
        return () => {
            unsubscribe();
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }
        };
    },[auth]);

    // 建立登出功能
    const handleLogout=async()=>{
        try{
            await signOut(auth);
            navigate('/');
            dispatch(showMessage({
                type:"success",
                text:"你已成功登出!"
            }));
        }catch(err){
            console.error('登出失敗!',err);
            dispatch(showMessage({
                type:"error",
                text:'登出時發生錯誤,請稍後嘗試!'
            }));
        }
    }

    return (
        <>
            <nav 
                className="navbar navbar-light bg-light py-2 shadow-sm" 
                style={{
                    position: "fixed", 
                    width: "100%", 
                    zIndex: "9999", 
                    top: "0", 
                    left: "0" 
                }} 
            >
                <div className="container-fluid px-3 px-lg-5"> 
                    
                    {/* 左側：Logo 區塊 */}
                    <Link 
                        to='/' 
                        className="navbar-brand d-flex align-items-center gap-2 m-0 text-decoration-none link-bar">
                        <SvgIcon name='home-vector' color="#D4AB6A" width="54" height="44"/>
                        <span className="fw-bold" style={{ color: "#6F5D42" }}>安心窩</span> 
                    </Link>

                    {/* 右側：按鈕與漢堡選單 */}
                    <div className="d-flex align-items-center gap-3">
                        
                        {/* 🌟 核心邏輯：判斷 currentUser 是否存在，來決定要顯示什麼 */}
                        {currentUser ? (
                            /* --- ✅ 已登入狀態 --- */
                            <>
                                <button
                                        type="button"
                                        // ✨ 把原本的 border-0 拿掉，換成 border、border-2(設定粗細)、rounded-circle(變圓形)、p-1(推開一點內距)
                                        className="btn p-1 rounded-circle d-flex align-items-center justify-content-center personal-bar"
                                        // ✨ 直接在這裡寫完整 border (粗細、實線、顏色)
                                        style={{ border: "1px solid #D4AB6A" }}
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#userMenu"
                                    >
                                    {/* 🌟 修改：判斷如果有 avatarUrl 就顯示圖片，沒有就顯示預設 SvgIcon */}
                                    {avatarUrl ? (
                                        <img 
                                            src={avatarUrl} 
                                            alt="User Avatar" 
                                            style={{ 
                                                width: "40px", 
                                                height: "40px", 
                                                borderRadius: "50%", 
                                                objectFit: "cover", // 確保圖片不變形
                                                cursor: "pointer" 
                                            }} 
                                        />
                                    ) : (
                                        <SvgIcon 
                                            name='home-user-icon' 
                                            width="40px" 
                                            height= "40px"  
                                            style={{ cursor:"pointer"}}
                                        />
                                    )}
                                </button>
                            </>
                        ) : (
                            /* --- ❌ 未登入狀態 (原本的程式碼) --- */
                            <>
                                <Link
                                    to="/sign" 
                                    className="btn btn-outline-warning top-button text-decoration-none desktop-login-btn m-0"
                                    type="button" 
                                    style={{ color: "#6F5D42", borderColor: "#D4AB6A" }}>
                                    註冊/登入
                                </Link>

                                {/* 手機頁顯示登入Icon */}
                                <Link 
                                    to="/sign"
                                    className= "d-inline-block d-md-none" 
                                    style={{color: "#D4AB6A"}}>
                                    <SvgIcon name='home-login-icon' width="40px" height="40px"/>
                                </Link>
                            </>
                        )}

                        {/* 漢堡選單按鈕 (無論登入與否都顯示) */}
                        <button
                            className='btn p-0 border-0 list-side'
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target='#mobileMenu'>
                            <SvgIcon name='home-icon-button' width ="40px" height="40px" color="#D4AB6A"/>
                        </button>
                    </div>
                </div>
            </nav>

            <div style={{ height: "80px", marginBottom: "1rem" }}></div>
            <Menu/>
            <UserMenu handleLogout={handleLogout}/>
        </>
    )
}

export default Navbar;