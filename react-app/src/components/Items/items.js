import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../../store/items";
import ItemTile from "./itemTile";
import "./items.css";
import LoaderComp from "./loader";
import Filters from './filters'
import Pages from "./pages";
import { filter } from "./filteredItems";
import queredItems from "./queryParams";
import { useLocation } from "react-router-dom";

// Function to use useParams to get the page number and items per page
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

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

  // Get the page number and items per page from the URL
  let query = useQuery();
  let pageNum = query.get("page");
  // default to 1 if no page number is provided
  if (pageNum) setCurrentPage(pageNum);
  let itemNum = query.get("itemsNum");
  // default to 10 if no items per page is provided
  if (itemNum) setItemsPerPage(itemNum);
  

  let filteredItems = filter(items, filters);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
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

  useEffect(() => {
    seconds > 0 && setTimeout(() => setSeconds(seconds - 1), 1000);
  }, [seconds]);

  setTimeout(() => {
    setIsLoading(false);
  }, 1200);

  useEffect(() => {
    (async () => {
      // use this to fetch items by page and item number
      await dispatch(fetchItems(currentPage, itemsPerPage));
      // await dispatch(fetchItems());
    })();
  }, [dispatch, currentPage, itemsPerPage]);

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
          <Pages setCurrentPage={setCurrentPage} currentPage={currentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} filteredItems={filteredItems}/>
        </div>
      )}
    </div>
  );
}
export default ItemsComponent;
