import { pUrl } from '../../utils/constants';
import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const anxinwoLogo = '/homePagePicture/new/anxinwo_app.png';
const googlePlayDownload = '/homePagePicture/new/google_play_download.png';
const appleStoreDownload = '/homePagePicture/new/apple_store_download.png';
const backgroundImg = '/homePagePicture/new/notice_bg.jpg';
const logo = '/homePagePicture/new/logo.png';

// 🌟 新增這個小工具：專門幫你組合安全的圖片路徑
const getSafeImageUrl = (imgPath) => {
    if (!imgPath) return '';
    return pUrl.endsWith('/') && imgPath.startsWith('/') 
        ? pUrl + imgPath.slice(1) 
        : pUrl + imgPath;
};

const Announce = () => {

    const [newDatas, setNewDatas] = useState([]);

    useEffect(() => {
        const getNewDatas = async () => {
            try {
                const newsCollection = collection(db, "news");
                const newsSnap = await getDocs(newsCollection);
                const newsList = newsSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNewDatas(newsList);
            } catch (err) {
                console.log("發生錯誤!" + err?.message);
            }
        }
        getNewDatas();
    }, []);

    return (
        <>
            <div className="container px-0 px-md-3 mt-5 mb-0 mb-md-5 news-app-section py-5" 
            style={{
                background: `linear-gradient(rgba(89, 120, 137, 0.6), rgba(89, 120, 137, 0.6)), url(${getSafeImageUrl(backgroundImg)})`,
            }}>
                <div className="custom-container p-4 p-md-5">
                    <div className="row g-4 position-relative">

                        {/* 左側：消息公告 */}
                        <div className="col-md-6 col-12 ">
                            <div className="info-card h-100 p-4 shadow-sm">
                                <h4 className="fw-bold mb-4">消息公告</h4>
                                <ul className="list-unstyled flex-grow-1">
                                    {
                                        newDatas.map((item) => (
                                            <li className="mb-3 border-bottom pb-3" key={item.id}>
                                                {/* 💡 修改：將最新標籤改成專屬金色 */}
                                                {item.isNew && (<span className="badge me-2" style={{ backgroundColor: "#D4A373", color: "white" }}>最新</span>)}
                                                <span className="text-secondary" style={{ fontSize: "0.95rem" }}>
                                                    {item.title.length > 20 ? `${item.title.substring(0, 20)}...` : item.title}
                                                </span>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <div className="text-end mt-3">
                                    {/* 💡 修改：更多內容改成金色並加上粗體 */}
                                    <span style={{ color: "#D4A373", fontWeight: "bold", cursor: "pointer" }}>更多內容 →</span>
                                </div>
                            </div>
                        </div>

                        {/* 右側：APP 下載 */}
                        <div className="col-md-6">
                            <div className="info-card h-100 p-4 shadow-sm d-flex flex-column position-relative overflow-hidden"
                                style={{ borderRadius: "16px" }}
                            >
                                <img 
                                    // 💡 判斷：如果 pUrl 結尾有斜線，且 anxinwoLogo 開頭也有斜線，就把 anxinwoLogo 的第一個斜線切掉 (slice(1))
                                    src={getSafeImageUrl(anxinwoLogo)}
                                    alt="background"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        zIndex: 0,
                                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 80%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 80%)',
                                    }}
                                />

                                <div style={{ position: 'relative', zIndex: 2 }} className="h-100 d-flex flex-column">
                                    <h4 className="fw-bold mb-2">想要快速找屋 / 找到租客？</h4>
                                    <p className="text-muted mb-4">歡迎使用 「安心窩」 APP</p>
                                    
                                    {/* 💡 修改：將水平排列 (align-items-center) 改為垂直排列 (flex-column) */}
                                    <div className="d-flex flex-column gap-2 mt-2">
                                        
                                        {/* App Store 容器 */}
                                        <div style={{ width: "120px" }}>
                                            <img 
                                                src={getSafeImageUrl(appleStoreDownload)} 
                                                className="DownloadIcon w-100 ms-2"
                                                alt="App Store" 
                                                style={{ objectFit: "contain", cursor: "pointer" }} 
                                            />
                                        </div>

                                        {/* googlePlay容器 */}
                                        <div style={{ width: "140px" }}>
                                            <img 
                                                src={getSafeImageUrl(googlePlayDownload)} 
                                                alt="Google Play" 
                                                className="DownloadIcon w-100"
                                                style={{ objectFit: "contain", cursor: "pointer" }} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 💡 修改：套用剛剛寫好的 .phone-mockup class */}
                                <img
                                    src={getSafeImageUrl(logo)} 
                                    alt="App Mockup"
                                    className="phone-mockup"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Announce;