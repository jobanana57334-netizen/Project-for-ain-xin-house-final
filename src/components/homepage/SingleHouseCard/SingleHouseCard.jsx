import { Link } from "react-router-dom";
import { pUrl } from "../../../utils/constants";

const getSafeImageUrl =(url)=>{
  if(!url) return '';

  return pUrl.endsWith('/') && url.startsWith('/') ?
    pUrl + url.slice(1) :
    pUrl + url;
}

// 💡 透過 props 接收母元件傳來的資料與函式
const SingleHouseCard = ({ item, typeName,isVisible,isUpdating, onFavorite}) => {
  return(
    <div 
      className={`flex-shrink-0 house-card-wrapper ${isVisible ? 'opacity-100' : 'opacity-50'}`} 
      data-id={item.id} // 讓觀察器知道這是哪一張圖片
      style={{ transition: 'opacity 0.2s ease-in-out' }}
    >
      <div className="card h-100 custom-card" style={{ borderRadius: '16px', border: 'none' }}>
        <Link to={`/item/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <img 
            src={getSafeImageUrl(item.img)} 
            className="card-img-top" 
            alt={item.title} 
            style={{ height: "230px", objectFit: "cover", borderRadius: '16px 16px 0 0' }} 
          />
        </Link>
        <div className="card-body px-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title fw-bold mb-0">{item.title}</h5>
            {/* 若正在更新則禁用點擊並調整游標 */}
            <i 
              className={`bi ${item.isfavor ? "bi-heart-fill" : "bi-heart"} text-warning ${isUpdating ? 'opacity-50' : ''}`}
              style={{ cursor: isUpdating ? 'default' : 'pointer', pointerEvents: isUpdating ? 'none' : 'auto' }}
              onClick={() => !isUpdating && onFavorite(item.id, item.isfavor)}    
            ></i>
          </div>
          <p className="card-text text-muted small mb-1">{item.address}</p>
          <p className="card-text text-muted small">{typeName} | {item.age}年 | 坪數 {item.size}</p>
          <p className="card-text fw-bold text-dark fs-5 mt-3">${item.price.toLocaleString()} / 月租</p>
        </div>
      </div>
    </div>
  )
};

export default SingleHouseCard;