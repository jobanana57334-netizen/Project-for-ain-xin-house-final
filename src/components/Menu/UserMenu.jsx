import { useState, useEffect, useRef } from 'react';
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from 'react-redux';
import { showMessage } from '../../store/MessageSlice';
import { Link } from 'react-router-dom';

const UserMenu = ({ handleLogout }) => {
  const closeBtnRef = useRef(null);
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const dispatch = useDispatch();

  const SelectFunction = [
    { id: 1, title: "個人資料編輯", turnTo: "/personalEdit" },
    { id: 2, title: "我的收藏", turnTo: "/collected" },
    { id: 3, title: "我的預約看房", turnTo: "/MyBooking" },
    { id: 4, title: "刊登屋件管理", turnTo: "/manage-posts" }
  ];

  const handleLinkClick = () => {
    if (closeBtnRef.current) {
      closeBtnRef.current.click();
    }
  };

  useEffect(() => {
  // 💡 1. 如果沒 user，我們就直接結束，不做任何事
  // (因為 userName 初始值就是 ""，或者我們會在 cleanup 處理它)
    if (!user?.uid) return;

    const userDocRef = doc(db, 'users', user.uid);

    // 💡 2. 開始即時監聽
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserName(userData.name || "");
      }
    }, (error) => {
      console.error("監聽使用者名稱失敗:", error);
      dispatch(showMessage({
        type: "error",
        text: "監聽使用者名稱失敗，請聯繫客服"
      }));
    });

    // 💡 3. 重點在回傳的這顆「時空膠囊」
    return () => {
      unsubscribe();   // 停止監聽
      setUserName(""); // 這裡清空！當 user 改變（例如登出）時，舊的 Effect 結束，順便清空名字
    };
  }, [user, dispatch]);

  const markEmail = (email) => {
    if (!email) return '';
    const name = email.split('@')[0];
    const maskedName = name.substring(0, 3);
    return `${maskedName}...`;
  };

  return (
    <>
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="userMenu"
        aria-labelledby="userMenuLabel"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold text-dark" id="userMenuLabel">
            會員中心
          </h5>
          <button
            ref={closeBtnRef}
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column align-items-center justify-content-between pt-5 gap-4">
          <div className="d-flex flex-column text-center gap-4 mt-4">
            {user && (
              <h5>
                歡迎回來, {userName || user.displayName || markEmail(user.email)}
              </h5>
            )}
            {SelectFunction.map((item) => (
              <Link
                to={item.turnTo}
                key={item.id}
                className="text-decoration-none fw-bold custom-list-button"
                onClick={handleLinkClick}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="text-center mb-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const closeBtn = document.querySelector('#userMenu .btn-close');
                if (closeBtn) closeBtn.click();
                setTimeout(() => {
                  handleLogout();
                }, 500);
              }}
              className="btn border-0 fw-bold d-inline-flex align-items-center gap-2 custom-list-logout"
            >
              登出 <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMenu;