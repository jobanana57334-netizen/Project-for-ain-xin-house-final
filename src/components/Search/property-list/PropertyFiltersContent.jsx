
function PropertyFiltersContent() {
  return (
    <div className="filters-content">
      <div className="filters-content__group">
        <h3>類型</h3>
        <label><input type="checkbox" /> 套房</label>
        <label><input type="checkbox" /> 整層住家</label>
        <label><input type="checkbox" /> 電梯大樓</label>
      </div>

      <div className="filters-content__group">
        <h3>租金</h3>
        <label><input type="checkbox" /> 10,000 以下</label>
        <label><input type="checkbox" /> 10,000 - 20,000</label>
        <label><input type="checkbox" /> 20,000 - 40,000</label>
      </div>
    </div>
  );
}

export default PropertyFiltersContent;