import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { update } from "../../store/session";
import "./SignupForm.css";
import SetUserAddress from "../GoogleMapsApi/index";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useJsApiLoader } from "@react-google-maps/api";
import { useApiKey } from "../../context/ApiKey";

function SignupFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [username, setUsername] = useState(sessionUser.username);
  const [firstName, setFirstName] = useState(sessionUser.first_name);
  const [lastName, setLastName] = useState(sessionUser.last_name);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [localImg, setLocalImg] = useState(null);
  const [errors, setErrors] = useState([]);
  const [profile_img, setProfileImg] = useState(null);
  const [description, setDescription] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  SetUserAddress(setAddress, setCity, setState);
  const {isGoogleScriptLoaded} = useApiKey();

  const baseUrl =
  process.env.NODE_ENV === "production"
  ? "https://scenthood.onrender.com"
  : "http://localhost:5000";
  
  const isLoaded = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  
  if (!sessionUser || !isLoaded || !isGoogleScriptLoaded) return null
  if (sessionUser.address != "None" && sessionUser.description != "None")
    return <Redirect to="/" />;

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(e.target.files[0]);
      const imageUrl = URL.createObjectURL(file);
      setLocalImg(imageUrl);
    }
  };

  let buttonClassname;
  if (
    !username ||
    !firstName ||
    !lastName ||
    !address ||
    !city ||
    !state ||
    !profile_img ||
    !description
  ) {
    buttonClassname = "disabled_next_button";
  } else {
    buttonClassname = "next_button";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorsObj = {};
    if (!username) errorsObj.username = "Username is required";
    if (!firstName) errorsObj.firstName = "First Name is required";
    if (!lastName) errorsObj.lastName = "Last Name is required";
    if (!address) errorsObj.address = "Address is required";
    if (!city) errorsObj.city = "City is required";
    if (!state) errorsObj.state = "State is required";
    if (!profile_img) errorsObj.profile_img = "Profile Image is required";
    if (!description) errorsObj.description = "About you required";
    if (description.length < 25)
      errorsObj.description = "About you needs to be at least 25 characters";

    if (!Object.values(errorsObj).length) {
      setImageLoading(true);
      const formData = new FormData();
      formData.append("username", username);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("profile_img", profile_img);
      formData.append("description", description);

      const data = await dispatch(update(sessionUser.id, formData));
      if (data) {
        let dataErrors = {};
        data.forEach((error) => {
          const errorsSplit = error.split(" :");
          dataErrors[errorsSplit[0]] = errorsSplit[1];
        });
        errorsObj = { ...errorsObj, ...dataErrors };
        setErrors(errorsObj);
        setImageLoading(false);
      } else {
        history.push("/");
      }
    } else {
      setErrors(errorsObj);
    }
  };

  return (isLoaded && (
      <div className="sign_up_page_container"
    style={{ marginTop: "20px",
    marginBottom: "20px",
  }}
    >
      <form
        enctype="multipart/form-data"
        className=""
        // style={{ width: "430px" }}
        onSubmit={handleSubmit}
      >
        <h2>Complete your profile</h2>
        <div className="">
            <div>
              <label className="">
                <did>
                  Username
                  <span aria-hidden="true" className="required">
                    *
                  </span>
                </did>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className=""
                />
                <span style={{ height: "22px" }}>
                  {errors.username && (
                    <span className="errors">{errors.username}</span>
                  )}
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
                <span style={{ height: "22px" }}>
                  {errors.firstName && (
                    <span className="errors">{errors.firstName}</span>
                  )}
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
                <span style={{ height: "22px" }}>
                  {errors.lastName && (
                    <span className="errors">{errors.lastName}</span>
                  )}
                </span>
              </label>
            </div>

          <div>
            <label className="">
              <div>
                Address
                <span aria-hidden="true" className="required">
                  *
                </span>
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                id="searchTextField"
                className=""
              />
              <span style={{ height: "22px" }}>
                {errors.address && (
                  <span className="errors">{errors.address}</span>
                )}
              </span>
            </label>
            <div className="city_state">
              <label className="">
                <div>
                  City
                  <span aria-hidden="true" className="required">
                    *
                  </span>
                </div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className=""
                />
                <span style={{ height: "22px" }}>
                  {errors.city && <span className="errors">{errors.city}</span>}
                </span>
              </label>
              <label className="">
                <div>
                  State
                  <span aria-hidden="true" className="required">
                    *
                  </span>
                </div>
                <select
                  style={{ width: "100%",
                  height: "25px",
                }}
                  type="text"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                  }}
                  required
                >
                  <option value="" disabled hidden>
                    State
                  </option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District Of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
                <span style={{ height: "22px" }}>
                  {errors.state && (
                    <span className="errors">{errors.state}</span>
                  )}
                </span>
              </label>
            </div>
            <label className="">
              <div>
                About You:
                <span aria-hidden="true" className="required">
                  *
                </span>
              </div>
              <textarea
                className=""
                style={{ height: "150px",
                  width: "100%",
              }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <span style={{ height: "22px" }}>
                {errors.description && (
                  <span className="errors">{errors.description}</span>
                )}
              </span>
            </label>
          </div>
        </div>
        <label className="">
          <div>
            Upload Image{" "}
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <input
            type="file"
            name="profile_img"
            accept=".jpg, .jpeg, .png"
            onChange={onFileChange}
            className="image_file_container"
          />
          <span style={{ height: "22px" }}>
            {errors?.profile_img && (
              <span className="errors">{errors.profile_img}</span>
            )}
          </span>
          <div className="image_placeholder_signup">
            {localImg && (
              <div>
                <img id="profile_form_img" src={localImg} alt="" />
              </div>
            )}
          </div>
        </label>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              className={buttonClassname}
              style={{ width: "70%" }}
              type="submit"
            >
              Sign Up
            </button>
          </div>
          {imageLoading && <p>Image is Loading...</p>}
        </div>
      </form>
    </div>
  ))
}

export default SignupFormPage;
