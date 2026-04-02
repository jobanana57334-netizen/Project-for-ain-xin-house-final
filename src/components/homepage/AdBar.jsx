import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { pUrl } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../store/MessageSlice';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AdBar = () => {
  const [adDatas, setAdDatas] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAdDatas = async () => {
      try {
        const adCollection = collection(db, "adDatas");
        const adSnapShot = await getDocs(adCollection);
        const adList = adSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setAdDatas(adList);
      } catch (err) {
        dispatch(showMessage({
          type: 'error',
          text: `發生 ${err} 錯誤，無法載入廣告資料，請稍後再試！`
        }));
      }
    };
    fetchAdDatas();
  }, [dispatch]); // 💡 遵照硬性規定：將 dispatch 加入依賴陣列

  const getSafeImageUrl = (imgPath) => {
    if (!imgPath) return '';
    return pUrl.endsWith('/') && imgPath.startsWith('/')
      ? pUrl + imgPath.slice(1)
      : pUrl + imgPath;
  };

  return (
    // 💡 外層：手機版滿版無邊距，桌機版加上邊距
    <div className="w-100 py-md-4 mt-2 px-0 px-md-4">
      {adDatas.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500 }}
          loop={true}
          observer={true}
          observeParents={true}
          className="overflow-hidden custom-swiper rounded-0 shadow-none shadow-md adbar-style"
          style={{
            '--swiper-navigation-color': "#fff",
            '--swiper-navigation-size': "40px",
          }}
        >
          {adDatas.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="position-relative h-100 w-100">
                <img
                  src={getSafeImageUrl(item.img)}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  alt={item.text}
                />

                {/* 文字遮罩層 */}
                <div
                  className="carousel-caption position-absolute"
                  style={{
                    left: "10%",
                    bottom: "15%",
                    textAlign: "left",
                    zIndex: 10
                  }}
                >
                  <div className="text-start">
                    <h2
                      className="display-5 fw-bold text-white mb-4"
                      style={{
                        letterSpacing: '2px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {item.title}
                    </h2>
                    <button type="button" className="top-button px-4 py-2">
                      {item.text} <span className="ms-2">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default AdBar;