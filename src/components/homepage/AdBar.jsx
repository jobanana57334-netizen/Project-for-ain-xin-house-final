import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { pUrl } from '../../utils/constants';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AdBar = () => {
    const [adDatas, setAdDatas] = useState([]);

    useEffect(() => {
        const fetchAdDatas = async () => {
            try {
                const adCollection = collection(db, "adDatas");
                const adSnapShot = await getDocs(adCollection);
                const adList = adSnapShot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setAdDatas(adList);
            } catch (err) {
                console.log("發生錯誤!" + err.message);
            }
        }
        fetchAdDatas();
    }, []);

    const getSafeImageUrl = (imgPath)=>{
        if(!imgPath) return '';
        return pUrl.endsWith('/') && imgPath.startsWith('/')?
            pUrl +imgPath.slice(1):
            pUrl +imgPath;
    };
    return (
        // 💡 1. 外層：手機版滿版無邊距 (px-0)，桌機版才加上邊距 (px-md-4)
        <div className="w-100 py-md-4 mt-2 px-0 px-md-4 ">
            {adDatas.length > 0 &&(
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3500 }}
                    loop={true}
                    // 💡 加入 observer 屬性，讓 Swiper 監聽 DOM 變化 (雙重保險)
                    observer={true}
                    observeParents={true}
                    // 💡 2. 圓角與陰影設定：手機版無圓角無陰影，md 以上才有
                    // 💡 3. 新增 'adbar-height' 這個 class，把高度控制交給 CSS
                    className="overflow-hidden custom-swiper rounded-0  shadow-none shadow-md adbar-style"
                    style={{ 
                        '--swiper-navigation-color': "#fff",
                        '--swiper-navigation-size': "40px",
                    }} 
                >
                    {
                        adDatas.map((item) => {
                            return(
                            // 💡 移除了多餘的 <></>
                            <SwiperSlide key={item.id}>
                                <div className="position-relative h-100 w-100 ">
                                    <img 
                                        // 💡 判斷：如果 pUrl 結尾有斜線，且 item.img 開頭也有斜線，就把 item.img 的第一個斜線切掉 (slice(1))
                                        src={getSafeImageUrl(item.img)}
                                        className="w-100 h-100" 
                                        style={{ objectFit: 'cover' }} 
                                        alt={item.text}
                                    />
                                    
                                    {/* 文字遮罩層 */}
                                    <div className="carousel-caption position-absolute" 
                                        style={{ 
                                            left: "10%", 
                                            bottom: "15%", 
                                            textAlign: "left",
                                            zIndex: 10 
                                        }}>
                                        <div className='text-start'>
                                            <h2 className="display-5 fw-bold text-white mb-4" style={{ letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                                                {item.title}
                                            </h2>
                                            <button className="top-button px-4 py-2">
                                                {item.text} <span className="ms-2">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )})
                    }
                </Swiper>
            )}
        </div>
    );
};

export default AdBar;