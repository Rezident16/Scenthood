import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from "../OpenModalButton";
import SearchBar from "../Items/SearchBar";
import { useDispatch } from "react-redux";
import { fetchItems } from "../../store/items";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(fetchItems());
    })();
  }, [dispatch]);
  const itemsObj = useSelector((state) => state.items);
  const items = Object.values(itemsObj);

  return (
    <ul className="navigation">
      <li className="left_nav">
        {sessionUser ? (
          <NavLink className="left_nav" exact to="/items">
            <img
              className="logo"
              src="https://scenthood.s3.us-east-2.amazonaws.com/113536.png"
            />
            <div className="logo_text_parent">
              <div className="logo_text" style={{ fontWeight: 600 }}>
                Scent
              </div>
              <div className="logo_text" style={{ fontWeight: 500 }}>
                hood
              </div>
            </div>
          </NavLink>
        ) : (
          <NavLink className="left_nav" exact to="/">
            <img
              className="logo"
              src="https://scenthood.s3.us-east-2.amazonaws.com/113536.png"
            />
            <div className="logo_text_parent">
              <div className="logo_text" style={{ fontWeight: 600 }}>
                Scent
              </div>
              <div className="logo_text" style={{ fontWeight: 500 }}>
                hood
              </div>
            </div>
          </NavLink>
        )}
      </li>
      <li>
        <SearchBar className={"search_bar_component"} items={items} />
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
