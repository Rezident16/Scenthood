import React, { useState } from "react";
import "./SignupForm.css";
import SetUserAddress from "../GoogleMapsApi/index";

function Second_page({
  address,
  city,
  state,
  setAddress,
  setCity,
  setState,
  nextPage,
  prevPage,
  errors,
  page,
}) {
  let buttonClassname;
  let tooltip;
  let tooltiptext;
  SetUserAddress(setAddress, setCity, setState);
  if (!address || !city || !state) {
    buttonClassname = "disabled_next_button";
    tooltip = "tooltip";
    tooltiptext = "tooltiptext";
  } else {
    buttonClassname = "next_button";
    tooltip = "";
    tooltiptext = "";
  }

  console.log(page);
  return (
    <div className="sign_up_page_container">
        <div className="2">
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
            <span style={{ height: "10px" }}>
              <span className="errors">{errors.address}</span>
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
                className="login_signup_input city_input"
              />
              <span style={{ height: "10px" }}></span>
            </label>
            <label className="">
              <div>
                State
                <span aria-hidden="true" className="required">
                  *
                </span>
              </div>
              <select
                className="login_signup_input state"
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
              <span style={{ height: "10px" }}></span>
            </label>
          </div>
        </div>
      
      <div className="next_previous">
        {
          <button className="next_button" onClick={prevPage}>
            Previous
          </button>
        }
        {
          <button onClick={nextPage} className={buttonClassname}>
            Next
          </button>
        }
      </div>
    </div>
  );
}

export default Second_page;
