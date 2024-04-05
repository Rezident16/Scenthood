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
  SetUserAddress(setAddress, setCity, setState);

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

// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// import { signUp } from "../../store/session";
// import "./SignupForm.css";
// import SetUserAddress from "../GoogleMapsApi/index";
// import { useJsApiLoader } from "@react-google-maps/api";

// function Signup_form() {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [profile_img, setProfileImg] = useState(null);
//   const [description, setDescription] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState([]);
//   const [imageLoading, setImageLoading] = useState(false);
//   const [localImg, setLocalImg] = useState(null);
//   SetUserAddress(setAddress, setCity, setState);

//   const baseUrl =
//     process.env.NODE_ENV === "production"
//       ? "https://scenthood.onrender.com"
//       : "http://localhost:5000";

//   const isLoaded = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//   });

//   const onFileChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       setProfileImg(e.target.files[0]);
//       const imageUrl = URL.createObjectURL(file);
//       setLocalImg(imageUrl);
//     }
//   };

//   const { closeModal } = useModal();
//   let buttonClassname;
//   let tooltip;
//   let tooltiptext;
//   if (
//     !email ||
//     !username ||
//     !firstName ||
//     !lastName ||
//     !address ||
//     !city ||
//     !state ||
//     !profile_img ||
//     !description ||
//     !password ||
//     !confirmPassword
//   ) {
//     buttonClassname = "disabled_signup_login_button tooltip";
//     tooltip = "tooltip";
//     tooltiptext = "tooltiptext";
//   } else {
//     buttonClassname = "signup_login_button";
//     tooltip = "";
//     tooltiptext = "";
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let errorsObj = {};
//     if (!email) errorsObj.email = "Email is required";
//     if (!username) errorsObj.username = "Username is required";
//     if (!firstName) errorsObj.firstName = "First Name is required";
//     if (!lastName) errorsObj.lastName = "Last Name is required";
//     if (!address) errorsObj.address = "Address is required";
//     if (!city) errorsObj.city = "City is required";
//     if (!state) errorsObj.state = "State is required";
//     if (!profile_img) errorsObj.profile_img = "Profile Image is required";
//     if (!description) errorsObj.description = "About you required";
//     if (password !== confirmPassword) {
//       errorsObj.password =
//         "Confirm Password field must be the same as the Password field";
//     }
//     if (password.length < 8) {
//       errorsObj.password = "Password must be at least 8 characters long";
//     }
//     if (description.length < 25)
//       errorsObj.description = "About you needs to be at least 25 characters";

//     if (!Object.values(errorsObj).length) {
//       setImageLoading(true);

//       const data = await dispatch(
//         signUp(
//           username,
//           email,
//           password,
//           firstName,
//           lastName,
//           address,
//           city,
//           state,
//           profile_img,
//           description
//         )
//       );
//       if (data) {
//         let dataErrors = {};
//         data.forEach((error) => {
//           const errorsSplit = error.split(" :");
//           dataErrors[errorsSplit[0]] = errorsSplit[1];
//         });
//         errorsObj = { ...errorsObj, ...dataErrors };
//         setErrors(errorsObj);
//         setImageLoading(false);
//       } else {
//         closeModal();
//       }
//     } else {
//       setErrors(errorsObj);
//     }
//   };

//   return (
//     <div className="form_container_signup">
//       <form
//         enctype="multipart/form-data"
//         className="form_container_signup"
//         onSubmit={handleSubmit}
//       >
//         <h2>Sign Up</h2>
//         <div className="button_field">
//           <div>
//             <div>
//               <label className="form_label signup_form">
//                 <div>
//                   Email
//                   <span aria-hidden="true" className="required">
//                     *
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="login_signup_input signup_input"
//                 />
//                 <span style={{ height: "22px", width: "250px" }}>
//                   {errors.email && (
//                     <span className="errors">{errors.email}</span>
//                   )}
//                 </span>
//               </label>
//               <label className="form_label">
//                 <did>
//                   Username
//                   <span aria-hidden="true" className="required">
//                     *
//                   </span>
//                 </did>
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                   className="login_signup_input signup_input"
//                 />
//                 <div style={{ height: "22px" }}>
//                   {errors.username && (
//                     <span className="errors">{errors.username}</span>
//                   )}
//                 </div>
//               </label>
//               <label className="form_label">
//                 <div>
//                   First Name
//                   <span aria-hidden="true" className="required">
//                     *
//                   </span>
//                 </div>
//                 <input
//                   className="login_signup_input signup_input"
//                   type="text"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   required
//                 />
//                 <span style={{ height: "22px" }}>
//                   {errors.firstName && (
//                     <span className="errors">{errors.firstName}</span>
//                   )}
//                 </span>
//               </label>
//               <label className="form_label">
//                 <div>
//                   Last Name
//                   <span aria-hidden="true" className="required">
//                     *
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   required
//                   className="login_signup_input signup_input"
//                 />
//                 <span style={{ height: "22px" }}>
//                   {errors.lastName && (
//                     <span className="errors">{errors.lastName}</span>
//                   )}
//                 </span>
//               </label>
//             </div>
//           </div>
//           <div>
//             <label className="form_label">
//               <div>
//                 Address
//                 <span aria-hidden="true" className="required">
//                   *
//                 </span>
//               </div>
//               <input
//                 type="text"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 required
//                 id="searchTextField"
//                 className="login_signup_input signup_input"
//               />
//               <span style={{ height: "22px" }}>
//                 {errors.address && (
//                   <span className="errors">{errors.address}</span>
//                 )}
//               </span>
//             </label>
//             <div className="address_city_state">
//               <label className="form_label">
//                 <div>
//                   City
//                   <span aria-hidden="true" className="required">
//                     *
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   required
//                   className="login_signup_input city_input"
//                 />
//                 <span style={{ height: "22px" }}>
//                   {errors.city && <span className="errors">{errors.city}</span>}
//                 </span>
//               </label>
//               <label className="form_label">
//                 <div>
//                   State
//                   <span aria-hidden="true" className="required">
//                     *
//                   </span>
//                 </div>
//                 <select
//                   className="login_signup_input state"
//                   type="text"
//                   value={state}
//                   onChange={(e) => {
//                     setState(e.target.value);
//                   }}
//                   required
//                 >
//                   <option value="" disabled hidden>
//                     State
//                   </option>
//                   <option value="AL">Alabama</option>
//                   <option value="AK">Alaska</option>
//                   <option value="AZ">Arizona</option>
//                   <option value="AR">Arkansas</option>
//                   <option value="CA">California</option>
//                   <option value="CO">Colorado</option>
//                   <option value="CT">Connecticut</option>
//                   <option value="DE">Delaware</option>
//                   <option value="DC">District Of Columbia</option>
//                   <option value="FL">Florida</option>
//                   <option value="GA">Georgia</option>
//                   <option value="HI">Hawaii</option>
//                   <option value="ID">Idaho</option>
//                   <option value="IL">Illinois</option>
//                   <option value="IN">Indiana</option>
//                   <option value="IA">Iowa</option>
//                   <option value="KS">Kansas</option>
//                   <option value="KY">Kentucky</option>
//                   <option value="LA">Louisiana</option>
//                   <option value="ME">Maine</option>
//                   <option value="MD">Maryland</option>
//                   <option value="MA">Massachusetts</option>
//                   <option value="MI">Michigan</option>
//                   <option value="MN">Minnesota</option>
//                   <option value="MS">Mississippi</option>
//                   <option value="MO">Missouri</option>
//                   <option value="MT">Montana</option>
//                   <option value="NE">Nebraska</option>
//                   <option value="NV">Nevada</option>
//                   <option value="NH">New Hampshire</option>
//                   <option value="NJ">New Jersey</option>
//                   <option value="NM">New Mexico</option>
//                   <option value="NY">New York</option>
//                   <option value="NC">North Carolina</option>
//                   <option value="ND">North Dakota</option>
//                   <option value="OH">Ohio</option>
//                   <option value="OK">Oklahoma</option>
//                   <option value="OR">Oregon</option>
//                   <option value="PA">Pennsylvania</option>
//                   <option value="RI">Rhode Island</option>
//                   <option value="SC">South Carolina</option>
//                   <option value="SD">South Dakota</option>
//                   <option value="TN">Tennessee</option>
//                   <option value="TX">Texas</option>
//                   <option value="UT">Utah</option>
//                   <option value="VT">Vermont</option>
//                   <option value="VA">Virginia</option>
//                   <option value="WA">Washington</option>
//                   <option value="WV">West Virginia</option>
//                   <option value="WI">Wisconsin</option>
//                   <option value="WY">Wyoming</option>
//                 </select>
//                 <span style={{ height: "22px" }}>
//                   {errors.state && (
//                     <span className="errors">{errors.state}</span>
//                   )}
//                 </span>
//               </label>
//             </div>
//             <label className="form_label">
//               <div>
//                 About You:
//                 <span aria-hidden="true" className="required">
//                   *
//                 </span>
//               </div>
//               <textarea
//                 className="login_signup_textarea"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//               />
//               <span style={{ height: "22px" }}>
//                 {errors.description && (
//                   <span className="errors">{errors.description}</span>
//                 )}
//               </span>
//             </label>
//           </div>
//         </div>

//         <label className="form_label">
//           <div>
//             Password
//             <span aria-hidden="true" className="required">
//               *
//             </span>
//           </div>
//           <input
//             className="login_signup_input signup_input"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <span style={{ height: "22px", width: "250px" }}>
//             {errors.password && (
//               <span className="errors">{errors.password}</span>
//             )}
//           </span>
//         </label>
//         <label className="form_label">
//           <div>
//             Confirm Password
//             <span aria-hidden="true" className="required">
//               *
//             </span>
//           </div>
//           <input
//             className="login_signup_input signup_input confirm_password"
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </label>
//         <label className="file_input">
//           <div>
//             Upload Image{" "}
//             <span aria-hidden="true" className="required">
//               *
//             </span>
//           </div>
//           <input
//             type="file"
//             name="profile_img"
//             accept=".jpg, .jpeg, .png"
//             onChange={onFileChange}
//             className="image_file_container"
//           />
//           <span style={{ height: "22px" }}>
//             {errors?.profile_img && (
//               <span className="errors">{errors.profile_img}</span>
//             )}
//           </span>
//           <div className="image_placeholder_signup">
//             {localImg && (
//               <div>
//                 <img id="profile_form_img" src={localImg} alt="" />
//               </div>
//             )}
//           </div>
//         </label>
//         <div>
//           <div className={tooltip}>
//             {tooltip != "" ? (
//               <span className={tooltiptext}>
//                 Don't forget to fill out everything
//               </span>
//             ) : null}

//             <button className={buttonClassname} type="submit">
//               Sign Up
//             </button>
//           </div>
//           {imageLoading && <p>Image is Loading...</p>}
//         </div>
//       </form>
//       {/* Hide it for now before styling */}
//       {/* <a href={`${baseUrl}/api/auth/oauth_login`}><button>OAUTH</button></a> */}
//     </div>
//   );
// }

// export default Signup_form;
