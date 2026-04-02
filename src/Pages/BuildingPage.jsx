import { Link } from "react-router-dom";

const UnderConstruction = () => {
  return (
    // 使用 Bootstrap 的 Flexbox 讓內容垂直水平置中
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      {/* 放一個可愛的施工三角錐 Icon */}
      <i className="bi bi-cone-striped text-warning mb-3" style={{ fontSize: '5rem' }}></i>
      
      <h2 className="fw-bold mb-3">此頁面建置中</h2>
      <p className="text-muted mb-4 text-center">
        工程師正努力開發這項新功能中，<br />
        請稍後再回來看看喔！
      </p>
      
      <Link to="/" className="btn btn-primary px-4 rounded-pill">
        回到首頁
      </Link>
    </div>
  );
};

export default UnderConstruction;