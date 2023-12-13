import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

function SearchBar({ items, className }) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef();

  const history = useHistory();

  const searchBarClassName = searchTerm ? "search_terms" : "empty_search_bar";
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      if (!event.target.classList.contains("search_term_target")) {
        setSearchTerm("");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={className}>
      <input
        ref={searchRef}
        type="text"
        placeholder="Search by name or brand..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search_bar"
      />
      <div className={searchBarClassName}>
        {searchTerm &&
          filteredItems
            .map((item) => (
              <div
                onClick={() => {
                  history.push(`/items/${item.id}`);
                  setSearchTerm("");
                }}
                className="search_term_result search_term_target"
                key={item.id}
              >
                <img
                  className="search_term_img search_term_target"
                  src={item.preview_img}
                  alt={item.name}
                />
                <div className="item_name_brand_search search_term_target">
                  <h4 className="search_term_target">{item.name}</h4>
                  <p className="search_term_target">{item.brand}</p>
                </div>
              </div>
            ))
            .slice(0, 5)}
      </div>
    </div>
  );
}

export default SearchBar;
