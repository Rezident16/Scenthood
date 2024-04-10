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
  if (!email || !username || !firstName || !lastName) {
    buttonClassname = "disabled_next_button";
  } else {
    buttonClassname = "next_button";
  }
  return (
      <div className="sign_up_page_container">
        <label>
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
            className=""
          />
          <span style={{ height: "10px", width: "250px" }}>
            <span className="errors">{errors.email}</span>
          </span>
        </label>
        <label className="">
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
            className=""
          />
          <span style={{ height: "10px", width: "250px" }}>
            <span className="errors">{errors.username}</span>
          </span>
        </label>
        <label className="">
          <div>
            First Name
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <input
            className=""
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <span style={{ height: "10px", width: "250px" }}>
            <span className="errors">{errors.firstName}</span>
          </span>
        </label>
        <label className="">
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
            className=""
          />
          <span style={{ height: "10px", width: "250px" }}>
            <span className="errors">{errors.lastName}</span>
          </span>
          <div>
                <button onClick={nextPage} 
                className={buttonClassname}
                disabled={buttonClassname === "disabled_next_button" ? true : false}
                >
                  Continue
                </button>
          </div>
        </label>
      </div>
  );
}

export default First_page;
