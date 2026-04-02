import { Link } from "react-router-dom";

const SpecialCard = ({ visibleIds }) => {
  return (
    <div
      // 一樣加上 flex-shrink-0 防擠壓，與 house-card-wrapper 讓觀察器抓取
      className={`flex-shrink-0 house-card-wrapper ${visibleIds.has('view-more') ? 'opacity-100' : 'opacity-50'}`}
      key="view-more-card"
      data-id="view-more" // 給它一個專屬的字串 ID
      style={{ transition: 'opacity 0.2s ease-in-out' }}
    >
      {/* 點擊整張卡片都可以跳轉 */}
      <Link
        to="/search"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
          height: '100%'
        }}
      >
        <div
          // 加上 d-flex 與置中 className，讓內容漂亮地置中對齊
          className="card h-100 custom-card d-flex flex-column justify-content-center align-items-center"
          style={{
            borderRadius: '16px',
            border: '2px dashed #9cb7c4', // 💡 小技巧：用虛線框取代實線框，暗示這是個「按鈕/連結」
            backgroundColor: '#f8f9fa',   // 稍微上一點淺灰底色
            minHeight: '350px'            // 💡 建議加上最小高度，盡量跟你的房屋卡片一樣高
          }}
        >
          {/* 加個大一點的 Icon 增加視覺引導 */}
          <i
            className="bi bi-arrow-right-circle-fill mb-3"
            style={{ fontSize: '3rem', color: '#D4A373' }}
          ></i>
          <h4 className="fw-bold text-secondary text-center">
            探索更多<br />熱門房屋
          </h4>
        </div>
      </Link>
    </div>
  );
};

export default SpecialCard;