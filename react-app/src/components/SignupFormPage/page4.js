import React, { useState } from "react";
import "./SignupForm.css";

function Forth_Page({
  password,
  setPassword,
  setConfirmPassword,
  confirmPassword,
  prevPage,
  handleSubmit,
  errors,
}) {
  let buttonClassname;
  if (!password || !confirmPassword || password !== confirmPassword) {
    buttonClassname = "disabled_next_button";
  } else {
    buttonClassname = "next_button";
  }

  const [errorPassword, setErrorPassword] = useState("");
  const [typingPassword, setTypingPassword] = useState(false);
  let timeoutId = null;
  return (
    <div className="sign_up_page_container">
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
            className=""
            type="password"
            value={confirmPassword}
            onChange={(e) => {
                setConfirmPassword(e.target.value);
                setTypingPassword(true);
                if (!e.target.value) setErrorPassword("");
                
                if (timeoutId) clearTimeout(timeoutId);
                
                timeoutId = setTimeout(() => {
                  if (password !== e.target.value && e.target.value && typingPassword) {
                    setErrorPassword("Passwords do not match");
                    setTypingPassword(false);
                  } else {
                    setErrorPassword("");
                  }
                }, 1300);
            }}
            required
          />
          <span style={{ height: "22px", width: "250px" }}>
            {errorPassword && (
              <span className="errors">{errorPassword}</span>
            )}
          </span>
        </label>
      </div>

      <div className="next_previous">
        {
          <button className="next_button" onClick={prevPage}>
            Previous
          </button>
        }
        {
          <button className={buttonClassname} type="submit"
          disabled={buttonClassname === "disabled_next_button" ? true : false}
          >
            Sign Up
          </button>
        }
      </div>
    </div>
  );
}

export default Forth_Page;
