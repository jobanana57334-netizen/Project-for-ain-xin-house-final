import { useState } from "react";
import { Search, RotateCcw, Check, ChevronDown } from "lucide-react";
import { cities } from "use-tw-zipcode";

function PropertySearchForm({ onSearchChange }) {
  const defaultFilters = {
    keyword: "",
    location: "any",
    rent: "any",
    layout: "any",
    other: "any",
  };

  const [localFilters, setLocalFilters] = useState(defaultFilters);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    // Immediately trigger search for select fields
    if (onSearchChange && field !== "keyword") {
      onSearchChange(newFilters);
    }
  };

  const handleKeywordChange = (e) => {
    setLocalFilters({ ...localFilters, keyword: e.target.value });
  };

  const handleKeywordSearch = () => {
    if (onSearchChange) {
      onSearchChange(localFilters);
    }
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
    if (onSearchChange) {
      onSearchChange(defaultFilters);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleKeywordSearch();
    }
  };

  return (
    <div className="property-search">
      <div className="property-search__grid">
        <div className="property-search__field">
          <label>地點</label>
          <div className="property-search__select-wrapper">
            <select 
              className="property-search__select" 
              value={localFilters.location} 
              onChange={(e) => handleFilterChange("location", e.target.value)}
            >
              {/* 預設選項可以改成「不限」或「全台灣」 */}
              <option value="any">全台灣</option> 
              
              {/* 跑迴圈把 use-tw-zipcode 的 cities 陣列印出來 */}
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="property-search__select-icon" />
          </div>
        </div>

        <div className="property-search__field">
          <label>租金</label>
          <div className="property-search__select-wrapper">
            <select className="property-search__select" value={localFilters.rent} onChange={(e) => handleFilterChange("rent", e.target.value)}>
              <option value="any">不限</option>
              <option value="10000-">10,000 以下</option>
              <option value="10000-20000">10,000 - 20,000</option>
              <option value="20000-40000">20,000 - 40,000</option>
              <option value="40000+">$40,000 以上</option>
            </select>
            <ChevronDown size={14} className="property-search__select-icon" />
          </div>
        </div>

        <div className="property-search__field">
          <label>格局</label>
          <div className="property-search__select-wrapper">
            <select className="property-search__select" value={localFilters.layout} onChange={(e) => handleFilterChange("layout", e.target.value)}>
              <option value="any">請選擇物件格局</option>
              <option value="1">1 房</option>
              <option value="2">2 房</option>
              <option value="3">3 房</option>
              <option value="4+">4 房以上</option>
            </select>
            <ChevronDown size={14} className="property-search__select-icon" />
          </div>
        </div>

        <div className="property-search__field">
          <label>其他</label>
          <div className="property-search__select-wrapper">
            <select className="property-search__select" value={localFilters.other} onChange={(e) => handleFilterChange("other", e.target.value)}>
              <option value="any">不限</option>
              <option value="elevator">有電梯</option>
              <option value="parking">有車位</option>
            </select>
            <ChevronDown size={14} className="property-search__select-icon" />
          </div>
        </div>

        <div className="property-search__input-group">
          <input type="text" placeholder="輸入關鍵字搜尋..." value={localFilters.keyword} onChange={handleKeywordChange} onKeyDown={handleKeyDown} />
          <button className="property-search__btn" type="button" onClick={handleKeywordSearch}>
            搜尋 <Search size={16} />
          </button>
        </div>
      </div>

      <div className="property-search__actions">
        <button className="property-search__action-btn property-search__action-btn--reset" type="button" onClick={handleReset}>
          重設條件 <RotateCcw size={14} />
        </button>
        <button className="property-search__action-btn property-search__action-btn--save" type="button">
          儲存設定 <Check size={14} />
        </button>
      </div>
    </div>
  );
}

export default PropertySearchForm;
