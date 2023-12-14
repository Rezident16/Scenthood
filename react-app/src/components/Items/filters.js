import { useState } from "react";

function Filters({ onFilterChange, items }) {
  const [filters, setFilters] = useState({
    min_price: 0,
    max_price: 9999,
    brands: "",
    availability: '',
  });

  console.log(filters)

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFilters({
      ...filters,
      [name]: value,
    });

    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  let brands = [];
  items.forEach((item) => {
    if (!brands.includes(item.brand)) {
      brands.push(item.brand);
    }
  });

  return (
    <div className="filters">
      <div className="item_price_filter">
        <h3>Price Per Item</h3>
        <div className="item_price_min_max_filter">
          <div className="item_price_each">
            <label>Min: </label>
            <input
              type="number"
              name="min_price"
              value={filters.min_price}
              onChange={handleInputChange}
              className="item_price_input_filter"
            />
          </div>
          <div className="item_price_each">
            <label>Max: </label>
            <input
              type="number"
              name="max_price"
              value={filters.max_price}
              onChange={handleInputChange}
              className="item_price_input_filter"
            />
          </div>
        </div>
      </div>
      <div className="item_brand_filter_container">
        <h3>Brand: </h3>
        <select className="item_brand_filter" name="brand" value={filters.brand} onChange={handleInputChange}>
          <option value="">All</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      <div className="availability_filter_container">
        <h3> Availability </h3>
        <label className={filters.availability ? "checked" : "unchecked"}>
          <input
            type="checkbox"
            name="availability"
            className="checkbox_availability"
            checked={filters.availability}
            onChange={handleInputChange}
          />
          In Stock Only
        </label>
      </div>
    </div>
  );
}

export default Filters;
