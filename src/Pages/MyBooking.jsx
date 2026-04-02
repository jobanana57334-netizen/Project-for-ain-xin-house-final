
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection,getDocs,getDoc,doc,query,where,orderBy,updateDoc } from 'firebase/firestore';
import { getAuth ,onAuthStateChanged} from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { showMessage } from '../store/MessageSlice';

import Swal from 'sweetalert2'

import BookingList from '../components/MyBooking/BookingList';
// 轉換時段顯示的輔助函式
const formatTime = (timeCode) => {
  switch(timeCode) {
  case 'morning': return '早上 (09:00 - 12:00)';
  case 'afternoon': return '下午 (13:00 - 17:00)';
  case 'evening': return '晚上 (18:00 - 21:00)';
  default: return '未指定';
  }
};

// 判斷是否已超過預約時間的輔助函式
const checkIsExpired=(bookingDate,timeCode)=>{
  const now= new Date();
  const bookDate= new Date(bookingDate);

  // 根據你的時段設定具體的結束時間
  let endHour= 23 ; //預設
  if(timeCode==='morning') endHour=12;
  if(timeCode==='afternoon') endHour=17;
  if(timeCode==='evening') endHour = 21 ;

  // 設定預約當天的結束時間
  bookDate.setHours(endHour,0,0,0);

  // 如果現在時間大於預約結束時間，回傳 true (已逾期)
  return now > bookDate;

};


const MyBooking = () => {
  // 未來這裡會用 useState 和 useEffect 從 Firebase 撈資料
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading,setIsLoading]= useState(true);
  const dispatch= useDispatch();
  // 監聽登入狀態
  useEffect(()=>{
    const auth= getAuth();
    const unsubscribe = onAuthStateChanged(auth,(user)=>{
      setCurrentUser(user?user:null);
      if(!user) return setIsLoading(false);
    });
    return ()=>unsubscribe();
  },[]);

    

  useEffect(()=>{
    // 建立一個 async 函式來抓取資料
    const fetchBookings=async()=>{
      if(!currentUser) return

      try{
        setIsLoading(true);

        // 1. 指向 UserBooking 集合
        const bookingRef = collection(db,"UserBooking");

        // 2. 設定查詢條件：篩選 userId，並依照建立時間 (createAt) 由新到舊排序
        const q= query(
          bookingRef,
          where('userId','==',currentUser.uid),
          orderBy('createAt','desc')
        );

        // 3. 取得資料快照
        const querySnapshot = await getDocs(q);

        // 4. 將 Firebase 的 Snapshot 轉換成 React 可以直接用的陣列格式

        const bookingPromises= querySnapshot.docs.map(async(bookingDoc)=>{
          const bookingData= bookingDoc.data();
          const houseId= bookingData.houseId;

          let fetchImage= '';

          // 如果有 houseId，就去 houses 集合裡面找對應的房屋
          if(houseId){
            const houseRef= doc(db,'houses',houseId);
            const houseSnapshot= await getDoc(houseRef);
                        
            if(houseSnapshot.exists()){
              // 假設你的房屋資料庫裡面，圖片的欄位名稱叫做 'img'
              fetchImage= houseSnapshot.data().img;
            }
          }
          // 計算是否逾期
          const isExpired= checkIsExpired(bookingData.date, bookingData.time);

          return{
            id:bookingDoc.id,
            ...bookingData,
            houseImage:fetchImage,
            isExpired:isExpired
          }
        });

        // 等待所有房屋的圖片都抓取完畢，再一次性存入 State
        const bookingDatas = await Promise.all(bookingPromises);
        //將整理好的資料進行打包
        setBookings(bookingDatas);
      }catch(err){
        console.error("傳輸使用者預約資料時發生錯誤:",err);
        dispatch(showMessage({
          type:"error",
          text:"傳輸使用者資料時發生錯誤,請按下f12確認錯誤!或請你立即連繫客服"
        }))
      }finally{
        setIsLoading(false);
      }
    }
    fetchBookings();
  },[currentUser,dispatch]);


  // 判斷狀態標籤外觀的輔助函式
  const getStatusBadge = (isHandle,isExpired,isCanceled) => {
    if (isCanceled) {
      return <span className="badge bg-secondary px-3 py-2 rounded-pill">已取消</span>;
    }
    if(!isHandle&&isExpired){
      return <span className="badge bg-danger px-3 py-2 rounded-pill">已逾期(未在時間內受理看房)</span>;
    }
    if (isHandle) {
      return <span className="badge bg-success px-3 py-2 rounded-pill">已受理預約看房</span>;
    }
    return <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: "#D4A373", color: "white" }}>待處理</span>;
  };

  // 新增取消預約功能
  const handleCancelBooking=async(bookingId,houseName)=>{
    const result= await Swal.fire({
      title : `確定要取消預約看房嗎?`,
      text:`若取消看該房屋(${houseName}),三天後才能夠再預約看該房屋喔!`,
      icon:"warning",
      showCancelButton:true,
      confirmButtonColor:'#dc3545',
      cancelButtonColor:"#6c757d",
      confirmButtonText:"是的，我要取消預約",
      cancelButtonText:"先不要",

    });

    if (!result.isConfirmed) return;

    try{
      const bookingRef= doc(db,'UserBooking',bookingId);

      // 更新資料庫中的 isCanceled 欄位為 true
      await updateDoc(bookingRef,{
        isCanceled:true
      });

      // 更新前端的 State，讓畫面即時反應，不需要重新 fetch 資料
      setBookings((prevBookings)=>
        prevBookings.map((booking)=>
          booking.id ===bookingId
            ?{...booking,isCanceled:true}
            : booking
        )
      );

      Swal.fire({
        title : `你已取消預約看房成功!`,
        icon:"success",
        timer: 2000,               // 設定倒數時間，2000 毫秒 (即 1.5 秒) 後自動關閉
        timerProgressBar: true,    // 顯示倒數進度條 (視覺體驗更好！)
        showConfirmButton: false   // 隱藏預設的「確定」按鈕，讓它純粹做為提示視窗
      });
    }catch(err){
      Swal.fire({
        title : `取消預約看房失敗!發生錯誤: ${err?.message || '未知錯誤'}`,
        text:"在這方面遇到困難了嗎,請立即洽詢客服諮詢!",
        icon:"error",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor:"#6c757d",
        confirmButtonText:"立即諮詢客服",
        cancelButtonText:"取消",
      });
    }
  }

  const unLoginned = () => {
    if (!currentUser) {
      return (
        <div className="container py-5">
          <div className="text-center py-5 bg-light rounded-4 shadow-sm">
                        
            {/* Bootstrap 5 Icon (使用 display-1 放大，並套用主題色) */}
            <i 
              className="bi bi-person-lock display-1 mb-3 d-block" 
              style={{ color: "#D4A373" }}
            ></i>
                        
            {/* 提示文字 */}
            <h4 className="fw-bold text-dark mb-3">您尚未登入</h4>
            <p className="text-muted mb-4">請先登入會員，才能查看您的專屬預約紀錄喔！</p>
                        
            {/* 導向登入頁面的按鈕 */}
            <Link 
              to="/sign" 
              className="btn px-5 py-2 rounded-pill fw-bold shadow-sm"
              style={{ backgroundColor: "#D4A373", color: "white" }}
            >
              前往登入
            </Link>
                        
          </div>
        </div>
      );
    }
    // 若已登入則不渲染此區塊
    return null;
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4 text-dark text-center">我的預約紀錄</h3>
            
      {
        isLoading?(
          <div className="text-center py-5">
            <h3>
              資料載入中，請稍候...
            </h3>
          </div>
        ):(
          !currentUser?(
            unLoginned()
          ):(
            bookings.length === 0 ? (
            // 空狀態顯示
              <div className="text-center py-5 bg-light rounded-4">
                <h5 className="text-muted">目前沒有任何預約看房紀錄喔！</h5>
                <Link 
                  to='/Search'
                  className="btn mt-3 px-4 rounded-pill" 
                  style={{ backgroundColor: "#D4A373", color: "white" }}>
                  去尋找理想好房
                </Link>
              </div>
            ) : (
            // 預約列表
              <BookingList 
                bookings={bookings}
                getStatusBadge={getStatusBadge}
                formatTime={formatTime}
                handleCancelBooking={handleCancelBooking}
              />
            )
          )
        )
      }
    </div>
  );
};

export default MyBooking;
