import { CheckCircle2 } from "lucide-react";
// 💡 1. 從 react-hook-form 引入 useWatch
import { useForm, useWatch } from "react-hook-form";
import { auth } from '../../firebaseConfig.js';
import { db } from "../../firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { showMessage } from "../../store/MessageSlice.jsx";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 💡 2. 將 watch 拿掉，改為解構出 control
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    mode: "onChange"
  });

  // --- 🌟 抽取出共用的「獲取使用者名稱」函式 ---
  const fetchCustomName = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists() && docSnap.data().name) {
        return docSnap.data().name;
      }
    } catch (error) {
      console.error("獲取使用者名稱失敗", error);
      dispatch(showMessage({
        type: "error",
        text: "取得使用者名稱發生錯誤,請按f12確認錯誤,或請你立即連繫客服"
      }));
    }
    return ""; // 如果沒抓到或發生錯誤，回傳空字串
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const loggedInUser = userCredential.user;
                
      // 🌟 新增：去 Firestore 抓取自訂名稱
      const customName = await fetchCustomName(loggedInUser.uid);

      // 決定要顯示什麼名字 (優先順序：自訂名稱 > Google 預設名稱 > Email 遮罩)
      const fallbackName = loggedInUser.displayName || loggedInUser.email.split('@')[0].substring(0, 3);
      const finalName = customName || fallbackName;

      dispatch(showMessage({
        type: "success",
        text: `${finalName},歡迎回到安心窩!`
      }));

      navigate("/");

    } catch (err) {
      console.error("登入失敗!", err.code, err.message);
                
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        dispatch(showMessage({
          type: "error",
          text: "登入失敗,帳號密碼輸入錯誤!如有問題,請洽客服"
        }));
      } else if (err.code === "auth/too-many-requests") {
        dispatch(showMessage({
          type: "warning",
          text: "嘗試次數過多,請等待數分鐘後再重新登入!"
        }));
      } else {
        dispatch(showMessage({
          type: "error",
          text: `登入失敗!${err?.message}`
        }));
      }
    }
  };
    
  // 💡 3. 改用 useWatch 來監聽欄位，解決編譯器衝突！
  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });

  // 登入函式
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // 這行會跳出 Google 登入視窗
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      // 🌟 新增：去 Firestore 抓取自訂名稱
      const customName = await fetchCustomName(loggedInUser.uid);
      const finalName = customName || loggedInUser.displayName || "使用者";
            
      dispatch(showMessage({
        type: "success",
        text: `歡迎 ${finalName} 回到安心窩!`
      }));
      navigate('/');
    } catch (error) {
      console.error("登入失敗", error);
      dispatch(showMessage({
        type: "error",
        text: `登入失敗,請按f12查看錯誤訊息!`
      }));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email 欄位 */}
        <div className="mb-4">
          <div className="position-relative">
            <input 
              className={`form-control form-control-lg border-0 custom-input pe-5 ${errors.email ? 'is-invalid' : ''}`}
              placeholder='輸入 E-mail'
              {...register("email", { 
                required: "請輸入 E-mail！", 
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email格式不正確!"
                } 
              })} 
            />
                        
            <div className="position-absolute top-50 translate-middle-y end-0 me-3">
              {!errors.email && emailValue && (
                <CheckCircle2 color="#198754" size={20} />
              )}
            </div>                
            {errors.email && (
              <div className='invalid-feedback ms-2 d-block'>
                {errors.email.message}
              </div>
            )}
          </div>
        </div>

        {/* 密碼欄位 */}
        <div className="mb-4">
          <div className='position-relative'>
            <input 
              type="password" 
              className={`form-control form-control-lg border-0 py-2 custom-input pe-5 ${errors.password ? 'is-invalid' : ''}`}
              placeholder='輸入密碼'
              {...register("password", {
                required: "密碼為必填!",
                minLength: { value: 6, message: "至少要有六碼!" },
                maxLength: { value: 12, message: "不可超過十二碼!" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)[A-Za-z0-9]+$/,
                  message: "需包含大寫字母與數字，不可含特殊符號"
                }
              })}
            />
            <div className="position-absolute top-50 translate-middle-y end-0 me-3">
              {!errors.password && passwordValue && (
                <CheckCircle2 color="#198754" size={20} />
              )}
            </div>
          </div>
          {errors.password && (
            <div className='invalid-feedback ms-2 d-block'>
              {errors.password.message}
            </div>
          )}
          <div className="d-flex justify-content-end mt-2">
            <button 
              type="button"
              className="text-decoration-none small fw-bold btn btn-link p-0" 
              style={{ color: '#D4AB6A', fontSize: '14px' }}
            >
              忘記帳號/密碼
            </button>
          </div>
        </div>

        {/* 提交按鈕 */}
        <button 
          type="submit" 
          className="w-100 py-3 fs-5 border-0 fw-bold custom-login-button"
        >
          登入
        </button>

        {/* Google 登入按鈕 */}
        <div className="text-center mt-3">
          <p>或</p>
          <button 
            type="button" 
            className="fw-bold py-3 btn btn-light border shadow-sm w-100"
            onClick={handleGoogleLogin}
          > 
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              width="20" 
              className="me-2"
            />
            使用 Google 帳號繼續
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;