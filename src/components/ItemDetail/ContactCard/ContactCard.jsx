
const ContactCard=({houseData,setShowContactAlert})=>{
    return(
        <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            // 加上半透明黑底背景，層級設高一點確保蓋住所有東西
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
            // 點擊灰底背景也能關閉提示框
            onClick={() => setShowContactAlert(false)}
        >
            <div 
                className="modal-dialog modal-dialog-centered" 
                // 阻止點擊白底內容區塊時觸發背景關閉
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content shadow" style={{ borderRadius: "16px", border: "none" }}>
                    
                    {/* 標題區 */}
                    <div className="modal-header border-0 pb-0 mt-2 mx-2">
                        <h5 className="modal-title fw-bold text-dark">聯絡房東 / 仲介</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setShowContactAlert(false)}
                        ></button>
                    </div>

                    {/* 內容區 */}
                    <div className="modal-body text-center pt-2 pb-5">
                        
                        {/* 房仲小提醒 (選填) */}
                        <p className="text-muted small mb-4">
                            聯絡時請告知是在「安心窩」看到的喔！
                        </p>

                        {/* 電話區塊 */}
                        <div className="mb-4">
                            <p className="text-muted mb-1 small">聯絡電話</p>
                            <h2 className="fw-bold mb-0" style={{ color: "#D4A373" }}>
                                <i className="bi bi-telephone-fill me-2"></i>
                                {houseData?.contact?.tel || "暫無電話"}
                            </h2>
                        </div>

                        {/* 分隔線 */}
                        <div className="d-flex align-items-center my-4 mx-4">
                            <hr className="flex-grow-1" />
                            <span className="mx-3 text-muted small">或</span>
                            <hr className="flex-grow-1" />
                        </div>

                        {/* Line 區塊 */}
                        <div>
                            <p className="text-muted mb-2 small">掃描或加入 Line 好友</p>
                            
                            {/* 假 QR Code (用 Bootstrap Icon 代替) */}
                            <div 
                                className="mx-auto bg-light d-flex align-items-center justify-content-center mb-3" 
                                style={{ width: "160px", height: "160px", borderRadius: "12px", border: "1px dashed #ced4da" }}
                            >
                                <i className="bi bi-qr-code text-secondary" style={{ fontSize: "6rem", opacity: 0.5 }}></i>
                            </div>
                            
                            {/* 假 Line ID，取前四碼做變化讓它看起來很真實 */}
                            <h5 className="mb-0 fw-bold">
                                ID: <span className="text-success">@anxinwo_{houseData?.id?.slice(0,4) || "demo"}</span>
                            </h5>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactCard;