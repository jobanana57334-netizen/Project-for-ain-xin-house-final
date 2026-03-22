
import { Link } from "react-router-dom";
import SvgIcons from '../../../components/SvgIcons';

// 新增接收 onFavorite 和 isUpdating 這兩個 props
function PropertyListItem({ property }) {
  if (!property) return null;


  return (
      <Link 
        to={`/item/${property.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
      <article className="property-card">
        <div className="property-card__image-wrap">
          <img
            src={property.img}
            alt={property.title}
            className="property-card__image"
          />
        </div>

        <div className="property-card__content">
                    {/* 修改 1 & 2：變數改為 property，並換成剛才寫好的 handleFavoriteClick */}

                    {/* 新增一個 Flex 容器包覆頂部資訊 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: '12px',
            width: '100%' // 確保容器佔滿整個寬度
          }}>
            
            {/* 左邊陣營：標題與地址包在一起 */}
            <div className="property-card__info-left" style={{ flex: 1, paddingRight: '16px' }}> 
              {/* 加了 flex: 1 讓它撐開，並加了 paddingRight 確保文字太長時不會貼死愛心 */}
              
              <h3 className="property-card__title" style={{ marginTop: 0, marginBottom: '4px' }}>
                {property.title}
              </h3>
              <p className="property-card__address" style={{ margin: 0, color: '#666' }}>
                {property.address}
              </p>
            </div>


          </div>

          <ul className="property-card__meta">
            <li>
              <SvgIcons
              name='home-housesItem'
              color="#F5E0BD"
              style={{width: "24px",height:"24px"}}/>
              {property.layout?.room}房 {property.layout?.hall}廳 {property.layout?.bathroom}衛
            </li>
            
            <li>
              <SvgIcons
              name='home-location'
              color="#F5E0BD"
              style={{width: "24px",height:"24px"}}/>
              {property.size} 坪
            </li>
            
            <li>
              <SvgIcons
              name='home-have'
              color="#F5E0BD"
              style={{width: "24px",height:"24px"}}/>
              樓層：{property.floorInfo?.current} / {property.floorInfo?.total}F
            </li>
          </ul>
        </div>

        <div className="property-card__price">
          ${property.price?.toLocaleString()} / 月
        </div>
      </article>
    </Link>
  );
}

export default PropertyListItem;