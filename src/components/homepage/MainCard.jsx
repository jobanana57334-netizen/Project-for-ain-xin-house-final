
import { pUrl } from '../../utils/constants';
const MainPic1 = '/homePagePicture/Main/學區熱門租屋處.jpg';
const MainPic2 = '/homePagePicture/Main/鄰近捷運.jpg';
const MainPic3 = '/homePagePicture/Main/經濟實惠.jpg';
const MainPic4 = '/homePagePicture/Main/青年補助.jpg';


const getSafeImageUrl = (imgPath)=>{
    if(!imgPath) return '';
    return pUrl.endsWith('/') && imgPath.startsWith('/')?
        pUrl +imgPath.slice(1):
        pUrl +imgPath;
};

const MainCard = () => {
    // 這裡定義主題資料，之後要增加小卡只需要在這裡加一筆，不用去動 HTML
    const themes = [
        { id: 1, title: '學院熱門租屋處', subtitle: 'School Area',img:MainPic1 },
        { id: 2, title: '鄰近捷運、公車站租屋處', subtitle: 'Easy Commute',img:MainPic2 },
        { id: 3, title: '經濟實惠租屋處', subtitle: 'Best Value', img:MainPic3 },
        { id: 4, title: '學生青年補助專區', subtitle: 'For Students', img:MainPic4 },
    ];

    return (
        <section className="bg-customer py-5">
            <div className="container">
                {/* 1. 標題區：乾淨俐落 */}
                <div className="mb-5">
                    <h1 className="fw-bold">主題找屋</h1>
                    <div className="d-flex align-items-center">
                        <span className="text-muted">根據主題快速找屋</span>
                        <hr className="ms-3 flex-grow-1" style={{ border: "1px solid #9cb7c4", opacity: "1", maxWidth: "120px" }} />
                    </div>
                </div>

                {/* 2. 格子區：使用 row-cols 定義一行顯示幾個 */}
                <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4">
                    {themes.map((theme) => (
                        <div className="col" key={theme.id}>
                            {/* 1. 在這裡加上 theme-card 類別 */}
                            <div className="card h-100 bg-transparent border-0 theme-card">
                                
                                {/* 圖片區 (維持不變) */}
                                <div className="overflow-hidden rounded-4 shadow-sm ">
                                    <img src={getSafeImageUrl(theme.img)} 
                                    className="card-img-top w-100" 
                                    alt={theme.title} 
                                    style={{ height: "230px", objectFit: "cover" }} />
                                </div>
                                
                                {/* 文字區 */}
                                <div className="card-body px-0 pt-3 border-bottom border-md-0 d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-secondary small mb-1" style={{ letterSpacing: "1px" }}>
                                            {theme.subtitle}
                                        </div>
                                        <h5 className="fw-bold mb-0">{theme.title}</h5>
                                    </div>
                                    
                                    {/* 2. 右側小箭頭：使用定義好的類別 */}
                                    <button type="button" className="theme-arrow">
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MainCard;