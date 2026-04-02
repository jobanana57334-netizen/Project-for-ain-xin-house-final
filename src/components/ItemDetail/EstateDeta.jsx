import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { db } from '../../firebaseConfig'; 
import { collection, query, where, getDocs } from "firebase/firestore";

import { showMessage } from "../../store/MessageSlice";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc,setDoc,deleteDoc,serverTimestamp } from "firebase/firestore";
import { useDispatch } from "react-redux";

import Swal from 'sweetalert2';

import ContactCard from "./ContactCard/ContactCard";
import BookingViewing from "./ContactCard/BookViewing";
const EstateDeta = ({ houseData }) => {

  // 1. 新增本地狀態
  const [currentUser, setCurrentUser] = useState(null);
  const [isFavor, setIsFavor] = useState(false); // 用來控制這單個物件的愛心狀態
  const [isUpdating, setIsUpdating] = useState(false); // 正在同步收藏狀態
    
  // 新增聯絡提示框的狀態
  const [showContactAlert, setShowContactAlert] = useState(false);
  // 新增顯示預約看房的狀態
  const [showBookingAlert, setShowBookingAlert] = useState(false);

  const navigate= useNavigate();

  const dispatch = useDispatch();
  const auth = getAuth();

  // 2. 當傳入的 houseData 改變/載入完成時，設定初始的收藏狀態
  useEffect(() => {
    if (houseData) {
      setIsFavor(houseData.isfavor);
    }
  }, [houseData]);

  // 3. 監聽登入狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user : null);
    });
    return () => unsubscribe();
  }, [auth]);

  // 4. 點擊收藏按鈕的處理函式 (針對單筆資料改寫)
  const handleFavoriteClick = async () => {
    if (!houseData?.id) return; // 防呆：確保物件有 ID 再執行

    if (!currentUser) {
      dispatch(showMessage({
        type: "warning",
        text: "請先登入會員，才能收藏房屋喔！(◕KZ◕)"
      }));
      return;
    }

    if (isUpdating) return; // 忙碌中不再處理

    // 建立判斷,判斷是否蒐藏與房屋id,來決定接下來的動作
    const currentStatus = isFavor;
    const nextStatus = !currentStatus;
    const id = houseData.id;

    // 【樂觀更新 UI】直接改變本地的布林值，UI 會瞬間切換，不需要 map
    setIsFavor(nextStatus);
    setIsUpdating(true);

    try {
      // 【🌟 關鍵修改】：定義專屬的 favorite 文件路徑
      const favoriteDocId = `${currentUser.uid}_${id}`;
      const favoriteRef = doc(db, "favorites", favoriteDocId);

      // 依據 nextStatus 決定要寫入還是刪除
      if (nextStatus) {
        // 加入收藏：在 favorites 新增文件
        await setDoc(favoriteRef, {
          userId: currentUser.uid,
          houseId: id,
          createAt: serverTimestamp() // 記錄收藏時間
        });
      } else {
        // 取消收藏：在 favorites 刪除該文件
        await deleteDoc(favoriteRef);
      }
            
      const title = houseData?.title || "該房屋";
      dispatch(showMessage({
        type:"success",
        text: `${title} ${nextStatus ? "已加入" : "已移除"}收藏！`
      }))

    } catch (err) {
      // 如果雲端更新失敗，將本地狀態回滾
      console.error("❌ 雲端同步失敗，正在還原本地狀態...", err);
      setIsFavor(currentStatus);
      dispatch(showMessage({
        type: "error",
        text: `發生錯誤,請聯繫客服!`
      }));
    } finally {
      setIsUpdating(false);
    }
  };


  // 點擊後顯示填寫預約看房小卡
  const handleBookingCard=async()=>{
    if(currentUser){
      setShowBookingAlert(true);
    }else{
      const result=await Swal.fire({
        icon:'warning',
        title:"請先登入",
        text:"請先登入會員，才能預約看房喔！(◕KZ◕)",
        showCancelButton:true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor:"#6c757d",
        confirmButtonText:"我要登入",
        cancelButtonText:"取消"
      });
      // 當使用者確認躍登入,移轉到登入頁面
      if (result.isConfirmed){
        navigate('/sign')
      }
      return;
    }
  };

  // 🌟 提交預約看房資訊 (這個方法將傳給 BookingViewing 元件使用)

  const submitBookingData =async(formData)=>{
    if(currentUser){
      try{
        const checkBookingsRef = collection(db, "UserBooking");
        // 1. 查詢資料庫：尋找「同一個房屋」且「同一支電話(或 userId)」的預約紀錄
        // 💡 提示：如果有做會員登入，強烈建議把 "phone" 換成 "userId" 判斷會更準確

        const q= query(
          checkBookingsRef,
          where('houseId','==',houseData.id),
          where('userId','==',currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        let isRecentlyBooked= false;

        if(!querySnapshot.empty){
                    
          // 3天的毫秒數：3天 * 24小時 * 60分 * 60秒 * 1000毫秒
          const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
          const now= new Date().getTime();

          querySnapshot.forEach((doc)=>{
            const pastBooking= doc.data();
            // 確保 createAt 存在，再轉換成毫秒
            if (pastBooking.createAt) {
              const pastBookingTime = pastBooking.createAt.toMillis();
                            
              // ✅ 修正 4：把判斷式移進迴圈內。只要有一筆紀錄在三天內，就阻擋
              if (now - pastBookingTime < THREE_DAYS_MS) {
                isRecentlyBooked = true;
              }
            }
          });
        };

        if(isRecentlyBooked){
          Swal.fire({
            icon:'error',
            title:"你已登記過該房屋預約了",
            text:"使用者不可以在三天內預約同一間房,如有問題,請洽客服0912-345-678",
            confirmButtonColor: '#3085d6',
            confirmButtonText:"確認",
          })
          return;
        }

        // 建立一個獨一無二的文件 ID (例如：用戶ID_時間戳)
        const bookingId= `${currentUser.uid}_${Date.now()}`;
        const bookingRef= doc(db,'UserBooking',bookingId);

                
        // 將資料寫入 Firebase
        await setDoc(bookingRef,{
          userId: currentUser.uid,
          houseId: houseData.id,
          houseTitle: houseData.title,
          ...formData, // 展開從 BookingViewing 傳來的表單資料 (如日期、時間、留言等)
          createAt:serverTimestamp() //確立何時建立資料
        });

        dispatch(showMessage({
          type:"success",
          text:"繳交預約房屋資料成功,請等待1~3個工作天,會有專人來與你連絡!"
        }));

        // 提交成功後關閉視窗
        setShowBookingAlert(false);

      }catch(err){
        console.error("❌ 預約看房提交失敗：", err);
        dispatch(showMessage({
          type: "error",
          text: "預約失敗，請稍後再試。按f12可以確認詳細錯誤資訊!或是聯繫客服"
        }));
      }
    }

    else{
      const result=await Swal.fire({
        icon:'warning',
        title:"請先登入",
        text:"請先登入會員，才能預約看房喔！(◕KZ◕)",
        showCancelButton:true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor:"#6c757d",
        confirmButtonText:"我要登入",
        cancelButtonText:"取消"
      });
      // 當使用者確認躍登入,移轉到登入頁面
      if (result.isConfirmed){
        navigate('/sign')
      }
      return;
    }
  }


  // 5. 根據目前的 isFavor 決定顯示實心還是空心愛心
  const isCollectedClass = isFavor ? `bi-heart-fill` : `bi-heart`;
  const sex = houseData?.contact?.sex === 'male' ? '先生' : '女士';

  return (
    <div style={{ paddingBottom: "2rem" }}>
            
      {/* 上方文字區塊：標題、副標、地址與標籤 */}
      <div className="d-flex justify-content-between mt-3 ms-3">
        <div>
          <h3 className="fw-bold text-dark">
            {houseData?.title || "找不到資料"}
          </h3>
          <p className="fw-medium mt-2 mb-1">
            {houseData?.description || "沒有任何描述"}
          </p>
          <p className="small mt-2 mb-0" style={{ color: "#6F5D42" }}>
            {houseData?.address || "找不到資料"}
          </p>
        </div>
                
        {/* 💡 綁定點擊事件 onClick={handleFavoriteClick} */}
        <i 
          className={`bi ${isCollectedClass} text-warning me-4 mt-1 ${isUpdating ? 'opacity-50' : ''}`} 
          style={{ 
            cursor: isUpdating ? 'default' : "pointer",
            fontSize: "24px",
            transition: "transform 0.2s", // 加上一點微動畫讓點擊回饋更好
            pointerEvents: isUpdating ? 'none' : 'auto'
          }}
          onClick={handleFavoriteClick}
        ></i>
      </div>
                
      <div className="d-flex flex-wrap gap-2 mt-3 ms-2">
        <span className="tag">{houseData?.typeName || "未知類型"}</span>
        <span className="tag">屋齡{houseData?.age || 0}年</span>
        <span className="tag">
          {houseData?.floorInfo?.current || "-"}F/{houseData?.floorInfo?.total || "-"}F
        </span>
        <span className="tag">建物{houseData?.size || 0}坪</span>
        <span className="tag">
          {houseData?.layout?.room || 0}房(室)
          {houseData?.layout?.hall || 0}廳
          {houseData?.layout?.bathroom || 0}衛
        </span>
      </div>
            
      <div className="ms-3 mt-4">
        <h3 className="price mb-0">
          ${houseData?.price?.toLocaleString() || "找不到資料"}/ 月租
        </h3>
      </div>

      <div className="card mt-4 mx-0 mx-md-3 border-0" style={{ borderRadius: "8px" }}> 
        <div className="card-body p-3 px-4 px-md-3">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-shrink-0" style={{ width: '48px', height: '48px' }}>
              <img 
                src={houseData?.contact?.picture || null} 
                alt="房東頭像" 
                className="w-100 h-100 rounded-circle object-fit-cover bg-secondary" 
              />
            </div>

            <div className="ms-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="text-secondary small">{houseData?.contact?.role || "找不到資料"}</span>
                <h6 className="mb-0 fw-bold text-dark">{houseData?.contact?.name || "找不到資料"} {sex}</h6>
              </div>
              <p className="mb-0 text-secondary" style={{ fontSize: '0.875rem' }}>
                聯絡電話 {houseData?.contact?.tel || "找不到資料"}
              </p>
            </div>
          </div>

          {/* 💡 使用 row 將區域分為網格，g-3 用來設定兩個按鈕中間的間距 */}
          <div className='row g-3 pt-3'>

            <div className="col-6">
              <button 
                className="book-viewing w-100 mt-2"
                onClick={handleBookingCard}
              >
                預約看房
              </button>
            </div>

            <div className="col-6">
              <button 
                className="contact w-100 mt-2"
                onClick={()=>setShowContactAlert(true)}>
                立即電話聯絡
              </button>
            </div>
                        
          </div>
        </div>
      </div>


      {/* 顯示預約看房小卡 */}
            
      {
        showBookingAlert && (
          <BookingViewing 
            houseData={houseData}
            setShowBookingAlert={setShowBookingAlert}
            submitBookingData={submitBookingData} // 💡 將寫入 Firebase 的方法當作 props 傳入
          />
        )
      }

      {/* 顯示立刻聯絡小卡 */}
      {
        showContactAlert && (
          <>
            <ContactCard 
              houseData={houseData}
              setShowContactAlert={setShowContactAlert}
            />
          </>
        )
      }

            
    </div>
  );
};

export default EstateDeta;