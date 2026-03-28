import {useState,useEffect} from 'react';
import {db} from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore'; // 💡 補齊需要的 Firestore 函式
import { onAuthStateChanged, getAuth } from 'firebase/auth'; // 💡 確保引入 getAuth
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { showMessage } from '../../store/MessageSlice';
const EveryoneInterest = ({currentHouseId,currentUser}) => {
    // 💡 建立資料陣列，方便管理與後續串接 API
    const [recommendDatas,setRecommendDatas]= useState([]);
    const [isLoading,setIsLoading]= useState(true);


    // 💡 追蹤目前正在點擊愛心的房屋 ID (使用 Set 可以同時追蹤多個)
    const [updatingIds,setUpdatingIds]= useState(new Set());
    const dispatch= useDispatch();



    // 傳入隨機房源，並「合併該使用者的收藏狀態」
    useEffect(()=>{
        const fetchRandomHouses= async()=>{
            try{
                setIsLoading(true);
                const houseRef= collection(db,"houses");
                const querySnapshot= await getDocs(houseRef);
                
                // 整理從firebase中取得的資料
                const allHousesData= querySnapshot.docs.map((doc)=>({
                    id:doc.id,
                    ...doc.data()
                }));

                // 1. 如果有傳入目前的房源 ID，就先把它過濾掉
                const otherHouses= currentHouseId? 
                    allHousesData.filter(house=>house.id!==currentHouseId):
                    allHousesData

                // 2. 隨機打亂陣列 (洗牌)
                const shuffledHouses = [...otherHouses].sort(()=>0.5-Math.random());

                const randomFour = shuffledHouses.slice(0, 4);

                // 💡 關鍵：如果使用者有登入，我們需要去檢查這 4 間房子他有沒有收藏
                if (currentUser) {
                    const mappedData = await Promise.all(
                        randomFour.map(async (house) => {
                            const favorDocId = `${currentUser.uid}_${house.id}`;
                            const favorRef = doc(db, 'favorites', favorDocId);
                            const favorSnap = await getDoc(favorRef);
                            return {
                                ...house,
                                isfavor: favorSnap.exists() // 如果檔案存在，代表有收藏
                            };
                        })
                    );
                    setRecommendDatas(mappedData);
                } else {
                    // 沒登入就預設為 false
                    const mappedData = randomFour.map(house => ({ ...house, isfavor: false }));
                    setRecommendDatas(mappedData);
                }
            }catch(err){
                console.error("隨機取資料時發生錯誤:",err);
                dispatch(showMessage({
                    type:"error",
                    text:"取得推薦房屋時發生錯誤,按f12確認詳細資訊,或連繫客服"
                }))
            }finally{
                setIsLoading(false);
            }
        };
        fetchRandomHouses();
    },[currentHouseId,currentUser,dispatch]); // 💡 將 currentUser 加入依賴，登入狀態改變時重新抓取
    

    // 收藏功能
    const handleFavorite= async(e,id,currentState)=>{
        e.preventDefault();
        // 如果正在更新資料-->不重複執行
        if(updatingIds.has(id)) return;
        
        const nextStatus= !currentState;

        if (!currentUser) {
            dispatch(showMessage({
                type: "warning",
                text: "請先登入會員，才能收藏房屋喔！(◕KZ◕)"
            }));
            return;
        };

        // 將這筆房源的 ID 加入 updating 狀態
        setUpdatingIds(prev => new Set(prev).add(id));
        
        // 先樂觀更新 UI (讓愛心馬上變色)
        setRecommendDatas(prev => prev.map(house => 
            house.id === id ? { ...house, isfavor: nextStatus } : house
        ));

        try {
            const favorDocId = `${currentUser.uid}_${id}`;
            const favorRef = doc(db, 'favorites', favorDocId);
            // 如果使用者收藏資料,將使用者的favorites狀態改為"已收藏"
            // 否則取消收藏
            if (nextStatus) {
                await setDoc(favorRef, {
                    userId: currentUser.uid,
                    houseId: id,
                    createAt: serverTimestamp(),
                });
            } else {
                await deleteDoc(favorRef);
            }

            const clickedHouse = recommendDatas.find(house => house.id === id);
            const title = clickedHouse ? clickedHouse.title : "該房屋";
            dispatch(showMessage({
                type: "success",
                text: `${title} 已${nextStatus ? "加入" : "移除"}收藏!`
            }));
            
        } catch (err) {
            console.error("雲端同步失敗，還原本地狀態...", err);
            // 失敗時，把愛心狀態復原
            setRecommendDatas(prev => prev.map(house => 
                house.id === id ? { ...house, isfavor: currentState } : house
            ));
            dispatch(showMessage({
                type: "error",
                text: `發生錯誤,請按f12確認錯誤訊息,或者聯繫客服`
            }));
        } finally {
            // 不論成功失敗，解除 updating 狀態
            setUpdatingIds(prev => {
                const nxt = new Set(prev);
                nxt.delete(id);
                return nxt;
            });
        }
    }   

    return (
        <section className="mb-5">
            {/* 標題 */}
            <h3 className="fs-5 fw-bold mb-4">
                大家都在看......
            </h3>

            {/* 💡 網格系統：手機版 1 欄，平板 2 欄，電腦版 4 欄，g-4 控制卡片間距 */}
            <div className="house-scroll-container py-2">
                <div className='d-flex flex-nowrap gap-3 gap-md-4'>
                {
                    isLoading?(
                        <>
                            <div className="text-center py-5 text-secondary small">推薦房源載入中...</div>
                        </>
                    ):(
                        <>
                            {
                                recommendDatas.map((item)=>{
                                    // 檢查房屋收藏狀態是否正在進行
                                    const isThisCardUpdating = updatingIds.has(item.id);
                                    
                                    return(
                                        <div className="flex-shrink-0 house-card-wrapper " key={item.id}>
                                            {/* 💡 使用 Link 把卡片包起來，並去除預設的 a 標籤底線 */}
                                            <Link 
                                                to={`/item/${item.id}`} 
                                                className="text-decoration-none text-dark d-block interest-house-cards">
                                                <div className="card h-100 border-0 bg-transparent">
                                                    
                                                    {/* 💡 圖片區塊：改接 Firebase 中的 item.img */}
                                                    <img 
                                                        src={item.img} 
                                                        alt={item.title} 
                                                        className="w-100 rounded-3 mb-2" 
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                    />
                                                    
                                                    <div className="card-body p-0 mt-1">
                                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                                            {/* 💡 標題改接 Firebase 中的 item.title */}
                                                            <h5 className="fs-6 fw-bold mb-0 text-dark">{item.title}</h5>
                                                            
                                                            {/* 💡 愛心點擊按鈕 */}
                                                            <i 
                                                                className={`bi ${item.isfavor ? "bi-heart-fill" : "bi-heart"} text-warning ${isThisCardUpdating ? 'opacity-50' : ''}`}
                                                                style={{ 
                                                                    cursor: isThisCardUpdating ? 'default' : 'pointer', 
                                                                    pointerEvents: isThisCardUpdating ? 'none' : 'auto' 
                                                                }}
                                                                
                                                                onClick={(e) => !isThisCardUpdating && handleFavorite(e, item.id, item.isfavor)}    
                                                            ></i>
                                                        </div>

                                                        <p className="text-secondary small mb-1 text-truncate">
                                                            {item.address}
                                                        </p>
                                                        
                                                        {/* 💡 房屋規格：用字串組合的方式顯示 Firebase 中的 age 和 size */}
                                                        <p className="text-secondary small mb-2">
                                                            屋齡 {item.age}年 | 坪數 {item.size}坪
                                                        </p>
                                                        
                                                        {/* 💡 價格：加上 toLocaleString() 讓數字有千分位逗號 */}
                                                        <p className="fw-bold mb-0 text-danger" style={{ fontSize: '15px' }}>
                                                            ${item.price?.toLocaleString()} <span className="fw-normal text-secondary small">/ 月租</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                )})
                            }
                        </>
                    )
                }
                </div>
            </div>
        </section>
    )
}

export default EveryoneInterest;