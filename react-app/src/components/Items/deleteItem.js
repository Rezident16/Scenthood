import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchDeleteItem } from "../../store/items";
import { fetchItems } from "../../store/items";
import { getSpecific } from "../../store/user";
import { removeFromCart } from "../../store/cart";
import { fetchLoadCart } from "../../store/cart";

function DeleteItemModal({ item }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const deleteItem = async (item) => {
    await dispatch(fetchDeleteItem(item.id))
    await dispatch(fetchItems())
    await dispatch(getSpecific(item.owner_id))
    await dispatch(removeFromCart(item))
    await dispatch(fetchLoadCart())
    closeModal()
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <span id="delete-item-span">
        Are you sure you want to delete your item?
      </span>
      <button
        style={{ cursor: "pointer" }}
        onClick={() => deleteItem(item)}
      >
        Yes (Delete Item)
      </button>
      <button
        style={{ cursor: "pointer" }}
        onClick={closeModal}
      >
        No (Keep Item)
      </button>
    </div>
  );
}

export default DeleteItemModal;
