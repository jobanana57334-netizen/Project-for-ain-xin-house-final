
import SvgIcon from '../SvgIcons'
import { Link } from "react-router-dom";
const Footer=()=>{
    return (
        <>
            {/*footer*/}
            <footer className="footer mt-md-5 mt-0">
                <div className="container">
                    <div className="row">
                    
                    {/* 左側：品牌資訊與聯繫方式 */}
                    <div className="col-12 col-lg-5 mb-5 mb-lg-0">
                        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-2 logo-bar">
                            {/* 這裡可以使用你的安心窩 Logo */}
                            <SvgIcon name='home-vector' color="#F5E0BD" width="54px" height="44px"/>
                            <span className='fw-bold' style={{color:"#FFFFFF", fontSize:"24px"}}>安心窩</span>
                        </Link>
                        
                        <div className="contact-info mt-5 mt-md-3">
                            <p className="fw-bold mb-4 ">直營店(總部-雙北營業區)</p>
                            <p><i className="bi bi-telephone-fill"></i> 0800-092-000</p>
                            <p><i className="bi bi-envelope-fill"></i> anixinwo@gmail.com</p>
                            <p><i className="bi bi-clock-fill"></i> 09:00~18:00(週一至週五)</p>
                        </div>

                        <div className="social-icons">
                        <i className="bi bi-facebook"></i>
                        <i className="bi bi-line"></i>
                        <i className="bi bi-instagram"></i>
                        </div>
                    </div>

                    {/* 右側：導覽連結 */}
                    <div className="col-12 col-lg-7 footer-nav">
                        <div className="row">
                        
                        <div className="col-12 nav-section">
                            <h5>合作夥伴</h5>
                            <div className="nav-links">
                            <span>永慶房屋</span><span>中信房屋</span><span>北揚房屋</span>
                            <span>Zuyou租寓</span><span>怡居房屋</span>
                            </div>
                        </div>

                        <div className="col-12 nav-section">
                            <h5>安心窩服務</h5>
                            <div className="nav-links">
                            <span>智能ai服務器</span><span>安心窩慈善基金會</span><span>安心窩居家服務</span>
                            </div>
                        </div>

                        <div className="col-12 nav-section">
                            <h5>人才招募</h5>
                            <div className="nav-links">
                            <span>房仲招募</span><span>數位人才招募</span><span>經紀人員招募</span>
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