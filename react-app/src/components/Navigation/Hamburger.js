import OpenModalDiv from "./DivModal";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import ItemForm from "../Items/CreateUpdateItemForm";
import { useHistory } from "react-router-dom";

function UserHamburger({ userClass, user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();
  let isCompleted = true;
  if (user) {
    isCompleted = user.address != "None" ? true : false;
  }

  const openMenu = async () => {
    if (showMenu) return;
    setShowMenu(true);
  };

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
    history.push(`/users/${user.id}`);
    closeMenu();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    closeMenu();
    history.push("/items");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
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
          {/* <li>{user?.email}</li> */}
          <li>
            {user?.first_name} {user?.last_name}
          </li>
          <li className="seperator"></li>
          {isCompleted ? (
            <div className="hamburger_buttons">
              <li className="profile_button" onClick={goToProfile}>
                My Profile
              </li>
              <li onClick={closeMenu}>
                <OpenModalDiv
                  onItemClick={closeMenu}
                  className={"profile_button"}
                  buttonText="Sell Your Item"
                  modalComponent={<ItemForm formType="create" />}
                />
              </li>
            </div>
          ) : (
            <li onClick={closeMenu}
            className="hamburger_buttons"
            style={{ display: "flex", flexDirection: "column", marginTop: "10px"}}
            >
              <li className="profile_button" onClick={() => {
                  history.push(`/complete`);
                }}>
                Complete Profile
              </li>
            </li>
          )}
          <li className="logout_button_li">
            <div onClick={handleLogout} className="logout_button">
              Log Out
            </div>
          </li>
        </div>
      </ul>
    </div>
  );
}

export default UserHamburger;
