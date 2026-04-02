import { pUrl } from '../../utils/constants';
const Reason1 = '/homePagePicture/Reason/Reason1.png';
const Reason2 = '/homePagePicture/Reason/Reason2.png';
const Reason3 = '/homePagePicture/Reason/Reason3.png';

const getSafeImageUrl = (imgPath)=>{
  if(!imgPath) return '';
  return pUrl.endsWith('/') && imgPath.startsWith('/')?
    pUrl +imgPath.slice(1):
    pUrl +imgPath;
};
// 1. 把樣式抽出，讓回傳的 JSX 保持整潔
const iconContainerStyle = {
  width: '120px',
  height: '120px',
  flexShrink: 0, 
  borderRadius: '50%',
  backgroundColor: '#fef5e7',
  border: '2px solid #e2c08d',
  marginTop: '-60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
};
// 這次我確定有改到檔案而且存檔了
const ReasonSection = () => {
  // 2. 定義理由資料 (之後要加第四、五個理由，只要在這裡增加物件即可)
  const reasons = [
    {
      id: 1,
      title: "線上租屋媒合平台",
      icon: Reason1,
      description: "每個用戶都能夠藉由該平台來快速篩選出自己想要的房屋類型、地點、以及了解房東情形如何以外。房東也可以在這個平台上上傳自己想要租出去的租屋處。"
    },
    {
      id: 2,
      title: "對​屋件​可​進行評價",
      icon: Reason2,
      description: "租客​可以​針對​自己​住過​的​租屋​處​進行​評價，​讓​其他​人​了解​該​房屋​屋件​如何，​防止​其他​租客​採​到​雷；而​能​夠​評價​的​租客​也​必須​要​符合租​客​規範，​方能​進行​評論，​以​防止​有心​人士​破壞房​東​名聲。​"
    },
    {
      id: 3,
      title: "可以​找到​心儀​的​租客​",
      icon: Reason3,
      description: "​屋主​可以​藉由​「租客​搜索」這項​功能，​來​根據​自己​理​想​中​的​條件，​找到​適合​自己​的​租客，​並且​也​可以​與租客​進行​聯繫，​從而​能​夠​快速​媒​合​到​自己​心目中​的​房客。​"
    }
  ];

  return (
    <section className="container py-5 mt-5">
      {/* 標題區 */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-4" style={{ letterSpacing: "2px", fontSize: "40px" }}>
          為什麼選擇安心窩？
        </h1>
        <div className="d-flex justify-content-center align-items-center">
          <span className="text-secondary fw-bold" style={{ fontSize: '16px' }}>
            不是只找房，是幫你把關人
          </span>
          <div className="ms-3" style={{ width: '80px', height: '3px', backgroundColor: 'black', opacity: 0.5 }}></div>
        </div>
      </div>

      {/* 卡片區塊 */}
      <div className="row justify-content-center gy-5 mt-2" >
        {reasons.map((item) => (
          <div className="col-md-6 col-lg-4 mb-5 mb-lg-0" key={item.id}>
            <div className="card border-0 shadow rounded-4 h-100 text-center px-4 pb-4 bg-white mt-5">
                            
              {/* 上方圓形圖示 */}
              <div className="mx-auto rounded-circle shadow-sm " style={iconContainerStyle}>
                <img 
                  src={getSafeImageUrl(item.icon)} 
                  alt={item.title}
                  style={{ width: '60px', height: '60px', objectFit: 'contain' }} 
                />
              </div>

              {/* 卡片內容 */}
              <div className="card-body d-flex flex-column justify-content-center" style={{ minHeight: '240px' }}>
                <h4 className="card-title fw-bold mb-3" style={{ fontFamily:"Noto Sans TC", color: '#444' }}>
                  {item.title}
                </h4>
                <p className="card-text text-muted lh-lg mb-0" style={{fontFamily:"Noto Sans TC"}}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReasonSection;