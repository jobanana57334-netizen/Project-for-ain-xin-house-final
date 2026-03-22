
import { useForm } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react'; // 引入打勾與打叉圖示
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { doc,getDoc } from 'firebase/firestore';

import { createUserWithEmailAndPassword , signInWithPopup, GoogleAuthProvider,getAdditionalUserInfo } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../store/MessageSlice';
// 1. 在參數裡接收 props (解構賦值拿出 onSwitchToLogin)
const Signin = ({onSwitchToLogin}) => {

    const dispatch= useDispatch();
    const navigate= useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
        mode: "onChange"
    });

    const {user}= useAuth();
    

    // 原先的Email/密碼註冊邏輯
    const onSubmit = async(data) => {
        try{
            // 呼叫firebase建立帳號
            await createUserWithEmailAndPassword(auth, data.email,data.password);
            dispatch(showMessage({
                type:"success",
                text:"註冊成功!歡迎加入安心窩🎉"
            }));
            
            // 2. 註冊成功後，按下遙控器，通知父層切換到 Login 分頁
            if(onSwitchToLogin){
                onSwitchToLogin()
            };

        }catch(err){
            console.error("註冊失敗:"+err.message);

            if(err.code === 'auth/email-already-in-use'){
                dispatch(showMessage({
                    type:"warning",
                    text:"這個Email已經註冊過了,請直接登入!"
                }));
            }else{
                dispatch(showMessage({
                    type:"error",
                    text:`註冊時發生${err?.message||"未知"}錯誤!如有問題,請洽客服人員`
                }));
            }
        }
    };

    // 新增Google註冊邏輯

    const handleGoogleLogin=async()=>{
        const provider = new GoogleAuthProvider();
        
        try{
            // 直接傳入從firebaseConfig import 出來的auth
            const result = await signInWithPopup(auth,provider);
            const loggedInUser = result.user; // 💡 換個變數名稱，避免跟上面 useAuth 的 user 撞名
            // 新增取得額外用戶資訊
            const additionalInfo = getAdditionalUserInfo(result);

            if(additionalInfo.isNewUser){
                navigate('/');
                dispatch(showMessage({
                    type:"success",
                    text:"歡迎新用戶註冊安心窩!"
                }))
                
            }else{
                // 🌟 新增：如果是舊用戶，直接在這裡去 Firestore 撈他的自訂名稱
                let customName='';
                try{
                    const userDocRef =doc(db,'users', loggedInUser.uid);
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists() && docSnap.data().name) {
                        customName = docSnap.data().name;
                    }
                }catch(err){
                    console.error("獲取使用者名稱失敗", err);
                    dispatch(showMessage({
                        type:"error",
                        message:"取用使用者名稱 發生錯誤,請按f12確認錯誤,或請你立即連繫客服"
                    }))
                }
                navigate('/');
                dispatch(showMessage({
                    type:'normal',
                    text:`${customName||user.displayName} 你已註冊Google帳戶,歡迎回到安心窩🎉`
                }));
            }
            
        }catch(err){
            console.error(`註冊時發生${err?.message||"未知"}錯誤!`);
            dispatch(showMessage({
                type:"error",
                text:"Google註冊時發生錯誤!如有問題,請洽客服"
            }));
        }
    }

    // 密碼監聽，用於顯示「符合條件」
    const passwordValue = watch("password");
    const emailValue = watch("email");
    const confirmPasswordValue = watch("confirmPassword");

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email 欄位 */}
                <div className="mb-4">
                    {/* 容器設為 relative，讓內部的 Icon 可以對準它定位 */}
                    <div className="position-relative">
                        <input 
                        className={`form-control form-control-lg border-0 custom-input pe-5 ${errors.email ? 'is-invalid' : ''}`}
                        placeholder='輸入 E-mail'
                        {...register("email", { 
                            required: "請輸入E-mail", 
                            pattern:{
                                value:/^\S+@\S+$/i ,
                                message:"Email格式不正確!"
                            } })} 
                        />
                        
                        {/* Icon 顯示邏輯 */}
                        <div className="position-absolute top-50 translate-middle-y end-0 me-3">
                            {/* 正確且有輸入值時：顯示綠色的勾勾 */}
                            {!errors.email && emailValue && <CheckCircle2 color="#198754" size={20} />}
                        </div>
                        {errors.email && (
                            <div className='invalid-feedback ms-2 d-block'>
                                {errors.email.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* 密碼 欄位 */}
                <div className="mb-4">
                    <div className='position-relative'>
                        <input 
                            type="password" 
                            className={`form-control form-control-lg border-0 py-2 custom-input pe-5 ${errors.password ? 'is-invalid' : ''}`}
                            placeholder='輸入密碼'
                            {...register("password",{
                                required:"密碼為必填!",
                                minLength:{ value:6, message:"至少要有六碼!" },
                                maxLength:{ value:12, message:"不可超過十二碼!" },
                                pattern:{
                                    // 修正：移除了 ^ 後面的空格
                                    value:/^(?=.*[A-Z])(?=.*\d)[A-Za-z0-9]+$/,
                                    message:"需包含大寫字母與數字，不可含特殊符號"
                                }
                            })}
                        />
                        {/* Icon 顯示邏輯 */}
                        <div className="position-absolute top-50 translate-middle-y end-0 me-3">
                            {/* 正確且有輸入值時：顯示綠色的勾勾 */}
                            {!errors.password && passwordValue && <CheckCircle2 color="#198754" size={20} />}
                        </div>
                        {errors.password && (
                            <div className='invalid-feedback ms-2 d-block'>
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* 確認密碼 欄位 */}
                <div className="mb-4">
                    <div className="position-relative">
                        <input 
                            type="password" 
                            className={`form-control form-control-lg border-0 py-2 custom-input pe-5 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            placeholder='再次輸入密碼'
                            {...register("confirmPassword",{
                                validate:(value)=> value === passwordValue || "兩次輸入不一致"
                            })}
                        />
                        {/* Icon 顯示邏輯 */}
                        <div className="position-absolute top-50 translate-middle-y end-0 me-3">
                            {/* 正確且有輸入值時：顯示綠色的勾勾 */}
                            {!errors.confirmPassword && confirmPasswordValue && <CheckCircle2 color="#198754" size={20} />}
                        </div>
                        {errors.confirmPassword && (
                            <div className='invalid-feedback ms-2 d-block'>
                                {errors.confirmPassword.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* 提交按鈕 */}
                <button 
                    type="submit" 
                    className=" w-100 py-3 fs-5 border-0 fw-bold custom-login-button" 
                    >
                    註冊
                </button>
            </form>
            
            {/* 新增Google註冊按鈕 */}
            <div className = 'text-center mt-3'>
                <p>或</p>
                <button
                    type='button'
                    onClick={handleGoogleLogin}
                    className="fw-bold py-3 btn btn-light border shadow-sm w-100">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" className="me-2"/>
                    使用Google帳號繼續
                </button>
            </div>
        </>
    );
}

export default Signin;