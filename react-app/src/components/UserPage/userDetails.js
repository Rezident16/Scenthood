import { useParams } from "react-router-dom";
import { getSpecific } from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./user.css";
import ItemTile from "../Items/itemTile";
import { useHistory } from "react-router-dom/";
import { createReviewThunk } from "../../store/item";
import ReviewForm from "../Items/reviewForm";
import OpenModalButton from "../OpenModalButton";
import { fetchOneItem } from "../../store/item";
import DeleteReviewModal from "../Items/deleteReviewModal";
import { fetchUserOrders } from "../../store/orders";
import { clearItemState } from "../../store/item";
import { clearState } from "../../store/user";
import ItemForm from "../Items/CreateUpdateItemForm";

function UserDetails() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.user.user);
  const currUser = useSelector((state) => state.session.user);
  const [userOrders, setUserOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState("not_selected");
  const [selectedItems, setSelectedItems] = useState("selected");

  const ordersObj = useSelector((state) => state.orders);
  const orders = Object.values(ordersObj);

  orders.forEach((order) => {
    order.order_prodcts.forEach((orderProduct) => {
      const userReview = orderProduct.item.reviews.filter(
        (review) => review.order_id == order.id
      );
    });
  });

  useEffect(async () => {
    await dispatch(getSpecific(userId));
    await dispatch(fetchUserOrders(userId));
    await dispatch(clearItemState());
  }, [dispatch, userId]);

  if (!user) return null;
  let userText;
  if (currUser) {
    if (userOrders == false) {
      userText = "Your Listed Items";
    } else if (userOrders == true && currUser.orders.length > 0) {
      userText = "Past Orders";
    } else {
      userText = "No Past Orders";
    }
  }

  return (
    <div>
      <div>
        <div>
          <img className="user_details_profile_img" src={user.profile_img} />
        </div>
        <div>
          <h2>{user.username}</h2>
          <h4>{user.description}</h4>
        </div>
      </div>
      {currUser && currUser.id == user.id ? (
        <div>
          <div className="user_items_orders">
            <div
              className={selectedOrder}
              onClick={() => {
                setUserOrders(false);
                setSelectedOrder("selected");
                setSelectedItems("not_selected");
              }}
            >
              My Items
            </div>
            <div
              className={selectedItems}
              onClick={() => {
                setUserOrders(true);
                setSelectedItems("selected");
                setSelectedOrder("not_selected");
              }}
            >
              Past Orders
            </div>
            <OpenModalButton
              className="add_item_button"
              buttonText={"List New Item"}
              modalComponent={<ItemForm formAction="create" />}
            />
          </div>
          {userOrders == false ? (
            <div className="all_items">
              {user.items.length ? (
                <div>
                  <h3>{userText}</h3>
                  {user.items
                    .sort((a, b) => b.reviews.length - a.reviews.length)
                    .map((item) => (
                      <ItemTile
                        className="individual_item"
                        key={item.id}
                        item={item}
                      />
                    ))}
                </div>
              ) : (
                <h3>No Listed Items </h3>
              )}
            </div>
          ) : (
            <div className="all_orders">
              {currUser && orders.length > 0 ? (
                orders.map((order) => (
                  <div className="order_details_container" key={order.id}>
                    <div>
                      <div>Address: {order.address}</div>
                      <div>Placed at: {order.created_at}</div>
                      <div>Total: ${order.price}</div>
                    </div>
                    <div className="order_items">
                      {order.order_prodcts.map((orderProduct) => {
                        const userReview = orderProduct.item.reviews.filter(
                          (review) => review.order_id === order.id
                        );

                        return (
                          <div
                            className="product_info_order"
                            key={orderProduct.item.id}
                          >
                            <img
                              className="order_img"
                              src={orderProduct.item.preview_img}
                              onClick={() =>
                                history.push(`/items/${orderProduct.item.id}`)
                              }
                            />
                            <div className="item_name_comment_container">
                              <div className="item_name_brand_container">
                                {orderProduct.item.name} by{" "}
                                <span className="item_brand_order">
                                  {orderProduct.item.brand}
                                </span>
                              </div>
                              {userReview.length === 0 ? (
                                <div>
                                  <OpenModalButton
                                    className="delete_review_button"
                                    buttonText={"Submit Review"}
                                    modalComponent={
                                      <ReviewForm
                                        formAction="create"
                                        itemId={orderProduct.item.id}
                                        orderId={order.id}
                                      />
                                    }
                                  />
                                </div>
                              ) : (
                                <div>
                                  You said: {userReview[0].note}{" "}
                                  <OpenModalButton
                                    className={"delete_review_button"}
                                    buttonText={"Delete Review"}
                                    modalComponent={
                                      <DeleteReviewModal
                                        review={userReview[0]}
                                      />
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div>{userText}</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="all_items">
          {user.items.length
            ? user.items
                .sort((a, b) => b.reviews.length - a.reviews.length)
                .map((item) => (
                  <ItemTile
                    className="individual_item"
                    key={item.id}
                    item={item}
                  />
                ))
            : null}
        </div>
      )}
    </div>
  );
}

export default UserDetails;
