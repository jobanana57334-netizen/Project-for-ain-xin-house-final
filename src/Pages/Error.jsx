import { Link } from "react-router-dom";



const ErrorPage=()=>{
  return(
    <div className="container text-center py-5">
      {/* 這裡加入一個極簡的 SVG Icon */}
      <div className="mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="120" 
          height="120" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#D3D3D3" /* 使用柔和的淺灰色，避免搶走 404 的焦點 */
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      </div>
      <h1>404</h1>
      <h2 className="mt-2">頁面未建立</h2>
      <p className="mt-2">抱歉，我們找不到您要前往的頁面。</p>
      <p className="mt-2">它可能正在建立中，或是網址輸入有誤。</p>
      <Link 
        to="/" 
        className="error-btn mt-3 text-dark text-decoration-none"
      >返回首頁
      </Link>
    </div>
  )
}

export default ErrorPage;
