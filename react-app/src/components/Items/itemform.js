import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { updateReviewThunk } from "../../store/item";
import { createReviewThunk } from "../../store/item";
import { fetchOneItem } from "../../store/item";
import { FaStar } from "react-icons/fa";
import "./items.css";

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

  let h4Text = formAction === "edit" ? "Update You Review" : "Leave your comment"

  const onSubmit = async (e) => {
    e.preventDefault();
    let errorsObj = {};

    if (!note) {
      errorsObj.note = "Review is required";
    }
    if (!rating) {
      errorsObj.rating = "Star rating is required";
    }
    setErrors(errorsObj)
    if (!Object.values(errorsObj).length) {
      const formdata = new FormData();
      formdata.append("item_id", itemId);
      formdata.append("order_id", orderId);
      formdata.append("note", note);
      formdata.append("stars", rating);
      if (formAction === "edit") {
        try {
          await dispatch(updateReviewThunk(review.id, formdata))
          await dispatch(fetchOneItem(itemId))
          history.push(`/items/${itemId}`);
          closeModal();
        } catch (e) {
          //   const errors = await e.json();
          //   setErrors(errors.errors);
          console.log(e);
        }
      } else {
        try {
          await dispatch(createReviewThunk(itemId, orderId, formdata));
          history.push(`/items/${itemId}`);
          closeModal();
        } catch (e) {
          console.log(e);
          //   const errors = await e.json();
          //   setErrors(errors.errors);
        }
      }
    }
  };
  return (
    <form onSubmit={onSubmit}>
        <h4>{h4Text}</h4>
      <label>
        Review  <span aria-hidden="true" className="required">*</span>
        <textarea
          rows="8"
          placeholder="Leave your review here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      {errors.note && (
        <div>{errors.note}</div>
      )}
      <div>
        How do you rate it?  <span aria-hidden="true" className="required">*</span>
        <div>
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
      {errors.rating && (
        <div>{errors.rating}</div>
      )}
      <div>
        <button type="submit">
          {formAction !== "edit" ? "Submit" : "Update"}
        </button>
      </div>
    </form>
  );
}
export default ReviewForm;
