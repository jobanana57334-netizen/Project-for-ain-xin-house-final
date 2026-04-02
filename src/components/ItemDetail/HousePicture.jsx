import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { pUrl } from '../../utils/constants';

// 必須導入樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const HousePicture=({houseData})=>{
// 用來儲存下方縮圖 Swiper 實例的 state
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // 模擬的照片資料 (你可以替換成你實際的圖片 URL)
  const images = houseData?.SwiperPicture||[];

  const getImageUrl = (imgStr)=>{
    if(!imgStr) return '';
    // 如果圖片已經是完整的外部網址 (包含 http 或 https)，就直接回傳原字串
    if(imgStr.startsWith('http')){
      return imgStr;
    }

    // 如果是本地端路徑，就接上 pUrl。
    // 使用 replace 拔除開頭的斜線，避免跟 pUrl 結尾的斜線撞在一起變成雙斜線 (//)
    return `${pUrl}${imgStr.replace(/^\//, '')}`;
  }

  if(images.length<=0){
    return (
      <div className='text-center py-5 bg-light rounded-3'>
        此房屋暫無提供圖片
      </div>
    )
  }

  return (
    <div className="house-gallery-container">
      {/* 上方：主圖輪播 */}
      <Swiper
        spaceBetween={10}
        navigation={true}
        // 將上方的 Swiper 與下方的 thumbsSwiper 綁定
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="main-swiper mb-3" // Bootstrap: margin-bottom 3
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            {/* Bootstrap: rounded-3 加上圓角，確保圖片自適應填滿 */}
            <img 
              src={getImageUrl(img)} 
              alt={`房屋圖片 ${index + 1}`} 
              className="w-100 object-fit-cover rounded-3" 
              style={{ height: '400px' }} // 主圖高度，可依需求調整
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 下方：縮圖輪播 */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={12} // 縮圖之間的間距
        slidesPerView={4} // 一次顯示 4 張縮圖 (對應你的截圖)
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbs-swiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img 
              src={getImageUrl(img)} 
              alt={`房屋縮圖 ${index + 1}`} 
              className="w-100 object-fit-cover rounded-3 cursor-pointer" 
              style={{ height: '80px' }} // 縮圖高度
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HousePicture;