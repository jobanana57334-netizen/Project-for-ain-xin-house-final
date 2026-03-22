import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";

import Navbar from "./components/homepage/Navbar";
import Home from './Pages/Home';
import Sign from "./Pages/Sign";
import ItemDetail from "./Pages/ItemDetail";
import Search from "./Pages/Search";
import PersonalEdit from "./Pages/PersonalEdit";

import CollectPage from "./Pages/CollectPage";
import Footer from "./components/homepage/Footer";
import ScrollTop from "./components/ScrollTop";
import ToastMessage from './store/ToastMessage'
import Error from "./Pages/Error";
import MyBooking from "./Pages/MyBooking";
import PublishHouse from "./Pages/PublishHouse";
import HousePublish from "./components/ManagerData/housePublish";
import EditPublishHouses from "./components/ManagerData/EditPublishHouses";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* 他會在背後默默監聽每次換頁 */}
      <ScrollTop/>
      
      {/* 它會讓顯示框可以改成Redux樣板 */}
      <ToastMessage/>
      <Navbar />
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sign' element={<Sign/>}/>
          <Route path='/item/:id' element={<ItemDetail/>}/>
          <Route path='/search' element={<Search/>}/>
          <Route path='/personalEdit' element={<PersonalEdit/>}/>
          <Route path='/MyBooking' element={<MyBooking/>}/>
          <Route path='/collected' element={<CollectPage/>}/>
          <Route path='/manage-posts' element={<PublishHouse/>}>
            {/* index 代表當網址剛好是 /manage-posts 時，預設顯示的子元件 */}
            <Route index element={<Navigate to="publishNewHouse" replace />} />
            <Route path='publishNewHouse' element={<HousePublish/>}/>
            <Route path='EditPublishHouses' element={<EditPublishHouses/>}/>
          </Route>
          {/* 加上這一行，幫助你判斷是不是路徑打錯了 */}
          <Route path="*" element={<Error/>} />
        </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
