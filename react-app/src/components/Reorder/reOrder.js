import CartModal from "../Cart/CartModal";
import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { addToCart } from "../../store/cart";
import { useDispatch } from "react-redux";
import './reorder.css';

const ReorderButton = (order) => {
  const { closeModal, setModalContent } = useModal();
  const [errors, setErrors] = useState({});
const [className, setClassName] = useState('');
let qty = 0

  useEffect(() => {
    let newErrors = {};
    order.order.order_prodcts.forEach((product) => {
        qty += product.item.available_qty;
      if (product.item.available_qty < product.qty) {
        newErrors = {
          qty: "Some items may be out of stock or have lower inventory than your order. We will try to match the quantity you ordered.",
        };
      }
    });
    if (qty == 0) {
      newErrors = {
        qty: "All items are out of stock",
      };
      setClassName('disabled_reorder_button');
    } else {
        setClassName('reorder_button');
    }
    setErrors(newErrors);
}, [order]);

const dispatch = useDispatch();
    if (!className) return null
  const Reorder = async (e, order) => {
    e.preventDefault();
    order.order.order_prodcts.forEach((product) => {
      let qty = product.qty;

      if (product.item.available_qty > 0) {
        if (product.item.available_qty < product.qty) {
          qty = product.item.available_qty;
        }
        dispatch(addToCart(product.item, qty));
      }
    });
    setModalContent(<CartModal />);
  };

  return (
    <div className="reorder_container">
      {errors.qty && <div className="errors">{errors.qty}</div>}
      <button className={className} disabled={className === 'disabled_reorder_button'} onClick={(e) => Reorder(e, order)}>Reorder</button>
    </div>
  );
};

export default ReorderButton
