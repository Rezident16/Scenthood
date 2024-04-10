import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";
import SetUserAddress from '../GoogleMapsApi/index';
import google from './google.png';
import Signup_form from "./manualSignUp";
import './SignupForm.css'
function Signup_main() {
  const baseUrl = process.env.NODE_ENV === "production" ? "https://scenthood.onrender.com" : "http://localhost:5000";

  const { closeModal } = useModal();

  return (
    <div className="form_container_signup">
      <h2>Create account</h2>
      {/* Hide it for now before styling */}
        <Signup_form />
      <p> ----------------- OR ----------------- </p>
      <div className="google_image_container">
      <a href={`${baseUrl}/api/auth/oauth_login`}><img src={google} alt='google' id='google'></img></a>
      </div>
    </div>
  );
}

export default Signup_main;
