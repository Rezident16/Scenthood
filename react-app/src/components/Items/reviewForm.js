import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { updateReviewThunk } from "../../store/item";
import { createReviewThunk } from "../../store/item";
import { fetchOneItem } from "../../store/item";
import { FaStar } from "react-icons/fa";
import "./items.css";
import { getSpecific } from "../../store/user";
import { fetchOneOrder } from "../../store/order";
import { fetchUserOrders } from "../../store/orders";

function ReviewForm({ formAction, itemId, orderId, review }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const { closeModal } = useModal();

  const [rating, setRating] = useState(
    formAction === "edit" ? review.stars : 0
  );
  const [note, setNote] = useState(formAction === "edit" ? review.note : "");
  const [errors, setErrors] = useState({});
  const [hover, setHover] = useState(null);

  let buttonClassname;
  if (
    !note ||
    !rating
  ) {
    buttonClassname = "disabled_signup_login_button";
  } else {
    buttonClassname = "signup_login_button";
  }

  let h4Text =
    formAction === "edit" ? "Update You Review" : "How was your purchase?";

  const onSubmit = async (e) => {
    e.preventDefault();
    let errorsObj = {};

    if (!note) {
      errorsObj.note = "Review is required";
    }
    if (!rating) {
      errorsObj.rating = "Star rating is required";
    }
    setErrors(errorsObj);
    if (!Object.values(errorsObj).length) {
      const formdata = new FormData();
      formdata.append("item_id", itemId);
      formdata.append("order_id", orderId);
      formdata.append("note", note);
      formdata.append("stars", rating);
      if (formAction === "edit") {
        try {
          await dispatch(updateReviewThunk(review.id, formdata));
          await dispatch(fetchOneItem(itemId));
          await dispatch(fetchUserOrders(user.id));
          closeModal();
        } catch (e) {
          return e;
        }
      } else {
        try {
          await dispatch(createReviewThunk(itemId, orderId, formdata));
          await dispatch(fetchUserOrders(user.id));
          await dispatch(fetchOneItem(itemId));
          closeModal();
        } catch (e) {
          return e;
        }
      }
    }
  };
  return (
    <form className="form_label" onSubmit={onSubmit}>
      <div>
        <h4>
          {h4Text}{" "}
          <span aria-hidden="true" className="required">
            *
          </span>
        </h4>
      </div>
      <label className="form_label">
        <textarea
          className="login_signup_textarea review_text_area"
          rows="8"
          placeholder="Leave your review here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      {errors.note && <div>{errors.note}</div>}
      <div>
        <div className="review_rating_div">

        How do you rate it?{" "}
        <span aria-hidden="true" className="required">
          *
        </span>
        </div>
        <div className="stars_review">
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <label>
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  onClick={(e) => setRating(ratingValue)}
                />
                <FaStar
                  size={25}
                  onMouseEnter={(e) => setHover(ratingValue)}
                  onMouseLeave={(e) => setHover(rating)}
                  className="star"
                  color={ratingValue <= (hover || rating) ? "gold" : "gray"}
                />
              </label>
            );
          })}
        </div>
      </div>
      {errors.rating && <div>{errors.rating}</div>}
      <div>
        <button className={buttonClassname} type="submit">
          {formAction !== "edit" ? "Submit" : "Update"}
        </button>
      </div>
    </form>
  );
}
export default ReviewForm;
