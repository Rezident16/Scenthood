import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteReviewThunk } from "../../store/item";
import { fetchOneItem } from "../../store/item";
import { fetchUserOrders } from "../../store/orders";

function DeleteReviewModal({ review }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const deleteReview = async (id) => {
    await dispatch(deleteReviewThunk(id))
    await dispatch(fetchOneItem(review.item_id))
    await dispatch(fetchUserOrders(review.order.user.id))
    closeModal()
  };

  return (
    <div  className="form_container">
      <h1>Confirm Delete</h1>
      <span id="delete-item-span">
        Are you sure you want to delete your review?
      </span>
      <button
        style={{ cursor: "pointer" }}
        onClick={() => deleteReview(review.id)}
        className="signup_login_button"
      >
        Yes (Delete review)
      </button>
      <button
        style={{ cursor: "pointer" }}
        onClick={closeModal}
        className="signup_login_button keep_item"
      >
        No (Keep Review)
      </button>
    </div>
  );
}

export default DeleteReviewModal;
