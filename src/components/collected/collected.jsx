import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc ,orderBy,deleteDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../../firebaseConfig'; // 確保路徑正確
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../store/MessageSlice';

import CollectedCard from './collectedCard';
import Search from '../../Pages/Search';
const Collected = () => {
  //使用useState管理資料與載入狀態及目前使用者 
  const [houseList, setHouseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
    
  const dispatch= useDispatch();
  // 1.監聽登入狀態
  useEffect(()=>{
    const auth = getAuth();
    const unsubscribe= onAuthStateChanged(auth,(user)=>{
      setCurrentUser(user?user:null);
      // 沒登入-->結束載入登入狀態
      if(!user) return setIsLoading(false);
    });
    return ()=>unsubscribe();
  },[]);


  // 🌟 新增：處理在收藏頁面直接點擊「取消收藏」的動作
  const handleRemoveFavorite = async (houseId, houseTitle) => {
    if (!currentUser) return;

    const result = await Swal.fire({
      title : `確定要將 "${houseTitle}" 從收藏中移除嗎？`,
      icon:"warning",
      showCancelButton:true,
      confirmButtonColor:'#dc3545',
      cancelButtonColor:"#6c757d",
      confirmButtonText:"是的，移除收藏",
      cancelButtonText:"先不要",

    })
    if(result.isConfirmed){
      try {
        // 1. 去 Firebase 的 favorites 集合中，刪除這筆文件
        const favoriteDocId = `${currentUser.uid}_${houseId}`;
        await deleteDoc(doc(db, "favorites", favoriteDocId));

        // 2. 讓畫面即時更新：把這個 houseId 從目前的 houseList 陣列中濾掉
        setHouseList(prevList => prevList.filter(house => house.id !== houseId));

        // 3. 可以加上你的 Redux 成功提示
        dispatch(showMessage({ 
          type: "success", 
          text: `已將 ${houseTitle} 從收藏中移除！` 
        }));

      } catch (error) {
        console.error("移除收藏失敗:", error);
        // 失敗提示...
        dispatch(showMessage({ 
          type: "error", 
          text: `無法移除 ${houseTitle}，按f12確認錯誤訊息,或連繫客服。` 
        }));
      }
    }
  };

  // 2.確認currentUser後,開始抓蒐藏資料

  useEffect(()=>{
    const fetchFavorites= async()=>{
      if(!currentUser){
        setHouseList([]);
        setIsLoading(false);
        return; // 防呆：確保有使用者才執行
      }

      setIsLoading(true);

      try{
        // 2-1找到favorite清單內容
        const favQuery= query(
          collection(db,'favorites'),
          where('userId','==',currentUser.uid),
          orderBy('createAt','desc')// 新增排序條件,讓最新收藏放置於前
        );

        const favSnapshot= await getDocs(favQuery);
                
        // 因為 Firebase 回傳的 favSnapshot 已經按照時間排好序了
        // 所以這裡抽出來的 ID 陣列，也會是【由新到舊】的順序
        const favHouseIds= favSnapshot.docs.map(doc=>doc.data().houseId);

        // 如果沒抓到任何收藏資料,則setHouseList回傳空陣列,並結束載入狀態
        if(favHouseIds.length===0){
          setHouseList([]);
          setIsLoading(false);
          return;
        }

        // 2-2若抓到資料,則根據houseId去houses資料表抓取房屋詳細資料
        const housePromises= favHouseIds.map(id=>
          getDoc(doc(db,'houses',String(id)))
        );

        const [houseSnapshots,typeDataSnapshot]= await Promise.all([
          Promise.all(housePromises),//所有房屋資料的 Promise 陣列
          getDocs(query(collection(db,'houseTypes')))//取得房屋資料的字典
        ]);

        // 製作字典
        const typeData={};
        typeDataSnapshot.forEach(doc=>{
          typeData[doc.id]=doc.data()
        })

        const housesData= houseSnapshots.filter(snap=>snap.exists())
          .map(snap=>
          {
            const houseRaw= snap.data();
            const typeName= typeData[houseRaw.typeId]?.name ||"未知類型";
            return{
              id:snap.id,
              ...snap.data(),
              typeName:typeName,
              isfavor:true //方便後續判斷
            }
          });  

        setHouseList(housesData);
                    
      }catch(err){
        console.error("抓取收藏資料失敗",err);
        dispatch(showMessage({
          type:"error",
          text:"無法載入收藏資料,請按f12確認錯誤訊息,或連繫客服"
        }))
      }finally{
        setIsLoading(false);
      }
    }
    fetchFavorites();
  },[currentUser,dispatch]);

  // 載入中的過場畫面
    
  return (
    <>
            
      <div className='container py-5'>
            
        <h1 className='fw-bold text-dark mb-4 text-center'>
          我的個人收藏
        </h1>
        {
          (isLoading)?(
            <div className="text-center py-5 mt-5"><h4>載入收藏中...</h4></div>
          ):(
            <div>
              {houseList.length > 0 ? (
              /* 有資料時：顯示卡片列表 (這裡未來替換成你的卡片元件) */
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {
                    houseList.map(house=>(
                      <div key={house.id} className='col'>
                        <CollectedCard house={house} onRemove={handleRemoveFavorite}/>
                      </div>
                    ))
                  }
                </div>
              ) : (
              /* 無資料時：顯示我們剛剛設計好的完美空狀態 Container */
                <div 
                  className='d-flex flex-column justify-content-center align-items-center bg-light rounded-4'
                  style={{ minHeight: "60vh" }} 
                >
                  <div className="mb-4 text-secondary" style={{ opacity: 0.4 }}>
                    <i className="bi bi-house-heart" style={{ fontSize: "6rem" }}></i>
                  </div>
                  <h4 className='fw-bold text-dark mb-3'>您的收藏清單空空如也</h4>
                  <p className='text-secondary mb-4 text-center px-3'>
                    目前沒有任何收藏的房屋喔！<br />
                    看到喜歡的房子，記得點擊愛心加入收藏，方便隨時比較。
                  </p>
                  <Link
                    to="/search"
                    element={<Search/>} 
                    className="btn btn-dark px-4 py-2 rounded-pill fw-medium shadow-sm d-flex align-items-center gap-2">
                    <i className="bi bi-search"></i> 立即去尋找好房
                  </Link>
                </div>
              )}
            </div>
          )
        }
      </div>
            
    </>
  );
};

export default Collected;