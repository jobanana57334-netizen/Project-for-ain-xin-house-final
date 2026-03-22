import { useState, useEffect, useRef } from "react";
import { db } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs ,query,where, doc,setDoc,deleteDoc,serverTimestamp} from "firebase/firestore";

import { useDispatch } from "react-redux";
import { showMessage } from "../../store/MessageSlice";

import SingleHouseCard from "./SingleHouseCard/SingleHouseCard";
import SpecialCard from "./SingleHouseCard/SpecialCard";


const HouseCard=()=>{

    const scrollRef= useRef(null); //建立給滑動區一個監聽事件

    const [houseDatas,setHouseDatas]=useState([]);
    const [houseType,setHouseType]= useState([]);

    // 建立觀察器,了解現在圖片轉動情況
    const [visibleIds,setVisibleIds]= useState(new Set());

    // 新增讀取狀態
    const [isLoading,setIsLoading]= useState(true);

    // 正在向後端發送更新的房屋 id 集合，用來禁止重複點擊
    const [updatingIds, setUpdatingIds] = useState(new Set());

    // 確認登入狀態
    const [currentUser, setCurrentUser] = useState(null);
    const auth = getAuth(); // 取得驗證實例
    
    const dispatch= useDispatch();

    // 🌟 讀取最新房屋資料與初始化收藏狀態 (合併版)
    useEffect(() => {
        const fetchHousesAndFavorites = async () => {
            setIsLoading(true); // 開始載入資料
            try {
                // 步驟一：先抓取「熱門房屋」與「房屋類型」
                const hotHouseQuery = query(
                    collection(db, "houses"),
                    where('isHot', "==", true)
                );

                const [houseSnap, typeSnap] = await Promise.all([
                    getDocs(hotHouseQuery),
                    getDocs(collection(db, 'houseTypes'))
                ]);

                // 處理房屋類型字典 (typeMap)
                const typeMap = {};
                typeSnap.docs.forEach((doc) => {
                    typeMap[doc.id] = doc.data().name;
                });
                setHouseType(typeMap);

                // 將抓到的熱門房屋先預設加上 isfavor: false
                let fetchedHouses = houseSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    isfavor: false 
                }));

                // 步驟二：如果使用者「有登入」，再去抓他的收藏清單來覆寫狀態
                if (currentUser) {
                    const favQuery = query(
                        collection(db, 'favorites'),
                        where('userId', '==', currentUser.uid)
                    );
                    const favSnapshot = await getDocs(favQuery);
                    
                    const favoriteHouseIds = new Set(
                        favSnapshot.docs.map(doc => doc.data().houseId)
                    );

                    // 如果使用者的收藏裡有這個房子，就把 isfavor 改為 true
                    fetchedHouses = fetchedHouses.map(house => ({
                        ...house,
                        isfavor: favoriteHouseIds.has(house.id)
                    }));
                }

                // 步驟三：統一寫入 State 更新畫面！
                setHouseDatas(fetchedHouses);

            } catch (err) {
                console.error("抓取失敗:" + err?.message);
                dispatch(showMessage({
                    type: "error",
                    text: "資料載入失敗，請稍後再試！或者立即連繫客服!"
                }));
            } finally {
                setIsLoading(false); // 資料載入結束
            }
        };

        fetchHousesAndFavorites();
        // 💡 這裡放 currentUser 作為 dependency，登入登出時都會重新觸發這個流程！
    }, [currentUser, dispatch]);

    // --- 新增：處理收藏切換的函式 ---
    const handleFavorite = async(id, currentStatus) => {
        // 如果正在更新，就不再執行
        if (updatingIds.has(id)) return;

        const nextStatus = !currentStatus;
        
        if (!currentUser) {
            dispatch(showMessage({
                type:"warning",
                text:"請先登入會員，才能收藏房屋喔！(◕KZ◕)"
            }));
            return; // 直接結束，不執行後面的程式碼，就不會跳 Permission Error 了
        };
        // 將 id 加入 updatingIds
        setUpdatingIds(prev => new Set(prev).add(id));
        // 2. 更新本地 state (讓 UI 立即有反應)
        setHouseDatas(prev => prev.map(house => 
            house.id === id ? { ...house, isfavor: nextStatus } : house
        ));


        try{
            //更新個人收藏1:定義這筆收藏的專屬ID資料庫
            const favorDocId= `${currentUser.uid}_${id}`;
            const favorRef = doc(db,'favorites',favorDocId);

            //更新個人收藏2:根據狀態決定是要新增還是刪除收藏文件

            if(nextStatus){
                // 加入收藏-->新增文件
                await setDoc(favorRef,{
                    userId: currentUser.uid,
                    houseId:id,
                    createAt:serverTimestamp(), //紀錄收藏時間,方便未來做排序或是清理過期收藏
                });
            }else{
                // 移除收藏-->刪除文件
                await deleteDoc(favorRef);
            }

            const clickedHouse = houseDatas.find(house => house.id === id);
            const title = clickedHouse ? clickedHouse.title : "該房屋";
            dispatch(showMessage({
                type:"success",
                text:`${title} 已${nextStatus?"加入":"移除"}收藏!`
            }))
        }catch(err){
            // 3. 錯誤處理：如果雲端更新失敗，將本地狀態回滾 (Rollback)
            console.error("❌ 雲端同步失敗，正在還原本地狀態...", err);
            setHouseDatas(prev => prev.map(house => 
                house.id === id ? { ...house, isfavor: currentStatus } : house
            ));
            console.error("❌ 錯誤詳情：", err.message);
            // 讓彈窗告訴我們真正的錯誤代碼 (例如: permission-denied 或 not-found)
            dispatch(showMessage({
                type:"error",
                text:`發生錯誤,請按f12確認錯誤訊息,或連繫客服`
            }));
        }finally{
            // 不論成功或失敗，都移除 updating 標記
            setUpdatingIds(prev => {
                const nxt = new Set(prev);
                nxt.delete(id);
                return nxt;
            });
        }
    };
    

    // 收藏功能
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user); // 有人登入，記住他
            } else {
                setCurrentUser(null); // 沒人登入，清空
            }
        });
        return () => unsubscribe(); // 離開頁面時取消監聽，好習慣
    }, []);

    
    // 抓取目前圖片滑動功能
    useEffect(()=>{
        const observer = new IntersectionObserver(
            (entries) => {
                setVisibleIds((prevIds) => {
                    const newIds = new Set(prevIds);
                    entries.forEach((entry) => {
                        // 取得卡片自定義的 ID
                        const id = entry.target.getAttribute('data-id');
                        // intersectionRatio >= 1 代表卡片 100% 都在容器內
                        if (entry.isIntersecting && entry.intersectionRatio >= 0.99) {
                            newIds.add(id);
                        } else {
                            newIds.delete(id);
                        }
                    });
                    return newIds;
                });
            },
            {
                root: scrollRef.current, // 以捲動容器為觀察基準
                threshold: [0.99],       // 門檻設為近乎 100%
            }
        );

        // 開始觀察所有的卡片元素
        const elements = scrollRef.current?.querySelectorAll('.house-card-wrapper');
        elements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect(); // 組件卸載時斷開，避免記憶體洩漏
    },[houseDatas])

    // 設定按鈕功能
    const handleScroll = (direction)=>{
        const {current} = scrollRef;
        if(current){
            const scrollAmount = 350;

            if(direction==='left'){
                current.scrollBy({left:-scrollAmount,behavior:"smooth"});
            }else if(direction==='right'){
                current.scrollBy({left:scrollAmount,behavior:"smooth"});
            }
        }
    };

return (
        <>
            <div className='container-fluid py-4 my-5 mt-5'> 
                <div 
                    id="select1"
                    className="select1 slide rounded-4 mx-auto"
                    style={{ maxWidth: '1400px' }}> 
                    
                    {/* 💡 標題與桌機版按鈕區塊 */}
                    <div className="ps-4 pe-4">
                        <h1 className="fw-bold mb-2">熱門首選</h1>
                        <div className="d-flex align-items-center">
                            <span className="text-muted text-nowrap">你不可錯過的精選租屋處</span>
                            <hr className="ms-3 flex-grow-1" style={{border: "1px solid #9cb7c4", opacity: "1", maxWidth: "120px"}} />
                            
                            {/* 💡 桌機版：右上角按鈕 (手機版自動隱藏) */}
                            <div 
                                className="d-none d-md-flex ms-auto gap-2">
                                <button 
                                    type="button" 
                                    className="btn btn-houseCard-custom rounded-circle btn-icon"
                                    onClick={()=>handleScroll('left')}>
                                    <i className="bi bi-arrow-left"></i>
                                </button>
                                <button 
                                    type="button"
                                    className="btn btn-houseCard-custom rounded-circle btn-icon"
                                    onClick={()=>handleScroll('right')}>
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 💡 橫向滑動卡片區：改用 house-scroll-container 包覆 */}
                    <div
                        ref={scrollRef}
                        className="house-scroll-container ps-4 py-4" 
                        style={{ 
                            marginTop: "10px", 
                            overflowX:'auto',
                            scrollbarWidth:"none",//隱藏Firefox的捲動條
                            msOverflowStyle:"none"//隱藏IE的捲動條
                            }}> 
                        <div className='d-flex flex-nowrap gap-3 gap-md-4'>
                            {isLoading?(
                                // 🌟 Loading 狀態：印出 5 張帶有閃爍動畫 (placeholder-glow) 的骨架卡片
                            Array.from({ length: 5 }).map((_, index) => (
                                <div className="flex-shrink-0 house-card-wrapper opacity-100" key={`skeleton-${index}`}>
                                    <div className="card h-100 custom-card placeholder-glow" style={{ borderRadius: '16px', border: 'none' }}>
                                        {/* 假圖片區塊 */}
                                        <div className="placeholder w-100 bg-secondary" style={{ height: "230px", borderRadius: '16px 16px 0 0', opacity: 0.2 }}></div>
                                        <div className="card-body px-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
                                                {/* 假標題 */}
                                                <span className="placeholder col-7 rounded bg-secondary opacity-25"></span>
                                                {/* 假愛心 Icon */}
                                                <span className="placeholder col-1 rounded-circle bg-secondary opacity-25" style={{ height: '20px', width: '20px' }}></span>
                                            </div>
                                            {/* 假地址 */}
                                            <p className="placeholder col-9 rounded bg-secondary opacity-25 mb-2 mt-2"></p>
                                            {/* 假房屋屬性 (格局/坪數) */}
                                            <p className="placeholder col-11 rounded bg-secondary opacity-25 mb-2"></p>
                                            {/* 假價格 */}
                                            <h5 className="placeholder col-5 rounded bg-secondary opacity-50 mt-4 mb-1"></h5>
                                        </div>
                                    </div>
                                </div>
                                ))
                            ):(
                                // 🌟 資料載入完成：印出真正的房屋卡片
                                houseDatas.slice(0, 5).map((item) => {

                                    const typeName = houseType[item.typeId] || "未知類型";
                                    
                                    // 如果Id不在visibleIds==>則套用透明度50%
                                    const isVisible= visibleIds.has(String(item.id));

                                    // 如果這筆資料的ID在正在更新的ID集合裡，就認定它正在更新
                                    // 這裡要特別注意：因為 item.id 可能是數字，但我們在 Set 裡存的是字串（因為 data-id 是字串），
                                    // 所以要轉成同一種型別才能正確比對
                                    const isUpdating = updatingIds.has(String(item.id));

                                    // 💡 把複雜的 HTML 替換成乾淨的子元件，並傳入 Props
                                    return(
                                        <SingleHouseCard 
                                            key={item.id}
                                            item={item}
                                            typeName={typeName}
                                            isVisible={isVisible}
                                            isUpdating={isUpdating}
                                            onFavorite={handleFavorite} // 傳入收藏處理函式
                                        />
                                    )
                                })
                            )
                                
                            }
                            {/* 💡 優化後的「查看更多」特殊卡片 */}
                            {/* 如果houseDatas沒有載入內容,不可以顯示特殊卡片出來 */}
                            {
                                !isLoading && houseDatas.length>0 &&(
                                    <SpecialCard key='special-card' visibleIds={visibleIds}/>
                                )
                            }
                            

                        </div>{/*End of flex-nowrap*/}
                    </div>{/*End of house-scroll-container*/}

                </div>
            </div>
        </>
    )
};

export default HouseCard;