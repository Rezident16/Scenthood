import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/";
import { clearCart } from "../../store/cart";
import React from "react";
import CartItem from "./Item";
import LoginFormModal from "../LoginFormModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function CartModal() {
  const { setModalContent } = useModal();
  const history = useHistory();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.session.user);
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [showCart, setShowCart] = useState("cart_modal not_show");
  const [total, setTotal] = useState(0);

  const items = Object.values(cart);
  useEffect(() => {
    let newTotal = 0;
    items.forEach((item) => {
      newTotal += parseFloat((item.price * parseInt(item.qty)).toFixed(2));
    });
    setTotal(parseFloat(newTotal.toFixed(2)));
  }, [cart]);

  setTimeout(() => {
    setShowCart("cart_modal show");
  }, 100)


  const onClick = async () => {
    if (!user) {
      setModalContent(<LoginFormModal />);
      return;
    } else {
      history.push("/checkout");
      closeModal();
    }
  };

  return (
    <div className={showCart}>
      <div className="cart_items">
        {items.length ? (
          items.map((item) => <CartItem item={item} key={item.id}></CartItem>)
        ) : (
          <p>Nothing in cart yet!</p>
        )}
      </div>
      {items.length ? (

          <div className="cart_buttons">
            <div>
              <div className="subtotal">Subtotal ${total.toFixed(2)}</div>
              <div className="cart_button" onClick={onClick}>
                Checkout
              </div>
            </div>
            <div
              className="cart_button"
              onClick={(e) => {
                e.preventDefault();
                dispatch(clearCart());
              }}
            >
              Clear Cart
            </div>
          </div>

      ) : null}
    </div>
  );
}

export default CartModal;
