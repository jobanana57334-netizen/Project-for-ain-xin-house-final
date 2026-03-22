import PropertyFiltersContent from "./PropertyFiltersContent";

function PropertyFilterSidebar() {
  return (
    <div className="filter-sidebar">
      <h2 className="filter-sidebar__title">篩選條件</h2>
      <PropertyFiltersContent />
    </div>
  );
}

export default PropertyFilterSidebar;