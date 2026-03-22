import PropertySearchForm from "./PropertySearchForm";


function PropertyListHero({ onSearchChange }) {
  return (
    <div className="property-hero-wrapper">
      <section className="property-hero">
        <div className="property-hero__overlay">
          <div className="property-hero__content">
            <h1 className="property-hero__title">為你篩選合適的房源</h1>
          </div>
        </div>
      </section>

      <div className="property-hero__search-container">
        <PropertySearchForm onSearchChange={onSearchChange} />
      </div>
    </div>
  );
}

export default PropertyListHero;
