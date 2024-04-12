import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../../store/session";
import "./SignupForm.css";
import SetUserAddress from "../GoogleMapsApi/index";
import First_page from "./page1";
import Second_page from "./page2";
import Third_page from "./page3";
import Forth_Page from "./page4";
import { useHistory } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";

function Signup_form() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [profile_img, setProfileImg] = useState(null);
  const [description, setDescription] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [localImg, setLocalImg] = useState(null);
//   SetUserAddress(setAddress, setCity, setState);

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://scenthood.onrender.com"
      : "http://localhost:5000";

const isLoaded = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  let buttonClassname;
  let tooltip;
  let tooltiptext;
  if (
    !email ||
    !username ||
    !firstName ||
    !lastName ||
    !address ||
    !city ||
    !state ||
    !profile_img ||
    !description ||
    !password ||
    !confirmPassword
  ) {
    buttonClassname = "disabled_signup_login_button tooltip";
    tooltip = "tooltip";
    tooltiptext = "tooltiptext";
  } else {
    buttonClassname = "signup_login_button";
    tooltip = "";
    tooltiptext = "";
  }

  const [page, setPage] = useState(1);

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const handleSubmit = async (e) => {
    console.log('clicked submit')
    e.preventDefault();
    let errorsObj = {};
    if (!email) errorsObj.email = "Email is required";
    if (!username) errorsObj.username = "Username is required";
    if (!firstName) errorsObj.firstName = "First Name is required";
    if (!lastName) errorsObj.lastName = "Last Name is required";
    if (!address) errorsObj.address = "Address is required";
    if (!city) errorsObj.city = "City is required";
    if (!state) errorsObj.state = "State is required";
    if (!profile_img) errorsObj.profile_img = "Profile Image is required";
    if (!description) errorsObj.description = "About you required";
    if (password !== confirmPassword) {
      errorsObj.password =
        "Confirm Password field must be the same as the Password field";
    }
    if (password.length < 8) {
      errorsObj.password = "Password must be at least 8 characters long";
    }
    if (description.length < 25)
      errorsObj.description = "About you needs to be at least 25 characters";

    if (!Object.values(errorsObj).length) {
      setImageLoading(true);

      const data = await dispatch(
        signUp(
          username,
          email,
          password,
          firstName,
          lastName,
          address,
          city,
          state,
          profile_img,
          description
        )
      );
      if (data) {
        let dataErrors = {};
        data.forEach((error) => {
          const errorsSplit = error.split(" :");
          dataErrors[errorsSplit[0]] = errorsSplit[1];
        });
        errorsObj = { ...errorsObj, ...dataErrors };
        setErrors(errorsObj);
        setImageLoading(false);
        if (errorsObj.email || errorsObj.username || errorsObj.firstName || errorsObj.lastName) {
            setPage(1);
        } else if (errorsObj.address || errorsObj.city || errorsObj.state) {
            setPage(2);
        } else if (errorsObj.profile_img || errorsObj.description) {
            setPage(3);
        } else {
            setPage(4);
        }
      } else {
        history.push("/items");
      }
    } else {
      setErrors(errorsObj);
    }
  };

  return (
    <div className="">
      <form enctype="multipart/form-data" className="" onSubmit={handleSubmit}>
        {page === 1 && (
          <First_page
            email={email}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            nextPage={nextPage}
            errors={errors}
          />
        )}

        {page === 2 && (
          <Second_page
            address={address}
            city={city}
            state={state}
            setAddress={setAddress}
            setCity={setCity}
            setState={setState}
            errors={errors}
            page={page}
            setPage={setPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        )}

        {page === 3 && (
          <Third_page
            description={description}
            profile_img={profile_img}
            setProfileImg={setProfileImg}
            setDescription={setDescription}
            nextPage={nextPage}
            prevPage={prevPage}
            errors={errors}
          />
        )}

        {page === 4 && (
          <Forth_Page
            password={password}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            confirmPassword={confirmPassword}
            prevPage={prevPage}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        )}
      </form>
    </div>
  );
}

export default Signup_form;
