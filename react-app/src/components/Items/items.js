import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../../store/items";
import ItemTile from "./itemTile";
import "./items.css";
import LoaderComp from "./loader";
import SearchBar from "./SearchBar";
import Filters from './filters'

function ItemsComponent() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [seconds, setSeconds] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const itemsObj = useSelector((state) => state.items);
  let items = Object.values(itemsObj);

  if (currentPage == 0) setCurrentPage(1);


  const [filters, setFilters] = useState({
    min_price: 0,
    max_price: 9999,
    brand: "",
    availability: false,
  });


  let filteredItems = [...items];

  if (filters.min_price || filters.max_price) {
    filteredItems = filteredItems.filter(item => item.price <= filters.max_price && item.price >= filters.min_price);
  }
  if (filters.brand) {
    filteredItems = filteredItems.filter(item => filters.brand.includes(item.brand));
  }
  if (filters.availability) {
    filteredItems = filteredItems.filter(item => item.available_qty > 0);
  }
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentPage)
  // let currentItems = filteredItems
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1)
  };


  let pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    seconds > 0 && setTimeout(() => setSeconds(seconds - 1), 1000);
  }, [seconds]);

  setTimeout(() => {
    setIsLoading(false);
  }, 1200);

  useEffect(() => {
    (async () => {
      await dispatch(fetchItems());
    })();
  }, [dispatch]);

  if (!items.length) return null;
  // if (!currentItems.length) return null;

  return (
    <div className="all_items_container">
      {isLoading ? (
        <div className="countdown">
          <LoaderComp />
        </div>
      ) : (
        <div>
          <div className="items_and_filter_container">
          <Filters onFilterChange={handleFilterChange} items={items} />
          <div className="all_items">
            {currentItems &&
              currentItems.map((item) => (
                <ItemTile
                  className="individual_item"
                  key={item.id}
                  item={item}
                />
              ))}
          </div>
          </div>
          <div className="page_buttons">
            <button
              className={
                currentPage === 1 ? "disabled_previous_page" : "previous_page"
              }
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="pages">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  disabled={number === currentPage}
                  className={
                    number === currentPage
                      ? "disabled_selected_page"
                      : "selected_page"
                  }
                >
                  {number}
                </button>
              ))}
            </div>
            <button
              className={
                currentPage === totalPages ? "disabled_next_page" : "next_page"
              }
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <div className="items_per_page">
              <label>Show per page: </label>
              <select
                className="select_items_per_page"
                value={itemsPerPage}
                onChange={(e) => {
                  
                  setItemsPerPage(e.target.value);
              }
                
              }
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ItemsComponent;
