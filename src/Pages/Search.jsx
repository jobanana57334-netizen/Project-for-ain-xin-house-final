import { useState, useMemo,useEffect } from "react";
import { db } from "../firebaseConfig";
import {collection, getDocs } from "firebase/firestore";

import { PropertyListHero, PropertyList, PropertyPagination } from "../components/Search/property-list";

import { useDispatch } from "react-redux";
import { showMessage } from "../store/MessageSlice";


const ITEMS_PER_PAGE = 8;


function PropertyListPage() {
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    location: "any",
    rent: "any",
    layout: "any",
    other: "any",
  });

  const dispatch= useDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  // 儲存firebase中的資料
  const [properties,setProperties]= useState([]);
  const [isLoading,setIsLoading]= useState(true);

  const handleSearchChange = (newFilters) => {
    setSearchFilters(newFilters);
    setCurrentPage(1);
  };

  // 新增：在元件載入時去 Firebase 抓資料
  useEffect(()=>{
    const fetchProperties= async()=>{
      try{
        setIsLoading(true);
        const houseRef=collection(db,'houses');//取得所有房屋資料
        const querySnapshot= await getDocs(houseRef);

        const houseData=querySnapshot.docs.map(doc=>({
          id:doc.id,
          ...doc.data()
        }));

        setProperties(houseData);
      }catch(err){
        console.error("讀取房屋資料時發生錯誤:",err);
        dispatch(showMessage({
          type:"error",
          message:"讀取房屋資料發生錯誤,按下f12確認錯誤,或請你立即連繫客服"
        }))
      }finally{
        setIsLoading(false);
      }
    };
    fetchProperties();
  },[dispatch]);

  // 監聽 currentPage，只要頁碼改變，就把視窗滾到最上面
  useEffect(()=>{
    window.scrollTo({
      top:0,
      behavior:"smooth" //加上 smooth 會有滑順的滾動動畫，UX 更好
    })
  },[currentPage])

  // 改用state 中的 properties 進行過濾
  // 改用state 中的 properties 進行過濾與排序
  const filteredProperties = useMemo(() => {
    // 1. 先把符合條件的資料過濾出來
    const filtered = properties.filter((prop) => {
      // 1. Keyword check
      if (searchFilters.keyword?.trim()) {
        const lowerKeyword = searchFilters.keyword.toLowerCase();
        if (!prop.title.toLowerCase().includes(lowerKeyword) && !prop.address.toLowerCase().includes(lowerKeyword)) {
          return false;
        }
      }

      // 2. Location check
      if (searchFilters.location && searchFilters.location !== "any") {
        // 💡 實戰小技巧：處理「臺」與「台」的字體差異
        // use-tw-zipcode 通常吐出「臺北市」，但資料庫地址常寫「台北市」
        // 所以我們統一把它們都替換成「台」再來比對，確保萬無一失！
        const normalizedLocation = searchFilters.location.replace(/臺/g, '台');
        const normalizedAddress = prop.address.replace(/臺/g, '台');

        // 直接檢查地址有沒有包含選取的縣市字串，沒有就淘汰
        if (!normalizedAddress.includes(normalizedLocation)) {
          return false;
        }
      }

      // 3. Rent check
      if (searchFilters.rent && searchFilters.rent !== "any") {
        const price = prop.price;
        if (searchFilters.rent === "10000-") {
          if (price >= 10000) return false;
        } else if (searchFilters.rent === "10000-20000") {
          if (price < 10000 || price > 20000) return false;
        } else if (searchFilters.rent === "20000-40000") {
          if (price < 20000 || price > 40000) return false;
        } else if (searchFilters.rent === "40000+") {
          if (price <= 40000) return false;
        }
      }

      // 4. Layout check
      if (searchFilters.layout && searchFilters.layout !== "any") {
        if (!prop.layout) return false;
        if (searchFilters.layout === "1" && prop.layout.room !== 1) return false;
        if (searchFilters.layout === "2" && prop.layout.room !== 2) return false;
        if (searchFilters.layout === "3" && prop.layout.room !== 3) return false;
        if (searchFilters.layout === "4+" && prop.layout.room < 4) return false;
      }

      // 5. Other check (Elevator / Parking)
      if (searchFilters.other && searchFilters.other !== "any") {
        if (searchFilters.other === "elevator") {
          if (prop.typeId !== "t4" && prop.typeId !== "t1") return false;
        }
        if (searchFilters.other === "parking") {
          if (!prop.title.includes("車位")) return false;
        }
      }

      return true;
    });

    // 2. 將過濾後的資料進行排序：isfavor 為 true 的排在前面
    return filtered.sort((a, b) => {
      // 在 JavaScript 中，true 轉換成數字是 1，false 是 0
      // 讓 b 減 a，如果 b 是 true(1) 且 a 是 false(0)，結果為 1，b 就會往前排
      const favorA = a.isHot ? 1 : 0;
      const favorB = b.isHot ? 1 : 0;
      return favorB - favorA;
    });

  }, [searchFilters, properties]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  return (
    <>
      <PropertyListHero onSearchChange={handleSearchChange} />

      <section className="property-list-section">
        <div className="property-list-section__inner">
          {
            isLoading?(
              <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>資料載入中，請稍候...</div>
            ):(
              <>
                <PropertyList properties={paginatedProperties} />
                {filteredProperties.length > 0 ? 
                  (<PropertyPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />):
                  (<div style={{ textAlign: "center", padding: "40px", color: "#888" }}>沒有符合條件的房源。</div>)
                }
              </>
            )
          }
        </div>
      </section>
    </>
  );
}

export default PropertyListPage;
