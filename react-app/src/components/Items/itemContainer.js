import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../../store/items";
import ItemTile from "./itemTile";
import "./items.css";
import { useParams } from "react-router-dom";
import { fetchOneItem } from "../../store/item";
import { useHistory } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { addToCart } from "../../store/cart";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/item";
import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "./deleteReviewModal";
import ReviewForm from "./itemform";
import { clearItemState } from "../../store/item";
import FavoriteForm from "./favoriteForm";
import DeleteCommentModal from "./deleteCommentModal";

function ItemContainer() {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const history = useHistory();
  const [Qty, setQty] = useState(1);
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(fetchOneItem(itemId));
  }, [dispatch]);

  const currentUser = useSelector((state) => state.session.user);
  console.log(currentUser);

  const item = useSelector((state) => state.item);

  if (!item) return null;
  if (!item?.reviews) return null;

  const reviews = item.reviews;
  const favorites = item.favorites;
  let userFavorite = false;
  if (favorites) {
    if (favorites.length && currentUser) {
      favorites.forEach((favorite) => {
        if (favorite.user.id == currentUser.id) {
          userFavorite = true;
        }
      });
    }
  }
  let reviewRating = 0;
  let avgReview = 0;
  let reviewText;
  let inStock;
  let stockClassName;
  if (Array.isArray(reviews)) {
    reviews.forEach((review) => {
      reviewRating += review.stars;
    });
    if (reviews.length > 0) {
      avgReview = reviewRating / reviews.length;
    }
    if (reviews.length == 1) {
      reviewText = "review";
    } else {
      reviewText = "reviews";
    }
  }
  const stock = item.available_qty;
  if (stock) {
    if (stock == 0) {
      inStock = "Out of Stock";
      stockClassName = "out_of_stock";
    } else if (stock == 1) {
      inStock = `Only ${stock} item left in stock - order soon`;
      stockClassName = "almost_out_of_stock";
    } else if (stock > 1 && stock <= 20) {
      inStock = `Only ${stock} items left in stock - order soon`;
      stockClassName = "almost_out_of_stock";
    } else {
      inStock = ``;
      stockClassName = "good_stock";
    }
  }

  const options = () => {
    const optionsArr = [];
    if (stock) {
      let highest = 40;
      if (stock < highest) {
        highest = stock;
      }
      for (let i = 1; i <= highest; i++) {
        optionsArr.push(i);
      }
    }
    return optionsArr;
  };

  const AddToCart = async (e) => {
    e.preventDefault();
    dispatch(addToCart(item, Qty));
    closeModal();
  };

  const goBack = async (e) => {
    await dispatch(clearItemState());
    history.push("/items");
  };

  const goToUser = () => {
    history.push(`/users/${item.owner_id}`);
  };

  return (
    <div>
      <div className="go_back_button" onClick={goBack}>
        {"< Back to items"}
      </div>
      {item.name ? (
        <div>
          <div className="item_container">
            <img src={item.preview_img} />
            <div className="item_description">
              <div className="link_to_see_user" onClick={goToUser}>
                Visit the seller {item.owner.username}
              </div>
              <div className="item_container_name">
                {item.name} by {item.brand}
              </div>
              <div>
                {reviews.length ? (
                  <div>
                    <div className="item_review_rating">
                      {[...Array(Math.round(avgReview))].map((star) => {
                        return <FaStar color="gold" />;
                      })}
                      {[...Array(5 - Math.round(avgReview))].map((star) => {
                        return <FaStar color="gray" />;
                      })}
                      <div className="item_review_text">
                        {avgReview.toFixed(2)} from {reviews.length}{" "}
                        {reviewText}
                      </div>
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
              <div>
                <div className="item_container_price">${item.price}</div>
                <div className={stockClassName}>{inStock}</div>
                <div>{inStock ? <div></div> : <div></div>}</div>
                <form onSubmit={AddToCart}>
                  <h3>About this item</h3>
                  <p>{item.description}</p>
                  <div className="add_to_cart">
                    <select
                      value={Qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="quantity"
                    >
                      {options().map((option) => (
                        <option value={option} key={option}>
                          {" "}
                          {option}{" "}
                        </option>
                      ))}
                    </select>

                    <button className="modal_buttons">
                      {" "}
                      Add {Qty} To Cart • ${(item.price * Qty).toFixed(2)}
                    </button>
                  </div>
                </form>
              </div>
              {!userFavorite && currentUser && (
                <div>
                  <h3>Have this fragrance? Let others know what you think</h3>
                  <OpenModalButton
                    className="delete_review_button"
                    buttonText={"Add Your Comment"}
                    modalComponent={
                      <FavoriteForm formAction="create" item={item} />
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            {reviews.length ? (
              <div>
                <h2 className="h2_reviews_text">Customer Reviews</h2>
                {reviews &&
                  reviews.map((review) => (
                    <div className="user_review">
                      <div>
                        <div className="user_review_profile">
                          <img
                            className="item_profile_img"
                            src={review.order.user.profile_img}
                          />
                          <div>{review.order.user.first_name}</div>
                          <div>{review.order.user.last_name}</div>
                        </div>
                        <div>
                          {[...Array(review.stars)].map((star) => {
                            return <FaStar color="gold" />;
                          })}
                          {[...Array(5 - review.stars)].map((star) => {
                            return <FaStar color="gray" />;
                          })}
                        </div>
                      </div>
                      <div>{review.note}</div>
                      {currentUser &&
                        (review.order.user.id === currentUser.id ? (
                          <div>
                            <OpenModalButton
                              className="delete_review_button"
                              buttonText={"Update Review"}
                              modalComponent={
                                <ReviewForm
                                  review={review}
                                  formAction="edit"
                                  itemId={item.id}
                                  orderId={review.order.id}
                                />
                              }
                            />
                            <OpenModalButton
                              className="delete_review_button"
                              buttonText={"Delete Review"}
                              modalComponent={
                                <DeleteReviewModal review={review} />
                              }
                            />
                          </div>
                        ) : null)}
                    </div>
                  ))}
              </div>
            ) : (
              <div>
                <h2 className="h2_reviews_text">
                  There are currently no customer reviews
                </h2>
              </div>
            )}
          </div>
          <div>
            {favorites.length ? (
              <div>
                <h2 className="h2_reviews_text">Community Comments</h2>
                {favorites &&
                  favorites.map((fav) => (
                    <div>
                      <div className="user_review">
                        <div className="user_review_profile">
                          <img
                            className="item_profile_img"
                            src={fav.user.profile_img}
                          />
                          <div>{fav.user.first_name}</div>
                          <div>{fav.user.last_name}</div>
                        </div>
                        <div>{fav.note}</div>
                      </div>
                      {currentUser &&
                      (fav.user_id == currentUser.id ? (
                        <div>
                          <OpenModalButton
                            className="delete_review_button"
                            buttonText={"Edit Comment"}
                            modalComponent={
                              <FavoriteForm
                                favorite={fav}
                                formAction="edit"
                                item={item}
                              />
                            }
                          />
                          <OpenModalButton
                            className="delete_review_button"
                            buttonText={"Delete Comment"}
                            modalComponent={<DeleteCommentModal fav={fav} />}
                          />
                        </div>
                      ) : null)}
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <p>Item Not Found</p>
      )}
    </div>
  );
}

export default ItemContainer;
