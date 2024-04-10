import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";
import google from "../SignupFormPage/google.png";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();
  const baseUrl = process.env.NODE_ENV === "production" ? "https://scenthood.onrender.com" : "http://localhost:5000";
  let errorsClassname = "errors_login_container_none";
  const demoLogin = async (e) => {
    e.preventDefault();
    await dispatch(login("emo@aa.io", "password"));
    history.push("/items");
    closeModal();
  };

  let buttonClassname;
  if (!email || !password) {
    buttonClassname = "disabled_next_button";
  } else {
    buttonClassname = "next_button";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      let dataErrors = {};
      data.forEach((error) => {
        const oneError = error.split(" : ");
        dataErrors[oneError[0]] = oneError[1];
      });
      setErrors(dataErrors);
      errorsClassname = "errors_login_container";
    } else {
      closeModal();
      errorsClassname = "errors_login_container_none";
    }
  };

  return (
    <div className="form_container_login">
      <h2></h2>
      <form className="sign_up_page_container" onSubmit={handleSubmit}>
        <label className="form_label">
          <div>
            Email{" "}
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
        </label>
        <span style={{ height: "22px" }}>
          {errors.email && <span className="errors">{errors.email}</span>}
        </span>
        <label className="form_label">
          <div>
            Password{" "}
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <input
            className=""
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <span style={{ height: "22px" }}>
          {errors.password && <span className="errors">{errors.password}</span>}
        </span>
        <div className="next_previous">
          <button className={buttonClassname} type="submit">
            Sign In
          </button>
          <button className="next_button" onClick={demoLogin}>
            Sign In as Demo
          </button>
        </div>
      </form>
      <p> ----------------- OR ----------------- </p>
      <div className="google_image_container">
      <a href={`${baseUrl}/api/auth/oauth_login`}><img src={google} alt='google' id='google'></img></a>
      </div>
    </div>
  );
}

export default LoginFormModal;
