import React, { useState } from "react";
import { useContext } from "react";
const SearchBarClass = React.createContext();

function SearchBarProvider({ children }) {
  const [searchClass, setSearchClass ] = useState("search_bar_component");

  return (
    <SearchBarClass.Provider value={{searchClass, setSearchClass}}>
      {children}
    </SearchBarClass.Provider>
  );
}

export const useSearchBar = () => useContext(SearchBarClass);

export default SearchBarProvider;
