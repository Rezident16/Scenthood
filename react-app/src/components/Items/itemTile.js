import { FaStar } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import React from "react";
import "./items.css";

function ItemTile({ item }) {
  const reviews = item.reviews;
  let reviewRating = 0;
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
    history.push(`/items/${item.id}`);
  }

  return (
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
      <div className="item_price_item_tile">${item.price}</div>
    </div>
  );
}

export default ItemTile;
