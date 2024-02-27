import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import CartModal from "../Cart/CartModal";
import LoginSignup from "./LoginSignup";
import UserHamburger from "./Hamburger";

function ProfileButton({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const ulRef = useRef();

  const [qty, setQty] = useState(0);
  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    if (user) setIsUser(true);
    else setIsUser(false);
  }, [user]);

  useEffect(() => {
    const lengthOfACart = Object.values(cart).reduce((accumulator, current) => {
      accumulator = parseInt(accumulator) + parseInt(current.qty);
      return accumulator;
    }, 0);
    setQty(lengthOfACart);
  }, [cart]);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const userClass = isUser ? "" : "hidden";

  let cartClass = user || qty > 0 ? "navigation_buttons_cart" : "hidden";

  return (
    <div id="nav-buttons">
      <OpenModalButton
        className={cartClass}
        buttonText={
          <>
            <i class="fa fa-shopping-cart" aria-hidden="true"></i>{" "}
            {qty == 1 ? `${qty} Item` : `${qty} Items`}
          </>
        }
        onItemClick={closeMenu}
        modalComponent={<CartModal />}
      />
      <UserHamburger userClass={userClass} />

      {!user && (
        <LoginSignup closeMenu={closeMenu} />
      )}
    </div>
  );
}

export default ProfileButton;
