import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { clearCart } from "../../store/cart";
import CartItem from "./Item";
import LoginFormModal from "../LoginFormModal";

function CartModal() {
  const { setModalContent, closeModal } = useModal();
  const history = useHistory();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [showCart, setShowCart] = useState("cart_modal not_show");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotal();
    showCartModal();
  }, [cart]);

  const calculateTotal = () => {
    let newTotal = 0;
    Object.values(cart).forEach((item) => {
      newTotal += parseFloat((item.price * parseInt(item.qty)).toFixed(2));
    });
    setTotal(parseFloat(newTotal.toFixed(2)));
  };

  const showCartModal = () => {
    setTimeout(() => {
      setShowCart("cart_modal show");
    }, 100);
  };

  const handleCheckout = () => {
    if (!user) {
      setModalContent(<LoginFormModal />);
      return;
    }
    history.push("/checkout");
    closeModal();
  };

  const handleClearCart = (e) => {
    e.preventDefault();
    dispatch(clearCart());
  };

  const items = Object.values(cart);
  const hasItems = items.length > 0;

  return (
    <div className={showCart}>
      <div className="cart_items">
        {hasItems ? (
          items.map((item) => <CartItem item={item} key={item.id}></CartItem>)
        ) : (
          <p>Nothing in cart yet!</p>
        )}
      </div>
      {hasItems && (
        <div className="cart_buttons">
          <div>
            <div className="subtotal">Subtotal ${total.toFixed(2)}</div>
            <div className="cart_button" onClick={handleCheckout}>
              Checkout
            </div>
          </div>
          <div className="cart_button" onClick={handleClearCart}>
            Clear Cart
          </div>
        </div>
      )}
    </div>
  );
}

export default CartModal;
