
import { useForm } from "react-hook-form";

// 傳入三個 props：
// 1. show (控制是否顯示)
// 2. onClose (關閉彈出視窗的函式)
// 3. houseData (用來顯示使用者現在正在預約哪一間房)
const BookViewing = ({ setShowBookingAlert,submitBookingData,houseData }) => {
    
  // 取得正確時間並避免使用者以當天為預約時間
  const today=new Date();
  // 複製今天的時間,並以+1來表示明天
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate()+1);
  // 將時間轉成 HTML <input type="date"> 需要的格式： "YYYY-MM-DD"
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  // 判斷表單是否有按照規則進行
  const {register, handleSubmit, formState:{errors}}=useForm({
    mode: 'onTouched',
    defaultValues:{
      name:"",
      phone:"",
      date:"",
      time:"morning",
      note:"",
      isHandle:false,
      isCanceled:false
    }
  });

    

  // 處理表單送出
  const onSubmit = (data) => {
        
    // TODO: 這裡之後可以接 Firebase 把資料存到後台
        
    // ✅ 在這裡呼叫上層傳進來的 submitBookingData，並把「表單資料」傳給它
    submitBookingData(data);
  };

  // 如果 show 是 false，就什麼都不渲染 (隱藏視窗)
    

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={()=>setShowBookingAlert(false)} // 點擊灰底背景關閉
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable" 
        onClick={(e) => e.stopPropagation()} // 點擊白底區域不關閉
      >
        <div className="modal-content shadow" style={{ borderRadius: "16px", border: "none" }}>
                    
          {/* 標題區 */}
          <div className="modal-header border-0 pb-0 mt-2 mx-2">
            <h5 className="modal-title fw-bold text-dark">預約看房</h5>
            <button type="button" className="btn-close" onClick={()=>setShowBookingAlert(false)}></button>
          </div>

          {/* 內容區：表單 */}
          <div className="modal-body px-4 pt-3 pb-4">
            <p className="text-muted small mb-4">
              您正在預約觀看：<span className="fw-bold" style={{ color: "#D4A373" }}>{houseData?.title || "此物件"}</span>
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 姓名與電話 (並排) */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="bookingName" className="form-label small fw-medium text-muted">姓名</label>
                  <input 
                    type="text" 
                    className={`form-control bg-light border-0 ${errors.name?'is-invalid':''}`} 
                    id="bookingName" 
                    placeholder="如:王曉明"
                    {
                      ...register('name',{
                        required:"姓名為必填"
                      })
                    }
                  />
                  {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="bookingPhone" className="form-label small fw-medium text-muted">聯絡電話</label>
                  <input 
                    type="tel" 
                    className={`form-control bg-light border-0 ${errors.phone?'is-invalid':''}`} 
                    id="bookingPhone" 
                    name="phone"
                    placeholder="0912-345-678" 
                    {
                      ...register('phone',{
                        required:"電話為必填!",
                        pattern:{
                          value: /^(09\d{8}|0\d{1,3}-?\d{6,8})$/,
                          message:"請輸入正確的號碼格式 (手機: 0912345678 或 市話: 02-23456789)"
                        }
                      })
                    }
                  />
                  {errors.phone && <div className='invalid-feedback'>{errors.phone.message}</div>}
                </div>
              </div>

              {/* 日期與時段 (並排) */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="bookingDate" className="form-label small fw-medium text-muted">預約日期</label>
                  <input 
                    type="date" 
                    className={`form-control bg-light border-0 ${errors.date?"is-invalid":""}`}
                    id="bookingDate" 
                    {
                      ...register('date',{
                        required:"日期為必填!",
                        min:{
                          value: tomorrowString,
                          message:"為了方便房東/房仲安排，預約日期必須是明天（含）以後喔！"
                        }
                      })
                    }
                  />
                  { errors.date && <div className='invalid-feedback'>{errors.date.message}</div> }
                </div>
                <div className="col-md-6">
                  <label htmlFor="bookingTime" className="form-label small fw-medium text-muted">希望時段</label>
                  <select 
                    className={`form-select bg-light border-0 ${errors.time?'is-invalid':''}`}
                    id="bookingTime"
                    {
                      ...register('time',{
                        required:"日期為必填!"
                      })
                    }
                  >
                    <option value="morning">早上 (09:00 - 12:00)</option>
                    <option value="afternoon">下午 (13:00 - 17:00)</option>
                    <option value="evening">晚上 (18:00 - 21:00)</option>
                  </select>
                  { errors.time && <div className='invalid-feedback'>{errors.time.message}</div>}
                </div>
              </div>

              {/* 備註留言 */}
              <div className="mb-4">
                <label htmlFor="bookingNote" className="form-label small fw-medium text-muted">給房東/房仲的留言 (選填)</label>
                <textarea 
                  className="form-control bg-light border-0" 
                  id="bookingNote" 
                  name="note"
                  rows="3" 
                  placeholder="有什麼特別想詢問的嗎？例如：是否可養寵物、想看屋內採光等..."
                  {...register('note')}
                ></textarea>
              </div>

              {/* 送出按鈕 */}
              <button 
                type="submit" 
                className="w-100 py-2 fw-bold" 
                style={{ 
                  backgroundColor: "#D4A373", 
                  color: "white", 
                  borderRadius: "100px", 
                  border: "none" 
                }}
              >
                確認預約
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookViewing;