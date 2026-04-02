

// 預留 address 作為 props，未來可以從外層傳入不同物件的地址
const Map = ({houseData}) => {
    
  // 從houseData中釋出相對應的address資料

  const address= houseData?.address || null

  // 將中文地址轉換成網址安全格式 (非常重要！不然網址會報錯)
  const encodedAddress = encodeURIComponent(address);
    
  // 使用 Google Maps 的免金鑰 embed 網址格式
  const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="mb-5">
      <h3 className="fs-5 fw-bold mb-4 ps-3 border-start border-4 border-warning">
        地圖索引
      </h3>
            
      {/* 地圖容器：加上 border 和淺淺的 shadow 讓質感更好，並保持你設定的 320px 高度 */}
      <div 
        className="w-100 rounded-3 overflow-hidden border border-light shadow-sm map-container" 
      >
        <iframe
          title="house-location-map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"        // 效能優化：等使用者滑到這裡時才載入地圖
          allowFullScreen       // 允許使用者點擊全螢幕觀看
          referrerPolicy="no-referrer-when-downgrade" //安全性設定:除非發生安全降級，否則我都願意告訴你我從哪裡來。
          src={mapUrl}
        ></iframe>
      </div>
    </section>
  );
}

export default Map;