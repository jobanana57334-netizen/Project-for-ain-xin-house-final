import { pUrl } from "../../utils/constants";
const Person1 = '/homePagePicture/recommand/陳先生.jpg';
const Person2 = '/homePagePicture/recommand/漫漫姊.jpg';
const Person3 = '/homePagePicture/recommand/主委.jpg';

// 1. 樣式提取：保持組件內部清爽
const avatarStyle = {
    width: '120px',
    height: '120px',
    flexShrink: 0, 
    borderRadius: '50%',
    backgroundColor: '#fef5e7',
    marginTop: '-60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden' // 確保頭像圖片不會超出圓框
};


const FeedbackSection = () => {
    const getSafeImageUrl = (imgPath)=>{
        if(!imgPath) return '';
        return pUrl.endsWith('/') && imgPath.startsWith('/')?
            pUrl +imgPath.slice(1):
            pUrl +imgPath;
    };
    // 2. 資料陣列：之後想加新的回饋，只要在這裡加一筆資料就好
    const feedbacks = [
        {
            id: 1,
            name: "優質房仲陳先生",
            content:(<>
                    這個平台試著用心將大多數的屋件資訊給透明化，幫助房客能夠掃雷、排除有問題的屋件，也能夠快速的將屋主與符合其設定條件的房客快速進行媒合。<br/><br/>
                    這種精神一直以來都是我們超級房仲學院所推崇的誠信精神。如果你感到迷惘的話，不彷可以使用安心窩，幫助你快速找到好房子。
                </>),
            avatar: Person1,
            isYT:true
        },
        {
            id: 2,
            name: "漫漫姊",
            content:(
                <>
                    在安心窩能夠快速找到自己喜歡的物件，也能夠從中快速篩選到心儀的租屋處。我發現他們真的很敢，敢把屋件狀況、房東情形都能記錄下來。<br/><br/>
                    總之，我很感謝安心窩，讓我能夠快速掃雷，找到心儀的租屋處。
                </>
            ),
            avatar: Person2 ,// 之後可以換成真實頭像路徑
            isYT:false
        },
        
        {
            id: 3,
            name: "主委​加碼啦",
            content: (
                <>
                    擁有十幾棟房產的我，每次為了找新的租客上苦苦思索，與許多租客聊天，但都不一定會媒合成功。<br/><br/>
                    在這裡，我可以根據租客的個人基本資料以及租客需求來快速剔除掉許多不符合我條件的租客，從而快速找到符合自己理想的租客。我推薦每個房東都可以試試看。
                </>
            ),
            avatar: Person3,
            isYT:false
        }
    ];

    return (
        <section className="container py-5 mt-5">
            {/* 標題區 */}
            <div className="text-center mb-5">
                <h1 className="fw-bold mb-4" style={{ letterSpacing: "2px", fontSize: "40px" }}>真實使用回饋</h1>
                <div className="d-flex justify-content-center">
                    <div style={{ width: '80px', height: "3px", backgroundColor: "black", opacity: 0.5 }}></div>
                </div>
            </div>

            {/* 卡片區塊 */}
            <div className="row justify-content-center gy-5 mt-2">
                {feedbacks.map((item) => (
                    <div className="col-12 col-md-6 col-lg-4 px-3 mb-5 mb-lg-0" key={item.id}>
                        <div className="card border-0 shadow rounded-4 position-relative h-100 mt-5" >
                            
                            {/* 圓形頭像區 */}
                            <div className="mx-auto rounded-circle shadow-sm bg-white border border-2 border-white" style={avatarStyle}>
                                <img 
                                    src={getSafeImageUrl(item.avatar)} 
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/120"; }} // 沒圖片時顯示預設圖
                                />
                            </div>

                            {/* 文字內容區 */}
                            <div className="card-body text-center d-flex flex-column" style={{ paddingTop: "70px", paddingBottom: "30px" }}>
                                <h5 className="fw-bold mb-2 d-flex align-items-center justify-content-center">{item.name} 
                                    {item.isYT && <i className="bi bi-play-btn-fill ms-2 custom-yt-icon"></i>}
                                </h5>
                                
                                <i className="bi bi-quote mb-2" style={{ fontSize: '3rem', color: '#F2E1C2', lineHeight: 1 }}></i>
                                
                                <p className="text-muted lh-lg px-2 flex-grow-1">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 查看更多按鈕 */}
            <div className="text-center" style={{marginTop:"100px"}}>
                <button type="button" className="top-button" style={{ width: "181px", height: "52px" }}>
                    查看更多客戶分享
                </button>
            </div>
        </section>
    );
};

export default FeedbackSection;