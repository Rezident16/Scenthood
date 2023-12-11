import { FaStar } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import "./items.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneItem } from "../../store/item";
import { clearState } from "../../store/user";
import OpenModalButton from "../OpenModalButton";
import ItemForm from "./CreateUpdateItemForm";
import DeleteItemModal from "./deleteItem";

function ItemTile({ item }) {
  const reviews = item.reviews;
  let reviewRating = 0;
  const dispatch = useDispatch();
  const currUser = useSelector((state) => state.session.user);
  let visible = false;
  if (currUser) {
    visible = currUser.id == item.owner_id ? true : false;
  }
  reviews.forEach((review) => {
    reviewRating += review.stars;
  });

  let avgReview = 0;
  if (reviews.length > 0) {
    avgReview = reviewRating / reviews.length;
  }
  let reviewText;
  if (reviews.length == 1) {
    reviewText = "review";
  } else {
    reviewText = "reviews";
  }

  const history = useHistory();
  function directToItem() {
    dispatch(clearState());
    history.push(`/items/${item.id}`);
  }

  return (
    <div className="item_tile_outer">

      <div className="item_tile" onClick={directToItem}>
        <img src={item.preview_img} />
        <div>
          <div className="item_name">{item.name}</div>
          <div className="item_brand">{item.brand}</div>
        </div>
        <div>
          {reviews.length ? (
            <div>
              <div>
                {[...Array(Math.round(avgReview))].map((star) => {
                  return <FaStar color="gold" />;
                })}
                {[...Array(5 - Math.round(avgReview))].map((star) => {
                  return <FaStar color="gray" />;
                })}
              </div>
              <div>
                {avgReview.toFixed(2)} from {reviews.length} {reviewText}
              </div>
            </div>
          ) : (
            <div>
              <div>
                {" "}
                {[...Array(5 - Math.round(avgReview))].map((star) => {
                  return <FaStar color="gray" />;
                })}
              </div>
              <div>No reviews yet</div>
            </div>
          )}
        </div>
        <div className="item_price_item_tile">${item.price.toFixed(2)}</div>
        <div style={{ height: "20px" }}></div>
      </div>
      <div
        className="icons_delete_update"
        style={{ height: "20px", zIndex: "1" }}
      >
        {visible ? (
          <div className="item_review_buttons user_item_change_buttons">
            <OpenModalButton
              buttonText={""}
              modalComponent={<ItemForm item={item} formType="edit" />}
              className={"fas fa-edit"}
            />
            <OpenModalButton
              buttonText={""}
              modalComponent={<DeleteItemModal item={item} />}
              className={"fa-solid fa-trash"}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ItemTile;
