import { Outlet, NavLink } from "react-router-dom";
import SvgIcon from '../../src/components/SvgIcons';
function PublishHouse() {
  return (
  // 1. 外層加上自訂 className "publish-layout"，用來控制方向
    <div className="container-fluid px-md-5 d-flex publish-layout mt-60">
        
      {/* 2. 移除 d-none d-md-block，讓手機版也能顯示。加上 mb-24 讓手機版選單跟下方內容保持距離 */}
      <aside className="sidebar">
        <ul className="p-0 m-0 d-flex publish-menu" style={{ listStyle: 'none' }}>
          <li className="flex-fill" style={{fontSize:"16px"}}>
            <NavLink 
              to="publishNewHouse" 
              // 1. 加上 sidebar-link
              // 2. 未選取時改用 text-secondary (或 text-gray-500)
              className={({ isActive }) => `sidebar-link d-flex justify-center justify-md-start align-center py-16 py-md-20 mt-md-3 ${isActive ? 'text-system-accent border-bottom-light' : 'text-secondary'}`}
              style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <i className='bi bi-house-add-fill me-8 me-md-3'></i>
              新增刊登屋件
            </NavLink>
          </li>
                
          <li className="flex-fill" style={{fontSize:"16px"}}>
            <NavLink 
              to="EditPublishHouses" 
              // 同樣加上 sidebar-link 與 text-secondary
              className={({ isActive }) => `sidebar-link d-flex justify-center justify-md-start align-center py-16 py-md-20 mt-md-3 ${isActive ? 'text-system-accent border-bottom-light' : 'text-secondary'}`}
              style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <SvgIcon name='Icons-write' isPublic className="me-8 me-md-3"/>
              刊登屋件管理
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* 4. 右側內容區塊：手機版不需要左邊距 (把 ms-5 換成專屬設定) */}
      <div className="content content-area">
        <Outlet />
      </div>

    </div>
  );
}

export default PublishHouse;