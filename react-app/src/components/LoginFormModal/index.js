import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  let errorsClassname = "errors_login_container_none";
  const demoLogin = async (e) => {
    e.preventDefault();
    await dispatch(login("emo@aa.io", "password"));
    history.push("/items");
    closeModal();
  };

  let buttonClassname;
  if (
    !email ||
    !password
  ) {
    buttonClassname = "disabled_signup_login_button";
  } else {
    buttonClassname = "signup_login_button";
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
    <form className="form_container" onSubmit={handleSubmit}>
      <h2>Log In</h2>
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
          className="login_input"
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
          className="login_input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <span style={{ height: "22px" }}>
        {errors.password && <span className="errors">{errors.password}</span>}
      </span>
      <button className={buttonClassname} type="submit">
        Log In
      </button>
      <div className="demo_login" onClick={demoLogin}>
        Demo User
      </div>
    </form>
  );
}

export default LoginFormModal;
