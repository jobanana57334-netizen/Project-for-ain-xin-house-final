
const Menu = () => {


    // 將選單項目陣列化，未來如果要新增/修改項目，只要改這裡就好
    const menuItems = [
        { id: 1, title: '屋件搜尋', path: '/search' },
        { id: 2, title: '最新屋件', path: '/latest' },
        { id: 3, title: '熱門租客評價', path: '/reviews' },
        { id: 4, title: '主題找屋', path: '/theme' },
        { id: 5, title: '最新消息', path: '/news' },
        { id: 6, title: 'Q&A', path: '/faq' },
    ];

    return (
        <>
            {/* Bootstrap Offcanvas 結構 (offcanvas-end 代表從右邊滑出) */}
            <div 
                className="offcanvas offcanvas-end" 
                tabIndex="-1" 
                id="mobileMenu" 
                aria-labelledby="mobileMenuLabel">
                
                {/* 💡 頂部 Header：Logo 與關閉按鈕 */}
                <div className="offcanvas-header justify-content-between border-bottom px-4 py-3">
                    <span className="fw-bold fs-5" style={{ color: "#6F5D42" }}>功能選單</span>
                    
                    <div className="d-flex align-items-center gap-3">
                        
                        
                        {/* Bootstrap 內建的漂亮打叉關閉按鈕 */}
                        <button 
                            type="button" 
                            className="btn p-0 border-0" 
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                            style={{borderColor:"#D4AB6A"}}>
                                <span style={{ fontSize: "28px", color: "#D4AB6A", lineHeight: "1" }}>
                                    &times;
                                </span>
                            </button>
                    </div>

                </div>

                {/* 💡 中間 Body：選單列表 */}
                {/* 使用 flex-column 垂直排列，pt-5 往下推，gap-4 控制間距 */}
                <div className="offcanvas-body d-flex flex-column align-items-center justify-content-start pt-5 gap-4">
                    {menuItems.map((item) => (
                        <a
                            href={item.path} 
                            key={item.id}
                            className="text-decoration-none fw-bold custom-list-button"
                            
                        >
                            {item.title}
                        </a>
                    ))}
                </div>
                
            </div>
        </>
    );
};

export default Menu;