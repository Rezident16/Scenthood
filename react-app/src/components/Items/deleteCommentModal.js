import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteFavoriteThunk } from "../../store/item";
import { fetchOneItem } from "../../store/item";

function DeleteCommentModal({ fav }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteFav = async (id) => {
    await dispatch(deleteFavoriteThunk(id))
    await dispatch(fetchOneItem(fav.product_id))
    closeModal()
  };

  return (
    <div  className="form_container">
      <h1>Confirm Delete</h1>
      <span id="delete-item-span">
        Are you sure you want to delete your comment?
      </span>
      <button
        style={{ cursor: "pointer" }}
        onClick={() => deleteFav(fav.id)}
        className="signup_login_button"
        
      >
        Yes (Delete comment)
      </button>
      <button
        style={{ cursor: "pointer" }}
        onClick={closeModal}
        className="signup_login_button keep_item"
      >
        No (Keep comment)
      </button>
    </div>
  );
}

export default DeleteCommentModal;
