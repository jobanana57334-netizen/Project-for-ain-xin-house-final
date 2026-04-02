import { HashRouter, useRoutes} from "react-router-dom";

import Navbar from "./components/homepage/Navbar";
import Footer from "./components/homepage/Footer";
import ScrollTop from "./components/ScrollTop";
import ToastMessage from "./store/ToastMessage";

// 引入統一管理的路由表
import Routes from "./Router";

// 建立一個子元件來解析並渲染路由表
// (因為 useRoutes 必須包在 Router 內部才能使用，所以我們把它抽成一個小元件)

const AppRoutes=()=>{
  const element =useRoutes(Routes);
  return element;
};


function App() {
  return (
    <HashRouter>
      {/* 他會在背後默默監聽每次換頁 */}
      <ScrollTop/>
      
      {/* 它會讓顯示框可以改成Redux樣板 */}
      <ToastMessage/>

      <Navbar />

      <AppRoutes />

      <Footer />
    </HashRouter>
  );
}

export default App;
