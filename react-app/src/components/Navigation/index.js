import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navigation">
      <li className="left_nav">
        <NavLink  className="left_nav" exact to="/">
			<img className='logo' src="https://scenthood.s3.us-east-2.amazonaws.com/113536.png" />
          <div className="logo_text_parent">
            <div className="logo_text" style={{ fontWeight: 600 }}>Scent</div>
            <div className="logo_text" style={{ fontWeight: 500 }}>hood</div>
          </div>
        </NavLink>
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
