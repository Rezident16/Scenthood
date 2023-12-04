import { useParams } from "react-router-dom";
import { getSpecific } from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./user.css";
import ItemTile from "../Items/itemTile";
import { useHistory } from "react-router-dom/";
import { createReviewThunk } from "../../store/item";
import ReviewForm from "../Items/itemform";
import OpenModalButton from "../OpenModalButton";
function UserDetails() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.user.user);
  const currUser = useSelector((state) => state.session.user);
  const [userOrders, setUserOrders] = useState(true);

  useEffect(() => {
    dispatch(getSpecific(userId));
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
          <div>
            <div onClick={() => setUserOrders(false)}>My Items</div>
            <div onClick={() => setUserOrders(true)}>Past Orders</div>
          </div>
          <h3>{userText}</h3>
          {userOrders == false ? (
            <div className="all_items">
              {user.items.length &&
                user.items
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
            <div className="all_orders">
              {currUser && currUser.orders.length > 0 ? (
                currUser.orders.map((order) => (
                  <div className="order_details_container">
                    <div>
                      <div>Address: {order.address}</div>
                      <div>Placed at: {order.created_at}</div>
                      <div>Total: ${order.price}</div>
                    </div>
                    <div className="order_items">
                      {order.order_prodcts.map((orderProduct) => (
                        <div className="product_info_order">
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
                              <span className="item_brand_order">{orderProduct.item.brand}</span>
                            </div>
                            {orderProduct.item.reviews.length == 0 ? (
                              <OpenModalButton
                              className="delete_review_button"
                              buttonText={"Submit Review"}
                              modalComponent={
                                <ReviewForm formAction="create" itemId={orderProduct.item.id} orderId={order.id} />
                              }
                            />
                            ) : (
                              <div>
                                You said: {orderProduct.item.reviews[0].note}{" "}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
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
          {user.items.length &&
            user.items
              .sort((a, b) => b.reviews.length - a.reviews.length)
              .map((item) => (
                <ItemTile
                  className="individual_item"
                  key={item.id}
                  item={item}
                />
              ))}
        </div>
      )}
    </div>
  );
}

export default UserDetails;
