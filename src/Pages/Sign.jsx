
import {  useState } from "react";
import SvgIcon from "../components/SvgIcons";
import Login from "../components/sign/Login";
import Signin from "../components/sign/Signin";


const Sign = () => {
    // 1. 定義狀態：'login' 代表登入，'signup' 代表註冊
    const [activeTab, setActiveTab] = useState('login');
    return (
        
        <div className="d-flex flex-column min-vh-100"> 
            {/* 使用 flex-column 確保 Footer 始終在底部 */}
            <div className="container d-flex justify-content-center align-items-center flex-grow-1 my-5">
                {/* 增加寬度到 500px，並加入 shadow 讓卡片浮現出來 */}
                <div className="card border-0 shadow-sm p-4 p-md-5" style={{ width: '100%', maxWidth: '500px', borderRadius: '20px' }}>
                    
                    {/* LOGO 區塊 - 放大 Icon 與文字 */}
                    <div className="text-center mb-5">
                        <SvgIcon name='home-vector' color="#D4AB6A" width="64" height="54"/>
                        <div className="mt-2">
                            <span className="text-secondary fs-5">{activeTab==="signin"?"註冊安心窩":"登入安心窩"}</span>
                        </div>
                    </div>

                    {/* 登入/註冊 切換頁籤 - 放大字體 */}
                    <div className="d-flex justify-content-around mb-5 border-bottom pb-3">
                        
                        <div 
                            className={`fs-4 cursor-pointer ${activeTab === 'login' ? 'text-dark fw-bold border-bottom border-warning border-4' : 'text-secondary'}`}
                            onClick={() => setActiveTab('login')}
                            style={{ marginBottom: '-16px' }} // 讓底線貼合 border-bottom
                        >
                            登入
                        </div>

                        <div 
                            className={`fs-4 cursor-pointer ${activeTab === 'signin' ? 'text-dark fw-bold border-bottom border-warning border-4' : 'text-secondary'}`}
                            onClick={() => setActiveTab('signin')}
                            style={{ marginBottom: '-16px' }} // 讓底線貼合 border-bottom
                        >
                            註冊
                        </div>
                        
                        
                    </div>

                    {/* 註冊表單內容 */}
                    {
                        activeTab==="login"?
                            <Login/>:
                            <Signin onSwitchToLogin={()=>setActiveTab("login")}/>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Sign;