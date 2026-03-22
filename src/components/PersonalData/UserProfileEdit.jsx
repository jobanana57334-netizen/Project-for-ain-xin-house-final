import React, { useState, useEffect } from 'react';
import { doc, getDoc ,updateDoc,setDoc} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebaseConfig'; // 記得確認路徑

import { useDispatch } from 'react-redux';
import { showMessage } from '../../store/MessageSlice';
import userIcon from '../../icons/home/user-icon.svg'
import BasicData from './Datas/BasicData';
import ConnectData from './Datas/ConnectData';

const UserProfileEdit = () => {

    // 1.準備state來包裝使用者資料
    const [userData,setUserData]= useState(null);
    // 準備Loading狀態,避免使用者在抓資料過程中進行其他操作
    const [isLoading,setIsLoading]= useState(true);
    
    const dispatch= useDispatch();

    useEffect(()=>{
        const auth=getAuth();
        const unsubscribe= onAuthStateChanged(auth,async(user)=>{
            // 使用者已登入
            if(user){
                try{
                    const userDocRef=doc(db,'users',user.uid);
                    // 先讀取資料庫,了解資料存在在firebase與否
                    const docSnap= await getDoc(userDocRef);

                    // 如果docSnap中有資料,則存進state
                    if(docSnap.exists()){
                        // 1. 先把資料庫抓到的資料存進一個變數
                        const firestoreData = docSnap.data();
                        
                        // 2. 更新 State 時，確保把 Google 登入的資料補上去
                        setUserData({
                            ...firestoreData, // 把資料庫原本的資料展開
                            
                            // 💡 關鍵在這裡：如果資料庫裡沒有 email，就去抓 Google 登入的 user.email！
                            email: firestoreData.email || user.email || '',
                            
                            // 頭貼和姓名也可以順便做一樣的防呆處理
                            img: firestoreData.img || user.photoURL || '',
                            name: firestoreData.name || user.displayName || ''
                        });
                    }
                    // 反之,則先用 Google 帳號的預設資料
                    else{
                        setUserData({
                            // 💡 防呆機制：如果資料庫裡沒有這三個欄位，就去抓 Auth 的預設資料來補！
                            email: firestoreData.email || user.email || '',
                            img: firestoreData.img || user.photoURL || '',
                            name: firestoreData.name || user.displayName || ''
                        });
                    }
                }catch(err){
                    console.error('讀取資料失敗!',err);
                    dispatch(showMessage({
                        type:"error",
                        text:"讀取資料失敗,請按f12查看詳細錯誤資訊!或者聯繫客服"
                    }))
                }
            }else{
                // 若使用者沒有登入,則顯示null
                setUserData(null);
                
            }

            setIsLoading(false);
        });

        return ()=>unsubscribe();
    },[dispatch]);

    // 🚀 核心重構：把更新 Firebase 的邏輯抽到這裡！
    // 這個 function 接收一個物件 (updatedFields)，裡面裝著子元件傳上來的新資料

    // 💡 新增：準備一個讓子元件呼叫的 Function，用來更新父元件的 state
    const handleDataUpdate = async(updateFields)=>{

        const auth = getAuth();
        const currentUser= auth.currentUser;

        if(!currentUser){
            dispatch(showMessage({
                type:"warning",
                text:"請先登入!"
            }));

            //如果在 if(!currentUser) 裡被擋下來，或者是進到了 catch(err) 裡面，代表更新失敗了。這時候我們明確地 
            //return false;，子元件的 isSuccess 就會拿到 false，於是它就知道：「噢，爸爸失敗了，我不能把編輯畫面關掉。」
            return false;
        }

        // 更新資料邏輯區
        try{
            const userDocRef= doc(db,'users',currentUser.uid);

            // 🚀 1. 先讀取資料庫，檢查這份文件存不存在
            const docSnap = await getDoc(userDocRef);
            

            // 2.判斷資料庫有無集合
            //有,則使用updateDoc更新資訊內容
            if(docSnap.exists()){
                await updateDoc(userDocRef,updateFields);
                dispatch(showMessage({
                    type:"success",
                    text:"更新資料成功"
                }));
            }

            // 沒有,則新增集合

            else{
                await setDoc(userDocRef,updateFields);
                dispatch(showMessage({
                    type:"success",
                    text:"建立個人資料成功"
                }));
            };

            // 更新成功後，同步更新父元件的 state，讓畫面立刻改變
            setUserData((prevData)=>({
                ...prevData,
                ...updateFields
            }));

            dispatch(showMessage({
                type:"success",
                text:"更新資料成功!"
            }));
            
            return true;
        }catch(err){
            console.error('更新資料失敗!',err);
            dispatch(showMessage({
                type:"error",
                text:"更新資料失敗,請按f12確認錯誤資訊!或請你立即連繫客服"
            }));
            return false;
        }
        
    }

    // 預設大頭貼,有,使用取得大頭貼內容 || 使用預設大頭貼
    const displayImg = userData?.img || userIcon;
    return (
        // 外層容器，限制最大寬度讓畫面看起來像 Google 的置中排版
        <div className="container py-5" style={{ maxWidth: '800px' }}>
        {
            isLoading?(
                <div className="text-center py-5">
                    <h1 className='text-bold '>載入個人資訊中...
                    </h1>
                </div>
            ):(
                <>
                    {/* 頁面標題區塊 */}
                    <div className="text-center mb-5">
                        <h2 className="fw-normal mb-2">個人資訊</h2>
                        <p className="text-muted">你的基本資訊和聯絡方式</p>
                        <img 
                            src={displayImg} 
                            alt="預設頭像"
                            className='mt-2 rounded-circle border border-2 bg-light'
                            style={{width:'100px',height:"100px"}}    
                        />
                    </div>

                    {/* 卡片 1：基本資訊 */}
                    <BasicData 
                        initialData={userData}
                        updateData={handleDataUpdate}/>

                    {/* 卡片 2：聯絡資訊 */}
                    <ConnectData 
                        initialData={userData}
                        updateData={handleDataUpdate}/>
                </>
            )
        }
        

        </div>
    );
};

export default UserProfileEdit;