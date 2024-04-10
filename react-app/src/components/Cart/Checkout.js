import { useSelector } from "react-redux";
import LoginFormModal from "../LoginFormModal";
import { useEffect, useState } from "react";
import { submitOrder } from "../../store/cart";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { fetchLoadCart } from "../../store/cart";
import { getSpecific } from "../../store/user";
import CartItemTile from "./CartItemTile";
import { fetchUpdateItem } from "../../store/item";
import "./Cart.css";
import SetUserAddress from "../GoogleMapsApi";

function Checkout() {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.session.user);
  let isCompleted = true

  if (user) {
    isCompleted = user.address != 'None' ? true : false;
  }
  // isCompleted = user.address != 'None' ? true : false;
  const history = useHistory();
  const { setModalContent } = useModal();
  const dispatch = useDispatch();

  const items = Object.values(cart);

  let total = 0;
  items.forEach((item) => {
    total += item.price * item.qty;
  });

  if (!isCompleted) {
    history.push("/complete");
  }

  const [address, setAddress] = useState(user ? `${user.address}` : "");
  const [city, setCity] = useState(user ? `${user.city}` : "");
  const [state, setState] = useState(user ? `${user.state}` : "");
  const [errors, setErrors] = useState({});
  SetUserAddress(setAddress, setCity, setState);

  let buttonClassname;
  if (!city || !state || !address) {
    buttonClassname = "disabled_signup_login_button";
  } else {
    buttonClassname = "signup_login_button";
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const errorsObj = {};
    if (!city) errorsObj.city = "City is required";
    if (!state) errorsObj.state = "State is required";
    if (!address) errorsObj.address = "Address is required";

    if (!user) {
      setModalContent(<LoginFormModal />);
      return;
    }
    if (!Object.values(errorsObj).length) {
      const order = {
        address: address,
        city: city,
        state: state,
        items: items,
      };
      await dispatch(submitOrder(order));
      for (let item of items) {
        const formData = new FormData();
        formData.append("name", item.name);
        formData.append("brand", item.brand);
        formData.append("description", item.description);
        formData.append("price", item.price);
        formData.append("available_qty", item.available_qty - item.qty);
        formData.append("preview_img", item.preview_img);
        await dispatch(fetchUpdateItem(item.id, formData));
      }
      history.push(`users/${user.id}`);
    } else {
      setErrors(errorsObj);
    }
  };

  return (
    <div className="checkout_container">
      <form className="checkout_form" onSubmit={onSubmit}>
        <div className="checkout_form_inputs">
          <label className="form_label">
            Address
            <input
              id="searchTextField"
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              className="checkout_address_input"
            />
          </label>
          <label className="form_label">
            City
            <input
              type="text"
              onChange={(e) => setCity(e.target.value)}
              value={city}
            />
          </label>
          <label className="form_label">
            State
            <select
              type="text"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
              }}
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
          </label>
        </div>
        <div className="order_total_button">
          <div>Order Total: ${total.toFixed(2)}</div>
          {items.length ? (
            <button className={buttonClassname} type="submit">
              Place Order
            </button>
          ) : null}
        </div>
      </form>

      <div className="checkout_items_tiles">
        {items.map((item) => (
          <CartItemTile item={item} />
        ))}
      </div>
    </div>
  );
}

export default Checkout;
