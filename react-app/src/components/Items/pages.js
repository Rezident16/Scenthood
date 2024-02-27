import React, { useEffect } from "react";
import "./items.css";
import ItemsPerPage from "./ItemsPerPage";

function Pages({setCurrentPage, currentPage, itemsPerPage, setItemsPerPage, filteredItems}) {

  if (currentPage == 0) setCurrentPage(1);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

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


  return (
    <div>
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
        <ItemsPerPage itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}/>
      </div>
    </div>
  );
}

export default Pages;
