import React,{useState,useRef} from 'react';
import userIcon from '../../../icons/home/user-icon.svg';

import { storage } from '../../../firebaseConfig';
import { ref,uploadBytes,getDownloadURL } from 'firebase/storage';

import {useForm} from 'react-hook-form';
import DatePicker,{registerLocale} from "react-datepicker";

import { getAuth } from 'firebase/auth';

import "react-datepicker/dist/react-datepicker.css"; // 💡 記得引入 CSS，不然日曆會變透明的！
import { zhTW } from 'date-fns/locale'; // 💡 引入繁體中文語系包
import { Controller } from "react-hook-form"; // 💡 從 react-hook-form 拿出 Controller
// 💡 1. 引入剛剛安裝的圖片裁切套件
import AvatarEditor from 'react-avatar-editor';

import { useDispatch } from 'react-redux';
import { showMessage } from '../../../store/MessageSlice';
registerLocale('zh-TW',zhTW);//註冊中文語系

const BasicData=({initialData,updateData})=>{

    //預設顯示資料內容
    const {register,handleSubmit,control,formState:{errors}}=useForm({
        values:{
            img: initialData?.img||userIcon,
            name: initialData?.name||'請輸入姓名',
            birthday: initialData?.birthday||'YYYY-MM-DD', 
            gender: initialData?.gender||'選擇性別'
        }
    });

    const dispatch=useDispatch();
    // 定義是否正在編輯
    const [isEditing,setIsEditing]= useState(false);

    // 💡 2. 準備給圖片裁切用的 State 與 Ref
    const [selectedImg,setSelectedImg]= useState(null); //存放使用者從電腦選取的圖片檔案
    const [scale,setScale] = useState(1.2);//控制圖片縮放比例
    const editorRef= useRef(null); //存放已裁切好的圖片結果

    // 💡 2. 加一個 Loading 狀態，避免上傳太久使用者狂點按鈕
    const [isUploading, setIsUploading] = useState(false);

    // 💡 3. 當使用者選擇檔案時觸發的 Function
    const handleImgChange=(e)=>{
        if(e.target.files && e.target.files.length>0){
            setSelectedImg(e.target.files[0]);
        }
    }
    // 🚀 核心重構：把複雜邏輯丟給爸爸處理
    const onSubmit = async (data) => {
        setIsUploading(true);

        let newAvatarUrl = initialData?.img;

        try {
            // 如果使用者有選新圖片，且編輯器準備好了，我們就進行上傳
            if (selectedImg && editorRef.current) {
                // 1. 從編輯器中取得「裁切後」的 Canvas 畫面
                const canvas = editorRef.current.getImageScaledToCanvas();

                // 2. 將 Canvas 轉換成圖片檔案 (Blob 格式)
                const blob = await new Promise((resolve) => {
                    canvas.toBlob((b) => resolve(b), 'image/jpeg');
                });

                // 3. 準備 Firebase Storage 的存檔路徑 (用使用者的 uid 命名，覆蓋舊圖)
                const auth = getAuth();
                const userId = auth.currentUser.uid;
                const storageRef = ref(storage, `userAvatars/${userId}.jpg`);

                // 4. 正式上傳檔案到 Storage！
                await uploadBytes(storageRef, blob);

                // 5. 上傳成功後，取得這張圖片的公開網址
                newAvatarUrl = await getDownloadURL(storageRef);
            }

            // 💡 6. 把熱騰騰的新圖片網址，替換掉原本 data 裡的 img
            const finalData = {
                ...data,
                img: newAvatarUrl 
            };

            // 7. 呼叫爸爸傳下來的 onSave，把所有資料存進 Firestore
            const isSuccess = await updateData(finalData);

            // 如果爸爸說更新成功了，我們才把編輯模式關閉，並清空圖片預覽
            if (isSuccess) {
                setIsEditing(false);
                setSelectedImg(null); 
            }
        } catch (error) {
            console.error("圖片上傳失敗：", error);
            dispatch(showMessage({
                type:"error",
                text:"圖片處理發生錯誤，請稍後再試！如有問題,請聯繫客服"
            }));
        } finally {
            setIsUploading(false); // 結束轉圈圈
        }
    };

return (
        <div className="card border mb-4" style={{ borderRadius: '16px' }}>
            <div className="card-body p-0">
                {/* 標題區塊：加入編輯按鈕 */}
                <div className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                    <div className="mb-3 mb-md-0">
                        <h4 className="card-title fw-normal mb-1">基本資訊</h4>
                        <p className="card-text text-muted small mb-0">部分資訊可能會顯示在使用此平台的其他用戶面前。</p>
                    </div>
                    {/* 💡 把兩個按鈕包起來，使用 gap-2 讓按鈕之間有漂亮的間距 */}
                    <div className="d-flex gap-2 align-self-end align-self-md-between">
                        {
                            isEditing &&
                            <button 
                                className='btn btn-outline-secondary btn-sm px-4' 
                                disabled={isUploading} 
                                onClick={() => {
                                    setIsEditing(false);
                                    setSelectedImg(null); 
                                }}>
                                取消
                            </button>
                        }
                        <button 
                            className={`btn ${isEditing ? 'btn-primary' : 'btn-outline-primary'} btn-sm px-4`}
                            disabled={isUploading} 
                            onClick={isEditing ? handleSubmit(onSubmit) : () => setIsEditing(true)}
                        >
                            {isUploading ? '上傳儲存中...' : (isEditing ? '儲存' : '編輯')}
                        </button>
                    </div>
                </div>

                {/* 列表項目：大頭貼 */}
                {/* 💡 加上 RWD 排版 class */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 border-bottom action-row">
                    <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>個人相片</div>
                    
                    <div className="flex-grow-1 text-muted small w-100">
                        {
                            !isEditing && (
                                initialData?.img ?
                                "按下編輯即可更改圖片" :
                                "新增相片即可個人化你的帳戶"
                            )
                        }
                    </div>

                    {/* 💡 調整手機版的圖片對齊：加上 mt-3 mt-md-0 和 align-self-center */}
                    <div className="flex-shrink-0 ms-0 ms-md-3 mt-3 mt-md-0 align-self-center align-self-md-end">
                        {
                            isEditing?(
                                <>
                                    <input
                                        type='file'
                                        accept='JPG,JPEG,PNG,GIF'
                                        className={`form-control ${errors.img? 'is-invalid':''}`}
                                        onChange={handleImgChange}
                                    />
                                    
                                    {/* 如果有選圖片，就顯示裁切編輯器 */}
                                    {selectedImg && (
                                        <div className="text-center mt-2 border rounded p-2 bg-light">
                                            <AvatarEditor
                                                ref={editorRef}
                                                image={selectedImg}
                                                width={150}
                                                height={150}
                                                border={10}
                                                borderRadius={75}
                                                color={[255, 255, 255, 0.6]}
                                                scale={scale}
                                            />
                                            <input
                                                type="range"
                                                min="1"
                                                max="2"
                                                step="0.01"
                                                value={scale}
                                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                                className="form-range mt-2"
                                            />
                                            <small className="text-muted">拖曳圖片調整位置，拉桿調整大小</small>
                                            {/* 🗑️ 刪除了這裡多餘的儲存按鈕 */}
                                        </div>
                                    )}
                                </>
                            ):(
                                <>
                                    <img 
                                        src={initialData.img}
                                        alt="Profile" 
                                        className="rounded-circle object-fit-cover"
                                        style={{ width: '60px', height: '60px' }}
                                    />
                                </>
                            )
                        }
                    </div>
                </div>

                {/* 列表項目：名稱 */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 border-bottom action-row">
                    <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>名稱</div>
                    <div className="flex-grow-1 w-100">
                        {isEditing ? (
                            <>
                                <input
                                    type='text'
                                    className={`form-control ${errors.name? 'is-invalid':''}`}
                                    {...register('name',{
                                        required:"姓名名稱為必填!",
                                    })}
                                />
                                {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
                            </>
                        ) : (
                            <span className="fw-medium text-dark">{initialData.name || '尚未設定'}</span>
                        )}
                    </div>
                </div>

                {/* 列表項目：生日 */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 border-bottom action-row">
                    <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>生日</div>
                    <div className="flex-grow-1 w-100">
                        {isEditing ? (
                            <>
                                <div className='input-group'>
                                    <span className="input-group-text bg-white text-muted">
                                        <i className="bi bi-calendar-date"></i> 
                                    </span>

                                    <Controller 
                                        control={control}
                                        name='birthday'
                                        rules={{ 
                                            required :"出生年月日為必填!",
                                            validate:{
                                                isAdult :(value)=>{
                                                    if(!value || value==='YYYY-MM-DD') return true 
                                                    const selectedDate= new Date(value);
                                                    const today= new Date();
                                                    const eighteenYearsAgo= new Date(
                                                        today.getFullYear()-18,
                                                        today.getMonth(),
                                                        today.getDate()
                                                    );
                                                    return selectedDate <= eighteenYearsAgo || "您必須年滿 18 歲才能使用本服務喔！";
                                                }
                                            }
                                        }}
                                        render={({ field:{onChange,value} })=>{
                                            const isValidDate = value && value !== 'YYYY-MM-DD' && !isNaN(new Date(value).getTime());
                                            return(
                                                <DatePicker
                                                    selected={isValidDate ? new Date(value) : null}
                                                    onChange={(date) => {
                                                        if (date) {
                                                            const year = date.getFullYear();
                                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                                            const day = String(date.getDate()).padStart(2, '0');
                                                            onChange(`${year}-${month}-${day}`);
                                                        } else {
                                                            onChange('');
                                                        }
                                                    }}
                                                    locale='zh-TW'
                                                    dateFormat="yyyy-MM-dd"
                                                    className={`form-control ${errors.birthday ? 'is-invalid' : ''}`}
                                                    placeholderText="請選擇出生年月日"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    maxDate={new Date()}
                                                />
                                            )}}
                                        />
                                    
                                </div>
                                {/* 💡 讓錯誤訊息獨立顯示在 input-group 下方 */}
                                {errors.birthday&& <div className='invalid-feedback d-block mt-1'>{errors.birthday.message}</div>}
                            </>
                        ) : (
                            <span className="fw-medium text-dark">{initialData.birthday || '尚未設定'}</span>
                        )}
                    </div>
                </div>

                {/* 列表項目：性別 */}
                {/* 💡 最後一個項目通常不需要 border-bottom */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 action-row">
                    <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>性別</div>
                    <div className="flex-grow-1 w-100">
                        {isEditing ? (
                            <>
                                <select 
                                    className={`form-select ${errors.gender? 'is-invalid':""}`} 
                                    { ...register('gender',{
                                        required:"性別為必填!",
                                        validate: (value)=>
                                            ['男性','女性','不公開'].includes(value)||'請選擇有效的性別' 
                                    })}
                                >
                                    <option value='' disabled>請選擇性別</option>
                                    <option value="男性">男性</option>
                                    <option value="女性">女性</option>
                                    <option value="不公開">不公開</option>
                                </select>
                                {errors.gender &&<div className='invalid-feedback'>{errors.gender.message}</div>}
                            </>
                        ) : (
                            <span className="fw-medium text-dark">{initialData?.gender || '尚未設定'}</span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BasicData;