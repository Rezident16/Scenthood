import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../../store/items";
import ItemTile from "./itemTile";
import './items.css'

function ItemsComponent () {
    const dispatch = useDispatch()
    
    
    useEffect(() => {
        (async () => {
            await dispatch(fetchItems());
        })();
    }, [dispatch]);

    const itemsObj = useSelector(state => state.items)
    const items = Object.values(itemsObj)

    if (!items) return null
    return (
        <div className="all_items">
            {items && items.sort((a,b) => b.reviews.length - a.reviews.length).map(item => (
                <ItemTile className="individual_item" key={item.id} item={item}/>
            ))}
        </div>
    )
}
export default ItemsComponent
