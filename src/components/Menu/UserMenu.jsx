import {useState,useEffect} from 'react';
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import { doc,onSnapshot } from "firebase/firestore"; //進行即時監聽

import { useDispatch } from 'react-redux';
import { showMessage } from '../../store/MessageSlice';
import { Link } from 'react-router-dom';
const UserMenu=({handleLogout})=>{

    const SelectFunction=[
        {id:1, title:"個人資料編輯", turnTo:"/personalEdit"},
        {id:2, title:"我的收藏", turnTo :"/collected"},
        {id:3 ,title :"我的預約看房", turnTo:"/MyBooking"},
        {id:4,title:"刊登屋件管理", turnTo:"/manage-posts"}
    ];

    const {user} = useAuth();

    // 新增用來存放從資料庫抓回來的自訂名稱
    const [userName,setUserName]= useState('');

    const dispatch=useDispatch();
    // 使用useEffect來監聽Firebase使用者資料變化
    useEffect(()=>{
        let unsubscribe= null;
        if(user&&user.uid){
            // 設定要監聽的文件路徑：users collection 下的該 user.uid
            const userDocRef= doc(db,'users',user.uid);

            // 開始即時監聽
            unsubscribe= onSnapshot(userDocRef,(docSnap)=>{
                if(docSnap.exists()){
                    const userData= docSnap.data();
                    // 將資料庫裡的 name 存到 state 中 (如果有值的話)
                    setUserName(userData.name||"");

                }
            },(error)=>{
                console.error("監聽使用者名稱失敗:",error);
                dispatch(showMessage({
                    type:"error",
                    text:"監聽使用者名稱失敗,請按f12確認原因,或者聯繫客服"
                }))
            });
        }else{
            // 告訴 ESLint 這是 Firebase 標準寫法，很安全
            //eslint-disable-next-line
            setUserName("");
        }

        // 離開元件時取消監聽，避免 memory leak
        return()=>{
            if(unsubscribe){
                unsubscribe();
            }
        }
    },[user])

    //防止資訊外洩,會使用mark

    const markEmail=(email)=>{
        if(!email) return '';
        const name= email.split('@')[0];
        
        //只取前三個字,後面補上***
        const maskedName= name.substring(0,3);
        return `${maskedName}`
    }

    return(
        <>
            {/* 🌟 會員專屬側滑選單 (User Menu Offcanvas) */}
            <div 
                className="offcanvas offcanvas-end" 
                tabIndex="-1" 
                id="userMenu" 
                aria-labelledby="userMenuLabel">
                
                {/* 頂部：標題與關閉按鈕 */}
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title fw-bold text-dark" id="userMenuLabel">會員中心</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                {/* 內容區：選單列表 */}
                <div className="offcanvas-body d-flex flex-column align-items-center justify-content-between pt-5 gap-4">
                    
                    {/* 上方：導覽連結 (根據設計圖置中且間距寬敞) */}
                    <div className="d-flex flex-column text-center gap-4 mt-4">
                        {
                            // 🌟 核心修改：顯示名稱的優先順序為：
                            // 1. userName (從 Firestore 來的 BasicData 名稱)
                            // 2. user.displayName (Google 登入預設名稱，如果有的話)
                            // 3. markEmail(user.email) (最後的備用方案，信箱遮罩)
                            user &&(
                                <h5>歡迎回來,{userName||user.displayName || markEmail(user.email)}</h5>
                            )
                        }
                        {/* 💡 記得將來把 to="" 換成你實際的 Router 路徑 */}
                        {
                            SelectFunction.map((item)=>(
                                <Link
                                    to={item.turnTo} 
                                    key={item.id}
                                    className="text-decoration-none fw-bold custom-list-button"
                                    >
                                    {item.title}
                                </Link>
                            ))
                        }
                    </div>

                    {/* 下方：登出按鈕 (與設計圖一致，帶有圖示並置中) */}
                    <div className="text-center mb-4">
                        {/* 💡 這裡呼叫你已經寫好的 handleLogout */}
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                // 點擊登出後，順便用 JS 把側滑選單關閉
                                document.querySelector('#userMenu .btn-close').click();
                                setTimeout(()=>{
                                    handleLogout();
                                },500);
                            }} 
                            className="btn border-0 fw-bold d-inline-flex align-items-center gap-2 custom-list-logout" 
                        >
                            登出 <i className="bi bi-box-arrow-right"></i>
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default UserMenu;