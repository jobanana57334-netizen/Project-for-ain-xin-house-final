import { Link } from "react-router-dom";

const EditPublishHouses = () => {
  // 假資料：模擬已經刊登的房屋物件
  const mockHouses = [
    {
      id: 1,
      title: "信義區精美獨立套房",
      type: "獨立套房",
      price: "15,000",
      status: "刊登中",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80",
    },
    {
      id: 2,
      title: "中山區採光大雅房",
      type: "雅房",
      price: "8,500",
      status: "已出租",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500&q=80",
    },
    {
      id: 3,
      title: "大安區溫馨整層住家",
      type: "整層住家",
      price: "32,000",
      status: "草稿",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80",
    }
  ];

  return (
    <div className="container-fluid p-0">
      {/* 頂部標題與新增按鈕 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0 text-secondary fw-bold">刊登屋件管理</h4>
        <Link to="/manage-posts/publishNewHouse" className="btn btn-warning text-white fw-bold">
          <i className="bi bi-plus-lg me-2"></i>新增物件
        </Link>
      </div>

      {/* 房屋列表網格 (使用 Bootstrap 5 的 Row & Col) */}
      <div className="row g-4">
        {mockHouses.map((house) => (
          <div className="col-12 col-md-6 col-xl-4" key={house.id}>
            {/* 卡片本體 */}
            <div className="card h-100 shadow-sm border-0">
              {/* 房屋圖片 */}
              <img 
                src={house.image} 
                className="card-img-top" 
                alt={house.title} 
                style={{ height: "200px", objectFit: "cover" }}
              />
              
              <div className="card-body d-flex flex-column">
                {/* 狀態標籤與類型 */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className={`badge ${house.status === '刊登中' ? 'bg-success' : house.status === '已出租' ? 'bg-secondary' : 'bg-warning'}`}>
                    {house.status}
                  </span>
                  <small className="text-muted">{house.type}</small>
                </div>

                {/* 標題與價格 */}
                <h5 className="card-title fw-bold text-dark">{house.title}</h5>
                <p className="card-text text-danger fw-bold fs-5 mt-auto">
                  NT$ {house.price} <span className="fs-6 text-muted">/ 月</span>
                </p>

                {/* 操作按鈕 */}
                <div className="d-flex gap-2 mt-3 pt-3 border-top">
                  <button className="btn btn-outline-secondary flex-fill btn-sm">
                    編輯
                  </button>
                  <button className="btn btn-outline-danger flex-fill btn-sm">
                    刪除
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditPublishHouses;