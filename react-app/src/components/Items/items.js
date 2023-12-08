import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../../store/items";
import ItemTile from "./itemTile";
import "./items.css";
import LoaderComp from "./loader";

function ItemsComponent() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [seconds, setSeconds] = useState(1);

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

  const itemsObj = useSelector((state) => state.items);
  const items = Object.values(itemsObj);

  if (!items) return null;
  return (
    <div>
      {isLoading ? (
        <div  className="countdown">
            <LoaderComp />

           </div> 
      ) : (
        <div className="all_items">
          {items &&
            items
              .sort((a, b) => b.reviews.length - a.reviews.length)
              .map((item) => (
                <ItemTile
                  className="individual_item"
                  key={item.id}
                  item={item}
                />
              ))}
        </div>
      )}
    </div>
  );
}
export default ItemsComponent;
