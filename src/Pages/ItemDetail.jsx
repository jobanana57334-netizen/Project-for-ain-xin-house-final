import {useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { doc,getDoc, collection , getDocs } from 'firebase/firestore';
import {getAuth,onAuthStateChanged} from "firebase/auth";
import { db } from '../firebaseConfig';

import HousePicture from "../components/ItemDetail/HousePicture";
import EstateDeta from "../components/ItemDetail/EstateDeta";
import BasicDeta from "../components/ItemDetail/BasicDeta";
import Equipment from "../components/ItemDetail/Equipment";
import Map from "../components/ItemDetail/Map";
import EveryoneInterest from "../components/ItemDetail/EveryoneInterest";
import { useDispatch } from 'react-redux';
import { showMessage } from '../store/MessageSlice';

const ItemDetail = () => {
    
    const dispatch=useDispatch();

    // 1.從網址中取得房屋資訊
    const {id}= useParams();

    // 2.宣告state
    const [houseData,setHouseData]= useState(null);
    const [loading,setLoading] =useState(true);

    // 新增currentUser狀態-->追蹤登入狀態
    const [currentUser,setCurrentUser]= useState(null);

    // 新增監聽登入狀態

    useEffect(()=>{
        const auth= getAuth();
        const unsubscribe= onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user? user:null);
        });
        return ()=>unsubscribe();
    },[]);

    // 3.設置取得資料,將currentUser加入依賴陣列，確保在登入狀態改變時重新評估收藏狀態

    useEffect(()=>{
        const fetchAllDatas= async()=>{
            try{
                // 4.準備所有的firebase資訊來取得相對應Data資料
                const houseRef = doc(db,"houses", String(id));//特定房屋
                const typeRef = collection(db,'houseTypes');//所有房屋類型
                const equipRef = collection(db,'equipmentIds');//所有房屋持有的家具類別
                const reqRef = collection(db,'requirementIds');//所有房屋提供的需求

                //5.使用Promise.all來一次性進行非同步取得資料
                const [houseSnap,typeSnap,equipSnap,reqSnap] = await Promise.all([
                    getDoc(houseRef),
                    getDocs(typeRef),
                    getDocs(equipRef),
                    getDocs(reqRef),
                ]);

                //6.防呆機制,確定房屋真的存在
                if(houseSnap.exists()){
                    const houseRaw = houseSnap.data();

                    // 步驟 A：建立字典 (Dictionary) 以加速比對
                    // 轉成 { "t1": {id: "t1", name: "住宅大樓"}, "t2": {...} }

                    const typeMap ={};
                    typeSnap.forEach((doc)=>{
                        typeMap[doc.data().id]=doc.data();
                    });

                    // 轉成 { 1: {id: 1, label: "有電梯"...}, 2: {...} }
                    const equipMap={};
                    equipSnap.forEach((doc)=>{
                        equipMap[doc.data().id]=doc.data();
                    });

                    // 轉成 { 16: {id: 16, label: "可開伙"...}, 17: {...} }
                    const reqMap={};
                    reqSnap.forEach((doc)=>{
                        reqMap[doc.data().id]=doc.data();
                    });

                    // 步驟 B：將原本的 ID 陣列，轉換成完整的物件陣列
                    // 若原始資料沒有陣列，則給予 [] 避免 map 報錯；filter(Boolean) 是為了過濾掉找不到的 null 值
                    const fullEquipments = (houseRaw.equipmentIds||[])
                        .map(eqId=>equipMap[eqId])
                        .filter(Boolean);

                    const fullRequirements= (houseRaw.requirementIds||[])
                        .map(reqId=>reqMap[reqId])
                        .filter(Boolean);

                    const typeName= typeMap[houseRaw.typeId]?.name||"未知類型";

                    // 步驟 C：組裝成最終的漂亮資料
                    // 更新:先確認使用者是否已經有收藏該房屋
                    let isFavorStatus= false;
                    if(currentUser){
                        // 使用自訂義規則:userId_houseId來精準命中該卡片
                        const favorDocId= doc(db,'favorites',`${currentUser.uid}_${id}`);
                        const favorSnap= await getDoc(favorDocId);
                        isFavorStatus= favorSnap.exists()?true:false;
                    }
                    const fullHouseData={
                        id:houseSnap.id,
                        ...houseRaw,
                        typeName:typeName,
                        equipments:fullEquipments,
                        requirements:fullRequirements,
                        isfavor: isFavorStatus, //將個人收藏綁定進houseData，方便後續使用
                    }

                    // 最後,存入state
                    setHouseData(fullHouseData);
                    
                }else{
                    console.log('找不到該房屋資料!');
                    dispatch(showMessage({
                        type:"error",
                        text:"無法找到該筆房屋資料,如有問題,請洽客服!"
                    }))
                }
            }catch(err){
                console.error("取得詳細資料失敗!",err);
                dispatch(showMessage({
                        type:"error",
                        text:"無法取得詳細資料,如有問題,請洽客服!"
                    }))
            }finally{
                setLoading(false);
            }
        };

        fetchAllDatas();
        
    // 🌟 將 currentUser 加入依賴陣列。這樣使用者一登入，畫面愛心就會自動亮起！
    },[id,currentUser,dispatch]);//當id或currentUser改變時，重新取得資料

    if(loading){
        return (
            <div className="container py-5 text-center">
                <h2>
                    資料載入中...
                </h2>
            </div>
        )
    };
            
    if(!houseData){
        return(
            <div className="container py-5 text-center">
                <h2>
                    找不到該筆房屋資料 (◕︵◕)
                </h2>
            </div>
        )
    }
    
    return (
        <>
            {/* 1. 最外層容器：使用 container 限制最大寬度並置中，加上上下 padding */}
            <div className="container py-4 py-lg-5">
                
                {/* 關鍵：使用 row 和 col 來做左右並排，gy-4 處理上下縮排時的間距 */}
                <section className="row gy-4 mb-5 mt-2">
                    
                    {/* 左側欄位：Bootstrap 是 12 格線，3/5 大約等於 7 格 */}
                    <div className="col-12 col-lg-6">
                        <HousePicture houseData={houseData}/>
                    </div>

                    {/* 右側欄位：2/5 大約等於 5 格 */}
                    <div className="col-12 col-lg-6">
                        <div className="p-0 p-md-4 rounded-4 h-100">
                            <EstateDeta houseData={houseData}/>
                        </div>
                    </div>

                </section>
                
                {/* 中間：基本資料 (Table-like Grid) */}
                <BasicDeta houseData={houseData}/>

                {/* 下方：設備與要求 (Icon Grid) */}
                <Equipment houseData={houseData}/>

                {/* 地圖索引 */}
                <Map houseData={houseData}/>
                
                {/* 大家都在看 */}
                <EveryoneInterest 
                    currentHouseId={id}
                    currentUser={currentUser}/>
            </div>
        </>
    );
}

export default ItemDetail;