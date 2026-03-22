
import PropertyListItem from './PropertyListItem';

function PropertyList({ properties }) {

  return (
    <div className="property-list">
      {properties.map(property => {
        return (
          <PropertyListItem 
            key={property.id} 
            // 把比對出來的 isfavor 結果，塞進 property 物件裡傳給子元件
            property={{ ...property}} 
          />
        );
      })}
    </div>
  );
}

export default PropertyList;