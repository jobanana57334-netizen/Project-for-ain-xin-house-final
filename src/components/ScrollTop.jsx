
import { useEffect } from "react";

import { useLocation } from "react-router-dom";

export default function ScrollTop(){
    // 使用useLocation抓出目前的網址路徑
    const {pathname} = useLocation();

    useEffect(()=>{
        // 只要連結到其他頁面,強制將window視窗卷軸變為0
        window.scrollTo(0,0);
    },[pathname])// 倚賴陣列記得放pathname,讓網址進行轉換時,立刻觸發

    // 他是操作者,無須顯示任何東西
    return null;
};

