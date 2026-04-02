
import { Link } from "react-router-dom";
import { pUrl } from "../../utils/constants";
const BookingList=({bookings,getStatusBadge,formatTime,handleCancelBooking})=>{
  const getImageUrl=(imgStr)=>{
    if(!imgStr) return '';
    // 如果圖片已經是完整的外部網址 (包含 http 或 https)，就直接回傳原字串
    if(imgStr.startsWith('http')){
      return imgStr;
    }
    // 如果是本地端路徑，就接上 pUrl。
    // 使用 replace 拔除開頭的斜線，避免跟 pUrl 結尾的斜線撞在一起變成雙斜線 (//)
    return `${pUrl}${imgStr.replace(/^\//, '')}`;
  }
  return(
    <div className="row g-4">
      {bookings.map((booking) => (
        <div className="col-12" key={booking.id}>
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="row g-0 ">
                            
              {/* 左側：房屋預覽圖 */}
              <div className="col-md-3 d-flex justify-content-center align-items-center">
                <img 
                  src={getImageUrl(booking.houseImage) || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80"} 
                  className="img-fluid w-100" 
                  alt={booking.houseTitle || "房屋圖片"} 
                  style={{maxHeight: "200px", objectFit: "cover" }}
                />
              </div>

              {/* 右側：預約詳細資訊 */}
              <div className="col-md-9">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold text-dark mb-0">
                      {booking.houseTitle}
                    </h5>
                    {getStatusBadge(booking.isHandle,booking.isExpired ,booking.isCanceled)}
                  </div>
                                    
                  <div className="row mt-3 text-muted small">
                    <div className="col-sm-6 mb-2">
                      <i className="bi bi-calendar-event me-2"></i>
                      預約日期：<span className="text-dark fw-medium">{booking.date}</span>
                    </div>
                    <div className="col-sm-6 mb-2">
                      <i className="bi bi-clock me-2"></i>
                      希望時段：<span className="text-dark fw-medium">{formatTime(booking.time)}</span>
                    </div>
                    {booking.note && (
                      <div className="col-12 mt-2 bg-light p-3 rounded-3">
                        <span className="fw-bold text-secondary">我的留言：</span>{booking.note}
                      </div>
                    )}
                  </div>

                  {/* 操作按鈕區 */}
                  <div className="d-flex justify-content-end mt-3 gap-2">
                    <Link
                      to={`/item/${booking.houseId}`} 
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                      查看房屋詳情
                    </Link>
                    {!booking.isCanceled && !booking.isHandle && !booking.isExpired && (
                      <button 
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={()=>handleCancelBooking(booking.id,booking.houseTitle)}>
                        取消預約
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BookingList ;