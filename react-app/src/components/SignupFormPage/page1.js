import React, { useState } from "react";
import "./SignupForm.css";

function First_page({
  email,
  setEmail,
  username,
  setUsername,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  nextPage,
  errors,
}) {
  let buttonClassname;
  let tooltip;
  let tooltiptext;
  if (!email || !username || !firstName || !lastName) {
    buttonClassname = "disabled_signup_login_button tooltip";
    tooltip = "tooltip";
    tooltiptext = "tooltiptext";
  } else {
    buttonClassname = "signup_login_button";
    tooltip = "";
    tooltiptext = "";
  }
  return (
    <div className="button_field">
      <div className="1">
        <label className="form_label signup_form">
          <div>
            Email
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login_signup_input signup_input"
          />
          <span style={{ height: "10px", width: "250px" }}>
            <span className="errors">{errors.email}</span>
          </span>
        </label>
        <label className="form_label">
          <div>
            Username
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login_signup_input signup_input"
          />
          <span style={{ height: "10px", width: "250px" }}>
            <span className="errors">{errors.username}</span>
          </span>
        </label>
        <label className="form_label">
          <div>
            First Name
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <input
            className="login_signup_input signup_input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <span style={{ height: "10px", width: "250px" }}>
            <span className="errors">{errors.firstName}</span>
          </span>
        </label>
        <label className="form_label">
          <div>
            Last Name
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="login_signup_input signup_input"
          />
          <span style={{ height: "10px", width: "250px" }}>
            <span className="errors">{errors.lastName}</span>
          </span>
          <div>
            {" "}
            <div className={tooltip}>
              {tooltip != "" ? (
                <span className={tooltiptext}>
                  Don't forget to fill out everything
                </span>
              ) : null}

              <div></div>
              {
                <button onClick={nextPage} className={buttonClassname}>
                  Next
                </button>
              }
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default First_page;
