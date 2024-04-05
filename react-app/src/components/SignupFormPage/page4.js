import React, { useState } from "react";
import "./SignupForm.css";

function Forth_Page({
    password,
    setPassword,
    setConfirmPassword,
    confirmPassword,
  prevPage,
  handleSubmit,
  errors
}) {
  let buttonClassname;
  let tooltip;
  let tooltiptext;
  if (!password || !confirmPassword) {
    buttonClassname = "disabled_signup_login_button tooltip";
    tooltip = "tooltip";
    tooltiptext = "tooltiptext";
  } else {
    buttonClassname = "signup_login_button";
    tooltip = "";
    tooltiptext = "";
  }

  return (
    <div className="">
        <div className="">
          <label className="form_label">
            <div>
              Password
              <span aria-hidden="true" className="required">
                *
              </span>
            </div>
            <input
              className="login_signup_input signup_input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span style={{ height: "22px", width: "250px" }}>
              {errors.password && (
                <span className="errors">{errors.password}</span>
              )}
            </span>
          </label>
          <label className="form_label">
            <div>
              Confirm Password
              <span aria-hidden="true" className="required">
                *
              </span>
            </div>
            <input
              className="login_signup_input signup_input confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
        <div className={tooltip}>
            {tooltip != "" ? (
              <span className={tooltiptext}>
                Don't forget to fill out everything
              </span>
            ) : null}

            {<button onClick={prevPage}>Previous</button>}
            {<button className={buttonClassname} type="submit">
               Sign Up
             </button>}
          </div>
        </div>
    </div>
  );
}

export default Forth_Page;
