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

  const [total, setTotal] = useState(0);

  const items = Object.values(cart);
  useEffect(() => {
    let newTotal = 0;
    items.forEach((item) => {
      newTotal += parseFloat((item.price * parseInt(item.qty)).toFixed(2));
    });
    setTotal(parseFloat(newTotal.toFixed(2)));
  }, [cart]);

  const onClick = async () => {
    if (!user) {
      setModalContent(<LoginFormModal />);
      return;
    } else {
      history.push('/checkout');
      closeModal()
    }
  };

  return (
    <div className="cart_modal">
      <div className="all_cart_items">
        {items.length ? (
          items.map((item) => <CartItem item={item} key={item.id}></CartItem>)
        ) : (
          <p>Nothing in cart yet!</p>
        )}
      </div>
      <div className="cart_buttons">
        {total > 0 && (
          <div>
            <div>Subtotal ${total}</div>
            <div onClick={onClick}>Checkout</div>
          </div>
        )}

        {items.length ? (
          <button
            className="modal_buttons"
            onClick={(e) => {
              e.preventDefault();
              dispatch(clearCart());
            }}
          >
            Clear Cart
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default CartModal;
