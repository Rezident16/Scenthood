import { useState } from "react";

function Filters({ onFilterChange, items }) {
  const [filters, setFilters] = useState({
    min_price: 0,
    max_price: 9999,
    brand: "",
    availability: false,
  });

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
      <div>
        <label>Min. Price: </label>
        <input
          type="number"
          name="min_price"
          value={filters.min_price}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Max. Price: </label>
        <input
          type="number"
          name="max_price"
          value={filters.max_price}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Brand: </label>
        <select name="brand" value={filters.brand} onChange={handleInputChange}>
          <option value="">All</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="availability"
            checked={filters.availability}
            onChange={handleInputChange}
          />
          Available
        </label>
      </div>
    </div>
  );
}

export default Filters;
