import SvgIcon from '../SvgIcons'
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="footer mt-md-5 mt-0">
        <div className="container">
          <div className="row">
                    
            {/* 左側：品牌資訊與聯繫方式 */}
            {/* ✅ 移除 col-12，保留 col-lg-5 即可 */}
            <div className="col-lg-5 mb-5 mb-lg-0">
              <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-2 logo-bar">
                <SvgIcon name='home-vector' color="#F5E0BD" width="54px" height="44px"/>
                <span className='fw-bold' style={{color:"#FFFFFF", fontSize:"24px"}}>安心窩</span>
              </Link>
                        
              <div className="contact-info mt-5 mt-md-3">
                <p className="fw-bold mb-4 ">直營店(總部-雙北營業區)</p>
                <p>
                  <i className="bi bi-telephone-fill"></i> 
                  <a href="tel:0800-092-000" className="text-decoration-none ms-1">0800-092-000</a>
                </p>
                <p>
                  <i className="bi bi-envelope-fill"></i> 
                  <a href="mailto:anixinwo@gmail.com" className="text-decoration-none ms-1">anixinwo@gmail.com</a>
                </p>
                <p><i className="bi bi-clock-fill"></i> 09:00~18:00(週一至週五)</p>
              </div>

              <div className="social-icons">
                {/* ✅ 建議社群連結也加上新開視窗設定 */}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-line"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>

            {/* 右側：導覽連結 */}
            <div className="col-lg-7 footer-nav">
              <div className="row">
                        
                {/* 💡 這裡的 col-12 可以保留，因為這三個 section 
                    在所有螢幕尺寸下都需要佔滿右側這 7 格寬度的 100% */}
                <div className="col-12 nav-section">
                  <h5>合作夥伴</h5>
                  <div className="nav-links d-flex flex-wrap gap-3">
                    <a href="https://www.yungching.com.tw/" target="_blank" rel="noopener noreferrer" className="text-decoration-none ">永慶房屋</a>
                    <a href="https://www.cthouse.com.tw/" target="_blank" rel="noopener noreferrer" className="text-decoration-none ">中信房屋</a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-decoration-none ">北揚房屋</a>
                    <a href="https://www.zuyou.com.tw/" target="_blank" rel="noopener noreferrer" className="text-decoration-none ">Zuyou租寓</a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-decoration-none ">怡居房屋</a>
                  </div>
                </div>

                <div className="col-12 nav-section">
                  <h5>安心窩服務</h5>
                  <div className="nav-links d-flex flex-wrap gap-3">
                    <Link to="/under-construction" className="text-decoration-none ">智能ai服務器</Link>
                    <Link to="/under-construction" className="text-decoration-none ">安心窩慈善基金會</Link>
                    <Link to="/under-construction" className="text-decoration-none ">安心窩居家服務</Link>
                  </div>
                </div>

                <div className="col-12 nav-section">
                  <h5>人才招募</h5>
                  <div className="nav-links d-flex flex-wrap gap-3">
                    <Link to="/under-construction" className="text-decoration-none ">房仲招募</Link>
                    <Link to="/under-construction" className="text-decoration-none ">數位人才招募</Link>
                    <Link to="/under-construction" className="text-decoration-none ">經紀人員招募</Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer;