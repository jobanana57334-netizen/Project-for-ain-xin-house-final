import { Navigate } from "react-router-dom";

// 引入所有頁面元件
import Home from './Pages/Home';
import Sign from "./Pages/Sign";
import ItemDetail from "./Pages/ItemDetail";
import Search from "./Pages/Search";
import PersonalEdit from "./Pages/PersonalEdit";
import CollectPage from "./Pages/CollectPage";
import ErrorPage from "./Pages/Error";
import MyBooking from "./Pages/MyBooking";
import PublishHouse from "./Pages/PublishHouse";
import HousePublish from "./components/ManagerData/housePublish";
import EditPublishHouses from "./components/ManagerData/EditPublishHouses";
import UnderConstruction from "./Pages/BuildingPage";
// 建立路由

const Routes=[
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/sign",
    element:<Sign/>
  },
  {
    path:"/item/:id",
    element:<ItemDetail/>
  },
  {
    path:"/search",
    element:<Search/>
  },
  {
    path:"/personalEdit",
    element:<PersonalEdit/>
  },
  {
    path:"/collected",
    element:<CollectPage/>
  },
  {
    path:"/MyBooking",
    element:<MyBooking/>
  },
  {
    path:"/manage-posts",
    element:<PublishHouse/>,
    // 子路由使用 children 陣列來管理
    children:[
      {
        index:true, // 代表當網址剛好是 /manage-posts 時，預設顯示的子元件
        element:<Navigate to="publishNewHouse" replace />
      },
      {
        path:"publishNewHouse",
        element:<HousePublish/>
      },
      {
        path:"EditPublishHouses",
        element:<EditPublishHouses/>
      }
    ]
  },
  {
    path: '/under-construction',
    element: <UnderConstruction />
  },
  {
    path:"*",
    element:<ErrorPage/>
  }
];

export default Routes;