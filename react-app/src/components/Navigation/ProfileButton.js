import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import CartModal from "../Cart/CartModal";
import { Link } from "react-router-dom";
import OpenModalDiv from "./DivModal";
import ItemForm from "../Items/CreateUpdateItemForm";
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

  const [qty, setQty] = useState(0);
  const cart = useSelector((state) => state.cart);
  const openMenu = async () => {
    if (showMenu) return;
    setShowMenu(true);
  };
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

  const goToProfile = () => {
    history.push(`/users/${user.id}`)
  }

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push('/items')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  const userClass = isUser ? "" : "hidden";

  return (
    <div id="nav-buttons">
      <OpenModalButton
      className={'navigation_buttons_cart'}
        buttonText={
          <>
            <i class="fa fa-shopping-cart" aria-hidden="true"></i>{" "}
            {qty == 1 ? `${qty} Item` : `${qty} Items`}
          </>
        }
        onItemClick={closeMenu}
        modalComponent={<CartModal />}
      />

      <div className={userClass}>
        <button id="hamburger" onClick={openMenu}>
          <i
            class="fa fa-bars"
            aria-hidden="true"
            style={{ fontSize: "30px", color: "black" }}
          />
        </button>
        <ul className={ulClassName} ref={ulRef}>
          <div className="profile_text">
          <li>{user?.username}</li>
          <li>{user?.email}</li>
          <li>{user?.first_name} {user?.last_name}</li>
          <li className="seperator"></li>
          <li className="profile_button" onClick={goToProfile}>
              My Profile
          </li>
          <li>
            <OpenModalDiv
            className={'profile_button'}
              buttonText="Sell Your Item"
              onItemClick={closeMenu}
              modalComponent={<ItemForm formType='create' />}
            />
          </li>
          <li>
            <button onClick={handleLogout} className="logout_button">
              Log Out
            </button>
          </li>

          </div>
        </ul>
      </div>

      {!user && (
        <div className="login_signup_buttons">
          <OpenModalButton
          className={'navigation_buttons'}
            buttonText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />

          <OpenModalButton
                    className={'navigation_buttons'}
            buttonText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
