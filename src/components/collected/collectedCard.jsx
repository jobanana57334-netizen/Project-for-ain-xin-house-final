import { Link } from "react-router-dom";

import ItemDetail from "../../Pages/ItemDetail";
export default function CollectedCard({house,onRemove}){

    // 處理防呆,避免不必要的資料傳遞錯誤
    const houseImg= house?.SwiperPicture?.[0]||null;
    const houseType= house?.typeName ||"沒有資料";
    const houseTitle=house?.title ||"沒有資料";
    const houseAddress=house?.address ||"沒有資料";
    const housePrice=house?.price ? `$${house.price.toLocaleString()} / 月` :"沒有資料";
    const houseLayout=house?.layout ? `${house.layout.room}房${house.layout.hall}廳${house.layout.bathroom}衛` :"沒有資料";
    const houseSize=house?.size ? `${house.size}坪` :"沒有資料";
    const houseFloor=house?.floorInfo ? `${house.floorInfo.current}F/${house.floorInfo.total}F` :"沒有資料";
    const houseAge=house?.age ? `屋齡${house.age}年` :"沒有資料";
    return(
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100" style={{ transition: "all 0.3s ease" }}>
            {/* 上半部：圖片與狀態區塊 */}
            <div className="position-relative" style={{ height: "220px" }}>
                <img 
                    src={houseImg} 
                    alt={houseTitle} 
                    className="w-100 h-100 object-fit-cover"
                />

                {/* 右上角：取消收藏按鈕 (實心愛心) */}
                <div className="position-absolute top-0 end-0 p-3">
                    <button 
                        className="btn btn-danger  shadow-sm p-2 d-flex align-items-center justify-content-center"
                        style={{ transition: "transform 0.2s" }}
                        onClick={(e) => {
                            e.stopPropagation(); // 阻止點擊事件冒泡到卡片外層
                            onRemove(house.id, houseTitle); // 觸發父元件傳進來的刪除函式
                        }}
                    >
                        取消蒐藏
                    </button>
                </div>

                
            </div>

            {/* 下半部：資訊區塊 */}
            <div className="card-body p-4 d-flex flex-column">
                <h5 className="fw-bold text-dark text-truncate mb-1">{houseTitle}</h5>
                <p className="text-secondary small mb-3">
                    <i className="bi bi-geo-alt me-1"></i>{houseAddress}
                </p>

                {/* 房屋規格小標籤 */}
                <div className="d-flex flex-wrap gap-2 mb-4 small text-secondary fw-medium">
                    <span className="bg-light px-2 py-1 rounded">{houseSize}</span>
                    <span className="bg-light px-2 py-1 rounded">{houseLayout}</span>
                    <span className="bg-light px-2 py-1 rounded">{houseType}</span>
                    <span className="bg-light px-2 py-1 rounded">{houseFloor}</span>
                    <span className="bg-light px-2 py-1 rounded">{houseAge}</span>
                </div>

                {/* 底部：價格 */}
                <div className="mt-auto d-flex justify-content-between align-items-end">
                    <div>
                        <span className="text-secondary small">月租</span>
                        <h4 className="fw-bold mb-0" style={{ color: "#E85D04" }}>
                            {housePrice}
                        </h4>
                    </div>
                    <Link
                        to={`/item/${house.id}`} 
                        element={<ItemDetail/>}
                        className="btn btn-outline-dark btn-sm px-4 rounded-pill fw-medium">
                        查看詳情
                    </Link>
                </div>
            </div>
        </div>
    )
}