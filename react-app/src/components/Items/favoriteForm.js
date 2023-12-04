import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { updateFavoriteThunk } from "../../store/item";
// favId + favorite
import { createFavoriteThunk } from "../../store/item";
// itemId + favorite
import { fetchOneItem } from "../../store/item";
import "./items.css";
import { getSpecific } from "../../store/user";

function FavoriteForm({ formAction, item, favorite }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const { closeModal } = useModal();

  const [comment, setComment] = useState(
    formAction === "edit" ? favorite.note : ""
  );
  const [errors, setErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault()
    let errorsObj = {}
    if (!comment) {
        errorsObj.comment = "Field required"
    }
    setErrors(errorsObj)
    // console.log(errors)

    if (!Object.values(errorsObj).length){
        const formdata = new FormData()
        formdata.append("user_id", user.id)
        formdata.append("product_id", item.id)
        formdata.append("note", comment)


        if (formAction === "edit") {
            await dispatch(updateFavoriteThunk(favorite.id, formdata))
            await dispatch(fetchOneItem(item.id))
            await dispatch(getSpecific(user.id)).then(
                closeModal()
            )
        } else {
            await dispatch(createFavoriteThunk(item.id, formdata))
            await dispatch(fetchOneItem(item.id))
            await dispatch(getSpecific(user.id)).then(
                closeModal()
            )
        }
    }
  }

  return (
    <form onSubmit={onSubmit}>
        <h4>Have this fragrance? Let others know what you think?</h4>
      <label>
        Your Comment <span aria-hidden="true" className="required">*</span>
        <textarea
          rows="8"
          placeholder="Leave your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div>
            {errors.comment && (
                <div>{errors.comment}</div>
            )}
        </div>
      </label>
      <button type="submit">
          {formAction !== "edit" ? "Submit" : "Update"}
        </button>
    </form>
  );
}

export default FavoriteForm
