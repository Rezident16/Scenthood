import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCartQty, removeFromCart } from "../../store/cart";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const [Qty, setQty] = useState();

  const generateOptions = (stock) => {
    const optionsArr = [];
    const highest = Math.min(stock, 40);
    for (let i = 1; i <= highest; i++) {
      optionsArr.push(i);
    }
    return optionsArr;
  };

  const handleSelectChange = (e) => {
    if (e.target.value === "remove") {
      dispatch(removeFromCart(item));
    } else {
      dispatch(updateCartQty(item, e.target.value));
    }
  };

  useEffect(() => {
    setQty(item.qty);
  }, [item]);

  return (
    <div className="individual_cart_item_container">
      <img src={item.preview_img} alt="" />
      <div className="item_name">{item.name}</div>
      <div className="price_qty">
        <select
          className="qty"
          onChange={handleSelectChange}
          value={Qty}
        >
          <option value="remove">Remove</option>
          {generateOptions(item.available_qty).map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
        <div>${(item.price * Qty).toFixed(2)}</div>
      </div>
    </div>
  );
}

export default CartItem;
