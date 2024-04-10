import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./items.css";
import { useParams } from "react-router-dom";
import { fetchOneItem } from "../../store/item";
import { useHistory } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { addToCart } from "../../store/cart";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "./deleteReviewModal";
import ReviewForm from "./reviewForm";
import { clearItemState } from "../../store/item";
import { clearState } from "../../store/user";
import LoaderComp from "./loader";
import ItemForm from "./CreateUpdateItemForm";
import DeleteItemModal from "./deleteItem";
import OpenModalDiv from "../Navigation/DivModal";
import { likeItem, unlikeItem } from "./like_remove";
import CartModal from "../Cart/CartModal";

function ItemContainer() {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const history = useHistory();
  const [Qty, setQty] = useState(1);
  const { closeModal, setModalContent } = useModal();
  const [isLoading, setIsLoading] = useState(true);

  const [seconds, setSeconds] = useState(1);


  useEffect(() => {
    seconds > 0 && setTimeout(() => setSeconds(seconds - 1), 1000);
  }, [seconds]);

  setTimeout(() => {
    setIsLoading(false);
  }, 1200);

  useEffect(async () => {
    await dispatch(clearState());
    await dispatch(fetchOneItem(itemId));
  }, [dispatch, itemId]);

  const currentUser = useSelector((state) => state.session.user);

  const item = useSelector((state) => state.item);

  let visible = false;
  if (currentUser) {
    visible = currentUser.id == item.owner_id ? true : false;
  }

  if (!item) return null;
  if (!item?.reviews) return null;

  const reviews = item.reviews;
  const favorites = item.favorites;
  let userFavorite = false;
  let favoriteItem = null;
  if (favorites) {
    if (favorites.length && currentUser) {
      favorites.forEach((favorite) => {
        if (favorite.user.id == currentUser.id) {
          userFavorite = true;
          favoriteItem = favorite;
          return;
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
  if (stock >= 0) {
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
    setModalContent(<CartModal />);
  };

  const goBack = async (e) => {
    await dispatch(clearItemState());
    history.push("/items");
  };

  const goToUser = () => {
    history.push(`/users/${item.owner_id}`);
  };

  return (
    <div  className="item_main">
      <div className="go_back_button" onClick={goBack}>
        {"< Back to items"}
      </div>
      {isLoading ? (
        <div className="countdown">
          <LoaderComp />
          {/* <h2>{seconds}..</h2> */}
        </div>
      ) : (
        <div>
          {item.name ? (
            <div>
              <div className="item_container">
                <img src={item.preview_img} />
                <div className="item_description">
                  <div className="link_to_see_user" onClick={goToUser}>
                    Visit the seller {item.owner.username}
                  </div>
                  <div>
                    <div className="item_container_name">
                      {item.name} by {item.brand}
                      {currentUser ? (
                        !userFavorite && currentUser ? (
                          <div
                            onClick={() =>
                              likeItem(dispatch, item, currentUser)
                            }
                            className="icon-container"
                          >
                            <i className="fa-regular fa-heart"></i>
                            {/* <i className="fa-solid fa-heart"></i> */}
                          </div>
                        ) : (
                          <div>
                            <i
                              onClick={() => unlikeItem(dispatch, favoriteItem)}
                              class="fa-solid fa-heart selected_star"
                            ></i>
                          </div>
                        )
                      ) : null}
                    </div>
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
                    <div className="item_container_price">
                      ${item.price.toFixed(2)}
                    </div>
                    {visible ? (
                      <div className="item_review_buttons user_item_change_buttons item_delete_update">
                        <div className="item_container_owner_buttons">
                          <OpenModalDiv
                            buttonText={""}
                            modalComponent={
                              <ItemForm item={item} formType="edit" />
                            }
                            className={"fas fa-edit"}
                            divText="Update"
                          />
                        </div>
                        <div className="item_container_owner_buttons">
                          <OpenModalDiv
                            buttonText={""}
                            modalComponent={<DeleteItemModal item={item} />}
                            className={"fa-solid fa-trash"}
                            divText="Delete"
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className={stockClassName}>{inStock}</div>
                    <div>{inStock ? <div></div> : <div></div>}</div>
                    <form onSubmit={AddToCart}>
                      <h3>About this item</h3>
                      <p>{item.description}</p>
                      {stock > 0 ? (
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
                      ) : null}
                    </form>
                  </div>

                  {/* {!userFavorite && currentUser && (
                    <div>
                      <h3>
                        Have this fragrance? Let others know what you think
                      </h3>
                      <OpenModalButton
                        className="delete_review_button"
                        buttonText={"Add Your Comment"}
                        modalComponent={
                          <FavoriteForm formAction="create" item={item} />
                        }
                      />
                    </div>
                  )} */}
                </div>
              </div>
              <div>
                {reviews.length ? (
                  <div className="user_review_container">
                    <h2 className="h2_reviews_text">Customer Reviews</h2>
                    <div className="review_list">

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
                          <div className="review_text">{review.note}</div>
                          {currentUser &&
                            (review.order.user.id === currentUser.id ? (
                              <div className="item_review_buttons">
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
                  </div>
                ) : (
                  <div>
                    <h2 className="h2_reviews_text">
                      There are currently no customer reviews
                    </h2>
                  </div>
                )}
              </div>
              {/* <div>
                {favorites.length ? (
                  <div className="community_comments_container">
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
                              <div className="item_review_buttons">
                                <OpenModalButton
                                  className="delete_review_button"
                                  buttonText={"Update Comment"}
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
                                  modalComponent={
                                    <DeleteCommentModal fav={fav} />
                                  }
                                />
                              </div>
                            ) : null)}
                        </div>
                      ))}
                  </div>
                ) : null}
              </div> */}
            </div>
          ) : (
            <p>Item Not Found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ItemContainer;
