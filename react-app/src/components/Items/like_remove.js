import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { updateFavoriteThunk } from "../../store/item";
// favId + favorite
import { createFavoriteThunk } from "../../store/item";
import { deleteFavoriteThunk } from "../../store/item";
// itemId + favorite
import { fetchOneItem } from "../../store/item";
import "./items.css";
import { getSpecific } from "../../store/user";

export const likeItem = async (dispatch, item, currentUser) => {

    const formdata = new FormData();
    formdata.append("user_id", currentUser.id);
    formdata.append("product_id", item.id);
    // formdata.append("note", "like like like like like like like");

    await dispatch(createFavoriteThunk(item.id, formdata));
    await dispatch(fetchOneItem(item.id));
}

export const unlikeItem = async (dispatch, fav) => { 

    await dispatch(deleteFavoriteThunk(fav.id))
    await dispatch(fetchOneItem(fav.product_id))
    await dispatch(getSpecific(fav.user_id))
}
