import React,{useState} from 'react';
import { useForm } from 'react-hook-form';
// 💡 1. 從套件中引入台灣縣市與區域的乾淨資料！
import { cities, districts } from 'use-tw-zipcode';
const ConnectData=({initialData,updateData})=>{

    // 定義是否正在編輯
        const [isEditing,setIsEditing]= useState(false);
        const [isLoading,setIsLoading]= useState(false);
        // 💡 2. 綁定傳進來的預設值 (加入 || '' 防呆)
        const {register ,handleSubmit,watch,setValue, formState:{errors}}=useForm({
            values:{
                email: initialData?.email|| '',
                tel: initialData?.tel || '',
                city: initialData?.city || '',
                district: initialData?.district || '',
                detailAddress: initialData?.detailAddress || ''
            }
        })
    
        // 💡 2. 監聽目前選到的縣市
        const selectedCity= watch('city');

        // 直接用套件提供的 districts 物件，丟入縣市名稱，就會吐出對應的區域陣列！

        const availableDistricts = selectedCity ? districts[selectedCity]:[];

       // 🚀 核心重構：把複雜邏輯丟給爸爸處理
        const onSubmit = async (data) => {
            // 呼叫爸爸傳下來的 onSave，並把這張卡片的資料丟進去
            // 等待爸爸處理完，會回傳 true (成功) 或 false (失敗)
            setIsLoading(true);
            const isSuccess = await updateData(data);
            
            // 如果爸爸說更新成功了，我們才把編輯模式關閉
            if (isSuccess) {
                setIsEditing(false);
                setIsLoading(false);
            }
        };

    return (
        <div className="card border mb-4" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className="card-body p-0">
                
                {/* 標題區塊：加入編輯與取消按鈕 */}
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="card-title fw-normal mb-0">聯絡資訊</h4>
                    </div>
                    
                    {/* 💡 統一 UX：加上取消按鈕 */}
                    <div className="d-flex gap-2">
                        {
                            isEditing &&
                            <button 
                                disabled={isLoading}
                                className='btn btn-outline-secondary btn-sm px-4'
                                // 如果有 Loading 狀態可以加 disabled={isLoading}
                                onClick={() => setIsEditing(false)}>
                                取消
                            </button>
                        }
                        <button 
                            className={`btn ${isEditing ? 'btn-primary' : 'btn-outline-primary'} btn-sm px-4`}
                            onClick={isEditing ? handleSubmit(onSubmit) : () => setIsEditing(true)}
                            disabled={isLoading}
                        >
                            {isEditing ? '儲存' : '編輯'}
                        </button>
                    </div>
                </div>

                {/* 列表項目：電子郵件 */}
                {/* 💡 RWD 魔法：手機版直排(flex-column)，平版以上橫排(flex-md-row) */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 border-bottom action-row">
                    <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>
                        電子郵件
                    </div>
                    <div className="flex-grow-1 w-100">
                        {isEditing ? (
                            <>
                                <input 
                                    type="email" 
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                    disabled
                                    {...register("email")} 
                                />
                                <div className="form-text small text-muted">
                                    電子郵件為您的登入帳號，目前不開放修改。
                                </div>
                            </>
                        ) : (
                            <span className="fw-medium text-dark">{initialData?.email || '尚未設定'}</span>
                        )}
                    </div>
                </div>

                {/* 列表項目：電話 */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 border-bottom action-row">
                    <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>
                        電話
                    </div>
                    <div className="flex-grow-1 w-100">
                        {isEditing ? (
                            <>
                                <input 
                                    type="tel" 
                                    className={`form-control ${errors.tel ? 'is-invalid' : ''}`} 
                                    {...register("tel", {
                                        pattern: {
                                            value: /^(09\d{8}|0\d{1,3}-?\d{6,8})$/,
                                            message: "請輸入正確的號碼格式 (手機: 0912345678 或 市話: 02-23456789)"
                                        }
                                    })} 
                                />
                                {errors.tel && <div className="invalid-feedback d-block">{errors.tel.message}</div>}
                            </>
                        ) : (
                            <span className="fw-medium text-dark">
                                {initialData?.tel ? initialData?.tel : <span className="text-muted">尚未設定</span>}
                            </span>
                        )}
                    </div>
                </div>

                {/* 列表項目：居住地 */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 action-row">
                    <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>
                        居住地
                    </div>
                    <div className="flex-grow-1 w-100">
                        {isEditing ? (
                            <div className="row g-2">
                                {/* 1. 縣市下拉選單 */}
                                <div className="col-md-4">
                                    <select 
                                        className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                                        {...register("city", { 
                                            required: "請選擇縣市",
                                            onChange: () => setValue('district', '') 
                                        })}
                                    >
                                        <option value="" disabled>選擇縣市</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    {errors.city && <div className="invalid-feedback d-block">{errors.city.message}</div>}
                                </div>

                                {/* 2. 鄉鎮市區下拉選單 */}
                                <div className="col-md-4">
                                    <select 
                                        className={`form-select ${errors.district ? 'is-invalid' : ''}`}
                                        {...register("district", { required: "請選擇區域" })}
                                        disabled={!selectedCity} 
                                    >
                                        <option value="" disabled>選擇區域</option>
                                        {availableDistricts.map(district => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </select>
                                    {errors.district && <div className="invalid-feedback d-block">{errors.district.message}</div>}
                                </div>

                                {/* 3. 詳細地址輸入框 */}
                                <div className="col-md-4">
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.detailAddress ? 'is-invalid' : ''}`}
                                        placeholder="街道、巷弄、樓層"
                                        {...register("detailAddress", { required: "請輸入詳細地址" })}
                                    />
                                    {errors.detailAddress && <div className="invalid-feedback d-block">{errors.detailAddress.message}</div>}
                                </div>
                            </div>
                        ) : (
                            <span className="fw-medium text-dark">
                                {(initialData?.city || initialData?.district || initialData?.detailAddress) 
                                    ? `${initialData?.city || ''}${initialData?.district || ''}${initialData?.detailAddress || ''}` 
                                    : '尚未設定'}
                            </span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConnectData;